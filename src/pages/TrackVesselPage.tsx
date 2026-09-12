import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Ship,
  MapPin,
  Compass,
  Clock,
  Navigation,
  ArrowRight,
  Filter,
  CheckCircle2,
  Anchor,
  Radio,
  FileText,
  PackageCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { MOCK_VESSELS } from '../data/mockData';
import { Vessel } from '../types';

export const TrackVesselPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'map' | 'arrivals' | 'details') || 'map';

  const [activeTab, setActiveTab] = useState<'map' | 'arrivals' | 'details'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedVessel, setSelectedVessel] = useState<Vessel>(MOCK_VESSELS[0]);

  // Filter vessels
  const filteredVessels = MOCK_VESSELS.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.imo.includes(searchQuery) ||
      v.mmsi.includes(searchQuery);
    const matchesType = typeFilter === 'All' || v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSelectVessel = (v: Vessel) => {
    setSelectedVessel(v);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search Bar (Blueprint Page 3) */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Suez AIS & Convoy Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] font-cinzel tracking-tight">
            Track Vessels in Suez
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Real-time vessel tracking and expected arrivals across Suez Canal, Port Said, and Red Sea anchorages.
          </p>

          {/* Search Bar (Blueprint spec: Search by Vessel Name, IMO or MMSI + Search button) */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto shadow-md rounded-xl p-1.5 bg-white border border-slate-200">
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by Vessel Name, IMO or MMSI (e.g. ANJI FORTUNE, 9281234)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-700 pr-2"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="button"
              className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#12345C] text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs: Live Map | Expected Arrivals | Vessel Details */}
        <div className="flex border-b border-slate-200 bg-white rounded-xl shadow-xs p-1.5 mb-8 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'map'
                ? 'bg-[#0B2545] text-white shadow'
                : 'text-slate-600 hover:text-[#0B2545]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Live Map</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('arrivals')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'arrivals'
                ? 'bg-[#0B2545] text-white shadow'
                : 'text-slate-600 hover:text-[#0B2545]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Expected Arrivals ({MOCK_VESSELS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'details'
                ? 'bg-[#0B2545] text-white shadow'
                : 'text-slate-600 hover:text-[#0B2545]'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Vessel Details</span>
          </button>
        </div>

        {/* TAB 1: LIVE MAP TAB (Blueprint Panel 3) */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* STYLIZED SUEZ CANAL MAP ILLUSTRATION (8 Cols) */}
            <div className="lg:col-span-8 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden relative min-h-[540px] flex flex-col justify-between">
              {/* Top map controls & legend */}
              <div className="p-4 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-bold text-white tracking-wide">
                    Suez Canal Maritime Radar & Convoy Lanes
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span>Bulk Carrier</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span>Container</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                    <span>Tanker</span>
                  </span>
                </div>
              </div>

              {/* Maritime SVG Map Canvas */}
              <div className="relative w-full h-[460px] bg-[#0c1f38] overflow-hidden flex items-center justify-center select-none">
                {/* Stylized Nautical Background Grid */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-35"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="nautical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#nautical-grid)" />
                </svg>

                {/* Suez Canal Waterway SVG Path */}
                <svg
                  viewBox="0 0 800 600"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                >
                  {/* Landmass Outlines (Sinai / Eastern Desert) */}
                  <path
                    d="M 0,0 L 520,0 L 500,120 L 460,200 L 420,290 L 460,370 L 390,470 L 340,600 L 0,600 Z"
                    fill="#152b47"
                    opacity="0.8"
                  />
                  <path
                    d="M 800,0 L 570,0 L 540,120 L 490,200 L 450,290 L 490,370 L 420,470 L 460,600 L 800,600 Z"
                    fill="#102540"
                    opacity="0.9"
                  />

                  {/* Suez Canal Navigational Channel (Waterway) */}
                  <path
                    d="M 545,0 C 530,90 475,170 440,240 C 430,265 440,310 470,330 C 480,350 440,410 405,470 C 385,510 395,570 410,600"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="32"
                    strokeLinecap="round"
                    strokeOpacity="0.4"
                  />
                  {/* Center transit track */}
                  <path
                    d="M 545,0 C 530,90 475,170 440,240 C 430,265 440,310 470,330 C 480,350 440,410 405,470 C 385,510 395,570 410,600"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />

                  {/* Great Bitter Lake Waterbody polygon */}
                  <ellipse cx="455" cy="315" rx="65" ry="35" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="455" y="318" fill="#93c5fd" fontSize="11" textAnchor="middle" fontWeight="bold">
                    Great Bitter Lake (Transit)
                  </text>

                  {/* Geographic Labels */}
                  <text x="630" y="45" fill="#e2e8f0" fontSize="13" fontWeight="bold">
                    Port Said (Mediterranean)
                  </text>
                  <text x="630" y="65" fill="#38bdf8" fontSize="10">
                    31°15'N, 32°18'E (North Entrance)
                  </text>

                  <text x="240" y="470" fill="#e2e8f0" fontSize="13" fontWeight="bold">
                    Port of Suez & Port Tawfik
                  </text>
                  <text x="240" y="488" fill="#38bdf8" fontSize="10">
                    29°57'N, 32°33'E (South Entrance)
                  </text>

                  <text x="210" y="555" fill="#e2e8f0" fontSize="12" fontWeight="bold">
                    Ain Sokhna & Adabiya
                  </text>

                  <text x="450" y="565" fill="#f87171" fontSize="11" fontWeight="bold">
                    Gulf of Suez / Anchorage V-Zone
                  </text>
                </svg>

                {/* Interactive Vessel Marker Pins */}
                {filteredVessels.map((vessel) => {
                  const isSelected = selectedVessel.id === vessel.id;
                  const pinColor =
                    vessel.type === 'Container Ship'
                      ? 'bg-[#D0201E]'
                      : vessel.type === 'Bulk Carrier'
                      ? 'bg-amber-500'
                      : 'bg-sky-500';

                  return (
                    <div
                      key={vessel.id}
                      onClick={() => handleSelectVessel(vessel)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin z-20"
                      style={{ left: `${vessel.coords.x}%`, top: `${vessel.coords.y}%` }}
                    >
                      {/* Pulse beacon if selected */}
                      {isSelected && (
                        <div className="absolute -inset-2 rounded-full bg-sky-400/40 animate-ping"></div>
                      )}

                      {/* Marker Icon Pin */}
                      <div
                        className={`w-7 h-7 rounded-full ${pinColor} text-white flex items-center justify-center shadow-lg border-2 ${
                          isSelected ? 'border-white scale-125' : 'border-slate-900 group-hover/pin:scale-110'
                        } transition-transform`}
                      >
                        <Ship className="w-3.5 h-3.5" />
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-1.5 hidden group-hover/pin:block bg-slate-950/95 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xl whitespace-nowrap border border-white/20 pointer-events-none z-30">
                        <span>{vessel.name}</span>
                        <span className="text-slate-400 block font-normal text-[10px]">
                          {vessel.type} • {vessel.speed}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom map status bar */}
              <div className="p-3 bg-slate-950/90 text-xs text-slate-400 border-t border-white/10 flex items-center justify-between">
                <span>Coordinates: Gulf of Suez & Canal Sector 2</span>
                <span className="text-sky-300 font-semibold">
                  Click any marker to inspect vessel details
                </span>
              </div>
            </div>

            {/* CALLOUT CARD FOR SELECTED VESSEL (4 Cols - Blueprint spec) */}
            <div className="lg:col-span-4 bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Radar Selection
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  {selectedVessel.status}
                </span>
              </div>

              {/* Vessel Headline */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0B2545] text-white flex items-center justify-center shrink-0">
                  <Ship className="w-6 h-6 text-sky-300" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#0B2545] font-cinzel">
                    {selectedVessel.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    IMO: <strong className="font-mono text-slate-800">{selectedVessel.imo}</strong> • MMSI: {selectedVessel.mmsi}
                  </p>
                </div>
              </div>

              {/* Key Specs Table */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Vessel Type</span>
                  <span className="font-bold text-slate-800">{selectedVessel.type}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Flag State</span>
                  <span className="font-bold text-slate-800">{selectedVessel.flag}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">ETA Suez</span>
                  <span className="font-bold text-[#D0201E]">{selectedVessel.eta}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Speed</span>
                  <span className="font-bold text-slate-800">{selectedVessel.speed}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Draught / DWT</span>
                  <span className="font-bold text-slate-800">{selectedVessel.draught} • {selectedVessel.dwt}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Convoy Direction</span>
                  <span className="font-bold text-slate-800">{selectedVessel.convoyDirection}</span>
                </div>
              </div>

              {/* Provisioning Desk Status Banner */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-xs mb-1">
                  <PackageCheck className="w-4 h-4 text-sky-700" />
                  <span>Provisioning Status:</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  {selectedVessel.provisionStatus}
                </p>
                {selectedVessel.assignedBoat && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Assigned Launch: <strong className="text-slate-700">{selectedVessel.assignedBoat}</strong>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  to={`/get-a-quote?vessel=${encodeURIComponent(selectedVessel.name)}&imo=${selectedVessel.imo}`}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-xs sm:text-sm text-center block shadow transition-colors"
                >
                  Supply This Vessel (Get Quote) →
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm text-center block transition-colors"
                >
                  View Full Vessel Dossier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPECTED ARRIVALS (Blueprint spec: List of 5 mock vessels as card rows with vessel icon, name, type, ETA, and 'View Full List') */}
        {activeTab === 'arrivals' && (
          <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <h3 className="text-base font-bold text-[#0B2545] font-cinzel">
                Expected Arrivals — Next 7 Days (Suez & Egyptian Ports)
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Filter:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-700"
                >
                  <option value="All">All Vessel Types</option>
                  <option value="Bulk Carrier">Bulk Carrier</option>
                  <option value="Container Ship">Container Ship</option>
                  <option value="Crude Oil Tanker">Crude Oil Tanker</option>
                  <option value="General Cargo">General Cargo</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredVessels.map((vessel) => (
                <div
                  key={vessel.id}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0B2545] flex items-center justify-center shrink-0 border border-slate-200">
                      <Ship className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-extrabold text-[#0B2545]">
                          {vessel.name}
                        </h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {vessel.type}
                        </span>
                        <span className="text-xs text-slate-500">
                          Flag: {vessel.flag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        IMO: <span className="font-mono text-slate-800">{vessel.imo}</span> • Calling: <strong className="text-slate-700">{vessel.port}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Arrival</span>
                      <span className="text-xs font-bold text-[#D0201E] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{vessel.eta}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVessel(vessel);
                          setActiveTab('map');
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Locate
                      </button>
                      <Link
                        to={`/get-a-quote?vessel=${encodeURIComponent(vessel.name)}&imo=${vessel.imo}`}
                        className="px-3 py-2 bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-xs rounded-lg transition-colors shadow"
                      >
                        Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom 'View Full List' Button (Blueprint spec) */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('All');
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B2545] hover:bg-[#12345C] text-white text-xs sm:text-sm font-bold rounded-lg shadow"
              >
                <span>View Full List (Reset Filters)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: VESSEL DETAILS DOSSIER */}
        {activeTab === 'details' && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#D0201E]">
                  Ship Registry & Provisioning Profile
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] font-cinzel mt-1">
                  {selectedVessel.name}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  IMO: {selectedVessel.imo} | MMSI: {selectedVessel.mmsi} | Flag: {selectedVessel.flag}
                </p>
              </div>

              <Link
                to={`/get-a-quote?vessel=${encodeURIComponent(selectedVessel.name)}&imo=${selectedVessel.imo}`}
                className="bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow inline-flex items-center gap-2 self-start"
              >
                <span>Order Provisions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="border border-slate-100 p-3 rounded-lg bg-slate-50">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Vessel Category</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedVessel.type}</span>
              </div>
              <div className="border border-slate-100 p-3 rounded-lg bg-slate-50">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Deadweight Tonnage</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedVessel.dwt}</span>
              </div>
              <div className="border border-slate-100 p-3 rounded-lg bg-slate-50">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Navigational Draught</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedVessel.draught}</span>
              </div>
              <div className="border border-slate-100 p-3 rounded-lg bg-slate-50">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Calling Port / Berth</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedVessel.port}</span>
              </div>
              <div className="border border-slate-100 p-3 rounded-lg bg-slate-50">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Next Convoy Window</span>
                <span className="font-bold text-[#D0201E] text-sm mt-0.5 block">{selectedVessel.eta}</span>
              </div>
              <div className="border border-slate-100 p-3 rounded-lg bg-slate-50">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Launch Delivery Method</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 block">Reefer Supply Launch</span>
              </div>
            </div>

            {/* Chandlery supply preparation status */}
            <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <span>Mentors Marine Provisioning Readiness</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our Suez base maintains active AIS monitoring for <strong>{selectedVessel.name}</strong>. Certified supply boat berths in Port Tawfik allow rapid loading and delivery within 30 minutes of convoy rendezvous.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Status: {selectedVessel.provisionStatus}
                </span>
                <span className="text-slate-400">Launch Boat: {selectedVessel.assignedBoat}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                ← Back to Live Map
              </button>
              <Link
                to="/contact"
                className="text-xs font-bold text-sky-700 hover:text-sky-900"
              >
                Contact 24/7 Operations Desk →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
