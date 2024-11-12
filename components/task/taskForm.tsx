import { Tarea } from '@/models/tarea.model'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from 'react'

type TaskFormProps = {
  tarea: Tarea
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (tarea: Tarea) => void
  title: string
  submitText: string
}

export default function TaskForm({ tarea, open, onOpenChange, onSubmit, title, submitText }: TaskFormProps) {
  const [formTarea, setFormTarea] = useState<Tarea>(tarea)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formTarea)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormTarea({ ...formTarea, [name]: value })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              name="titulo"
              value={formTarea.titulo}
              onChange={handleInputChange}
              placeholder="Título"
              required
            />
            <Textarea
              name="descripcion"
              value={formTarea.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción"
              required
            />
            <Input
              type="date"
              name="fecha_vencimiento"
              value={formTarea.fecha_vencimiento}
              onChange={handleInputChange}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">{submitText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}