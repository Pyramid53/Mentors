import React, { useState } from 'react';
import { X, Play, Volume2, VolumeX, ShieldCheck, Ship, Clock, CheckCircle2 } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h3 className="text-white font-bold text-base tracking-wide">
              Mentors Marine Provisions: 24/7 Suez Canal Operations
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Canvas (Simulated high-production maritime documentary) */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-[#0B2545] to-slate-950 flex items-center justify-center overflow-hidden group">
          {/* Background maritime cinematic image */}
          <img
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1600&q=80"
            alt="Vessel provisioning in Suez Canal"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
          />

          {/* Animated radar overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15)_0%,transparent_70%)] pointer-events-none"></div>

          {/* Dynamic on-screen overlay stats */}
          <div className="absolute top-4 left-4 z-10 space-y-1.5 pointer-events-none">
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-sky-300 border border-sky-500/30">
              <Ship className="w-3.5 h-3.5" />
              <span>Location: Suez Southern Anchorage (29°57'N, 32°33'E)</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-emerald-400 border border-emerald-500/30 block">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cold Chain Active: -18.5°C Controlled Reefer Launch</span>
            </div>
          </div>

          {/* Center Play / Pause Indicator */}
          <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-lg">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full bg-[#D0201E] hover:bg-[#b01716] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 mb-4 group/btn"
              aria-label="Play video"
            >
              {isPlaying ? (
                <div className="flex gap-1.5 items-center justify-center">
                  <div className="w-2 h-6 bg-white rounded-full"></div>
                  <div className="w-2 h-6 bg-white rounded-full"></div>
                </div>
              ) : (
                <Play className="w-8 h-8 text-white ml-1 fill-white" />
              )}
            </button>
            <h4 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight">
              Supplying Vessels. Building Lasting Partnerships.
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Go behind the scenes with our supply boat crew, refrigerated staging warehouses in Port Tawfik, and direct-to-quay crane operations.
            </p>
          </div>

          {/* Player controls bottom bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-center justify-between text-xs text-white z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-sky-300 transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <span>02:14 / 04:30</span>
            </div>
            <div className="w-1/2 bg-white/20 h-1 rounded-full overflow-hidden hidden sm:block">
              <div className="bg-[#D0201E] h-full w-1/2 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-sky-300 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded border border-sky-400/30">
                1080p HD
              </span>
            </div>
          </div>
        </div>

        {/* Footer info & key capabilities */}
        <div className="bg-slate-900 p-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold">60-Minute Fast Turnaround</strong>
              <span className="text-slate-400">Rapid response teams stationed along the canal corridor.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold">HACCP & ISO 22000 Certified</strong>
              <span className="text-slate-400">Strict cold-chain logistics from cold room to ship gallery.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Ship className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold">Dedicated Fleet Launches</strong>
              <span className="text-slate-400">Certified supply launches operating in all weather conditions.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
