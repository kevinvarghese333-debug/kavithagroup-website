"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type Enquiry = { name: string; email: string; phone: string; subject: string; message: string };
const emptyForm: Enquiry = { name: "", email: "", phone: "", subject: "General enquiry", message: "" };

export function ContactForm() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(values: Enquiry) {
    setStatus("sending");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      setStatus("error");
      throw new Error("The enquiry could not be sent.");
    }
    setForm(emptyForm);
    setStatus("sent");
    return { status: "received" };
  }

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: "submit_contact_enquiry",
        title: "Submit contact enquiry",
        description: "Submit a Kavitha Group contact enquiry and update the visible form status.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 2 },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            subject: { type: "string", minLength: 2 },
            message: { type: "string", minLength: 10 },
          },
          required: ["name", "email", "subject", "message"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        async execute(input: unknown) {
          const values = input as Enquiry;
          if (!values.name || !values.email || !values.subject || !values.message) {
            throw new Error("Name, email, subject and message are required.");
          }
          setForm({ ...emptyForm, ...values });
          return submit({ ...emptyForm, ...values });
        },
      }, { signal: lifecycle.signal })).catch(() => undefined);
    } catch {
      // WebMCP is progressive enhancement; the visible form remains fully functional.
    }
    return () => lifecycle.abort();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try { await submit(form); } catch { /* status is shown below */ }
  }

  if (status === "sent") {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={34} />
        <h2>Thank you.</h2>
        <p>Your enquiry has been received. The Kavitha Group team can follow up using the details you provided.</p>
        <button type="button" onClick={() => setStatus("idle")}>Send another enquiry</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="field-pair">
        <label>Full name<input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>
        <label>Email address<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@example.com" /></label>
      </div>
      <div className="field-pair">
        <label>Phone number<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+91" /></label>
        <label>Subject<select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })}><option>General enquiry</option><option>Financial services</option><option>Investor relations</option><option>Career</option><option>Media enquiry</option></select></label>
      </div>
      <label>Message<textarea required minLength={10} rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Tell us how we can help" /></label>
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send enquiry"}<ArrowRight size={17} /></button>
      {status === "error" && <p className="form-error" role="alert">We could not send your enquiry. Please try again or contact the head office directly.</p>}
    </form>
  );
}
