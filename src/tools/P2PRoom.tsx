import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Wifi, WifiOff, FileUp, Send, Copy, QrCode, Lock, Clipboard, Download, Image as ImageIcon } from 'lucide-react';
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
    fetch('/api/env').then(r => r.json()).then(env => {
      if (env.url && env.key) {
        setSupabase(createClient(env.url, env.key));
      }
    });
    
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (channelRef.current) channelRef.current.unsubscribe();
    if (pcRef.current) pcRef.current.close();
    setStatus('disconnected');
  };

  const initPeerConnection = () => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    
    pc.onicecandidate = (e) => {
      if (e.candidate && channelRef.current) {
        channelRef.current.send({ type: 'broadcast', event: 'signal', payload: { type: 'ice', candidate: e.candidate } });
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        setStatus('disconnected');
      } else if (pc.iceConnectionState === 'connected') {
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
      const msg = JSON.parse(e.data);
      const decrypted = await decryptMessage(msg, secretKey);
      setMessages(prev => [...prev, { text: decrypted, isSender: false, time: new Date().toLocaleTimeString() }]);
    };
    chatChannelRef.current = channel;
  };

  const setupFileChannel = (channel: RTCDataChannel) => {
    channel.binaryType = 'arraybuffer';
    channel.onmessage = (e) => {
      if (typeof e.data === 'string') {
        const msg = JSON.parse(e.data);
        if (msg.type === 'start') {
          incomingFileRef.current = msg;
          incomingBuffersRef.current = [];
          incomingSizeRef.current = 0;
          setDownloadProgress(0);
        } else if (msg.type === 'end') {
          const blob = new Blob(incomingBuffersRef.current, { type: incomingFileRef.current.mime });
          const url = URL.createObjectURL(blob);
          setFiles(prev => [...prev, { ...incomingFileRef.current, url, isSender: false }]);
          incomingFileRef.current = null;
          setDownloadProgress(0);
        }
      } else {
        incomingBuffersRef.current.push(e.data);
        incomingSizeRef.current += e.data.byteLength;
        if (incomingFileRef.current) {
          setDownloadProgress(Math.round((incomingSizeRef.current / incomingFileRef.current.size) * 100));
        }
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
        const chat = pc.createDataChannel('chat');
        const file = pc.createDataChannel('file');
        setupChatChannel(chat);
        setupFileChannel(file);

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

  // --- Encryption ---
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
      
      const cipherArr = Array.from(new Uint8Array(cipher));
      const ivArr = Array.from(iv);
      return { 
        text: btoa(String.fromCharCode.apply(null, cipherArr)), 
        iv: btoa(String.fromCharCode.apply(null, ivArr)), 
        encrypted: true 
      };
    } catch (e) {
      return { text, encrypted: false };
    }
  };

  const decryptMessage = async (msg: any, secret: string) => {
    if (!msg.encrypted) return msg.text;
    if (!secret) return "🔒 [Encrypted - Enter Secret Key in Security Tab]";
    try {
      const key = await getAesKey(secret);
      const cipherStr = atob(msg.text);
      const ivStr = atob(msg.iv);
      const cipherBytes = new Uint8Array(cipherStr.length);
      for (let i=0; i<cipherStr.length; i++) cipherBytes[i] = cipherStr.charCodeAt(i);
      const ivBytes = new Uint8Array(ivStr.length);
      for (let i=0; i<ivStr.length; i++) ivBytes[i] = ivStr.charCodeAt(i);
      
      const decrypted = await crypto.subtle.decrypt({name: "AES-GCM", iv: ivBytes}, key, cipherBytes);
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      return "🔒 [Decryption Failed - Wrong Key]";
    }
  };

  // --- Actions ---
  const sendMessage = async () => {
    if (!chatInput || status !== 'connected' || !chatChannelRef.current) return;
    const encrypted = await encryptMessage(chatInput, secretKey);
    chatChannelRef.current.send(JSON.stringify(encrypted));
    setMessages(prev => [...prev, { text: chatInput, isSender: true, time: new Date().toLocaleTimeString() }]);
    setChatInput('');
  };

  const sendClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setChatInput(text);
      }
    } catch (e) {
      alert("Clipboard access denied");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || status !== 'connected' || !fileChannelRef.current) return;

    const id = Math.random().toString(36).slice(2);
    fileChannelRef.current.send(JSON.stringify({ type: 'start', id, name: file.name, size: file.size, mime: file.type }));
    
    const buffer = await file.arrayBuffer();
    let offset = 0;
    
    const sendChunk = () => {
      while (offset < buffer.byteLength) {
        if (fileChannelRef.current!.bufferedAmount > 65535) {
          setTimeout(sendChunk, 50);
          return;
        }
        const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
        fileChannelRef.current!.send(chunk);
        offset += CHUNK_SIZE;
        setUploadProgress(Math.min(100, Math.round((offset / buffer.byteLength) * 100)));
      }
      fileChannelRef.current!.send(JSON.stringify({ type: 'end', id }));
      setUploadProgress(0);
      setFiles(prev => [...prev, { id, name: file.name, size: file.size, mime: file.type, isSender: true }]);
    };
    sendChunk();
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header & Status */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            <Shield className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white">Secure P2P Room</h2>
            <p className="text-sm text-gray-500">Direct Browser-to-Browser Connection</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-900 px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {status === 'connected' ? <Wifi className="text-green-500" size={20} /> : <WifiOff className="text-red-500" size={20} />}
            <span className="font-bold text-gray-700 dark:text-gray-300 capitalize">{status}</span>
          </div>
          {roomId && <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 font-mono font-bold text-blue-600 dark:text-blue-400">Room: {roomId}</div>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['connect', 'chat', 'files', 'security'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 rounded-xl font-bold capitalize transition-colors whitespace-nowrap ${tab === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[500px]">
        
        {tab === 'connect' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold dark:text-white">Join Existing Room</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Room Code</label>
                <input type="text" value={roomId} onChange={e => setRoomId(e.target.value.toUpperCase())} placeholder="Enter 6-digit code" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none font-mono text-lg font-bold uppercase" />
              </div>
              <button onClick={joinRoom} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-blue-500/30">
                Join Room
              </button>
            </div>

            <div className="space-y-6 border-t-2 md:border-t-0 md:border-l-2 border-gray-100 dark:border-gray-700 pt-8 md:pt-0 md:pl-12">
              <h3 className="text-xl font-bold dark:text-white">Create New Room</h3>
              <p className="text-gray-500">Generate a secure room code to share with your peer.</p>
              <button onClick={createRoom} className="w-full py-4 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-2xl font-bold text-lg transition-colors shadow-sm">
                Generate Room Code
              </button>

              {isHost && roomId && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex flex-col items-center text-center space-y-4">
                  <div className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase">Your Room Code</div>
                  <div className="text-5xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-widest">{roomId}</div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/tool/secure-room-join?room=' + roomId)}`} alt="QR Code" className="w-32 h-32" />
                  </div>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Scan to join on mobile</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'chat' && (
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto space-y-4 mb-6">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                  {status === 'connected' ? 'Connected! Send a message.' : 'Connect to a room to start chatting.'}
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`flex ${m.isSender ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl ${m.isSender ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded-bl-none'}`}>
                      <div className="break-words">{m.text}</div>
                      <div className={`text-[10px] mt-2 font-bold ${m.isSender ? 'text-blue-200' : 'text-gray-400'}`}>{m.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex gap-4">
              <button onClick={sendClipboard} disabled={status !== 'connected'} className="p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl transition-colors disabled:opacity-50" title="Paste from Clipboard">
                <Clipboard size={24} />
              </button>
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                disabled={status !== 'connected'}
                placeholder={status === 'connected' ? "Type a message..." : "Not connected"}
                className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-blue-500 outline-none disabled:opacity-50"
              />
              <button onClick={sendMessage} disabled={status !== 'connected'} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-bold transition-colors shadow-sm">
                <Send size={24} />
              </button>
            </div>
          </div>
        )}

        {tab === 'files' && (
          <div className="space-y-8">
            <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${status === 'connected' ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50' : 'border-gray-300 bg-gray-50 dark:bg-gray-900 opacity-50 cursor-not-allowed'}`}>
              <FileUp className={`w-10 h-10 mb-3 ${status === 'connected' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className={`font-bold ${status === 'connected' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                {status === 'connected' ? 'Click or Drag & Drop to Send File' : 'Connect to a room to send files'}
              </span>
              <input type="file" className="hidden" disabled={status !== 'connected'} onChange={handleFileUpload} />
            </label>

            {(uploadProgress > 0 || downloadProgress > 0) && (
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm font-bold mb-2 dark:text-white">
                  <span>{uploadProgress > 0 ? 'Uploading...' : 'Downloading...'}</span>
                  <span>{uploadProgress > 0 ? uploadProgress : downloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress || downloadProgress}%` }}></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((f, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                      {f.mime.startsWith('image/') ? <ImageIcon className="text-blue-500" size={24} /> : <FileUp className="text-blue-500" size={24} />}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-gray-900 dark:text-white truncate" title={f.name}>{f.name}</div>
                      <div className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB • {f.isSender ? 'Sent' : 'Received'}</div>
                    </div>
                  </div>
                  
                  {!f.isSender && f.url && (
                    <div className="space-y-3">
                      {f.mime.startsWith('image/') && (
                        <img src={f.url} alt="Received" className="w-full h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                      )}
                      <a href={f.url} download={f.name} className="flex items-center justify-center w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
                        <Download size={16} className="mr-2" /> Download
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex items-start space-x-4">
              <Lock className="text-amber-600 dark:text-amber-400 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-1">End-to-End Encryption</h3>
                <p className="text-sm text-amber-800 dark:text-amber-400/80">
                  WebRTC connections are already encrypted by default. However, you can add an additional layer of AES-GCM encryption to your chat messages by setting a shared secret key below. Both peers must enter the exact same key to read messages.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Shared Secret Key (Optional)</label>
              <input
                type="password"
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
                placeholder="Enter a secret passphrase..."
                className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl dark:text-white focus:border-amber-500 outline-none text-lg font-mono"
              />
            </div>
            
            <div className="text-center p-4 text-gray-500 text-sm">
              Files are transferred directly via WebRTC data channels and are protected by standard WebRTC DTLS encryption.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
