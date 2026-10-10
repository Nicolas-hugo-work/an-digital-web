"use client";

import { useEffect, useId, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { contact, mailtoLink, whatsappLink } from "@/lib/contact";
import { QUOTE_EVENT, serviceKeys, type ServiceKey } from "@/lib/quote-bus";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "../icons";

type Props = { t: Dictionary["quote"]; services: Dictionary["services"]["items"]; id: string };

export function QuoteForm({ t, services, id }: Props) {
  const uid = useId();
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [service, setService] = useState<ServiceKey | "other" | "">("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [sent, setSent] = useState<"whatsapp" | "email" | null>(null);

  useEffect(() => {
    const onRequest = (event: Event) => {
      const key = (event as CustomEvent<ServiceKey>).detail;
      if (serviceKeys.includes(key)) setService(key);
    };
    window.addEventListener(QUOTE_EVENT, onRequest);
    return () => window.removeEventListener(QUOTE_EVENT, onRequest);
  }, []);

  const build = () => {
    const serviceName = service === "other" || !service ? t.other : services[service].name;
    const body = t.template
      .replace("{name}", name.trim())
      .replace("{business}", business.trim() ? t.templateBusiness.replace("{business}", business.trim()) : "")
      .replace("{service}", serviceName)
      .replace("{message}", message.trim() ? `\n\n${message.trim()}` : "");
    const subject = t.subject.replace("{business}", business.trim() || name.trim());
    return { body, subject };
  };

  const send = (channel: "whatsapp" | "email") => {
    if (!name.trim()) {
      setError(true);
      document.getElementById(`${uid}-name`)?.focus();
      return;
    }
    setError(false);
    const { body, subject } = build();
    if (channel === "whatsapp") window.open(whatsappLink(body), "_blank", "noopener");
    else window.location.href = mailtoLink(subject, body);
    setSent(channel);
  };

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section">
      <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h2 id={`${id}-title`} className="t-h2">
            {t.title}
          </h2>
          <p className="t-lede mt-5 max-w-[30rem]">{t.body}</p>

          <div className="mt-10">
            <p className="t-small text-mist">{t.direct}</p>
            <ul className="mt-4 grid gap-3">
              <li>
                <a
                  href={whatsappLink("")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full py-1 text-lg hover:text-amber-soft"
                >
                  <WhatsAppIcon className="h-5 w-5 text-amber" />
                  <span>
                    {t.whatsapp} <span className="tabular-nums">{contact.phoneDisplay}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={contact.phoneHref} className="inline-flex items-center gap-3 rounded-full py-1 text-lg hover:text-amber-soft">
                  <PhoneIcon className="h-5 w-5 text-amber" />
                  <span className="tabular-nums">{contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.supportEmail}`}
                  className="inline-flex items-center gap-3 rounded-full py-1 text-lg break-all hover:text-amber-soft"
                >
                  <MailIcon className="h-5 w-5 shrink-0 text-amber" />
                  {contact.supportEmail}
                </a>
              </li>
            </ul>
            <p className="t-small mt-6 max-w-[28rem] text-mist">{t.where}</p>
          </div>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            send("whatsapp");
          }}
          className="glass grid gap-5 p-5 sm:p-8"
          style={{ "--g-radius": "36px", "--g-tint": "0.075" } as React.CSSProperties}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor={`${uid}-name`} className="field-label">
                {t.name}
              </label>
              <input
                id={`${uid}-name`}
                className="field-control"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={error && !name.trim() ? true : undefined}
                aria-describedby={error ? `${uid}-error` : undefined}
              />
            </div>
            <div className="field">
              <label htmlFor={`${uid}-business`} className="field-label">
                {t.business}
              </label>
              <input
                id={`${uid}-business`}
                className="field-control"
                autoComplete="organization"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor={`${uid}-service`} className="field-label">
              {t.service}
            </label>
            <select
              id={`${uid}-service`}
              className="field-control"
              value={service}
              onChange={(e) => setService(e.target.value as ServiceKey | "other" | "")}
            >
              <option value="">{t.servicePlaceholder}</option>
              {serviceKeys.map((key) => (
                <option key={key} value={key}>
                  {services[key].name}
                </option>
              ))}
              <option value="other">{t.other}</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={`${uid}-message`} className="field-label">
              {t.message}
            </label>
            <textarea
              id={`${uid}-message`}
              className="field-control"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {error && (
            <p id={`${uid}-error`} role="alert" className="t-small text-amber-soft">
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

          <p aria-live="polite" className="t-small min-h-5 text-ivory/80">
            {sent && t.sent.replace("{channel}", sent === "whatsapp" ? t.channelWhatsapp : t.channelEmail)}
          </p>
        </form>
      </div>
    </section>
  );
}
