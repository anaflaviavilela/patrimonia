// backend/src/services/email.services.js
//
// Ponto único de disparo de e-mails transacionais. Cada função aqui
// monta o template certo e delega o envio ao mailer genérico.
//
// IMPORTANTE: erros de envio de e-mail NUNCA devem propagar para quem
// chamou (ex: o controller de /auth/register). E-mail é um efeito
// colateral — se o SMTP falhar, o cadastro/lançamento deve continuar
// normalmente. Por isso cada função aqui captura o próprio erro,
// loga, e retorna silenciosamente (sem `throw`).
//
// Evolução natural quando o volume crescer: trocar a chamada direta
// por uma fila (BullMQ + Redis, por exemplo), já que o Redis já está
// no stack do projeto. Isso desacopla o tempo de resposta da API do
// tempo de envio do e-mail.

import { sendEmail } from "../lib/mailer.js";
import { welcomeEmailTemplate, debtReminderEmailTemplate } from "../templates/email-templates.js";

export async function sendWelcomeEmail(email, name) {
  try {
    await sendEmail({
      to: email,
      subject: "Bem-vindo ao Patrimônia 2.0! 🚀",
      html: welcomeEmailTemplate(name),
    });
    console.log(`[email] Boas-vindas enviado para: ${email}`);
  } catch (error) {
    console.error(`[email] Falha ao enviar boas-vindas para ${email}:`, error);
    // Sem throw: cadastro não pode falhar por causa do e-mail.
  }
}

export async function sendDebtReminderEmail(email, name, debtDescription, amount, dueDate) {
  try {
    await sendEmail({
      to: email,
      subject: `Lembrete: vencimento de "${debtDescription}"`,
      html: debtReminderEmailTemplate(name, debtDescription, amount, dueDate),
    });
    console.log(`[email] Lembrete de dívida enviado para: ${email}`);
  } catch (error) {
    console.error(`[email] Falha ao enviar lembrete de dívida para ${email}:`, error);
  }
}

// Exemplo de uso no controller de /auth/register (não precisa de await
// bloqueando a resposta — o erro nunca propaga, então dá pra chamar
// como fire-and-forget também):
//
//   const user = await prisma.user.create({ data: { ... } });
//   sendWelcomeEmail(user.email, user.name);
//   return res.status(201).json({ user });
