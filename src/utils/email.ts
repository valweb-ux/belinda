import nodemailer from "nodemailer"
import type { SystemSettings } from "@prisma/client"
import { validateEmail } from "./validation"

interface EmailOptions {
  to: string | string[]
  subject: string
  text: string
  html: string
  settings: SystemSettings["email"]
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const { to, subject, text, html, settings } = options

  // Валідація email адрес
  const recipients = Array.isArray(to) ? to : [to]
  for (const recipient of recipients) {
    if (!validateEmail(recipient)) {
      throw new Error(`Недійсна email адреса: ${recipient}`)
    }
  }

  let transporter

  switch (settings.provider) {
    case "smtp":
      transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort,
        secure: settings.smtpSecure,
        auth: {
          user: settings.smtpUser,
          pass: settings.smtpPassword,
        },
      })
      break

    case "sendgrid":
      // Налаштування для SendGrid
      transporter = nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: settings.apiKey,
          pass: settings.apiSecret,
        },
      })
      break

    case "mailgun":
      // Налаштування для Mailgun
      transporter = nodemailer.createTransport({
        host: "smtp.mailgun.org",
        port: 587,
        secure: false,
        auth: {
          user: settings.apiKey,
          pass: settings.apiSecret,
        },
      })
      break

    default:
      throw new Error("Непідтримуваний провайдер email")
  }

  try {
    // Перевіряємо з'єднання
    await transporter.verify()

    // Надсилаємо email
    await transporter.sendMail({
      from: settings.from,
      to: recipients.join(", "),
      subject,
      text,
      html,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error("Помилка надсилання email")
  }
}

export function generatePasswordResetEmail(
  username: string,
  resetLink: string,
): { subject: string; text: string; html: string } {
  return {
    subject: "Скидання пароля",
    text: `
      Привіт ${username}!
      
      Ви отримали цей лист, тому що запросили скидання пароля.
      Для скидання пароля перейдіть за посиланням: ${resetLink}
      
      Якщо ви не запитували скидання пароля, проігноруйте цей лист.
      
      З повагою,
      Команда підтримки
    `,
    html: `
      <h1>Скидання пароля</h1>
      <p>Привіт ${username}!</p>
      <p>Ви отримали цей лист, тому що запросили скидання пароля.</p>
      <p>Для скидання пароля натисніть кнопку нижче:</p>
      <p>
        <a href="${resetLink}" 
           style="display:inline-block;padding:12px 24px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:4px">
          Скинути пароль
        </a>
      </p>
      <p>Або перейдіть за посиланням: ${resetLink}</p>
      <p>Якщо ви не запитували скидання пароля, проігноруйте цей лист.</p>
      <p>З повагою,<br>Команда підтримки</p>
    `,
  }
}

export function generateWelcomeEmail(
  username: string,
  verificationLink?: string,
): { subject: string; text: string; html: string } {
  const verificationSection = verificationLink
    ? `
    Для підтвердження вашої email адреси перейдіть за посиланням:
    ${verificationLink}
  `
    : ""

  const verificationHtml = verificationLink
    ? `
    <p>Для підтвердження вашої email адреси натисніть кнопку нижче:</p>
    <p>
      <a href="${verificationLink}" 
         style="display:inline-block;padding:12px 24px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:4px">
        Підтвердити email
      </a>
    </p>
    <p>Або перейдіть за посиланням: ${verificationLink}</p>
  `
    : ""

  return {
    subject: "Ласкаво просимо!",
    text: `
      Привіт ${username}!
      
      Дякуємо за реєстрацію на нашому сайті.
      ${verificationSection}
      
      З повагою,
      Команда підтримки
    `,
    html: `
      <h1>Ласкаво просимо!</h1>
      <p>Привіт ${username}!</p>
      <p>Дякуємо за реєстрацію на нашому сайті.</p>
      ${verificationHtml}
      <p>З повагою,<br>Команда підтримки</p>
    `,
  }
}

