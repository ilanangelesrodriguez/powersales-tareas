import { Tarea } from '@/models/tarea.model'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Pencil, Trash2 } from 'lucide-react'

type TaskCardProps = {
  tarea: Tarea
  onEdit: (tarea: Tarea) => void
  onDelete: (id: string) => void
  onEstadoChange: (id: string, nuevoEstado: 'pendiente' | 'completada') => void
}

export default function TaskCard({ tarea, onEdit, onDelete, onEstadoChange }: TaskCardProps) {
  return (
    <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{tarea.titulo}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-2">{tarea.descripcion}</p>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <CalendarIcon className="mr-1" size={14} />
          {tarea.fecha_vencimiento}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge 
          variant={tarea.estado === 'completada' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => onEstadoChange(tarea.id!, tarea.estado === 'completada' ? 'pendiente' : 'completada')}
        >
          {tarea.estado === 'completada' ? 'Completada' : 'Pendiente'}
        </Badge>
        <div>
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => onEdit(tarea)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => onDelete(tarea.id!)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}