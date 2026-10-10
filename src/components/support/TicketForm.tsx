"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { contact, mailtoLink, makeTicketId, whatsappLink } from "@/lib/contact";
import { MailIcon, WhatsAppIcon } from "../icons";

type Props = { t: Dictionary["support"] };
type Urgency = "low" | "medium" | "high";

export function TicketForm({ t }: Props) {
  const uid = useId();
  const [form, setForm] = useState({ name: "", business: "", contact: "", type: t.types[0], description: "" });
  const [urgency, setUrgency] = useState<Urgency>("medium");
  const [error, setError] = useState(false);
  const [ticket, setTicket] = useState<{ id: string; channel: "whatsapp" | "email" } | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const missing = {
    name: !form.name.trim(),
    contact: !form.contact.trim(),
    description: !form.description.trim(),
  };

  const send = (channel: "whatsapp" | "email") => {
    if (missing.name || missing.contact || missing.description) {
      setError(true);
      const first = missing.name ? "name" : missing.contact ? "contact" : "description";
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setError(false);
    const id = makeTicketId();
    const f = t.ticketFields;
    const body = [
      t.ticketHeader.replace("{id}", id),
      "",
      `${f.name}: ${form.name.trim()}`,
      form.business.trim() ? `${f.business}: ${form.business.trim()}` : null,
      `${f.contact}: ${form.contact.trim()}`,
      `${f.type}: ${form.type}`,
      `${f.urgency}: ${t.urgencies[urgency]}`,
      "",
      `${f.description}:`,
      form.description.trim(),
    ]
      .filter((line): line is string => line !== null)
      .join("\n");
    const subject = `[${id}] ${form.type} · ${t.urgencies[urgency]}`;
    if (channel === "whatsapp") window.open(whatsappLink(body), "_blank", "noopener");
    else window.location.href = mailtoLink(subject, body);
    setTicket({ id, channel });
  };

  const invalid = (key: keyof typeof missing) => (error && missing[key] ? true : undefined);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        send("whatsapp");
      }}
      aria-labelledby={`${uid}-title`}
      className="glass grid gap-5 p-5 sm:p-8"
      style={{ "--g-radius": "36px", "--g-tint": "0.075" } as React.CSSProperties}
    >
      <h2 id={`${uid}-title`} className="t-h3">
        {t.formTitle}
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${uid}-name`} className="field-label">
            {t.name}
          </label>
          <input id={`${uid}-name`} className="field-control" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={invalid("name")} />
        </div>
        <div className="field">
          <label htmlFor={`${uid}-business`} className="field-label">
            {t.business}
          </label>
          <input id={`${uid}-business`} className="field-control" autoComplete="organization" value={form.business} onChange={set("business")} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${uid}-contact`} className="field-label">
            {t.contact}
          </label>
          <input id={`${uid}-contact`} className="field-control" autoComplete="tel" value={form.contact} onChange={set("contact")} aria-invalid={invalid("contact")} />
        </div>
        <div className="field">
          <label htmlFor={`${uid}-type`} className="field-label">
            {t.type}
          </label>
          <select id={`${uid}-type`} className="field-control" value={form.type} onChange={set("type")}>
            {t.types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="field">
        <legend className="field-label mb-2">{t.urgency}</legend>
        <div className="grid grid-cols-3 gap-1 rounded-[18px] bg-ink/40 p-1 shadow-[inset_0_1px_2px_rgb(0_0_0/0.35),inset_0_0_0_1px_rgb(255_255_255/0.08)]">
          {(["low", "medium", "high"] as Urgency[]).map((level) => (
            <label key={level} className="relative grid min-h-11 cursor-pointer place-items-center rounded-[14px] px-2 text-center text-[0.9375rem] leading-tight has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber">
              <input type="radio" name={`${uid}-urgency`} value={level} checked={urgency === level} onChange={() => setUrgency(level)} className="sr-only" />
              {urgency === level && (
                <motion.span
                  layoutId={`${uid}-urgency-lens`}
                  className="glass absolute inset-0"
                  style={
                    {
                      "--g-radius": "14px",
                      "--g-tint": level === "high" ? "0.04" : "0.14",
                      "--g-blur": "2px",
                      backgroundColor: level === "high" ? "rgb(233 168 43 / 0.85)" : undefined,
                    } as React.CSSProperties
                  }
                  transition={{ type: "spring", stiffness: 480, damping: 34 }}
                />
              )}
              <span className={`relative z-10 py-2 ${urgency === level ? (level === "high" ? "font-medium text-ink" : "text-ivory") : "text-mist"}`}>
                {t.urgencies[level]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor={`${uid}-description`} className="field-label">
          {t.description}
        </label>
        <textarea
          id={`${uid}-description`}
          className="field-control"
          rows={5}
          value={form.description}
          onChange={set("description")}
          aria-invalid={invalid("description")}
          aria-describedby={`${uid}-hint`}
        />
        <p id={`${uid}-hint`} className="t-small text-mist">
          {t.descriptionHint}
        </p>
      </div>

      {error && (
        <p role="alert" className="t-small text-amber-soft">
          {t.error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-1">
        <button type="submit" className="btn btn-amber">
          <WhatsAppIcon className="h-5 w-5" />
          {t.sendWhatsapp}
        </button>
        <button type="button" onClick={() => send("email")} className="glass glass-pill btn btn-glass">
          <MailIcon className="h-5 w-5" />
          {t.sendEmail}
        </button>
      </div>

      <div aria-live="polite">
        {ticket && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="rounded-[20px] bg-ok/10 p-4 shadow-[inset_0_0_0_1px_rgb(111_220_170/0.35)]"
          >
            <p className="font-medium text-ok">{t.ready.replace("{id}", ticket.id)}</p>
            <p className="t-small mt-1 text-ivory/85">
              {t.readyBody
                .replace("{channel}", ticket.channel === "whatsapp" ? t.channelWhatsapp : t.channelEmail)
                .replace("{email}", contact.supportEmail)}
            </p>
          </motion.div>
        )}
      </div>
    </form>
  );
}
