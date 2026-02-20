// contact.js
// Plain JavaScript contact form handler.
// Security note: never put service-account/API JSON keys in browser code.
// The browser should post to your server endpoint, and the server applies auth.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value, maxLength = 2000) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function setStatus(message, type = "info") {
  const statusEl = document.getElementById("contactStatus");
  if (!statusEl) {
    if (type === "error") {
      window.alert(message);
    }
    return;
  }

  statusEl.textContent = message;
  statusEl.dataset.type = type;
}

function collectPayload() {
  return {
    name: sanitize(document.getElementById("name")?.value, 120),
    email: sanitize(document.getElementById("email")?.value, 200).toLowerCase(),
    company: sanitize(document.getElementById("company")?.value, 120),
    phone: sanitize(document.getElementById("phone")?.value, 50),
    subject: sanitize(document.getElementById("subject")?.value, 200),
    message: sanitize(document.getElementById("message")?.value, 5000),
  };
}

function validatePayload(payload) {
  if (!payload.name || !payload.email || !payload.message) {
    return "Name, email, and message are required.";
  }
  if (!EMAIL_RE.test(payload.email)) {
    return "Please enter a valid email address.";
  }
  return null;
}

function clearForm(form) {
  form.reset();
}

export function initContactForm(options = {}) {
  const form = document.getElementById(options.formId || "contactForm");
  if (!form) {
    console.warn("contact.js: form not found");
    return;
  }

  const endpoint =
    options.endpoint ||
    window.CONTACT_CONFIG?.endpoint ||
    "/api/contact";

  const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");

    const payload = collectPayload();
    const validationError = validatePayload(payload);
    if (validationError) {
      setStatus(validationError, "error");
      return;
    }

    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const reason = data?.error || "Failed to send - try again";
        throw new Error(reason);
      }

      setStatus("Submission successful", "success");
      clearForm(form);
      console.log("Contact submission succeeded");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send - try again";
      console.error("Contact submission failed", error);
      setStatus(message, "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    initContactForm();
  });
}
