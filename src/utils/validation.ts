import type { SystemSettings } from "@prisma/client"

export function validateSettings(settings: any): string | null {
  // Перевірка загальних налаштувань
  if (!settings.general) {
    return "Відсутні загальні налаштування"
  }

  if (!settings.general.siteName) {
    return "Назва сайту обов'язкова"
  }

  if (settings.general.siteName.length > 100) {
    return "Назва сайту занадто довга"
  }

  // Перевірка налаштувань email
  if (!settings.email) {
    return "Відсутні налаштування email"
  }

  if (!settings.email.provider) {
    return "Провайдер email обов'язковий"
  }

  if (settings.email.provider === "smtp") {
    if (!settings.email.smtpHost) {
      return "SMTP хост обов'язковий"
    }
    if (!settings.email.smtpPort) {
      return "SMTP порт обов'язковий"
    }
    if (settings.email.smtpPort < 1 || settings.email.smtpPort > 65535) {
      return "Недійсний SMTP порт"
    }
  }

  // Перевірка налаштувань сховища
  if (!settings.storage) {
    return "Відсутні налаштування сховища"
  }

  if (!settings.storage.provider) {
    return "Провайдер сховища обов'язковий"
  }

  if (settings.storage.provider === "s3") {
    if (!settings.storage.s3.bucket) {
      return "S3 bucket обов'язковий"
    }
    if (!settings.storage.s3.region) {
      return "S3 регіон обов'язковий"
    }
    if (!settings.storage.s3.accessKey) {
      return "S3 access key обов'язковий"
    }
    if (!settings.storage.s3.secretKey) {
      return "S3 secret key обов'язковий"
    }
  }

  // Перевірка налаштувань безпеки
  if (!settings.security) {
    return "Відсутні налаштування безпеки"
  }

  if (settings.security.sessionTimeout < 300) {
    return "Час сесії не може бути менше 5 хвилин"
  }

  if (settings.security.maxLoginAttempts < 1) {
    return "Максимальна кількість спроб входу повинна бути більше 0"
  }

  if (settings.security.passwordPolicy) {
    if (settings.security.passwordPolicy.minLength < 8) {
      return "Мінімальна довжина пароля повинна бути не менше 8 символів"
    }
  }

  // Перевірка налаштувань резервного копіювання
  if (!settings.backup) {
    return "Відсутні налаштування резервного копіювання"
  }

  if (settings.backup.autoBackup) {
    if (!settings.backup.backupTime) {
      return "Час автоматичного резервного копіювання обов'язковий"
    }
    if (settings.backup.keepBackups < 1) {
      return "Кількість резервних копій повинна бути більше 0"
    }
  }

  return null
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(
  password: string,
  policy: SystemSettings["security"]["passwordPolicy"],
): string | null {
  if (password.length < policy.minLength) {
    return `Пароль повинен містити мінімум ${policy.minLength} символів`
  }

  if (policy.requireNumbers && !/\d/.test(password)) {
    return "Пароль повинен містити цифри"
  }

  if (policy.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Пароль повинен містити спеціальні символи"
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    return "Пароль повинен містити великі літери"
  }

  return null
}

export function validateUsername(username: string): string | null {
  if (username.length < 3) {
    return "Ім'я користувача повинно містити мінімум 3 символи"
  }

  if (username.length > 30) {
    return "Ім'я користувача занадто довге"
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return "Ім'я користувача може містити лише літери, цифри, дефіс та підкреслення"
  }

  return null
}

export function validatePhone(phone: string): string | null {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/

  if (!phoneRegex.test(phone)) {
    return "Недійсний формат номера телефону"
  }

  return null
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

