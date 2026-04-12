// ============================================================
// Supabase REST-klient — letvægts, ingen npm-afhængighed
// Bruger Supabase PostgREST API direkte via fetch
// ============================================================

export function createSupabaseClient(url, anonKey) {
  const baseUrl = `${url}/rest/v1`
  const headers = {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }

  return {
    from(table) {
      return new QueryBuilder(baseUrl, headers, table)
    }
  }
}

class QueryBuilder {
  constructor(baseUrl, headers, table) {
    this._baseUrl = baseUrl
    this._headers = headers
    this._table = table
    this._filters = []
    this._order = null
    this._limit = null
    this._select = '*'
    this._single = false
    this._count = null
  }

  select(columns, opts) {
    this._select = columns || '*'
    if (opts?.count) this._count = opts.count
    return this
  }

  eq(col, val) { this._filters.push(`${col}=eq.${encodeURIComponent(val)}`); return this }
  neq(col, val) { this._filters.push(`${col}=neq.${encodeURIComponent(val)}`); return this }
  gt(col, val) { this._filters.push(`${col}=gt.${encodeURIComponent(val)}`); return this }
  gte(col, val) { this._filters.push(`${col}=gte.${encodeURIComponent(val)}`); return this }
  lt(col, val) { this._filters.push(`${col}=lt.${encodeURIComponent(val)}`); return this }
  lte(col, val) { this._filters.push(`${col}=lte.${encodeURIComponent(val)}`); return this }

  order(col, opts) {
    const dir = opts?.ascending === false ? 'desc' : 'asc'
    this._order = `${col}.${dir}`
    return this
  }

  limit(n) { this._limit = n; return this }
  single() { this._single = true; this._limit = 1; return this }

  async _execute(method, body) {
    let url = `${this._baseUrl}/${this._table}?select=${encodeURIComponent(this._select)}`
    for (const f of this._filters) url += `&${f}`
    if (this._order) url += `&order=${this._order}`
    if (this._limit) url += `&limit=${this._limit}`

    const h = { ...this._headers }
    if (this._single) h['Accept'] = 'application/vnd.pgrst.object+json'
    if (this._count) h['Prefer'] = `count=${this._count}`

    const opts = { method, headers: h }
    if (body) opts.body = JSON.stringify(body)

    try {
      const res = await fetch(url, opts)
      if (!res.ok) {
        const err = await res.text()
        return { data: null, error: { message: err, status: res.status }, count: null }
      }
      const data = await res.json()
      const count = res.headers.get('content-range')?.split('/')[1] || null
      return { data, error: null, count: count ? parseInt(count) : null }
    } catch (e) {
      return { data: null, error: { message: e.message }, count: null }
    }
  }

  then(resolve) { return this._execute('GET').then(resolve) }

  async insert(rows) {
    const url = `${this._baseUrl}/${this._table}`
    const body = Array.isArray(rows) ? rows : [rows]
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { ...this._headers, 'Prefer': 'return=representation' },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const err = await res.text()
        return { data: null, error: { message: err, status: res.status } }
      }
      return { data: await res.json(), error: null }
    } catch (e) {
      return { data: null, error: { message: e.message } }
    }
  }

  async upsert(rows, opts) {
    const url = `${this._baseUrl}/${this._table}`
    const body = Array.isArray(rows) ? rows : [rows]
    const prefer = opts?.onConflict
      ? `return=representation,resolution=merge-duplicates`
      : 'return=representation'
    const h = { ...this._headers, 'Prefer': prefer }
    if (opts?.onConflict) {
      // Use on_conflict query param for PostgREST
    }
    try {
      let u = url
      if (opts?.onConflict) u += `?on_conflict=${opts.onConflict}`
      const res = await fetch(u, {
        method: 'POST',
        headers: h,
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const err = await res.text()
        return { data: null, error: { message: err, status: res.status } }
      }
      return { data: await res.json(), error: null }
    } catch (e) {
      return { data: null, error: { message: e.message } }
    }
  }

  async update(values) {
    let url = `${this._baseUrl}/${this._table}?`
    url += this._filters.join('&')
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { ...this._headers, 'Prefer': 'return=representation' },
        body: JSON.stringify(values)
      })
      if (!res.ok) {
        const err = await res.text()
        return { data: null, error: { message: err, status: res.status } }
      }
      return { data: await res.json(), error: null }
    } catch (e) {
      return { data: null, error: { message: e.message } }
    }
  }
}
