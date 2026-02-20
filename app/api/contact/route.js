import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DEFAULT_CONTACT_PATH = '/api/contact'
const DEFAULT_CONTACT_PATHS = ['/api/contacts', '/api/inquiries', '/api/contact']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_FORWARD_TIMEOUT_MS = 15000

function sanitizeText(value, maxLength = 2000) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

function sanitizePayload(body) {
  return {
    name: sanitizeText(body?.name, 120),
    email: sanitizeText(body?.email, 200).toLowerCase(),
    company: sanitizeText(body?.company, 120),
    phone: sanitizeText(body?.phone, 50),
    subject: sanitizeText(body?.subject, 200),
    message: sanitizeText(body?.message, 5000),
  }
}

function getNestedValue(source, pathExpression) {
  if (!source || typeof source !== 'object') return undefined
  const parts = String(pathExpression || '').split('.').filter(Boolean)
  let current = source
  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) return undefined
    current = current[part]
  }
  return current
}

async function readJsonCredential() {
  const raw = process.env.API_KEY_JSON
  if (raw && raw.trim()) {
    try {
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? parsed : null
    } catch {
      console.error('Invalid API_KEY_JSON format')
    }
  }

  const filePath = process.env.SERVICE_ACCOUNT_FILE
  if (filePath && filePath.trim()) {
    try {
      const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)
      const text = await fs.promises.readFile(fullPath, 'utf8')
      const parsed = JSON.parse(text)
      return parsed && typeof parsed === 'object' ? parsed : null
    } catch (err) {
      console.error('Failed to load SERVICE_ACCOUNT_FILE', err)
    }
  }

  return null
}

async function buildForwardAuth(forwardPayload) {
  const headers = { 'Content-Type': 'application/json' }
  let body = forwardPayload

  // Optional raw header passthrough for providers that need custom auth headers/cookies.
  if (process.env.CONTACT_FORWARD_HEADERS_JSON) {
    try {
      const parsedHeaders = JSON.parse(process.env.CONTACT_FORWARD_HEADERS_JSON)
      if (parsedHeaders && typeof parsedHeaders === 'object') {
        Object.assign(headers, parsedHeaders)
      }
    } catch {
      console.error('Invalid CONTACT_FORWARD_HEADERS_JSON format')
    }
  }

  // Legacy simple API key support.
  if (process.env.API_KEY) {
    const headerName = process.env.API_KEY_HEADER || 'Authorization'
    if (headerName.toLowerCase() === 'authorization') {
      headers.Authorization = `Bearer ${process.env.API_KEY}`
    } else {
      headers[headerName] = process.env.API_KEY
    }
    return { headers, body }
  }

  const hasJsonCredentialConfig = Boolean(
    (process.env.API_KEY_JSON && process.env.API_KEY_JSON.trim()) ||
      (process.env.SERVICE_ACCOUNT_FILE && process.env.SERVICE_ACCOUNT_FILE.trim())
  )
  const authMode = (process.env.API_AUTH_MODE || (hasJsonCredentialConfig ? 'api_key_header' : 'none')).toLowerCase()
  if (authMode === 'none') {
    return { headers, body }
  }

  const credential = await readJsonCredential()
  if (!credential) {
    throw new Error('API auth enabled but JSON credentials are missing. Set API_KEY_JSON or SERVICE_ACCOUNT_FILE.')
  }

  const preferredField = process.env.API_KEY_JSON_FIELD || 'apiKey'
  const tokenValue =
    getNestedValue(credential, preferredField) ||
    credential.apiKey ||
    credential.access_token ||
    credential.token ||
    credential.projectId

  if (!tokenValue || typeof tokenValue !== 'string') {
    throw new Error(
      `API auth enabled but token field was not found in JSON key. Set API_KEY_JSON_FIELD (current: ${preferredField}).`
    )
  }

  if (authMode === 'api_key_header') {
    const headerName = process.env.API_KEY_HEADER || 'Authorization'
    if (headerName.toLowerCase() === 'authorization') {
      headers.Authorization = `Bearer ${tokenValue}`
    } else {
      headers[headerName] = tokenValue
    }
  } else if (authMode === 'bearer_token_field') {
    headers.Authorization = `Bearer ${tokenValue}`
  } else if (authMode === 'json_body') {
    const authField = process.env.API_AUTH_BODY_FIELD || 'apiKey'
    body = { ...forwardPayload, [authField]: tokenValue }
  }

  return { headers, body }
}

function unique(values) {
  return Array.from(new Set(values))
}

