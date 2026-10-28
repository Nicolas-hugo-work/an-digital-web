// Textos ES / EN. *palabra* = énfasis, \n = salto de línea
// Tono: cercano, directo y práctico (tuteo / "you" cercano). Sin jerga técnica, sin cifras ni testimonios inventados.
export type Lang = "es" | "en";

const es = {
  "meta.title": "AN DIGITAL — Tu negocio, en el celular de tus clientes",
  "meta.desc": "Tarjetas de fidelización para Apple Wallet y Google Wallet, tarjetas NFC para reseñas y páginas web para negocios pequeños en Virginia y Bolivia.",
  "skip": "Saltar al contenido",
  "nav.services": "Servicios",
  "nav.approach": "Enfoque",
  "nav.process": "Proceso",
  "nav.contact": "Contacto",
  "nav.cta": "Hablemos",
  "hero.eyebrow": "Fidelización · Reseñas · Páginas web",
  "hero.title": "Tu negocio, en el *celular*\nde tus clientes",
  "hero.sub": "Tarjetas de sellos en Apple Wallet y Google Wallet, más reseñas en Google y páginas que traen clientes. Para cafés, barberías, panaderías y negocios que quieren que sus clientes vuelvan.",
  "hero.cta": "Hablemos",
  "hero.cta2": "Ver servicios",
  "hero.scroll": "Desliza",
  "services.eyebrow": "Servicios",
  "services.title": "Lo que hacemos\n*por tu negocio*",
  "services.lead": "Herramientas sencillas para que tus clientes te recuerden, vuelvan y hablen bien de ti. Tú atiendes; ellas trabajan.",
  "s.featured": "El favorito",
  "s1.title": "Tarjetas de fidelización en Apple Wallet y Google Wallet",
  "s1.desc": "Tu tarjeta de sellos o de puntos vive en el celular de tus clientes, junto a sus tarjetas del banco. Nada de cartoncitos que se pierden ni apps que descargar. Cuando les falta poco para su premio, les llega un aviso al celular y vuelven.",
  "s1.t1": "Sellos",
  "s1.t2": "Puntos",
  "s1.t3": "Premios",
  "s1.t4": "Avisos al celular",
  "s2.title": "Tarjetas NFC para reseñas",
  "s2.desc": "Tu cliente acerca el celular a la tarjeta y se abre tu página de reseñas de Google. Más reseñas sin pedirles que busquen tu negocio.",
  "s2.t1": "Para el mostrador",
  "s2.t2": "Reseñas en Google",
  "s3.title": "Páginas listas para tus anuncios",
  "s3.desc": "Páginas pensadas para tus anuncios en Meta y Google, para que quien las ve te escriba, te llame o te visite.",
  "s3.t1": "Facebook e Instagram",
  "s3.t2": "Google",
  "s4.title": "Aplicaciones a la medida",
  "s4.desc": "Inventarios, reservas, paneles y registros de clientes, hechos para la forma en que ya trabajas.",
  "s4.t1": "Reservas",
  "s4.t2": "Inventario",
  "s5.title": "Mantenimiento de tu web",
  "s5.desc": "Nos ocupamos de que tu página esté al día y funcionando. Tú pides el cambio; nosotros lo hacemos.",
  "s5.t1": "Cambios",
  "s5.t2": "Siempre al día",
  "s6.title": "Asistentes de IA que contestan tus llamadas",
  "s6.desc": "Atienden el teléfono en español y en inglés cuando tú estás ocupado, para que ninguna llamada se quede sin respuesta.",
  "s6.t1": "Español",
  "s6.t2": "Inglés",
  "pass.stamps": "Sellos",
  "pass.reward": "Premio",
  "pass.rewardValue": "Un café gratis",
  "pass.left": "Te falta",
  "pass.leftValue": "1 sello",
  "pass.scan": "Muestra este código en caja",
  "pass.label": "Ejemplo de tarjeta de fidelización de Café Altura en el celular: 9 de 10 sellos, el premio es un café gratis.",
  "notif.app": "Café Altura",
  "notif.time": "ahora",
  "notif.text": "Te falta 1 sello para tu café gratis ☕",
  "manifesto.eyebrow": "Enfoque",
  "manifesto.text": "Tus clientes ya tienen el celular en la mano. Ponemos tu negocio *ahí*, para que te recuerden, *vuelvan* y te recomienden.",
  "pr1.title": "Resultados que se notan",
  "pr1.desc": "Clientes que regresan y reseñas que llegan. Eso es lo que buscamos contigo.",
  "pr2.title": "Te hablamos claro",
  "pr2.desc": "En español o en inglés, sin palabras raras. Te explicamos todo en simple.",
  "pr3.title": "Con tu marca",
  "pr3.desc": "Tus colores, tu logo y tu estilo en cada tarjeta y en cada página.",
  "process.eyebrow": "Proceso",
  "process.title": "Cómo *trabajamos*",
  "process.lead": "Cuatro pasos, sin complicaciones. Tú sigues atendiendo tu negocio; nosotros nos ocupamos del resto.",
  "p1.title": "Hablamos",
  "p1.desc": "Nos cuentas cómo funciona tu negocio y qué quieres lograr. Te proponemos solo lo que de verdad te sirve.",
  "p2.title": "Lo diseñamos con tu marca",
  "p2.desc": "Preparamos tu tarjeta, tu página o tu herramienta con tus colores y tu logo. Tú la revisas antes de que la vean tus clientes.",
  "p3.title": "Te lo dejamos funcionando",
  "p3.desc": "Lo ponemos en marcha, lo probamos contigo y te enseñamos a usarlo. Listo para tus clientes desde el primer día.",
  "p4.title": "Te acompañamos",
  "p4.desc": "Seguimos a tu lado para cambios, dudas y mejoras. Si algo puede funcionar mejor, te lo decimos.",
  "cta.title": "¿Hablamos de\n*tu negocio*?",
  "cta.sub": "Escríbenos por WhatsApp y cuéntanos qué necesitas. Te contestamos en español o en inglés.",
  "cta.us": "WhatsApp EE.UU.",
  "cta.bo": "WhatsApp Bolivia",
  "cta.mail": "o escríbenos a",
  "wa.msg": "Hola AN DIGITAL, quiero más información para mi negocio.",
  "mail.subject": "Quiero más información para mi negocio",
  "footer.rights": "Todos los derechos reservados.",
  "footer.made": "Diseñado y construido por AN DIGITAL.",
  "footer.where": "Virginia · Bolivia",
};

