import type React from "react"
import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { GripVertical, Edit } from "lucide-react"
import styles from "./Schedule.module.scss"

interface Program {
  id: string
  title: string
  startTime: string
  duration: number
  host: string
  description: string
}

interface ScheduleProps {
  initialPrograms: Program[]
  onSave: (programs: Program[]) => void
}

export const Schedule: React.FC<ScheduleProps> = ({ initialPrograms, onSave }) => {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(programs)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setPrograms(items)
    onSave(items)
  }

  const handleEdit = (program: Program) => {
    setEditingProgram(program)
  }

  const handleSaveEdit = (updatedProgram: Program) => {
    const updatedPrograms = programs.map((p) => (p.id === updatedProgram.id ? updatedProgram : p))
    setPrograms(updatedPrograms)
    onSave(updatedPrograms)
    setEditingProgram(null)
  }

  return (
    <div className={styles.schedule}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="programs">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className={styles.programsList}>
              {programs.map((program, index) => (
                <Draggable key={program.id} draggableId={program.id} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} className={styles.programCard}>
                      <div {...provided.dragHandleProps} className={styles.dragHandle}>
                        <GripVertical size={20} />
                      </div>
                      <div className={styles.programInfo}>
                        <span className={styles.time}>{program.startTime}</span>
                        <h3>{program.title}</h3>
                        <p className={styles.host}>{program.host}</p>
                      </div>
                      <div className={styles.actions}>
                        <Button onClick={() => handleEdit(program)} variant="outline" size="sm">
                          <Edit size={16} className="mr-2" />
                          Редагувати
                        </Button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={!!editingProgram} onOpenChange={() => setEditingProgram(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагування програми</DialogTitle>
          </DialogHeader>
          {editingProgram && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveEdit(editingProgram)
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Назва</Label>
                  <Input
                    id="title"
                    value={editingProgram.title}
                    onChange={(e) =>
                      setEditingProgram({
                        ...editingProgram,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Час початку</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={editingProgram.startTime}
                    onChange={(e) =>
                      setEditingProgram({
                        ...editingProgram,
                        startTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Тривалість (хв)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={editingProgram.duration}
                    onChange={(e) =>
                      setEditingProgram({
                        ...editingProgram,
                        duration: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="host">Ведучий</Label>
                  <Input
                    id="host"
                    value={editingProgram.host}
                    onChange={(e) =>
                      setEditingProgram({
                        ...editingProgram,
                        host: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Опис</Label>
                  <Textarea
                    id="description"
                    value={editingProgram.description}
                    onChange={(e) =>
                      setEditingProgram({
                        ...editingProgram,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit" className={styles.saveButton}>
                  Зберегти
                </Button>
                <Button type="button" onClick={() => setEditingProgram(null)} variant="outline">
                  Скасувати
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

