import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Server-side route: accepts POST { name, email, message }
// Forwards the data to external API (process.env.API_BASE should contain the full URL to POST to)
// Sends an email notification if SMTP config and NOTIFY_EMAIL are set. Fallback: write to notifications/ folder.

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Forward to external API if provided
    let externalResult = null
    const apiBase = process.env.API_BASE // should be full URL like https://api.example.com/contacts
    if (apiBase) {
      try {
        const forwardResp = await fetch(apiBase, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        })
        externalResult = { ok: forwardResp.ok, status: forwardResp.status }
      } catch (err) {
        externalResult = { ok: false, error: String(err) }
      }
    }

    // Try to send email notification if SMTP env vars and NOTIFY_EMAIL are set
    let emailed = false
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.NOTIFY_EMAIL) {
      try {
        // require nodemailer dynamically without letting bundlers try to resolve it at build time
        let nodemailer = null
        try {
          // eval prevents webpack from statically analyzing the require call
          nodemailer = eval("require")('nodemailer')
        } catch (e) {
          // nodemailer not installed — skip emailing
          nodemailer = null
        }
        if (nodemailer) {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          })

          const mailBody = `New contact form submission\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`

          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: process.env.NOTIFY_EMAIL,
            subject: `New contact from ${name}`,
            text: mailBody,
          })
          emailed = true
        } else {
          console.warn('nodemailer not installed; skipping email send')
        }
      } catch (err) {
        // continue — fallbacks will handle notification persistence
        console.error('Error sending notification email:', err)
      }
    }

    // Fallback: write to notifications folder so you can review submissions if email not configured
    try {
      const notificationsDir = path.join(process.cwd(), 'notifications')
      await fs.promises.mkdir(notificationsDir, { recursive: true })
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = path.join(notificationsDir, `contact-${timestamp}.json`)
      await fs.promises.writeFile(filename, JSON.stringify({ name, email, message, forwarded: externalResult, emailed }, null, 2))
    } catch (err) {
      console.error('Failed writing notification file', err)
    }

    return NextResponse.json({ ok: true, forwarded: externalResult, emailed })
  } catch (err) {
    console.error('API /api/contact error', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
