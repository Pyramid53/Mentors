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

// Clean initial state for production (no hardcoded test data)
const SEED_QUOTES: any[] = [];
const SEED_INQUIRIES: any[] = [];

async function seedSupabaseIfEmpty() {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // Purge any legacy mock records from database if present
    await supabase
      .from('quote_requests')
      .delete()
      .in('id', ['MMP-RFQ-98421', 'MMP-RFQ-98405', 'MMP-RFQ-98389', 'MMP-RFQ-98388', 'MMP-RFQ-98310']);

    await supabase
      .from('contact_inquiries')
      .delete()
      .in('id', ['MM-INQ-1042', 'MM-INQ-1039', 'INQ-4821', 'INQ-4815', 'INQ-4798']);

    // Check and seed app_users (ensuring admin@mentors.com exists with owner credentials)
    const seedAdminUser = {
      id: 'USR-ADM-01',
      name: 'Capt. Tarek Mansour (Owner)',
      email: 'admin@mentors.com',
      company: 'Mentors Marine Services SAE',
      role: 'admin',
      phone: '+20 100 489 2210',
      avatar_initials: 'TM',
      password_hash: 'tarekmentorsowner'
    };

    // Always ensure admin@mentors.com exists with admin role in database
    const { error: adminUpsertError } = await supabase
      .from('app_users')
      .upsert([seedAdminUser], { onConflict: 'id' });

    if (adminUpsertError) {
      console.warn('Could not sync app_users to Supabase:', adminUpsertError.message);
    } else {
      console.log('Verified admin account (admin@mentors.com) in Supabase app_users table!');
    }
  } catch (err: any) {
    console.warn('Seeding check error:', err?.message || err);
  }
}

// Server-side user storage fallback (when Supabase is in local mode / not yet provisioned)
const SERVER_USERS: any[] = [
  {
    id: 'USR-ADM-01',
    name: 'Capt. Tarek Mansour (Owner)',
    email: 'admin@mentors.com',
    company: 'Mentors Marine Services SAE',
    role: 'admin',
    phone: '+20 100 489 2210',
    avatar_initials: 'TM',
    password_hash: 'tarekmentorsowner',
    created_at: '2025-01-10T08:00:00Z'
  }
];

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

  // DELETE /api/inquiries/:id - Remove contact inquiry from Supabase
  app.delete('/api/inquiries/:id', async (req, res) => {
    const { id } = req.params;
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.json({ success: true, id });
    }
    try {
      const { error } = await supabase.from('contact_inquiries').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true, id });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 8. Auth API: Register & Login endpoints
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data: dbUser, error: dbError } = await supabase
          .from('app_users')
          .select('*')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (dbError) {
          console.error('Supabase auth error:', dbError.message);
          return res.status(500).json({ success: false, error: `Database error: ${dbError.message}` });
        }

        if (!dbUser) {
          return res.status(401).json({ success: false, error: 'No account found with this email address.' });
        }

        if (dbUser.password_hash !== cleanPassword) {
          return res.status(401).json({ success: false, error: 'Incorrect password.' });
        }

        return res.json({
          success: true,
          user: {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role, // strictly from database ('admin' or 'client')
            company: dbUser.company,
            phone: dbUser.phone,
            avatarInitials: dbUser.avatar_initials || 'MM',
            createdAt: dbUser.created_at
          }
        });
      } catch (err: any) {
        console.error('Supabase login exception:', err);
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    // Database server-side fallback (before Supabase keys are configured)
    const matchedUser = SERVER_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matchedUser) {
      return res.status(401).json({ success: false, error: 'No account found with this email address.' });
    }

    if (matchedUser.password_hash !== cleanPassword) {
      return res.status(401).json({ success: false, error: 'Incorrect password.' });
    }

    return res.json({
      success: true,
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role, // 'admin' or 'client'
        company: matchedUser.company,
        phone: matchedUser.phone,
        avatarInitials: matchedUser.avatar_initials || 'MM',
        createdAt: matchedUser.created_at
      }
    });
  });

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
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'client', // All self-registrations are strictly 'client' role
      company: company || 'Shipping Line Operator',
      phone: phone || '',
      avatar_initials: initials,
      password_hash: String(password).trim()
    };

    // Save in fallback list
    SERVER_USERS.push({
      ...userRecord,
      created_at: new Date().toISOString()
    });

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
