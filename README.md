# Contact Form API Submission

This setup sends form data from the browser to your backend through `POST /api/contact`.

## Files added

- `public/js/contact.js`: Plain JavaScript form submit handler.
- `public/contact-sample.html`: Example HTML form wired to `contact.js`.
- `.env.example`: Server-side forwarding/auth environment variables.
- `app/api/contact/route.js`: Sanitizes input, validates required fields, and forwards to backend with optional JSON-key auth.

## Frontend behavior (`public/js/contact.js`)

On submit:

1. Validates required fields: `name`, `email`, `message`.
2. Validates email format.
3. Sanitizes text inputs.
4. Sends payload as JSON:

```json
{
  "name": "User Name",
  "email": "user@email.com",
  "company": "Company",
  "phone": "1234567",
  "subject": "Subject",
  "message": "Message text"
}
```

5. Shows success/failure status and clears form on success.

## Security model

- Do not expose JSON API keys in frontend JavaScript.
- Put `API_KEY_JSON` (stringified JSON) or `SERVICE_ACCOUNT_FILE` on the server only.
- Browser calls `/api/contact`; server handles auth to upstream backend.

## Environment setup

Create `.env.local` from `.env.example`, then set:

```env
BASE_URL=http://127.0.0.1:8000
CONTACT_API_PATHS=/api/contacts,/api/inquiries,/api/contact
# API_AUTH_MODE=api_key_header
API_KEY_JSON_FIELD=apiKey
API_KEY_JSON={"apiKey":"your-token-or-field-from-json"}
```

If using a file instead:

```env
SERVICE_ACCOUNT_FILE=./service-account.json
```

## Integrate into a page

Use the sample form IDs (`name`, `email`, `company`, `phone`, `subject`, `message`) and load script:

```html
<form id="contactForm">...</form>
<div id="contactStatus"></div>
<script>
  window.CONTACT_CONFIG = { endpoint: "/api/contact" };
</script>
<script type="module" src="/js/contact.js"></script>
```

## Run

```bash
npm run dev
```

Then open `/contact-sample.html` (or your page using the same form IDs) and submit.

If one endpoint fails, the route automatically tries the next configured path in `CONTACT_API_PATHS`.
