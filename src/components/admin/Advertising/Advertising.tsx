"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Upload } from "lucide-react"
import styles from "./Advertising.module.scss"

interface Advertisement {
  id: string
  title: string
  type: "banner" | "audio" | "video"
  url: string
  startDate: string
  endDate: string
  status: "active" | "scheduled" | "ended"
  impressions: number
  clicks: number
}

export const Advertising: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "audio/*": [".mp3"],
      "video/*": [".mp4"],
    },
    onDrop: (acceptedFiles) => {
      handleFileUpload(acceptedFiles)
    },
  })

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  const fetchAdvertisements = async () => {
    try {
      const response = await fetch("/api/admin/advertising")
      const data = await response.json()
      setAds(data)
    } catch (error) {
      console.error("Error fetching advertisements:", error)
    }
  }

  const handleFileUpload = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("file", file)
    })

    try {
      const response = await fetch("/api/admin/advertising/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      console.log("Uploaded:", data)
    } catch (error) {
      console.error("Error uploading files:", error)
    }
  }

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAd) return

    try {
      const response = await fetch(`/api/admin/advertising/${selectedAd.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedAd),
      })

      if (response.ok) {
        setIsModalOpen(false)
        fetchAdvertisements()
      }
    } catch (error) {
      console.error("Error saving advertisement:", error)
    }
  }

  return (
    <div className={styles.advertising}>
      <div className={styles.header}>
        <h2 className="text-2xl font-bold">Керування рекламою</h2>
        <Button
          onClick={() => {
            setSelectedAd(null)
            setIsModalOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Додати рекламу
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активні кампанії</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.filter((ad) => ad.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всього показів</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.reduce((sum, ad) => sum + ad.impressions, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всього кліків</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.reduce((sum, ad) => sum + ad.clicks, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {ads.map((ad) => (
          <Card key={ad.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{ad.title}</h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      ad.status === "active"
                        ? "bg-green-100 text-green-800"
                        : ad.status === "scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ad.status}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAd(ad)
                    setIsModalOpen(true)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Редагувати
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Тип: {ad.type}</p>
                  <p className="text-sm text-muted-foreground">Покази: {ad.impressions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Кліки: {ad.clicks}</p>
                  <p className="text-sm text-muted-foreground">
                    CTR: {((ad.clicks / ad.impressions) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAd ? "Редагування реклами" : "Нова реклама"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAd}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Назва</Label>
                <Input
                  id="title"
                  value={selectedAd?.title || ""}
                  onChange={(e) => setSelectedAd((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Тип реклами</Label>
                <Select
                  value={selectedAd?.type || "banner"}
                  onValueChange={(value) =>
                    setSelectedAd((prev) => (prev ? { ...prev, type: value as "banner" | "audio" | "video" } : null))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть тип реклами" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Банер</SelectItem>
                    <SelectItem value="audio">Аудіо</SelectItem>
                    <SelectItem value="video">Відео</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div {...getRootProps()} className={styles.dropzone}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center py-8">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Перетягніть файли сюди або клікніть для вибору</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Початок</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={selectedAd?.startDate || ""}
                    onChange={(e) => setSelectedAd((prev) => (prev ? { ...prev, startDate: e.target.value } : null))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Кінець</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={selectedAd?.endDate || ""}
                    onChange={(e) => setSelectedAd((prev) => (prev ? { ...prev, endDate: e.target.value } : null))}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="submit">Зберегти</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

