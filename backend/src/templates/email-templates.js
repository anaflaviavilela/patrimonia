// backend/src/templates/email-templates.js
//
// Cada função monta o HTML de um tipo de e-mail. Mantê-las separadas
// do envio em si facilita adicionar novos tipos (dívida vencendo,
// alerta de gasto, relatório mensal etc.) sem tocar no mailer.

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return entities[character] || character;
  });
}

export function welcomeEmailTemplate(name) {
  const firstName = escapeHtml(String(name || "").trim() || "por aqui");

  return `
    <div style="margin:0; padding:32px 16px; background:#f4faf8; font-family:Arial,Helvetica,sans-serif; color:#16232b;">
      <div style="max-width:560px; margin:0 auto; overflow:hidden; background:#ffffff; border:1px solid #d1e2de; border-radius:8px;">
        <div style="height:8px; background:#087d78;"></div>

        <div style="padding:40px 48px 48px;">
          <div style="margin-bottom:40px; font-size:19px; font-weight:700; color:#087d78;">
            Patrimônia
          </div>

          <p style="margin:0 0 16px; color:#087d78; font-size:14px; font-weight:700;">
            BOAS-VINDAS
          </p>

          <h1 style="margin:0; font-size:30px; line-height:1.2; color:#16232b;">
            Olá, ${firstName}. Seu futuro financeiro começa agora.
          </h1>

          <p style="margin:28px 0 0; font-size:16px; line-height:1.65; color:#40545d;">
            Seu cadastro na <strong style="color:#16232b;">Patrimônia</strong>
            foi realizado com sucesso.
          </p>

          <p style="margin:16px 0 0; font-size:16px; line-height:1.65; color:#40545d;">
            A partir de agora, você tem uma visão clara das suas finanças e
            investimentos em um só lugar — para tomar decisões com mais
            tranquilidade.
          </p>

          <div style="margin:32px 0; border-top:1px solid #d1e2de;"></div>

          <p style="margin:0; font-size:16px; line-height:1.5; color:#40545d;">
            Bons investimentos,<br />
            <strong style="color:#16232b;">Equipe Patrimônia</strong>
          </p>
        </div>

        <div style="padding:20px 48px; border-top:1px solid #d1e2de; background:#eef7f4; color:#61767d; font-size:12px; line-height:1.5; text-align:center;">
          Patrimônia · Organize hoje. Invista no amanhã.
        </div>
      </div>
    </div>
  `;
}



export function debtReminderEmailTemplate(name, debtDescription, amount, dueDate) {
  const formattedAmount = amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const formattedDate = dueDate.toLocaleDateString("pt-BR");

  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2>Olá, ${name}</h2>
      <p>Um lembrete: você tem um vencimento próximo cadastrado no Patrimônia.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Descrição</td>
          <td style="padding: 8px 0; text-align: right;"><strong>${debtDescription}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Valor</td>
          <td style="padding: 8px 0; text-align: right;"><strong>${formattedAmount}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Vencimento</td>
          <td style="padding: 8px 0; text-align: right;"><strong>${formattedDate}</strong></td>
        </tr>
      </table>
      <p style="margin-top: 32px;">
        Equipe Patrimônia
      </p>
    </div>
  `;
}
