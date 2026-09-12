import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Anchor,
  MapPin,
  Ship,
  Clock,
  Navigation,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { MOCK_PORTS } from '../data/mockData';

export const PortsPage: React.FC = () => {
  const [selectedPort, setSelectedPort] = useState(MOCK_PORTS[0]);

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Strategic Egyptian Maritime Coverage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] font-cinzel tracking-tight">
            Ports We Serve
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-2 font-medium">
            24/7 provision delivery across all major Egyptian waterways, anchorages, and container terminals.
          </p>
        </div>

        {/* Ports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PORTS.map((port) => (
            <div
              key={port.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-white flex items-center justify-center shrink-0">
                    <Anchor className="w-5 h-5 text-sky-300" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                    {port.type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0B2545] font-cinzel">
                  {port.name}
                </h3>
                <p className="text-xs text-sky-700 font-mono mt-0.5 mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{port.coordinates}</span>
                </p>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {port.description}
                </p>

                {/* Capabilities / Services */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                    <span>Supply Services</span>
                    <span className="text-sky-700">Launch: {port.avgLaunchTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {port.servicesAvailable.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/track-vessel?tab=arrivals`}
                  className="text-xs font-bold text-slate-600 hover:text-[#0B2545]"
                >
                  View Arrivals →
                </Link>
                <Link
                  to={`/get-a-quote?port=${encodeURIComponent(port.name)}`}
                  className="bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-xs px-3.5 py-1.5 rounded-md shadow transition-colors"
                >
                  Quote for this Port
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Anchorages notice */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Ship className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0B2545] font-cinzel">
                Anchorage & Offshore Launch Supply Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Our fleet of specialized refrigerated workboats serves vessels anchored in Suez V-Zone, Green Island, and Port Said Mediterranean Roads 24 hours a day without requiring vessel berthing.
              </p>
            </div>
          </div>

          <Link
            to="/get-a-quote"
            className="bg-[#0B2545] hover:bg-[#12345C] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg whitespace-nowrap shadow shrink-0"
          >
            Arrange Anchorage Delivery
          </Link>
        </div>
      </div>
    </div>
  );
};
