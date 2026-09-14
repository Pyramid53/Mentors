import { QuoteFormData, ContactMessage, AdminQuoteRequest, AdminContactInquiry, RFQStatus, ContactStatus } from '../types';
import { getSupabaseClient } from './supabaseClient';

const QUOTES_KEY = 'mentors_admin_quotes_v1';
const INQUIRIES_KEY = 'mentors_admin_inquiries_v1';

function dbRowToQuote(r: any): AdminQuoteRequest {
  return {
    id: r.id,
    submittedAt: r.submitted_at || r.created_at,
    vesselName: r.vessel_name || '',
    imoNumber: r.imo_number || '',
    vesselType: r.vessel_type || 'Commercial Vessel',
    portOfCall: r.port_of_call || 'Port of Suez',
    etaDate: r.eta_date || '',
    etaTime: r.eta_time || '',
    services: r.services || [],
    fileName: r.file_name,
    fileSize: r.file_size,
    selectedItems: r.selected_items || [],
    crewNationalities: r.crew_nationalities,
    priority: r.priority || 'Standard (60 Min)',
    additionalNotes: r.additional_notes,
    contactName: r.contact_name || '',
    contactEmail: r.contact_email || '',
    contactPhone: r.contact_phone || '',
    companyName: r.company_name || '',
    status: r.status || 'New',
    assignedOfficer: r.assigned_officer || 'Capt. Tarek (Suez Desk)',
    quotedAmountUSD: r.quoted_amount_usd ? Number(r.quoted_amount_usd) : undefined,
    dispatchLaunchBoat: r.dispatch_launch_boat,
    adminNotes: r.admin_notes,
    lastUpdated: r.last_updated || 'Active'
  };
}

