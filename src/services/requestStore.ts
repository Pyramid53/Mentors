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

// Production-ready data store initialized with empty real state (no hardcoded test data)
const INITIAL_QUOTES: AdminQuoteRequest[] = [];
const INITIAL_INQUIRIES: AdminContactInquiry[] = [];

// Known mock IDs to purge from previous testing sessions
const MOCK_QUOTE_IDS = new Set(['MMP-RFQ-98421', 'MMP-RFQ-98405', 'MMP-RFQ-98388', 'MMP-RFQ-98310']);
const MOCK_INQUIRY_IDS = new Set(['INQ-4821', 'INQ-4815', 'INQ-4798', 'MM-INQ-1042', 'MM-INQ-1039']);

// Purge any lingering legacy mock data from localStorage
function sanitizeLocalStorage() {
  if (typeof window === 'undefined') return;
  try {
    const rawQuotes = localStorage.getItem(QUOTES_KEY);
    if (rawQuotes) {
      const parsed: AdminQuoteRequest[] = JSON.parse(rawQuotes);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(
          (q) => !MOCK_QUOTE_IDS.has(q.id) && q.vesselName !== 'MSC ORION' && q.vesselName !== 'CMA CGM LOUVRE'
        );
        localStorage.setItem(QUOTES_KEY, JSON.stringify(cleaned));
      }
    }

    const rawInq = localStorage.getItem(INQUIRIES_KEY);
    if (rawInq) {
      const parsedInq: AdminContactInquiry[] = JSON.parse(rawInq);
      if (Array.isArray(parsedInq)) {
        const cleanedInq = parsedInq.filter(
          (i) => !MOCK_INQUIRY_IDS.has(i.id) && i.fullName !== 'Sven Borg' && i.fullName !== 'Elena Rostova'
        );
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(cleanedInq));
      }
    }
  } catch (err) {
    console.warn('Storage sanitization check:', err);
  }
}

if (typeof window !== 'undefined') {
  sanitizeLocalStorage();
}

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
        return [];
      }
      const parsed: AdminQuoteRequest[] = JSON.parse(data);
      // Filter out any mock remnants
      return parsed.filter((q) => !MOCK_QUOTE_IDS.has(q.id) && q.vesselName !== 'MSC ORION');
    } catch {
      return [];
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
        return [];
      }
      const parsed: AdminContactInquiry[] = JSON.parse(data);
      return parsed.filter((i) => !MOCK_INQUIRY_IDS.has(i.id) && i.fullName !== 'Sven Borg');
    } catch {
      return [];
    }
  },

  deleteContactInquiry(id: string): void {
    const current = this.getContactInquiries();
    const filtered = current.filter((i) => i.id !== id);
    try {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    notifyListeners();

    try {
      fetch(`/api/inquiries/${id}`, { method: 'DELETE' }).catch(() => {
        const supabase = getSupabaseClient();
        if (supabase) {
          supabase.from('contact_inquiries').delete().eq('id', id).then();
        }
      });
    } catch {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.from('contact_inquiries').delete().eq('id', id).then();
      }
    }
  },

  exportQuotesToCSV(): void {
    const quotes = this.getQuoteRequests();
    if (quotes.length === 0) {
      alert('No quote records to export.');
      return;
    }

    const headers = ['RFQ ID', 'Submitted At', 'Vessel Name', 'IMO Number', 'Port of Call', 'ETA Date', 'Services', 'Contact Name', 'Company', 'Email', 'Phone', 'Status', 'Quoted USD', 'Assigned Officer'];
    const rows = quotes.map((q) => [
      `"${q.id}"`,
      `"${q.submittedAt}"`,
      `"${q.vesselName.replace(/"/g, '""')}"`,
      `"${q.imoNumber}"`,
      `"${(q.portOfCall || '').replace(/"/g, '""')}"`,
      `"${q.etaDate}"`,
      `"${(q.services || []).join(', ').replace(/"/g, '""')}"`,
      `"${(q.contactName || '').replace(/"/g, '""')}"`,
      `"${(q.companyName || '').replace(/"/g, '""')}"`,
      `"${(q.contactEmail || '').replace(/"/g, '""')}"`,
      `"${(q.contactPhone || '').replace(/"/g, '""')}"`,
      `"${q.status}"`,
      `"${q.quotedAmountUSD || ''}"`,
      `"${(q.assignedOfficer || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mentors_Marine_RFQs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  clearAllData(): void {
    localStorage.removeItem(QUOTES_KEY);
    localStorage.removeItem(INQUIRIES_KEY);
    notifyListeners();
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
    localStorage.setItem(QUOTES_KEY, JSON.stringify([]));
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify([]));
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
