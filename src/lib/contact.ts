export const contact = {
  phoneDisplay: "+1 (703) 944-3469",
  phoneHref: "tel:+17039443469",
  whatsappNumber: "17039443469",
  supportEmail: "villarroelayrton@gmail.com",
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const mailtoLink = (subject: string, body: string) =>
  `mailto:${contact.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** Número de ticket legible: AN-AAMMDD-XXXX */
export const makeTicketId = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AN-${yy}${mm}${dd}-${rand}`;
};