function quoteToDbRow(q: AdminQuoteRequest) {
  return {
    id: q.id,
    submitted_at: q.submittedAt || new Date().toISOString(),
    vessel_name: q.vesselName || '',
    imo_number: q.imoNumber || '',
    vessel_type: q.vesselType || 'Commercial Vessel',
    port_of_call: q.portOfCall || 'Port of Suez',
    eta_date: q.etaDate || '',
    eta_time: q.etaTime || '',
    services: Array.isArray(q.services) ? q.services : [],
    file_name: q.fileName || null,
    file_size: q.fileSize || null,
    selected_items: Array.isArray(q.selectedItems) ? q.selectedItems : [],
    crew_nationalities: q.crewNationalities || null,
    priority: q.priority || 'Standard (60 Min)',
    additional_notes: q.additionalNotes || null,
    contact_name: q.contactName || '',
    contact_email: q.contactEmail || '',
    contact_phone: q.contactPhone || '',
    company_name: q.companyName || '',
    status: q.status || 'New',
    assigned_officer: q.assignedOfficer || 'Capt. Tarek (Suez Desk)',
    quoted_amount_usd: q.quotedAmountUSD ? Number(q.quotedAmountUSD) : null,
    dispatch_launch_boat: q.dispatchLaunchBoat || null,
    admin_notes: q.adminNotes || null,
    last_updated: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function dbRowToInquiry(r: any): AdminContactInquiry {
  return {
    id: r.id,
    submittedAt: r.submitted_at || r.created_at,
    fullName: r.full_name || '',
    email: r.email || '',
    phone: r.phone || '',
    company: r.company || '',
    inquiryType: r.inquiry_type || 'General Inquiries',
    portOfCall: r.port_of_call || 'Port of Suez',
    message: r.message || '',
    status: r.status || 'New',
    assignedTo: r.assigned_to || 'Duty Officer (Suez Operations)',
    adminNotes: r.admin_notes
  };
}

function inquiryToDbRow(i: AdminContactInquiry) {
  return {
    id: i.id,
    submitted_at: i.submittedAt || new Date().toISOString(),
    full_name: i.fullName || '',
    email: i.email || '',
    phone: i.phone || '',
    company: i.company || '',
    inquiry_type: i.inquiryType || 'General Inquiries',
    port_of_call: i.portOfCall || 'Port of Suez',
    message: i.message || '',
    status: i.status || 'New',
    assigned_to: i.assignedTo || 'Duty Officer (Suez Operations)',
    admin_notes: i.adminNotes || null,
    last_updated: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Seed initial realistic data so admin desk is immediately rich and functional
const INITIAL_QUOTES: AdminQuoteRequest[] = [
  {
    id: 'MMP-RFQ-98421',
    submittedAt: '2026-05-12T13:42:00Z',
    vesselName: 'MSC ORION',
    imoNumber: '9857145',
    portOfCall: 'Suez Anchorage (V-Zone)',
    etaDate: '2026-05-13',
    etaTime: '18:00',
    services: ['Fresh Provisions', 'Dry Stores & Beverages', 'Technical Stores'],
    fileName: 'MSC_Orion_Suez_Stores_Indent_Rev2.xlsx',
    fileSize: '1.45 MB',
    selectedItems: [
      'Mineral Water 1.5L (Case of 12)',
      'USDA Boneless Beef (Halal)',
      'Fresh Table Eggs Grade AA',
      'Engine Oil 15W40 (208L Drum)',
      '4G Suez Transit Data SIM Card (100GB)'
    ],
    crewNationalities: 'Mixed (24 Crew: Italian, Filipino, Ukrainian)',
    priority: 'Urgent (< 30 Min)',
    additionalNotes: 'Vessel is awaiting 04:00 northbound convoy slot. Need launch alongside at Waiting Area V before 22:00. Requires customs clearance stamped before boarding.',
    contactName: 'Capt. Marco Rossi',
    contactEmail: 'm.rossi@msc-operations.com',
    contactPhone: '+39 340 551 2894',
    companyName: 'Mediterranean Shipping Company (Geneva)',
    status: 'In Review',
    assignedOfficer: 'Capt. Tarek (Suez Desk)',
    quotedAmountUSD: 18450,
    dispatchLaunchBoat: 'Mentors Launch 02',
    adminNotes: 'Spoke with local shipping agent GAC Suez. Launch 02 scheduled for 20:30 departure from Port Tawfik pier.',
    lastUpdated: '10 mins ago'
  },
  {
    id: 'MMP-RFQ-98405',
    submittedAt: '2026-05-12T11:15:00Z',
    vesselName: 'CMA CGM LOUVRE',
    imoNumber: '9839129',
    portOfCall: 'Port Said (North Convoy)',
    etaDate: '2026-05-14',
    etaTime: '06:00',
    services: ['Fresh Provisions', 'Bonded Stores (Duty Free)', 'Crew Welfare & Wi-Fi'],
    fileName: 'CMA_CGM_Louvre_Provisions_List_May.pdf',
    fileSize: '890 KB',
    selectedItems: [
      'Fresh Egyptian Citrus & Bananas',
      'Whole Chicken Grade A (Frozen)',
      'Basmati Long Grain Rice 25KG',
      'Marlboro Red Cigarettes (Duty Free)'
    ],
    crewNationalities: 'French & Filipino (28 crew)',
    priority: 'Standard (60 Min)',
    additionalNotes: 'Requires HACCP certified temperature printouts for all chilled poultry and fresh dairy.',
    contactName: 'Jean-Luc Moreau',
    contactEmail: 'jl.moreau@cmacgm-fleet.fr',
    contactPhone: '+33 4 88 91 22 00',
    companyName: 'CMA CGM Ship Management',
    status: 'Quoted (60m)',
    assignedOfficer: 'Eng. Mostafa (Port Said Desk)',
    quotedAmountUSD: 24800,
    dispatchLaunchBoat: 'Mentors Launch 04',
    adminNotes: 'Quotation sent via email and WhatsApp. Awaiting superintendent PO confirmation.',
    lastUpdated: '1 hour ago'
  },
  {
    id: 'MMP-RFQ-98388',
    submittedAt: '2026-05-12T08:30:00Z',
    vesselName: 'NORDIC SPIRIT',
    imoNumber: '9429112',
    portOfCall: 'Ain Sokhna Tanker Terminal',
    etaDate: '2026-05-13',
    etaTime: '06:15',
    services: ['Technical Stores', 'Deck & Engine Spares', 'Fresh Water Supply'],
    fileName: 'Nordic_Spirit_IMPA_Engine_Deck.xlsx',
    fileSize: '2.10 MB',
    selectedItems: [
      'Mooring Rope 8-Strand 56mm x 220m',
      'Engine Oil 15W40 (208L Drum)',
      'Mineral Water 1.5L (Case of 12)'
    ],
    crewNationalities: 'Scandinavian & Polish (21 crew)',
    priority: 'Anchorage Delivery',
    additionalNotes: 'Tanker discharging at Sokhna SPM berth 2. Safety helmets and ATEX-certified radios mandatory on launch boat.',
    contactName: 'Henrik Lindberg',
    contactEmail: 'h.lindberg@nordictankers.no',
    contactPhone: '+47 902 33 412',
    companyName: 'Nordic Tankers AS',
    status: 'Order Confirmed',
    assignedOfficer: 'Capt. Tarek (Suez Desk)',
    quotedAmountUSD: 31200,
    dispatchLaunchBoat: 'Mentors Launch 01',
    adminNotes: 'PO #NT-2026-091 received. Provisions and mooring lines loaded in refrigerated warehouse.',
    lastUpdated: '3 hours ago'
  },
  {
    id: 'MMP-RFQ-98310',
    submittedAt: '2026-05-11T16:20:00Z',
    vesselName: 'ANJI FORTUNE',
    imoNumber: '9281234',
    portOfCall: 'Port of Suez & Port Tawfik',
    etaDate: '2026-05-12',
    etaTime: '14:30',
    services: ['Fresh Provisions', 'Dry Stores & Beverages'],
    fileName: 'AnjiFortune_Halal_Stores.pdf',
    fileSize: '450 KB',
    selectedItems: [
      'USDA Boneless Beef (Halal)',
      'Fresh Table Eggs Grade AA',
      'Fresh Egyptian Citrus & Bananas'
    ],
    crewNationalities: 'Chinese & Indonesian (22 crew)',
    priority: 'Standard (60 Min)',
    additionalNotes: 'All beef and poultry must be certified 100% Halal with Egyptian Islamic Authority stamp.',
    contactName: 'Capt. Zhang Wei',
    contactEmail: 'master.anjifortune@cosco-bulk.cn',
    contactPhone: '+86 21 6888 1234',
    companyName: 'Cosco Shipping Bulk Co.',
    status: 'Dispatched',
    assignedOfficer: 'Chandlery Officer Karim',
    quotedAmountUSD: 12900,
    dispatchLaunchBoat: 'Mentors Launch 04',
    adminNotes: 'Launch boat en route to anchorage. ETA alongside 15:10.',
    lastUpdated: '4 hours ago'
  }
];

const INITIAL_INQUIRIES: AdminContactInquiry[] = [
  {
    id: 'INQ-4821',
    submittedAt: '2026-05-12T14:10:00Z',
    fullName: 'Sven Borg',
    company: 'Stolt-Nielsen Fleet Operations',
    email: 's.borg@stolt.com',
    phone: '+31 10 409 0100',
    inquiryType: 'Fleet Supply Agreement',
    message: 'We operate 14 chemical parcel tankers transiting Suez regularly every quarter. Looking to establish a comprehensive annual ship chandlery and provisions agreement with fixed rebates for Suez and Port Said calls.',
    status: 'New',
    assignedTo: 'Commercial Director Ahmed',
    adminNotes: 'High-value fleet account. Prepare corporate proposal and Suez transit discount tier.',
    lastUpdated: '25 mins ago'
  },
  {
    id: 'INQ-4815',
    submittedAt: '2026-05-12T09:45:00Z',
    fullName: 'Elena Rostova',
    company: 'V-Ships Monaco',
    email: 'elena.rostova@vships.com',
    phone: '+377 92 05 10 50',
    inquiryType: 'Emergency Stores & Spares',
    message: 'One of our bulk carriers arriving at Suez V-zone tomorrow morning requires urgent emergency auxiliary generator fuel filters (IMPA 23.20.15) and fresh potable water barge bunkering (120 MT). Can you supply alongside?',
    status: 'Replied',
    assignedTo: 'Capt. Tarek (Suez Desk)',
    adminNotes: 'Phoned superintendent. Confirmed stock availability in Suez warehouse. Water barge reserved for 08:00.',
    lastUpdated: '2 hours ago'
  },
  {
    id: 'INQ-4798',
    submittedAt: '2026-05-11T14:00:00Z',
    fullName: 'David Chen',
    company: 'Pacific Basin Shipping',
    email: 'dchen@pacificbasin.com',
    phone: '+852 2233 7000',
    inquiryType: 'Crew Welfare & SIMs',
    message: 'Looking for 25 high-speed 4G unlimited data SIM cards and crew calling scratchcards for 2 handysize vessels entering Suez north convoy next Tuesday. Please provide pricing and activation terms.',
    status: 'Closed',
    assignedTo: 'Chandlery Officer Karim',
    adminNotes: 'Package delivered and tested onboard. Master signed delivery receipt.',
    lastUpdated: '1 day ago'
  }
];

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error('Error in requestStore listener:', err);
    }
  });
}

