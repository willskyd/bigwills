"use client"
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
    try {
      const payload = { name, email, company, phone, subject, message }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', text: 'Message sent — thank you!' })
        setName('')
        setEmail('')
        setCompany('')
        setPhone('')
        setSubject('')
        setMessage('')
      } else {
        setStatus({ type: 'error', text: data?.error || 'Failed to send message' })
      }
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Network error' })
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
