import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Wifi, WifiOff, FileUp, Send, QrCode, Lock, Clipboard, Download, Image as ImageIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const CHUNK_SIZE = 16384;

export default function P2PRoom({ defaultTab = 'connect' }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRoom = queryParams.get('room') || '';

  const [tab, setTab] = useState(defaultTab);
  const [supabase, setSupabase] = useState<any>(null);
  const [roomId, setRoomId] = useState(initialRoom);
  const [isHost, setIsHost] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const [secretKey, setSecretKey] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const chatChannelRef = useRef<RTCDataChannel | null>(null);
  const fileChannelRef = useRef<RTCDataChannel | null>(null);
  const channelRef = useRef<any>(null);

  // Incoming file state
  const incomingFileRef = useRef<any>(null);
  const incomingBuffersRef = useRef<ArrayBuffer[]>([]);
  const incomingSizeRef = useRef(0);

  useEffect(() => {
    // SECURITY NOTE: In production, use VITE_ environment variables 
    // rather than a public /api/env endpoint if possible.
    fetch('/api/env').then(r => r.json()).then(env => {
      if (env.url && env.key) {
        setSupabase(createClient(env.url, env.key));
      }
    }).catch(err => console.error("Env Load Error:", err));
    
    return () => cleanup();
  }, []);

  const cleanup = () => {
    if (channelRef.current) channelRef.current.unsubscribe();
    if (pcRef.current) {
      pcRef.current.getSenders().forEach(sender => pcRef.current?.removeTrack(sender));
      pcRef.current.close();
    }
    setStatus('disconnected');
    pcRef.current = null;
  };

  const initPeerConnection = () => {
    const pc = new RTCPeerConnection({ 
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }] 
    });
    
    pc.onicecandidate = (e) => {
      if (e.candidate && channelRef.current) {
        channelRef.current.send({ 
            type: 'broadcast', 
            event: 'signal', 
            payload: { type: 'ice', candidate: e.candidate } 
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        setStatus('disconnected');
      } else if (state === 'connected' || state === 'completed') {
        setStatus('connected');
      }
    };

    pc.ondatachannel = (e) => {
      if (e.channel.label === 'chat') setupChatChannel(e.channel);
      if (e.channel.label === 'file') setupFileChannel(e.channel);
    };

    pcRef.current = pc;
    return pc;
  };

  const setupChatChannel = (channel: RTCDataChannel) => {
    channel.onopen = () => setStatus('connected');
    channel.onclose = () => setStatus('disconnected');
    channel.onmessage = async (e) => {
      try {
        const msg = JSON.parse(e.data);
        const decrypted = await decryptMessage(msg, secretKey);
        setMessages(prev => [...prev, { text: decrypted, isSender: false, time: new Date().toLocaleTimeString() }]);
      } catch (err) {
        console.error("Chat Message Error:", err);
      }
    };
    chatChannelRef.current = channel;
  };

  const setupFileChannel = (channel: RTCDataChannel) => {
    channel.binaryType = 'arraybuffer';
    channel.onmessage = (e) => {
      if (typeof e.data === 'string') {
        try {
            const msg = JSON.parse(e.data);
            if (msg.type === 'start') {
              incomingFileRef.current = msg;
              incomingBuffersRef.current = [];
              incomingSizeRef.current = 0;
              setDownloadProgress(0);
            } else if (msg.type === 'end') {
              if (!incomingFileRef.current) return;
              const blob = new Blob(incomingBuffersRef.current, { type: incomingFileRef.current.mime });
              const url = URL.createObjectURL(blob);
              setFiles(prev => [...prev, { ...incomingFileRef.current, url, isSender: false }]);
              // Reset
              incomingFileRef.current = null;
              incomingBuffersRef.current = [];
              setDownloadProgress(0);
            }
        } catch (err) { console.error("File Metadata Error", err); }
      } else {
        if (!incomingFileRef.current) return;
        incomingBuffersRef.current.push(e.data);
        incomingSizeRef.current += e.data.byteLength;
        setDownloadProgress(Math.round((incomingSizeRef.current / incomingFileRef.current.size) * 100));
      }
    };
    fileChannelRef.current = channel;
  };

  const createRoom = () => {
    if (!supabase) return;
    cleanup();
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
    setIsHost(true);
    setStatus('connecting');

    const channel = supabase.channel(`p2p-${id}`);
    channelRef.current = channel;

    channel.on('broadcast', { event: 'signal' }, async ({ payload }: any) => {
      if (payload.type === 'join') {
        const pc = initPeerConnection();
        setupChatChannel(pc.createDataChannel('chat'));
        setupFileChannel(pc.createDataChannel('file'));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        channel.send({ type: 'broadcast', event: 'signal', payload: { type: 'offer', sdp: offer } });
      } else if (payload.type === 'answer' && pcRef.current) {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      } else if (payload.type === 'ice' && pcRef.current) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    });

    channel.subscribe();
  };

  const joinRoom = () => {
    if (!supabase || !roomId) return;
    cleanup();
    setIsHost(false);
    setStatus('connecting');

    const channel = supabase.channel(`p2p-${roomId}`);
    channelRef.current = channel;

    channel.on('broadcast', { event: 'signal' }, async ({ payload }: any) => {
      if (payload.type === 'offer') {
        const pc = initPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        channel.send({ type: 'broadcast', event: 'signal', payload: { type: 'answer', sdp: answer } });
      } else if (payload.type === 'ice' && pcRef.current) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    });

    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        channel.send({ type: 'broadcast', event: 'signal', payload: { type: 'join' } });
      }
    });
  };

  // --- Encryption Logic ---
  const getAesKey = async (secret: string) => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(secret.padEnd(32, '0').slice(0,32)), {name: "PBKDF2"}, false, ["deriveBits", "deriveKey"]);
    return crypto.subtle.deriveKey({name: "PBKDF2", salt: enc.encode("p2p-secure-salt"), iterations: 100000, hash: "SHA-256"}, keyMaterial, {name: "AES-GCM", length: 256}, false, ["encrypt", "decrypt"]);
  };

  const encryptMessage = async (text: string, secret: string) => {
    if (!secret) return { text, encrypted: false };
    try {
      const key = await getAesKey(secret);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const enc = new TextEncoder();
      const cipher = await crypto.subtle.encrypt({name: "AES-GCM", iv}, key, enc.encode(text));
      return { 
        text: btoa(String.fromCharCode(...new Uint8Array(cipher))), 
        iv: btoa(String.fromCharCode(...iv)), 
        encrypted: true 
      };
    } catch (e) { return { text, encrypted: false }; }
  };

  const decryptMessage = async (msg: any, secret: string) => {
    if (!msg.encrypted) return msg.text;
    if (!secret) return "🔒 [Encrypted - Enter Key in Security Tab]";
    try {
      const key = await getAesKey(secret);
      const cipherBytes = Uint8Array.from(atob(msg.text), c => c.charCodeAt(0));
      const ivBytes = Uint8Array.from(atob(msg.iv), c => c.charCodeAt(0));
      const decrypted = await crypto.subtle.decrypt({name: "AES-GCM", iv: ivBytes}, key, cipherBytes);
      return new TextDecoder().decode(decrypted);
    } catch (e) { return "🔒 [Decryption Failed]"; }
  };

  const sendMessage = async () => {
    if (!chatInput || !chatChannelRef.current || chatChannelRef.current.readyState !== 'open') return;
    const encrypted = await encryptMessage(chatInput, secretKey);
    chatChannelRef.current.send(JSON.stringify(encrypted));
    setMessages(prev => [...prev, { text: chatInput, isSender: true, time: new Date().toLocaleTimeString() }]);
    setChatInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fileChannelRef.current || fileChannelRef.current.readyState !== 'open') return;

    const id = Math.random().toString(36).slice(2);
    fileChannelRef.current.send(JSON.stringify({ type: 'start', id, name: file.name, size: file.size, mime: file.type }));
    
    const buffer = await file.arrayBuffer();
    let offset = 0;
    
    const sendChunk = () => {
      while (offset < buffer.byteLength) {
        if (fileChannelRef.current!.bufferedAmount > 1024 * 1024) { // 1MB buffer limit
          setTimeout(sendChunk, 100);
          return;
        }
        const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
        fileChannelRef.current!.send(chunk);
        offset += CHUNK_SIZE;
        setUploadProgress(Math.min(100, Math.round((offset / buffer.byteLength) * 100)));
      }
      fileChannelRef.current!.send(JSON.stringify({ type: 'end', id }));
      setFiles(prev => [...prev, { id, name: file.name, size: file.size, mime: file.type, isSender: true }]);
      setUploadProgress(0);
    };
    sendChunk();
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Shield className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white">Secure P2P Room</h2>
            <p className="text-sm text-gray-500">End-to-End Encrypted Transfer</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-900 px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {status === 'connected' ? <Wifi className="text-green-500" size={20} /> : <WifiOff className="text-red-500" size={20} />}
            <span className="font-bold text-gray-700 dark:text-gray-300 capitalize">{status}</span>
          </div>
          {roomId && <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 font-mono font-bold text-blue-600 dark:text-blue-400">ID: {roomId}</div>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {['connect', 'chat', 'files', 'security'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${tab === t ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[500px]">
        {tab === 'connect' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold dark:text-white">Join Room</h3>
              <input type="text" value={roomId} onChange={e => setRoomId(e.target.value.toUpperCase())} placeholder="ENTER CODE" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-mono text-xl text-center" />
              <button onClick={joinRoom} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-blue-500/20 shadow-lg">Join</button>
            </div>
            <div className="space-y-6 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-8 md:pt-0 md:pl-12">
              <h3 className="text-xl font-bold dark:text-white">Host Room</h3>
              <button onClick={createRoom} className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-2xl font-bold">Generate Code</button>
              {isHost && roomId && (
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl flex flex-col items-center">
                  <span className="text-5xl font-black text-blue-600 mb-4 tracking-widest">{roomId}</span>
                  <div className="bg-white p-2 rounded-lg">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(window.location.origin + '/tool/secure-room-join?room=' + roomId)}`} alt="QR" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'chat' && (
          <div className="flex flex-col h-[450px]">
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 overflow-y-auto space-y-3 mb-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isSender ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[80%] ${m.isSender ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 dark:text-white shadow-sm'}`}>
                    <p className="text-sm">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Message..." className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-700 dark:text-white" />
              <button onClick={sendMessage} className="p-4 bg-blue-600 text-white rounded-2xl"><Send /></button>
            </div>
          </div>
        )}

        {tab === 'files' && (
          <div className="space-y-6">
            <label className={`w-full h-40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${status === 'connected' ? 'border-blue-400 bg-blue-50/20' : 'opacity-50 grayscale cursor-not-allowed'}`}>
              <FileUp className="text-blue-500 mb-2" size={32} />
              <span className="font-bold text-gray-600">Send File</span>
              <input type="file" className="hidden" disabled={status !== 'connected'} onChange={handleFileUpload} />
            </label>

            {(uploadProgress > 0 || downloadProgress > 0) && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <div className="flex justify-between mb-2 text-xs font-bold dark:text-white">
                  <span>{uploadProgress > 0 ? 'Sending...' : 'Receiving...'}</span>
                  <span>{uploadProgress || downloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${uploadProgress || downloadProgress}%` }}></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {files.map((f, i) => (
                <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-700 flex flex-col">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg"><ImageIcon className="text-blue-500" /></div>
                    <div className="truncate flex-1">
                      <p className="font-bold text-sm dark:text-white truncate">{f.name}</p>
                      <p className="text-[10px] text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!f.isSender && f.url && (
                    <a href={f.url} download={f.name} className="w-full py-2 bg-blue-600 text-white rounded-xl text-center text-xs font-bold"><Download size={14} className="inline mr-1"/> Download</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200">
                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Add an extra password to your chat messages. Peers must use the same password to decrypt.</p>
            </div>
            <input type="password" value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder="Secret Key..." className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-700 dark:text-white" />
          </div>
        )}
      </div>
    </div>
  );
}