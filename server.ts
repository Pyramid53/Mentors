import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getSupabaseClient } from './src/services/supabaseClient';

// Helper mappers for Quotes (camelCase <-> snake_case)
function quoteToDbRow(q: any) {
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

function dbRowToQuote(r: any) {
  return {
    id: r.id,
    submittedAt: r.submitted_at || r.created_at,
    vesselName: r.vessel_name,
    imoNumber: r.imo_number,
    vesselType: r.vessel_type,
    portOfCall: r.port_of_call,
    etaDate: r.eta_date,
    etaTime: r.eta_time,
    services: r.services || [],
    fileName: r.file_name,
    fileSize: r.file_size,
    selectedItems: r.selected_items || [],
    crewNationalities: r.crew_nationalities,
    priority: r.priority,
    additionalNotes: r.additional_notes,
    contactName: r.contact_name,
    contactEmail: r.contact_email,
    contactPhone: r.contact_phone,
    companyName: r.company_name,
    status: r.status,
    assignedOfficer: r.assigned_officer,
    quotedAmountUSD: r.quoted_amount_usd ? Number(r.quoted_amount_usd) : undefined,
    dispatchLaunchBoat: r.dispatch_launch_boat,
    adminNotes: r.admin_notes,
    lastUpdated: r.last_updated || 'Active'
  };
}

// Helper mappers for Inquiries
function inquiryToDbRow(i: any) {
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

function dbRowToInquiry(r: any) {
  return {
    id: r.id,
    submittedAt: r.submitted_at || r.created_at,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    company: r.company,
    inquiryType: r.inquiry_type,
    portOfCall: r.port_of_call,
    message: r.message,
    status: r.status,
    assignedTo: r.assigned_to,
    adminNotes: r.admin_notes
  };
}

// Initial sample quotes to seed into empty Supabase tables
const SEED_QUOTES = [
  {
    id: 'MMP-RFQ-98421',
    submittedAt: '2026-05-12T13:42:00Z',
    vesselName: 'MSC ORION',
    imoNumber: '9857145',
    vesselType: 'Container Ship (14,000 TEU)',
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
    vesselType: 'LNG Dual-Fuel Container Vessel',
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
    contactEmail: 'jl.moreau@cma-cgm.com',
    contactPhone: '+33 4 88 91 2000',
    companyName: 'CMA CGM Marseilles',
    status: 'Quoted (60m)',
    assignedOfficer: 'Eng. Hany Mostafa',
    quotedAmountUSD: 14200,
    dispatchLaunchBoat: 'Mentors Launch 01',
    adminNotes: 'Proforma quotation transmitted to superintendent. Awaiting master PO confirmation.',
    lastUpdated: '25 mins ago'
  },
  {
    id: 'MMP-RFQ-98389',
    submittedAt: '2026-05-12T09:30:00Z',
    vesselName: 'NORDIC BREEZE',
    imoNumber: '9748231',
    vesselType: 'Aframax Crude Oil Tanker',
    portOfCall: 'Ain Sokhna Petroleum Basin',
    etaDate: '2026-05-13',
    etaTime: '12:00',
    services: ['Safety & Pyrotechnics', 'Technical Stores', 'Fresh Water Supply'],
    fileName: 'Nordic_Breeze_Safety_Spares_Indent.xlsx',
    fileSize: '2.1 MB',
    selectedItems: [
      'Fresh Potable Water (150 Metric Tons)',
      'Rocket Parachute Flares (SOLAS Approved)',
      'Impeller Kit for Bilge Pump Model B-42'
    ],
    crewNationalities: 'Scandinavian & Croatian (21 crew)',
    priority: 'Urgent (< 30 Min)',
    additionalNotes: 'Barge water delivery connection 2.5 inch Storz coupling.',
    contactName: 'Sarah Lindqvist',
    contactEmail: 'superintendent@shipping.com',
    contactPhone: '+47 902 33 412',
    companyName: 'Nordic Tankers AS',
    status: 'Order Confirmed',
    assignedOfficer: 'Capt. Tarek (Suez Desk)',
    quotedAmountUSD: 29800,
    dispatchLaunchBoat: 'Mentors Water Barge 01',
    adminNotes: 'PO #NT-2026-05-99 verified with bank guarantee. Barge scheduled for pumping at 13:30.',
    lastUpdated: '1 hour ago'
  }
];

const SEED_INQUIRIES = [
  {
    id: 'MM-INQ-1042',
    submittedAt: '2026-05-12T14:10:00Z',
    fullName: 'Capt. Henrik Lindholm',
    email: 'h.lindholm@maersk-tankers.com',
    phone: '+45 33 63 33 63',
    company: 'Maersk Tankers Copenhagen',
    inquiryType: 'Emergency Technical Stores',
    portOfCall: 'Port of Suez',
    message: 'Urgent inquiry regarding main engine cylinder lubricating oil delivery at Suez waiting zone V-4 before southbound transit. Need 12 drums 208L.',
    status: 'In Review',
    assignedTo: 'Capt. Tarek Mansour',
    adminNotes: 'Shell Gadinia 40 in stock in Adabiya free-zone warehouse.'
  },
  {
    id: 'MM-INQ-1039',
    submittedAt: '2026-05-11T09:20:00Z',
    fullName: 'Elena Rostova',
    email: 'procurement@sovcomflot.com',
    phone: '+7 495 660 4000',
    company: 'SCF Management Services',
    inquiryType: 'Fresh Provisions Requisition',
    portOfCall: 'Port Said Container Terminal',
    message: 'Requesting monthly provisions rate-card for container vessels calling Port Said regularly on Asia-Europe route.',
    status: 'New',
    assignedTo: 'Eng. Hany Mostafa',
    adminNotes: 'Send 2026 standardized contract pricing sheet.'
  }
];

async function seedSupabaseIfEmpty() {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // Check quote_requests
    const { count: quoteCount } = await supabase
      .from('quote_requests')
      .select('*', { count: 'exact', head: true });

    if ((quoteCount || 0) < 3) {
      console.log('Seeding initial quote requests to Supabase...');
      const rows = SEED_QUOTES.map(quoteToDbRow);
      const { error: seedError } = await supabase.from('quote_requests').upsert(rows, { onConflict: 'id' });
      if (seedError) {
        console.warn('Could not auto-seed quote_requests:', seedError.message);
      } else {
        console.log(`Successfully synced ${rows.length} quote requests to Supabase!`);
      }
    }

    // Check contact_inquiries
    const { count: inqCount } = await supabase
      .from('contact_inquiries')
      .select('*', { count: 'exact', head: true });

    if (inqCount === 0) {
      console.log('Seeding initial contact inquiries to Supabase...');
      const inqRows = SEED_INQUIRIES.map(inquiryToDbRow);
      const { error: inqError } = await supabase.from('contact_inquiries').insert(inqRows);
      if (inqError) {
        console.warn('Could not auto-seed contact_inquiries:', inqError.message);
      } else {
        console.log(`Successfully seeded ${inqRows.length} contact inquiries to Supabase!`);
      }
    }

    // Check app_users
    const { count: userCount } = await supabase
      .from('app_users')
      .select('*', { count: 'exact', head: true });

    if ((userCount || 0) === 0) {
      console.log('Seeding initial maritime users to Supabase...');
      const seedUsers = [
        {
          id: 'USR-ADM-01',
          name: 'Capt. Tarek Mansour',
          email: 'admin@mentors-marine.com',
          company: 'Mentors Marine Services SAE',
          role: 'admin',
          phone: '+20 100 489 2210',
          avatar_initials: 'TM',
          password_hash: 'admin123'
        },
        {
          id: 'USR-CLT-01',
          name: 'Capt. Marco Rossi',
          email: 'm.rossi@msc-operations.com',
          company: 'Mediterranean Shipping Company (Geneva)',
          role: 'client',
          phone: '+39 340 551 2894',
          avatar_initials: 'MR',
          password_hash: 'client123'
        },
        {
          id: 'USR-CLT-02',
          name: 'Sarah Lindqvist',
          email: 'superintendent@shipping.com',
          company: 'Nordic Tankers AS',
          role: 'client',
          phone: '+47 902 33 412',
          avatar_initials: 'SL',
          password_hash: 'shipping123'
        }
      ];

      const { error: userError } = await supabase.from('app_users').insert(seedUsers);
      if (userError) {
        console.warn('Could not auto-seed app_users:', userError.message);
      } else {
        console.log(`Successfully seeded ${seedUsers.length} app_users to Supabase!`);
      }
    }
  } catch (err: any) {
    console.warn('Seeding check error:', err?.message || err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Run initial seed if Supabase is connected
  seedSupabaseIfEmpty();

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1. Health check & database diagnostics
  app.get('/api/health', async (req, res) => {
    const supabase = getSupabaseClient();
    let dbStatus = 'not_configured';
    let quotesCount = 0;
    let inquiriesCount = 0;
    let usersCount = 0;

    if (supabase) {
      try {
        const { count: qCount, error: qError } = await supabase
          .from('quote_requests')
          .select('*', { count: 'exact', head: true });

        if (qError) {
          dbStatus = `supabase_error: ${qError.message}`;
        } else {
          dbStatus = 'supabase_connected_healthy';
          quotesCount = qCount || 0;

          const { count: iCount } = await supabase
            .from('contact_inquiries')
            .select('*', { count: 'exact', head: true });
          inquiriesCount = iCount || 0;

          const { count: uCount } = await supabase
            .from('app_users')
            .select('*', { count: 'exact', head: true });
          usersCount = uCount || 0;
        }
      } catch (err: any) {
        dbStatus = `supabase_exception: ${err?.message || err}`;
      }
    }

    res.json({
      status: 'ok',
      database: dbStatus,
      supabaseConfigured: !!supabase,
      stats: {
        quoteRequests: quotesCount,
        contactInquiries: inquiriesCount,
        appUsers: usersCount
      },
      timestamp: new Date().toISOString(),
      suezStation: 'Mentors Marine Suez Dispatch 24/7'
    });
  });

  // 2. GET /api/quotes - Fetch all quote requests from Supabase
  app.get('/api/quotes', async (req, res) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(200).json({ source: 'local_fallback', data: SEED_QUOTES });
    }

    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Supabase get quotes error:', error.message);
        return res.status(500).json({ error: error.message });
      }

      const formatted = (data || []).map(dbRowToQuote);
      return res.json({ source: 'supabase', count: formatted.length, data: formatted });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 3. POST /api/quotes - Create new quote request in Supabase
  app.post('/api/quotes', async (req, res) => {
    const quoteData = req.body;
    const supabase = getSupabaseClient();

    if (!supabase) {
      return res.status(200).json({
        source: 'local_fallback',
        data: quoteData
      });
    }

    try {
      const dbRow = quoteToDbRow(quoteData);
      const { data, error } = await supabase
        .from('quote_requests')
        .upsert([dbRow])
        .select()
        .single();

      if (error) {
        console.error('Supabase quote insert error:', error.message);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ source: 'supabase', data: dbRowToQuote(data) });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 4. PATCH /api/quotes/:id - Update status, pricing, officer assignment
  app.patch('/api/quotes/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const supabase = getSupabaseClient();

    if (!supabase) {
      return res.status(200).json({ source: 'local_fallback', id, updates });
    }

    try {
      const dbUpdates: Record<string, any> = {
        updated_at: new Date().toISOString()
      };

      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.quotedAmountUSD !== undefined) dbUpdates.quoted_amount_usd = updates.quotedAmountUSD;
      if (updates.assignedOfficer !== undefined) dbUpdates.assigned_officer = updates.assignedOfficer;
      if (updates.dispatchLaunchBoat !== undefined) dbUpdates.dispatch_launch_boat = updates.dispatchLaunchBoat;
      if (updates.adminNotes !== undefined) dbUpdates.admin_notes = updates.adminNotes;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.lastUpdated !== undefined) dbUpdates.last_updated = updates.lastUpdated;

      const { data, error } = await supabase
        .from('quote_requests')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({ source: 'supabase', data: dbRowToQuote(data) });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 5. DELETE /api/quotes/:id - Delete quote
  app.delete('/api/quotes/:id', async (req, res) => {
    const { id } = req.params;
    const supabase = getSupabaseClient();

    if (!supabase) {
      return res.status(200).json({ source: 'local_fallback', id });
    }

    try {
      const { error } = await supabase.from('quote_requests').delete().eq('id', id);
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.json({ success: true, id });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 6. GET /api/inquiries - Fetch contact inquiries from Supabase
  app.get('/api/inquiries', async (req, res) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(200).json({ source: 'local_fallback', data: SEED_INQUIRIES });
    }

    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const formatted = (data || []).map(dbRowToInquiry);
      return res.json({ source: 'supabase', count: formatted.length, data: formatted });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 7. POST /api/inquiries - Submit contact inquiry to Supabase
  app.post('/api/inquiries', async (req, res) => {
    const inquiryData = req.body;
    const supabase = getSupabaseClient();

    if (!supabase) {
      return res.status(200).json({
        source: 'local_fallback',
        data: inquiryData
      });
    }

    try {
      const dbRow = inquiryToDbRow(inquiryData);
      const { data, error } = await supabase
        .from('contact_inquiries')
        .upsert([dbRow])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ source: 'supabase', data: dbRowToInquiry(data) });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 8. Auth API: Register & Login endpoints
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, company, phone, password } = req.body;
    const supabase = getSupabaseClient();

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required registration fields' });
    }

    const initials = name
      .split(' ')
      .map((p: string) => p[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const userRecord = {
      id: `USR-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      role: 'client',
      company: company || 'Shipping Line Operator',
      phone: phone || '',
      avatar_initials: initials,
      password_hash: password
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('app_users')
          .insert([userRecord])
          .select()
          .single();

        if (error) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(201).json({ success: true, user: userRecord });
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(201).json({ success: true, user: userRecord });
  });

  app.get('/api/auth/users', async (req, res) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.json([]);
    }

    try {
      const { data, error } = await supabase.from('app_users').select('id, name, email, role, company, phone, avatar_initials, created_at');
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.json(data || []);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE (DEV) & STATIC (PROD)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mentors Marine Suez Dispatch Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
