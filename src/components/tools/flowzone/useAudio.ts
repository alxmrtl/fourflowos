import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioReturn {
  activeSounds: Set<string>;
  volume: number;
  youtubeVideoId: string | null;
  youtubeReady: boolean;
  toggleSound: (id: string) => void;
  setVolume: (v: number) => void;
  playYoutube: (videoId: string) => void;
  stopYoutube: () => void;
  stopAll: () => void;
}

function parseYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    return u.searchParams.get('v');
  } catch {
    // Maybe it's already a video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    return null;
  }
}

export function useAudio(): UseAudioReturn {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [volume, setVolumeState] = useState(0.5);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [youtubeReady, setYoutubeReady] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<Map<string, AudioNode>>(new Map());
  const ytPlayerRef = useRef<any>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainRef.current = gain;
    }
    return { ctx: audioCtxRef.current, gain: gainRef.current! };
  }, []);

  const createWhiteNoise = useCallback(() => {
    const { ctx, gain } = getAudioCtx();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gain);
    source.start();
    return source;
  }, [getAudioCtx]);

  const createRain = useCallback(() => {
    const { ctx, gain } = getAudioCtx();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1500;
    bandpass.Q.value = 0.5;
    source.connect(bandpass).connect(gain);
    source.start();
    return source;
  }, [getAudioCtx]);

  const createBinaural = useCallback(() => {
    const { ctx, gain } = getAudioCtx();
    const merger = ctx.createChannelMerger(2);
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    const gainL = ctx.createGain();
    const gainR = ctx.createGain();
    oscL.type = 'sine';
    oscR.type = 'sine';
    oscL.frequency.value = 200;
    oscR.frequency.value = 206; // 6Hz theta beat
    gainL.gain.value = 0.3;
    gainR.gain.value = 0.3;
    oscL.connect(gainL).connect(merger, 0, 0);
    oscR.connect(gainR).connect(merger, 0, 1);
    merger.connect(gain);
    oscL.start();
    oscR.start();
    // Return a node we can stop
    return { oscL, oscR, stop: () => { oscL.stop(); oscR.stop(); } };
  }, [getAudioCtx]);

  const toggleSound = useCallback((id: string) => {
    setActiveSounds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        // Stop
        const node = nodesRef.current.get(id);
        if (node) {
          try { (node as any).stop?.(); } catch { /* */ }
          nodesRef.current.delete(id);
        }
        next.delete(id);
      } else {
        // Start
        let node: any;
        if (id === 'white-noise') node = createWhiteNoise();
        else if (id === 'rain') node = createRain();
        else if (id === 'binaural') node = createBinaural();
        if (node) nodesRef.current.set(id, node);
        next.add(id);
      }
      return next;
    });
  }, [createWhiteNoise, createRain, createBinaural]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (gainRef.current) gainRef.current.gain.value = v;
    if (ytPlayerRef.current?.setVolume) ytPlayerRef.current.setVolume(v * 100);
  }, []);

  const playYoutube = useCallback((input: string) => {
    const videoId = parseYoutubeId(input);
    if (!videoId) return;
    setYoutubeVideoId(videoId);
    setYoutubeReady(false);

    // Load YouTube IFrame API if not loaded
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => {
        createYTPlayer(videoId);
      };
    } else {
      createYTPlayer(videoId);
    }

    function createYTPlayer(vid: string) {
      // Destroy existing
      if (ytPlayerRef.current?.destroy) {
        try { ytPlayerRef.current.destroy(); } catch { /* */ }
      }
      // Ensure container exists
      let container = document.getElementById('flowzone-yt-player');
      if (!container) {
        container = document.createElement('div');
        container.id = 'flowzone-yt-player';
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.width = '1px';
        container.style.height = '1px';
        document.body.appendChild(container);
      }

      ytPlayerRef.current = new (window as any).YT.Player('flowzone-yt-player', {
        videoId: vid,
        playerVars: { autoplay: 1, enablejsapi: 1 },
        events: {
          onReady: (e: any) => {
            e.target.setVolume(volume * 100);
            e.target.playVideo();
            setYoutubeReady(true);
          },
        },
      });
    }
  }, [volume]);

  const stopYoutube = useCallback(() => {
    if (ytPlayerRef.current?.destroy) {
      try { ytPlayerRef.current.destroy(); } catch { /* */ }
    }
    ytPlayerRef.current = null;
    setYoutubeVideoId(null);
    setYoutubeReady(false);
  }, []);

  const stopAll = useCallback(() => {
    nodesRef.current.forEach((node) => {
      try { (node as any).stop?.(); } catch { /* */ }
    });
    nodesRef.current.clear();
    setActiveSounds(new Set());
    stopYoutube();
  }, [stopYoutube]);

  useEffect(() => {
    return () => {
      nodesRef.current.forEach((node) => {
        try { (node as any).stop?.(); } catch { /* */ }
      });
      audioCtxRef.current?.close();
      if (ytPlayerRef.current?.destroy) {
        try { ytPlayerRef.current.destroy(); } catch { /* */ }
      }
    };
  }, []);

  return {
    activeSounds,
    volume,
    youtubeVideoId,
    youtubeReady,
    toggleSound,
    setVolume,
    playYoutube,
    stopYoutube,
    stopAll,
  };
}

export { parseYoutubeId };
