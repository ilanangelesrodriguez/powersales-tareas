import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

type AddTaskButtonProps = {
  onOpenDialog: () => void
}

export default function AddTaskButton({ onOpenDialog }: AddTaskButtonProps) {
  return (
    <Button onClick={onOpenDialog}>
      <Plus className="mr-2 h-4 w-4" /> Agregar Nueva Tarea
    </Button>
  )
}