export type Key = keyof typeof es;

const en: Record<Key, string> = {
  "meta.title": "AN DIGITAL — Your business, on your customers' phones",
  "meta.desc": "Loyalty cards for Apple Wallet and Google Wallet, NFC review cards and websites for small businesses in Virginia and Bolivia.",
  "skip": "Skip to content",
  "nav.services": "Services",
  "nav.approach": "Approach",
  "nav.process": "Process",
  "nav.contact": "Contact",
  "nav.cta": "Let's talk",
  "hero.eyebrow": "Loyalty · Reviews · Websites",
  "hero.title": "Your business, on your\ncustomers' *phones*",
  "hero.sub": "Stamp cards in Apple Wallet and Google Wallet, more Google reviews and pages that bring in customers. For cafés, barbershops, bakeries and every business that wants its customers to come back.",
  "hero.cta": "Let's talk",
  "hero.cta2": "See services",
  "hero.scroll": "Scroll",
  "services.eyebrow": "Services",
  "services.title": "What we do\n*for your business*",
  "services.lead": "Simple tools that help your customers remember you, come back and speak well of you. You run the shop; they do the work.",
  "s.featured": "Customer favorite",
  "s1.title": "Loyalty cards in Apple Wallet and Google Wallet",
  "s1.desc": "Your stamp or points card lives on your customers' phones, right next to their bank cards. No paper cards to lose, no apps to download. When they're close to a reward, they get a heads-up on their phone and come back.",
  "s1.t1": "Stamps",
  "s1.t2": "Points",
  "s1.t3": "Rewards",
  "s1.t4": "Phone alerts",
  "s2.title": "NFC review cards",
  "s2.desc": "Your customer taps their phone on the card and your Google review page opens. More reviews, without asking anyone to search for your business.",
  "s2.t1": "For your counter",
  "s2.t2": "Google reviews",
  "s3.title": "Pages ready for your ads",
  "s3.desc": "Pages built for your Meta and Google ads, so the people who see them message you, call you or stop by.",
  "s3.t1": "Facebook & Instagram",
  "s3.t2": "Google",
  "s4.title": "Custom web apps",
  "s4.desc": "Inventory, bookings, dashboards and customer records, built around the way you already work.",
  "s4.t1": "Bookings",
  "s4.t2": "Inventory",
  "s5.title": "Website care",
  "s5.desc": "We keep your site up to date and working. You ask for the change; we take care of it.",
  "s5.t1": "Updates",
  "s5.t2": "Always current",
  "s6.title": "AI assistants that answer your calls",
  "s6.desc": "They pick up the phone in Spanish and English when you're busy, so no call goes unanswered.",
  "s6.t1": "Spanish",
  "s6.t2": "English",
  "pass.stamps": "Stamps",
  "pass.reward": "Reward",
  "pass.rewardValue": "A free coffee",
  "pass.left": "Only",
  "pass.leftValue": "1 stamp left",
  "pass.scan": "Show this code at checkout",
  "pass.label": "Sample Café Altura loyalty card on a phone: 9 of 10 stamps, the reward is a free coffee.",
  "notif.app": "Café Altura",
  "notif.time": "now",
  "notif.text": "Just 1 more stamp for your free coffee ☕",
  "manifesto.eyebrow": "Approach",
  "manifesto.text": "Your customers already have their phone in hand. We put your business *right there*, so they remember you, *come back* and tell their friends.",
  "pr1.title": "Results you can see",
  "pr1.desc": "Customers who return and reviews that keep coming. That's what we work on with you.",
  "pr2.title": "Plain talk",
  "pr2.desc": "In English or Spanish, no buzzwords. We explain everything simply.",
  "pr3.title": "Your brand, everywhere",
  "pr3.desc": "Your colors, your logo and your style on every card and every page.",
  "process.eyebrow": "Process",
  "process.title": "How we *work*",
  "process.lead": "Four steps, no headaches. You keep running your business; we handle the rest.",
  "p1.title": "We talk",
  "p1.desc": "Tell us how your business works and what you want to achieve. We only suggest what will actually help you.",
  "p2.title": "We design it with your brand",
  "p2.desc": "We prepare your card, page or tool with your colors and logo. You review it before your customers ever see it.",
  "p3.title": "We get it up and running",
  "p3.desc": "We launch it, test it with you and show you how to use it. Ready for your customers from day one.",
  "p4.title": "We stay with you",
  "p4.desc": "We're here for changes, questions and improvements. If something could work better, we'll tell you.",
  "cta.title": "Let's talk about\n*your business*",
  "cta.sub": "Message us on WhatsApp and tell us what you need. We'll answer in English or Spanish.",
  "cta.us": "WhatsApp USA",
  "cta.bo": "WhatsApp Bolivia",
  "cta.mail": "or email us at",
  "wa.msg": "Hi AN DIGITAL, I'd like more information for my business.",
  "mail.subject": "I'd like more information for my business",
  "footer.rights": "All rights reserved.",
  "footer.made": "Designed and built by AN DIGITAL.",
  "footer.where": "Virginia · Bolivia",
};