export const requestStore = {
  getQuoteRequests(): AdminQuoteRequest[] {
    try {
      const data = localStorage.getItem(QUOTES_KEY);
      if (!data) {
        localStorage.setItem(QUOTES_KEY, JSON.stringify(INITIAL_QUOTES));
        return INITIAL_QUOTES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_QUOTES;
    }
  },

  addQuoteRequest(formData: QuoteFormData): AdminQuoteRequest {
    const current = this.getQuoteRequests();
    const newId = `MMP-RFQ-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRecord: AdminQuoteRequest = {
      ...formData,
      id: newId,
      submittedAt: new Date().toISOString(),
      status: 'New',
      assignedOfficer: 'Capt. Tarek (Suez Desk)',
      lastUpdated: 'Just now',
      adminNotes: 'Incoming request received via web portal. Fast 60-min quote response countdown initiated.'
    };

    const updated = [newRecord, ...current];
    try {
      localStorage.setItem(QUOTES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    notifyListeners();

    // Background sync to backend API (Supabase when connected)
    try {
      fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      }).catch(() => {
        // Fallback: direct Supabase if client-side keys are configured
        const supabase = getSupabaseClient();
        if (supabase) {
          supabase.from('quote_requests').upsert([quoteToDbRow(newRecord)], { onConflict: 'id' }).then();
        }
      });
    } catch {
      // Direct Supabase fallback
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.from('quote_requests').upsert([quoteToDbRow(newRecord)], { onConflict: 'id' }).then();
      }
    }

    return newRecord;
  },

  updateQuoteRequest(id: string, updates: Partial<AdminQuoteRequest>): AdminQuoteRequest | null {
    const current = this.getQuoteRequests();
    const index = current.findIndex((q) => q.id === id);
    if (index === -1) return null;

    const updatedItem: AdminQuoteRequest = {
      ...current[index],
      ...updates,
      lastUpdated: 'Just now'
    };

    current[index] = updatedItem;
    try {
      localStorage.setItem(QUOTES_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    notifyListeners();

    // Background sync to backend API or direct Supabase
    try {
      fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).catch(() => {
        const supabase = getSupabaseClient();
        if (supabase) {
          supabase.from('quote_requests').upsert([quoteToDbRow(updatedItem)], { onConflict: 'id' }).then();
        }
      });
    } catch {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.from('quote_requests').upsert([quoteToDbRow(updatedItem)], { onConflict: 'id' }).then();
      }
    }

    return updatedItem;
  },

  updateQuoteStatus(id: string, newStatus: RFQStatus, details?: Partial<AdminQuoteRequest>): AdminQuoteRequest | null {
    return this.updateQuoteRequest(id, {
      status: newStatus,
      ...details
    });
  },

  deleteQuoteRequest(id: string): void {
    const current = this.getQuoteRequests();
    const filtered = current.filter((q) => q.id !== id);
    try {
      localStorage.setItem(QUOTES_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    notifyListeners();

    try {
      fetch(`/api/quotes/${id}`, { method: 'DELETE' }).catch(() => {
        const supabase = getSupabaseClient();
        if (supabase) {
          supabase.from('quote_requests').delete().eq('id', id).then();
        }
      });
    } catch {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.from('quote_requests').delete().eq('id', id).then();
      }
    }
  },

  async refreshFromBackend(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      let quotesSynced = false;
      let inqSynced = false;

      const [quotesRes, inqRes] = await Promise.allSettled([
        fetch('/api/quotes'),
        fetch('/api/inquiries')
      ]);

      if (quotesRes.status === 'fulfilled' && quotesRes.value.ok) {
        try {
          const json = await quotesRes.value.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            localStorage.setItem(QUOTES_KEY, JSON.stringify(json.data));
            quotesSynced = true;
          }
        } catch {}
      }

      if (inqRes.status === 'fulfilled' && inqRes.value.ok) {
        try {
          const json = await inqRes.value.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            localStorage.setItem(INQUIRIES_KEY, JSON.stringify(json.data));
            inqSynced = true;
          }
        } catch {}
      }

      // If server API was unavailable (static GitHub Pages hosting), query direct Supabase
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          if (!quotesSynced) {
            const { data: qData } = await supabase
              .from('quote_requests')
              .select('*')
              .order('submitted_at', { ascending: false });
            if (qData && qData.length > 0) {
              const mapped = qData.map(dbRowToQuote);
              localStorage.setItem(QUOTES_KEY, JSON.stringify(mapped));
            }
          }
          if (!inqSynced) {
            const { data: iData } = await supabase
              .from('contact_inquiries')
              .select('*')
              .order('submitted_at', { ascending: false });
            if (iData && iData.length > 0) {
              const mapped = iData.map(dbRowToInquiry);
              localStorage.setItem(INQUIRIES_KEY, JSON.stringify(mapped));
            }
          }
        } catch (dbErr) {
          console.warn('Direct Supabase sync warning:', dbErr);
        }
      }

      notifyListeners();
    } catch (err) {
      console.log('Backend sync offline/fallback:', err);
    }
  },

  getContactInquiries(): AdminContactInquiry[] {
    try {
      const data = localStorage.getItem(INQUIRIES_KEY);
      if (!data) {
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_INQUIRIES));
        return INITIAL_INQUIRIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_INQUIRIES;
    }
  },

  addContactInquiry(message: ContactMessage): AdminContactInquiry {
    const current = this.getContactInquiries();
    const newId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: AdminContactInquiry = {
      ...message,
      id: newId,
      submittedAt: new Date().toISOString(),
      status: 'New',
      assignedTo: 'Duty Officer (Suez Operations)',
      lastUpdated: 'Just now',
      adminNotes: 'Inbound message from contact desk.'
    };

    const updated = [newRecord, ...current];
    try {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    notifyListeners();

    try {
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      }).catch(() => {
        const supabase = getSupabaseClient();
        if (supabase) {
          supabase.from('contact_inquiries').upsert([inquiryToDbRow(newRecord)], { onConflict: 'id' }).then();
        }
      });
    } catch {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.from('contact_inquiries').upsert([inquiryToDbRow(newRecord)], { onConflict: 'id' }).then();
      }
    }

    return newRecord;
  },

  updateContactInquiry(id: string, updates: Partial<AdminContactInquiry>): AdminContactInquiry | null {
    const current = this.getContactInquiries();
    const index = current.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const updatedItem: AdminContactInquiry = {
      ...current[index],
      ...updates,
      lastUpdated: 'Just now'
    };

    current[index] = updatedItem;
    try {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    notifyListeners();
    return updatedItem;
  },

  getUnreadCount(): { quotes: number; inquiries: number; total: number } {
    const quotes = this.getQuoteRequests().filter((q) => q.status === 'New').length;
    const inquiries = this.getContactInquiries().filter((i) => i.status === 'New').length;
    return {
      quotes,
      inquiries,
      total: quotes + inquiries
    };
  },

  resetToDefaults(): void {
    localStorage.setItem(QUOTES_KEY, JSON.stringify(INITIAL_QUOTES));
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_INQUIRIES));
    notifyListeners();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};

// Initial background sync from Supabase backend when loaded in browser
if (typeof window !== 'undefined') {
  requestStore.refreshFromBackend();
}
