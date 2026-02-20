"use client"
import axios from 'axios'
import { useState } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    const payload = { name, email, company, phone, subject, message }
    try {
// https://v0-latest-torqtech-dashboard.vercel.app/api/contact-requests
      const response = await axios.post('https://v0-latest-torqtech-dashboard.vercel.app/api/contact-requests', payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      const result = response?.data || {}
      const target = result?.forwarded?.url ? ` Forwarded to: ${result.forwarded.url}.` : ''

      setStatus({ type: 'success', text: `Message sent - th..ank you!${target}` })
      setName('')
      setEmail('')
      setCompany('')
      setPhone('')
      setSubject('')
      setMessage('')
    } catch (err) {
      const data = err?.response?.data || {}
      const hasAuthFailure = (data?.forwarded?.attempts || []).some(
        (attempt) => attempt?.status === 401 || attempt?.status === 403
      )
      const reason = data?.forwarded?.error ? ` (${data.forwarded.error})` : ''
      const authHint = hasAuthFailure ? ' Backend auth failed (401/403). Check API_KEY/API_KEY_JSON in server env.' : ''
      setStatus({
        type: 'error',
        text: `${data?.error || err?.message || 'Failed to send message'}${reason}${authHint}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="contact_form" onSubmit={handleSubmit} autoComplete="off">
      <div className="success" data-success="Your message has been received, we will contact you soon."></div>
      <div className="empty_notice"><span>Please Fill Required Fields</span></div>
      <div className="items">
        <div className="item">
          <input id="name" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="item">
          <input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="item">
          <input id="company" type="text" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div className="item">
          <input id="phone" type="text" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="item">
          <input id="subject" type="text" placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="item">
          <textarea id="message" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
        </div>
        <div className="item">
          <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
        </div>
      </div>
      {status && (
        <div className={`contact_status ${status.type}`} style={{ marginTop: 12 }}>{status.text}</div>
      )}
    </form>
  )
}
