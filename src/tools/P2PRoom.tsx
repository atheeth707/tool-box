import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Wifi, WifiOff, FileUp, Send, Clipboard, Download, Image as ImageIcon } from 'lucide-react';
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

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);

  // --- GAME STATE ---
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [symbol, setSymbol] = useState<'X' | 'O' | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const chatChannelRef = useRef<RTCDataChannel | null>(null);
  const fileChannelRef = useRef<RTCDataChannel | null>(null);
  const gameChannelRef = useRef<RTCDataChannel | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    fetch('/api/env').then(r => r.json()).then(env => {
      setSupabase(createClient(env.url, env.key));
    });

    return () => cleanup();
  }, []);

  const cleanup = () => {
    channelRef.current?.unsubscribe();
    pcRef.current?.close();
    setStatus('disconnected');
  };

  // ---------- GAME LOGIC ----------
  const checkWinner = (b: any[]) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b1,c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
  };

  const setupGameChannel = (channel: RTCDataChannel) => {
    channel.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === 'move') {
        setBoard(msg.board);
        setIsMyTurn(true);

        const win = checkWinner(msg.board);
        if (win) setWinner(win);
      }

      if (msg.type === 'reset') {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setIsMyTurn(symbol === 'X');
      }
    };

    gameChannelRef.current = channel;
  };

  const makeMove = (i: number) => {
    if (!isMyTurn || board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = symbol;

    setBoard(newBoard);
    setIsMyTurn(false);

    const win = checkWinner(newBoard);
    if (win) setWinner(win);

    gameChannelRef.current?.send(JSON.stringify({
      type: 'move',
      board: newBoard
    }));
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsMyTurn(symbol === 'X');

    gameChannelRef.current?.send(JSON.stringify({ type: 'reset' }));
  };

  // ---------- PEER ----------
  const initPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'signal',
          payload: { type: 'ice', candidate: e.candidate }
        });
      }
    };

    pc.ondatachannel = (e) => {
      if (e.channel.label === 'chat') chatChannelRef.current = e.channel;
      if (e.channel.label === 'file') fileChannelRef.current = e.channel;
      if (e.channel.label === 'game') setupGameChannel(e.channel);
    };

    pcRef.current = pc;
    return pc;
  };

  // ---------- CREATE ----------
  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
    setIsHost(true);
    setStatus('connecting');

    const channel = supabase.channel(`p2p-${id}`);
    channelRef.current = channel;

    channel.on('broadcast', { event: 'signal' }, async ({ payload }: any) => {

      if (payload.type === 'join') {
        const pc = initPeerConnection();

        chatChannelRef.current = pc.createDataChannel('chat');
        fileChannelRef.current = pc.createDataChannel('file');
        const game = pc.createDataChannel('game');

        setupGameChannel(game);

        // HOST = X
        setSymbol('X');
        setIsMyTurn(true);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        channel.send({
          type: 'broadcast',
          event: 'signal',
          payload: { type: 'offer', sdp: offer }
        });
      }

      if (payload.type === 'answer') {
        await pcRef.current?.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      }

      if (payload.type === 'ice') {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    });

    channel.subscribe();
  };

  // ---------- JOIN ----------
  const joinRoom = () => {
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

        // JOINER = O
        setSymbol('O');
        setIsMyTurn(false);

        channel.send({
          type: 'broadcast',
          event: 'signal',
          payload: { type: 'answer', sdp: answer }
        });
      }

      if (payload.type === 'ice') {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    });

    channel.subscribe((s: string) => {
      if (s === 'SUBSCRIBED') {
        channel.send({ type: 'broadcast', event: 'signal', payload: { type: 'join' } });
      }
    });
  };

  // ---------- UI ----------
  return (
    <div className="max-w-5xl mx-auto">

      <div className="mb-6">
        <button onClick={createRoom} className="mr-4 bg-black text-white px-4 py-2">Create</button>
        <input value={roomId} onChange={e=>setRoomId(e.target.value)} />
        <button onClick={joinRoom} className="ml-2 bg-blue-600 text-white px-4 py-2">Join</button>
      </div>

      <div className="flex space-x-2 mb-4">
        {['connect','chat','files','games'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'games' && (
        <div className="flex flex-col items-center space-y-6">

          <h2 className="text-xl font-bold">Tic Tac Toe</h2>

          <div className="grid grid-cols-3 gap-4">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => makeMove(i)}
                className="w-20 h-20 text-2xl bg-gray-200"
              >
                {cell}
              </button>
            ))}
          </div>

          {winner && <div>Winner: {winner}</div>}
          <div>{isMyTurn ? "Your Turn" : "Opponent Turn"}</div>

          <button onClick={resetGame} className="bg-blue-600 text-white px-4 py-2">
            Reset
          </button>
        </div>
      )}

    </div>
  );
}