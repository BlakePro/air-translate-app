'use client';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
const urlSocket = 'wss://192.168.1.68:3000';

export function useWebRTC(roomId: string, lang: string) {
  const socket = useRef<any>(null);
  const peersRef = useRef<{ [id: string]: RTCPeerConnection }>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [micEnabled, setMicEnabled] = useState(false);
  const [captions, setCaptions] = useState<any[]>([]);

  useEffect(() => {
    if (!roomId) return;

    socket.current = io(urlSocket);

    const init = async () => {
      // 1. Capture microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('🎤 mic tracks:', stream.getAudioTracks());

      // ✅ Start with mic OFF
      for (const track of stream.getAudioTracks()) {
        track.enabled = false;
      }
      localStreamRef.current = stream;

      // 🔊 Setup AudioContext + Worklet
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      await audioCtx.audioWorklet.addModule('/recorder-worklet.js');

      const source = audioCtx.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(audioCtx, 'mic-processor');
      source.connect(worklet);

      // 3. Handle audio chunks
      let buffer: Float32Array[] = [];
      const chunkSize = 4096;

      worklet.port.onmessage = (event: any) => {
        const audioData: Float32Array = event.data.data;

        const micState = (document?.getElementById('mic') as HTMLInputElement)?.value;
        if (micState === '1') {
          // 🎙️ speaking
          buffer.push(audioData);

          const total = buffer.reduce((a, arr) => a + arr.length, 0);
          if (total >= chunkSize) {
            const merged = new Float32Array(total);
            let offset = 0;
            for (const arr of buffer) {
              merged.set(arr, offset);
              offset += arr.length;
            }
            buffer = [];

            // Float32 → Int16
            const int16 = new Int16Array(merged.length);
            for (let i = 0; i < merged.length; i++) {
              const s = Math.max(-1, Math.min(1, merged[i]));
              int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }

            socket.current.emit('audio-chunk', int16.buffer);
          }
        }
      };

      // 2. Join room
      socket.current.emit('join', roomId);

      // 3. Handle new peer
      socket.current.on('new-peer', async (peerId: string) => {
        const pc = createPeer(peerId, true, stream);
        peersRef.current[peerId] = pc;
      });

      // 5. Peer disconnect cleanup
      socket.current.on('peer-disconnect', (peerId: string) => {
        if (peersRef.current[peerId]) {
          peersRef.current[peerId].close();
          delete peersRef.current[peerId];
        }
        const el = document.getElementById(`audio-${peerId}`);
        if (el) el.remove();
      });

      // 6. receive transcription from server
      socket.current.on('stt-text', (props: object) => {
        console.log(props);
        setCaptions((prev) => [props, ...prev]);
      });

      socket.current.on('tts-audio', ({ audio, format }: any) => {
        const audioBlob = new Blob([Uint8Array.from(atob(audio), (c) => c.charCodeAt(0))], { type: `audio/${format}` });
        const url = URL.createObjectURL(audioBlob);
        const audioEl = new Audio(url);
        audioEl.play();
      });
    };

    init();

    return () => {
      socket.current.disconnect();
      audioCtxRef.current?.close();
      for (const key in peersRef.current) {
        peersRef.current[key].close();
      }
    };
  }, [roomId]);

  const onToggleMic = async () => {
    if (!localStreamRef.current) return;
    const newState = !micEnabled;
    setMicEnabled(newState);

    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    // ✅ Toggle mic tracks
    for (const track of localStreamRef.current.getAudioTracks()) {
      track.enabled = newState;
    }

    if (!newState) socket.current.emit('audio-stop', { roomId, lang });
  };

  const createPeer = (peerId: string, initiator: boolean, stream: MediaStream) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // Send my mic
    for (const track of stream.getTracks()) {
      pc.addTrack(track, stream);
    }

    // ICE candidates
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.current.emit('signal', {
          target: peerId,
          data: { candidate: e.candidate },
        });
      }
    };

    // Remote audio
    pc.ontrack = (e) => {
      const remoteStream = e.streams[0];
      const audio = document.createElement('audio');
      audio.id = `audio-${peerId}`;
      audio.autoplay = false;
      audio.srcObject = remoteStream;
      document.body.appendChild(audio);
    };

    if (initiator) {
      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer);
        socket.current.emit('signal', {
          target: peerId,
          data: { sdp: offer },
        });
      });
    }

    return pc;
  };

  return { onToggleMic, micEnabled, captions };
}