function parseList(value) {
  if (!value) return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizePath(pathValue) {
  if (!pathValue) return ''
  return pathValue.startsWith('/') ? pathValue : `/${pathValue}`
}

function isNotificationUrl(url) {
  try {
    const parsed = new URL(url)
    return parsed.pathname.includes('/api/notifications')
  } catch {
    return String(url || '').includes('/api/notifications')
  }
}

function buildForwardPayloadVariants(forwardPayload, forwardUrl) {
  if (!isNotificationUrl(forwardUrl)) {
    return [{ mode: 'contact', body: forwardPayload }]
  }

  const summary = forwardPayload.subject
    ? `${forwardPayload.subject}: ${forwardPayload.message}`
    : forwardPayload.message

  return [
    {
      mode: 'notification',
      body: {
        type: 'contact_request',
        title: `New contact request from ${forwardPayload.name}`,
        message: summary,
        isRead: false,
        priority: 'high',
        contact: forwardPayload,
        payload: forwardPayload,
        data: forwardPayload,
      },
    },
    { mode: 'contact', body: forwardPayload },
  ]
}

function resolveForwardUrls() {
  const explicitUrls = unique(
    [
      ...parseList(process.env.CONTACT_API_URLS),
      process.env.CONTACT_API_URL,
      process.env.CONTACT_WEBHOOK_URL,
      process.env.BACKEND_CONTACT_URL,
    ]
      .map((item) => (item || '').trim())
      .filter(Boolean)
  )

  if (explicitUrls.length > 0) {
    return explicitUrls
  }

  const baseOrFullUrl =
    process.env.BASE_URL ||
    process.env.API_BASE ||
    process.env.BACKEND_URL ||
    process.env.BACKEND_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL

  if (!baseOrFullUrl) {
    return []
  }

  const normalized = baseOrFullUrl.trim()
  const configuredPaths = parseList(process.env.CONTACT_API_PATHS).map(normalizePath)
  const singlePath = process.env.CONTACT_API_PATH ? [normalizePath(process.env.CONTACT_API_PATH)] : []
  const candidatePaths = unique([...configuredPaths, ...singlePath, ...DEFAULT_CONTACT_PATHS]).filter(Boolean)

  try {
    const parsed = new URL(normalized)
    if (parsed.pathname && parsed.pathname !== '/' && configuredPaths.length === 0 && singlePath.length === 0) {
      return [parsed.toString()]
    }

    return candidatePaths.map((p) => new URL(p, parsed).toString())
  } catch {
    return [normalized]
  }
}

export async function POST(req) {
  try {
    const rawBody = await req.json()
    const { name, email, company, phone, subject, message } = sanitizePayload(rawBody)

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields (name, email, message)' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Keep forwarding payload aligned with the backend contract provided.
    const forwardPayload = {
      name,
      email,
      company: company || '',
      phone: phone || '',
      subject: subject || '',
      message
    }

    const timestamp = new Date().toISOString()
    const localRecord = {
      _id: `local-${Date.now()}`,
      ...forwardPayload,
      status: 'new',
      createdAt: timestamp,
      updatedAt: timestamp,
      __v: 0,
    }

    // Forward to external backend API
    let externalResult = null
    const forwardUrls = resolveForwardUrls()
    if (forwardUrls.length > 0) {
      try {
        const attempts = []
        let successResult = null
        const forwardTimeout = Number(process.env.CONTACT_FORWARD_TIMEOUT_MS || DEFAULT_FORWARD_TIMEOUT_MS)

        for (const forwardUrl of forwardUrls) {
          const payloadVariants = buildForwardPayloadVariants(forwardPayload, forwardUrl)
          for (const variant of payloadVariants) {
            try {
              const { headers, body } = await buildForwardAuth(variant.body)
              const forwardResp = await fetch(forwardUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
                signal:
                  Number.isFinite(forwardTimeout) && forwardTimeout > 0 && typeof AbortSignal?.timeout === 'function'
                    ? AbortSignal.timeout(forwardTimeout)
                    : undefined,
              })
              const text = await forwardResp.text()
              let parsedBody = text
              try {
                parsedBody = text ? JSON.parse(text) : null
              } catch {
                // Backend may return plain text; keep original text when JSON parse fails.
              }

              const attempt = {
                ok: forwardResp.ok,
                status: forwardResp.status,
                body: parsedBody,
                url: forwardUrl,
                mode: variant.mode,
              }
              attempts.push(attempt)

              if (forwardResp.ok) {
                successResult = attempt
                break
              }
            } catch (err) {
              attempts.push({ ok: false, error: String(err), url: forwardUrl, mode: variant.mode })
            }
          }

          if (successResult) {
            break
          }
        }

        if (successResult) {
          externalResult = { ...successResult, attempts }
        } else {
          const hasAuthFailure = attempts.some((attempt) => attempt?.status === 401 || attempt?.status === 403)
          externalResult = {
            ok: false,
            error: hasAuthFailure
              ? 'Forwarding failed: backend rejected authentication (401/403). Set API_KEY or API_KEY_JSON in your server env.'
              : 'Forwarding failed for all configured endpoints.',
            attempts,
          }
        }
      } catch (err) {
        externalResult = { ok: false, error: String(err), urls: forwardUrls }
      }
    } else {
      externalResult = {
        ok: false,
        error:
          'No backend URL configured. Set CONTACT_API_URL/CONTACT_API_URLS or BASE_URL/API_BASE/BACKEND_URL/BACKEND_BASE_URL.',
      }
    }

    // Email notifications are disabled in this build by default to avoid
    // bundling server-only libraries. If you want email notifications,
    // install `nodemailer` and run sending logic from a separate worker
    // or add your SMTP/email provider webhook. For now we keep `emailed`
    // false and rely on forwarding + file fallback.
    let emailed = false

    // Fallback: write to notifications folder so you can review submissions if email not configured
    let savedLocally = false
    try {
      const notificationsDir = path.join(process.cwd(), 'notifications')
      await fs.promises.mkdir(notificationsDir, { recursive: true })
      const safeTimestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = path.join(notificationsDir, `contact-${safeTimestamp}.json`)
      await fs.promises.writeFile(
        filename,
        JSON.stringify({ ...localRecord, forwarded: externalResult, emailed }, null, 2)
      )
      savedLocally = true
    } catch (err) {
      console.error('Failed writing notification file', err)
    }

    if (!externalResult?.ok && !emailed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            externalResult?.error ||
            'Message saved locally but backend notification failed. Check your backend URL and API settings.',
          forwarded: externalResult,
          savedLocally,
          emailed,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ok: true,
      forwarded: externalResult,
      emailed,
      data: [localRecord],
      total: 1,
      count: 1,
    })
  } catch (err) {
    console.error('API /api/contact error', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
