"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
} from "@mui/material"
import { Save as SaveIcon, ExpandMore as ExpandMoreIcon, Refresh as RefreshIcon } from "@mui/icons-material"
import styles from "./Settings.module.scss"

interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    maintenanceMode: boolean
    registrationEnabled: boolean
    defaultUserRole: string
  }
  email: {
    provider: string
    from: string
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    smtpSecure: boolean
  }
  storage: {
    provider: string
    local: {
      uploadDir: string
      maxFileSize: number
    }
    s3: {
      bucket: string
      region: string
      accessKey: string
      secretKey: string
    }
  }
  security: {
    sessionTimeout: number
    maxLoginAttempts: number
    passwordPolicy: {
      minLength: number
      requireNumbers: boolean
      requireSymbols: boolean
      requireUppercase: boolean
    }
    twoFactorAuth: {
      enabled: boolean
      provider: string
    }
  }
  backup: {
    autoBackup: boolean
    backupTime: string
    keepBackups: number
    backupLocation: string
  }
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [testingEmail, setTestingEmail] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (!response.ok) throw new Error("Помилка завантаження налаштувань")

      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      setError("Не вдалося завантажити налаштування системи")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error("Помилка збереження налаштувань")

      setSuccess("Налаштування успішно збережено")
    } catch (error) {
      console.error("Error saving settings:", error)
      setError("Не вдалося зберегти налаштування")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (section: keyof SystemSettings, field: string, value: any) => {
    if (!settings) return

    setSettings((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }
    })
  }

  const handleNestedChange = (section: keyof SystemSettings, subsection: string, field: string, value: any) => {
    if (!settings) return

    setSettings((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [field]: value,
          },
        },
      }
    })
  }

  const handleTestEmail = async () => {
    setTestingEmail(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/admin/settings/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings?.email),
      })

      if (!response.ok) throw new Error("Помилка тестування email")

      setSuccess("Тестовий email успішно надіслано")
    } catch (error) {
      console.error("Error testing email:", error)
      setError("Не вдалося надіслати тестовий email")
    } finally {
      setTestingEmail(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    )
  }

  if (!settings) {
    return <Alert severity="error">Не вдалося завантажити налаштування</Alert>
  }

  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <Typography variant="h2">Налаштування системи</Typography>
        <Tooltip title="Оновити">
          <IconButton onClick={fetchSettings}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </div>

      {error && (
        <Alert severity="error" className={styles.alert}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className={styles.alert}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Загальні налаштування */}
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Загальні налаштування</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles.section}>
                  <TextField
                    label="Назва сайту"
                    value={settings.general.siteName}
                    onChange={(e) => handleChange("general", "siteName", e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Опис сайту"
                    value={settings.general.siteDescription}
                    onChange={(e) => handleChange("general", "siteDescription", e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.general.maintenanceMode}
                        onChange={(e) => handleChange("general", "maintenanceMode", e.target.checked)}
                      />
                    }
                    label="Режим обслуговування"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.general.registrationEnabled}
                        onChange={(e) => handleChange("general", "registrationEnabled", e.target.checked)}
                      />
                    }
                    label="Реєстрація користувачів"
                  />
                  <FormControl fullWidth>
                    <InputLabel>Роль за замовчуванням</InputLabel>
                    <Select
                      value={settings.general.defaultUserRole}
                      onChange={(e) => handleChange("general", "defaultUserRole", e.target.value)}
                    >
                      <MenuItem value="user">Користувач</MenuItem>
                      <MenuItem value="premium">Premium</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Email налаштування */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Налаштування Email</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={styles.section}>
                  <FormControl fullWidth>
                    <InputLabel>Провайдер</InputLabel>
                    <Select
                      value={settings.email.provider}
                      onChange={(e) => handleChange("email", "provider", e.target.value)}
                    >
                      <MenuItem value="smtp">SMTP</MenuItem>
                      <MenuItem value="sendgrid">SendGrid</MenuItem>
                      <MenuItem value="mailgun">Mailgun</MenuItem>
                    </Select>
                  </FormControl>

                  {settings.email.provider === "smtp" && (
                    <>
                      <TextField
                        label="SMTP Host"
                        value={settings.email.smtpHost}
                        onChange={(e) => handleChange("email", "smtpHost", e.target.value)}
                        fullWidth
                      />
                      <TextField
                        label="SMTP Port"
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => handleChange("email", "smtpPort", Number.parseInt(e.target.value))}
                        fullWidth
                      />
                      <TextField
                        label="SMTP User"
                        value={settings.email.smtpUser}
                        onChange={(e) => handleChange("email", "smtpUser", e.target.value)}
                        fullWidth
                      />
                      <TextField
                        label="SMTP Password"
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) => handleChange("email", "smtpPassword", e.target.value)}
                        fullWidth
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.email.smtpSecure}
                            onChange={(e) => handleChange("email", "smtpSecure", e.target.checked)}
                          />
                        }
                        label="Використовувати SSL/TLS"
                      />
                    </>
                  )}

                  <Button
                    variant="outlined"
                    onClick={handleTestEmail}
                    disabled={testingEmail}
                    startIcon={<RefreshIcon />}
                  >
                    {testingEmail ? "Надсилання..." : "Надіслати тестовий email"}
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Інші секції налаштувань... */}
        </Grid>

        <div className={styles.actions}>
          <Button variant="contained" color="primary" type="submit" disabled={saving} startIcon={<SaveIcon />}>
            {saving ? "Збереження..." : "Зберегти налаштування"}
          </Button>
        </div>
      </form>
    </div>
  )
}