export const DICT: Record<Lang, Record<Key, string>> = { es, en };

export const MARQUEE: Record<Lang, string[]> = {
  es: ["Apple Wallet", "Google Wallet", "Tarjetas de sellos", "Reseñas en Google", "Tarjetas NFC", "Páginas para anuncios", "Reservas", "Llamadas en español e inglés"],
  en: ["Apple Wallet", "Google Wallet", "Stamp cards", "Google reviews", "NFC cards", "Ad-ready pages", "Bookings", "Calls in English & Spanish"],
};

// Eslogan que se muestra siempre en ambos idiomas (pie de página)
export const TAGLINES = {
  es: "Tu negocio, en el celular de tus clientes.",
  en: "Your business, on your customers' phones.",
};

export const CONTACT_EMAIL = "hola@andigital.co"; // inferred: correo indicado en el brief, confirmar que el buzón existe

// Números de ejemplo con mensaje prellenado (se añade ?text= según el idioma)
export const WHATSAPP = {
  us: "https://wa.me/15710000000", // inferred: número de ejemplo EE.UU., reemplazar por el real
  bo: "https://wa.me/59170000000", // inferred: número de ejemplo Bolivia, reemplazar por el real
};

export const waLink = (base: string, message: string) => `${base}?text=${encodeURIComponent(message)}`;

export type Segment = { text: string; em: boolean };

// "Lo que *hacemos*" → [{text:"Lo que ", em:false}, {text:"hacemos", em:true}]
export function parseRich(value: string): Segment[] {
  return value
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("*") && part.endsWith("*")
        ? { text: part.slice(1, -1), em: true }
        : { text: part, em: false },
    );
}
