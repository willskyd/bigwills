import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Server-side route: accepts POST { name, email, message }
// Forwards the data to external API (process.env.API_BASE should contain the full URL to POST to)
// Sends an email notification if SMTP config and NOTIFY_EMAIL are set. Fallback: write to notifications/ folder.

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, email, company, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields (name, email, message)' }, { status: 400 })
    }

    // Forward to external API if provided
    let externalResult = null
    const apiBase = process.env.API_BASE // should be full URL like https://api.example.com/contacts
    if (apiBase) {
      try {
        const payload = {
          name,
          email,
          company: company || '',
          phone: phone || '',
          subject: subject || '',
          message,
          status: 'new',
          createdAt: new Date().toISOString(),
        }

        const headers = { 'Content-Type': 'application/json' }
        // support optional API key header; set API_KEY and optionally API_KEY_HEADER
        if (process.env.API_KEY) {
          const headerName = process.env.API_KEY_HEADER || 'Authorization'
          if (headerName.toLowerCase() === 'authorization') {
            headers['Authorization'] = `Bearer ${process.env.API_KEY}`
          } else {
            headers[process.env.API_KEY_HEADER] = process.env.API_KEY
          }
        }

        const forwardResp = await fetch(apiBase, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        })
        const text = await forwardResp.text()
        externalResult = { ok: forwardResp.ok, status: forwardResp.status, body: text }
      } catch (err) {
        externalResult = { ok: false, error: String(err) }
      }
    }

    // Email notifications are disabled in this build by default to avoid
    // bundling server-only libraries. If you want email notifications,
    // install `nodemailer` and run sending logic from a separate worker
    // or add your SMTP/email provider webhook. For now we keep `emailed`
    // false and rely on forwarding + file fallback.
    let emailed = false

    // Fallback: write to notifications folder so you can review submissions if email not configured
    try {
      const notificationsDir = path.join(process.cwd(), 'notifications')
      await fs.promises.mkdir(notificationsDir, { recursive: true })
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = path.join(notificationsDir, `contact-${timestamp}.json`)
      await fs.promises.writeFile(
        filename,
        JSON.stringify({ name, email, company, phone, subject, message, forwarded: externalResult, emailed, createdAt: new Date().toISOString() }, null, 2)
      )
    } catch (err) {
      console.error('Failed writing notification file', err)
    }

    return NextResponse.json({ ok: true, forwarded: externalResult, emailed })
  } catch (err) {
    console.error('API /api/contact error', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
