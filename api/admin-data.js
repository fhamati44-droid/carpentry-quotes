export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !adminEmail) {
    return res.status(503).json({ error: 'ADMIN_NOT_CONFIGURED' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' });

  try {
    const userResp = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` }
    });
    if (!userResp.ok) return res.status(401).json({ error: 'INVALID_SESSION' });
    const me = await userResp.json();
    if ((me.email || '').toLowerCase() !== adminEmail) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }

    const commonHeaders = {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json'
    };

    const [usersResp, quotesResp] = await Promise.all([
      fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=1000`, { headers: commonHeaders }),
      fetch(`${supabaseUrl}/rest/v1/user_app_data?id=eq.quotes&select=user_id,value,updated_at`, { headers: commonHeaders })
    ]);

    if (!usersResp.ok) {
      const text = await usersResp.text();
      throw new Error(`USERS_FETCH_FAILED:${text}`);
    }
    if (!quotesResp.ok) {
      const text = await quotesResp.text();
      throw new Error(`QUOTES_FETCH_FAILED:${text}`);
    }

    const usersJson = await usersResp.json();
    const quoteRows = await quotesResp.json();
    const quoteMap = new Map();

    for (const row of quoteRows || []) {
      let parsed = [];
      try { parsed = JSON.parse(row.value || '[]'); } catch (_) {}
      quoteMap.set(row.user_id, {
        quotes: Array.isArray(parsed) ? parsed : [],
        updated_at: row.updated_at || null
      });
    }

    const users = (usersJson.users || []).map(u => {
      const q = quoteMap.get(u.id) || { quotes: [], updated_at: null };
      const quotes = q.quotes.map(item => ({
        id: item.id || null,
        quoteNumber: item.quoteNumber || null,
        clientName: item.clientName || '',
        clientPhone: item.clientPhone || '',
        projectName: item.projectName || '',
        total: Number(item.total || 0),
        status: item.status || 'quote',
        date: item.date || null,
        updatedAt: item.updatedAt || null,
        validUntil: item.validUntil || null,
        materialName: item.materialName || '',
        notes: item.notes || ''
      }));
      return {
        id: u.id,
        email: u.email || '',
        displayName: u.user_metadata?.display_name || '',
        createdAt: u.created_at || null,
        lastSignInAt: u.last_sign_in_at || null,
        emailConfirmedAt: u.email_confirmed_at || null,
        quotesUpdatedAt: q.updated_at,
        quotes
      };
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error('admin-data error', error);
    return res.status(500).json({ error: 'ADMIN_DATA_ERROR' });
  }
}
