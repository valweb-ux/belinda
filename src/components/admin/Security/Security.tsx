"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { X } from "lucide-react"

interface SecuritySettings {
  twoFactorAuth: boolean
  passwordPolicy: {
    minLength: number
    requireNumbers: boolean
    requireSpecialChars: boolean
    requireUppercase: boolean
    maxAge: number
  }
  sessionTimeout: number
  ipWhitelist: string[]
  loginAttempts: {
    maxAttempts: number
    lockoutDuration: number
  }
}

export const Security: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    passwordPolicy: {
      minLength: 8,
      requireNumbers: true,
      requireSpecialChars: true,
      requireUppercase: true,
      maxAge: 90,
    },
    sessionTimeout: 30,
    ipWhitelist: [],
    loginAttempts: {
      maxAttempts: 5,
      lockoutDuration: 15,
    },
  })

  const [newIp, setNewIp] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/security")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching security settings:", error)
      setMessage({
        type: "error",
        text: "Помилка при завантаженні налаштувань безпеки",
      })
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch("/api/admin/security", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Налаштування безпеки успішно оновлено",
        })
      } else {
        throw new Error("Failed to update security settings")
      }
    } catch (error) {
      console.error("Error saving security settings:", error)
      setMessage({
        type: "error",
        text: "Помилка при збереженні налаштувань безпеки",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddIp = () => {
    if (newIp && !settings.ipWhitelist.includes(newIp)) {
      setSettings({
        ...settings,
        ipWhitelist: [...settings.ipWhitelist, newIp],
      })
      setNewIp("")
    }
  }

  const handleRemoveIp = (ip: string) => {
    setSettings({
      ...settings,
      ipWhitelist: settings.ipWhitelist.filter((item) => item !== ip),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Налаштування безпеки</CardTitle>
      </CardHeader>
      <CardContent>
        {message.text && (
          <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
            <AlertTitle>{message.type === "error" ? "Помилка" : "Успіх"}</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Двофакторна автентифікація</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    twoFactorAuth: checked as boolean,
                  })
                }
              />
              <Label htmlFor="twoFactorAuth">Увімкнути двофакторну автентифікацію</Label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Політика паролів</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="minLength">Мінімальна довжина паролю</Label>
                <Input
                  id="minLength"
                  type="number"
                  min="6"
                  value={settings.passwordPolicy.minLength}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        minLength: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireNumbers"
                  checked={settings.passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        requireNumbers: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="requireNumbers">Вимагати цифри</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireSpecialChars"
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        requireSpecialChars: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="requireSpecialChars">Вимагати спеціальні символи</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireUppercase"
                  checked={settings.passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        requireUppercase: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="requireUppercase">Вимагати великі літери</Label>
              </div>
              <div>
                <Label htmlFor="maxAge">Максимальний вік паролю (днів)</Label>
                <Input
                  id="maxAge"
                  type="number"
                  min="0"
                  value={settings.passwordPolicy.maxAge}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        maxAge: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Налаштування сесії</h3>
            <div>
              <Label htmlFor="sessionTimeout">Час очікування сесії (хвилин)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sessionTimeout: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Білий список IP-адрес</h3>
            <div className="space-y-2">
              {settings.ipWhitelist.map((ip) => (
                <div key={ip} className="flex items-center justify-between bg-secondary p-2 rounded">
                  <span>{ip}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveIp(ip)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              <Input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="Введіть IP-адресу"
                className="mr-2"
              />
              <Button type="button" onClick={handleAddIp}>
                Додати
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Спроби входу</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="maxAttempts">Максимальна кількість спроб</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  min="1"
                  value={settings.loginAttempts.maxAttempts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      loginAttempts: {
                        ...settings.loginAttempts,
                        maxAttempts: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="lockoutDuration">Тривалість блокування (хвилин)</Label>
                <Input
                  id="lockoutDuration"
                  type="number"
                  min="1"
                  value={settings.loginAttempts.lockoutDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      loginAttempts: {
                        ...settings.loginAttempts,
                        lockoutDuration: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Збереження..." : "Зберегти налаштування"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

