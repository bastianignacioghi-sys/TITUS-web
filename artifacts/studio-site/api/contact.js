import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY no configurada" });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "contacto@titusdiseno.cl",
    to: "titus@titus.cl",
    replyTo: email,
    subject: `Nuevo mensaje de contacto — ${name}`,
    html: `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  });

  if (error) {
    return res.status(500).json({ error: "Error al enviar el correo" });
  }

  return res.status(200).json({ ok: true });
}
