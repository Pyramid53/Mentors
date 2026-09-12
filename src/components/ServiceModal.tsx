import React from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Package, FileSpreadsheet } from 'lucide-react';
import { ServiceDetail } from '../types';
import { Link } from 'react-router-dom';

interface ServiceModalProps {
  service: ServiceDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, isOpen, onClose }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header with image banner */}
        <div className="relative h-48 bg-slate-900 overflow-hidden shrink-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-[#0B2545]/60 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block bg-[#D0201E] text-white text-[11px] font-bold px-2.5 py-0.5 rounded tracking-wide uppercase mb-1">
              {service.badge}
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Overview & Specifications
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {service.longDesc}
            </p>
          </div>

          {/* Key capabilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Standard Inclusions & Capabilities
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-xs sm:text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Catalog items */}
          {service.sampleItems && service.sampleItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sample Catalog Items
                </h4>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-sky-500" />
                  <span>IMPA / ISSA / Custom List</span>
                </span>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-3 py-2">Item Code</th>
                      <th className="px-3 py-2">Description</th>
                      <th className="px-3 py-2">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {service.sampleItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono text-sky-700 font-semibold">{item.code}</td>
                        <td className="px-3 py-2 text-slate-800">{item.name}</td>
                        <td className="px-3 py-2 text-slate-500">{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quality Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Quality & Regulatory Compliance
            </h4>
            <div className="flex flex-wrap gap-2">
              {service.standards.map((std, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-md text-xs font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>{std}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          <Link
            to={`/get-a-quote?service=${encodeURIComponent(service.title)}`}
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors shadow"
          >
            <span>Request Quote for {service.title.split('&')[0]}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
