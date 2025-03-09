"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { GripVertical, X } from "lucide-react"

interface Track {
  id: string
  title: string
  artist: string
  duration: number
  genre: string
  playCount: number
}

interface Playlist {
  id: string
  name: string
  description: string
  tracks: Track[]
  isActive: boolean
  schedule: {
    days: string[]
    startTime: string
    endTime: string
  }
}

export const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const response = await fetch("/api/admin/playlists")
      const data = await response.json()
      setPlaylists(data)
    } catch (error) {
      console.error("Error fetching playlists:", error)
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination || !selectedPlaylist) return

    const items = Array.from(selectedPlaylist.tracks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedPlaylist({
      ...selectedPlaylist,
      tracks: items,
    })
  }

  const handleSavePlaylist = async () => {
    if (!selectedPlaylist) return

    try {
      const response = await fetch(`/api/admin/playlists/${selectedPlaylist.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPlaylist),
      })

      if (response.ok) {
        fetchPlaylists()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Error saving playlist:", error)
    }
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Керування плейлистами</h2>
        <Button
          onClick={() => {
            setSelectedPlaylist({
              id: "",
              name: "",
              description: "",
              tracks: [],
              isActive: true,
              schedule: {
                days: [],
                startTime: "00:00",
                endTime: "23:59",
              },
            })
            setIsModalOpen(true)
          }}
        >
          Створити плейлист
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className={`cursor-pointer transition-shadow hover:shadow-md ${playlist.isActive ? "border-primary" : ""}`}
            onClick={() => {
              setSelectedPlaylist(playlist)
              setIsModalOpen(true)
            }}
          >
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{playlist.description}</p>
              <div className="flex justify-between text-sm">
                <span>{playlist.tracks.length} треків</span>
                <span>
                  {playlist.schedule.days.join(", ")} {playlist.schedule.startTime}-{playlist.schedule.endTime}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedPlaylist?.id ? "Редагування плейлиста" : "Новий плейлист"}</DialogTitle>
          </DialogHeader>
          {selectedPlaylist && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Назва</Label>
                  <Input
                    id="name"
                    value={selectedPlaylist.name}
                    onChange={(e) =>
                      setSelectedPlaylist({
                        ...selectedPlaylist,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Опис</Label>
                  <Textarea
                    id="description"
                    value={selectedPlaylist.description}
                    onChange={(e) =>
                      setSelectedPlaylist({
                        ...selectedPlaylist,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Розклад</Label>
                <div className="flex flex-wrap gap-2">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={selectedPlaylist.schedule.days.includes(day)}
                        onCheckedChange={(checked) => {
                          const days = checked
                            ? [...selectedPlaylist.schedule.days, day]
                            : selectedPlaylist.schedule.days.filter((d) => d !== day)
                          setSelectedPlaylist({
                            ...selectedPlaylist,
                            schedule: {
                              ...selectedPlaylist.schedule,
                              days,
                            },
                          })
                        }}
                      />
                      <Label htmlFor={`day-${day}`}>{day}</Label>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Початок</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={selectedPlaylist.schedule.startTime}
                      onChange={(e) =>
                        setSelectedPlaylist({
                          ...selectedPlaylist,
                          schedule: {
                            ...selectedPlaylist.schedule,
                            startTime: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Кінець</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={selectedPlaylist.schedule.endTime}
                      onChange={(e) =>
                        setSelectedPlaylist({
                          ...selectedPlaylist,
                          schedule: {
                            ...selectedPlaylist.schedule,
                            endTime: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Треки</Label>
                <Input
                  type="text"
                  placeholder="Пошук треків..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="tracks">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {selectedPlaylist.tracks.map((track, index) => (
                          <Draggable key={track.id} draggableId={track.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center space-x-2 p-2 bg-secondary rounded-md"
                              >
                                <GripVertical className="text-muted-foreground" />
                                <span className="text-sm font-medium">{index + 1}</span>
                                <div className="flex-1">
                                  <p className="font-medium">{track.title}</p>
                                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                                </div>
                                <span className="text-sm text-muted-foreground">{formatDuration(track.duration)}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const tracks = selectedPlaylist.tracks.filter((t) => t.id !== track.id)
                                    setSelectedPlaylist({
                                      ...selectedPlaylist,
                                      tracks,
                                    })
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSavePlaylist}>Зберегти</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

