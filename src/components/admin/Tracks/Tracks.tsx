"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ArrowUpDown, Upload } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  genre: string
  duration: number
  fileUrl: string
  playCount: number
  createdAt: string
}

export const Tracks: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<keyof Track>("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isUploading, setIsUploading] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".ogg"],
    },
    onDrop: handleFileDrop,
  })

  useEffect(() => {
    fetchTracks()
  }, [])

  async function fetchTracks() {
    try {
      const response = await fetch(
        `/api/admin/tracks?page=${currentPage}&search=${searchTerm}&sortBy=${sortBy}&order=${sortOrder}`,
      )
      const data = await response.json()
      setTracks(data.tracks)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching tracks:", error)
    }
  }

  async function handleFileDrop(acceptedFiles: File[]) {
    setIsUploading(true)
    const formData = new FormData()

    for (const file of acceptedFiles) {
      formData.append("files", file)
    }

    try {
      const response = await fetch("/api/admin/tracks/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        fetchTracks()
      }
    } catch (error) {
      console.error("Error uploading files:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSort = (field: keyof Track) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleTrackUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTrack) return

    try {
      const response = await fetch(`/api/admin/tracks/${selectedTrack.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTrack),
      })

      if (response.ok) {
        fetchTracks()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Error updating track:", error)
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-primary">Керування треками</h2>
        <Input
          type="text"
          placeholder="Пошук треків..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer transition-colors hover:border-primary"
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p className="text-gray-600">Завантаження...</p>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Перетягніть аудіофайли сюди або клікніть для вибору</p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("title")} className="cursor-pointer hover:bg-gray-100">
                Назва <ArrowUpDown className="ml-2 h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort("artist")} className="cursor-pointer hover:bg-gray-100">
                Виконавець <ArrowUpDown className="ml-2 h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort("album")} className="cursor-pointer hover:bg-gray-100">
                Альбом <ArrowUpDown className="ml-2 h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort("genre")} className="cursor-pointer hover:bg-gray-100">
                Жанр <ArrowUpDown className="ml-2 h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort("duration")} className="cursor-pointer hover:bg-gray-100">
                Тривалість <ArrowUpDown className="ml-2 h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort("playCount")} className="cursor-pointer hover:bg-gray-100">
                Прослуховування <ArrowUpDown className="ml-2 h-4 w-4" />
              </TableHead>
              <TableHead>Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.map((track) => (
              <TableRow key={track.id} className="hover:bg-gray-50">
                <TableCell>{track.title}</TableCell>
                <TableCell>{track.artist}</TableCell>
                <TableCell>{track.album}</TableCell>
                <TableCell>{track.genre}</TableCell>
                <TableCell>{formatDuration(track.duration)}</TableCell>
                <TableCell>{track.playCount}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTrack(track)
                      setIsModalOpen(true)
                    }}
                  >
                    Редагувати
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Попередня
        </Button>
        <span className="text-sm text-gray-600">
          Сторінка {currentPage} з {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Наступна
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагування треку</DialogTitle>
          </DialogHeader>
          {selectedTrack && (
            <form onSubmit={handleTrackUpdate}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Назва
                  </Label>
                  <Input
                    id="title"
                    value={selectedTrack.title}
                    onChange={(e) => setSelectedTrack({ ...selectedTrack, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="artist" className="text-right">
                    Виконавець
                  </Label>
                  <Input
                    id="artist"
                    value={selectedTrack.artist}
                    onChange={(e) => setSelectedTrack({ ...selectedTrack, artist: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="album" className="text-right">
                    Альбом
                  </Label>
                  <Input
                    id="album"
                    value={selectedTrack.album}
                    onChange={(e) => setSelectedTrack({ ...selectedTrack, album: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="genre" className="text-right">
                    Жанр
                  </Label>
                  <Input
                    id="genre"
                    value={selectedTrack.genre}
                    onChange={(e) => setSelectedTrack({ ...selectedTrack, genre: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Зберегти зміни</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

