import { Tarea } from '@/models/tarea.model'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type TaskFormProps = {
  tarea: Tarea
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (tarea: Tarea) => void
  title: string
  submitText: string
}

export default function TaskForm({ tarea, open, onOpenChange, onSubmit, title, submitText }: TaskFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(tarea)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onSubmit({ ...tarea, [name]: value })
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
              value={tarea.titulo}
              onChange={handleInputChange}
              placeholder="Título"
              required
            />
            <Textarea
              name="descripcion"
              value={tarea.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción"
              required
            />
            <Input
              type="date"
              name="fecha_vencimiento"
              value={tarea.fecha_vencimiento}
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