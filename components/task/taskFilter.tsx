import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TaskFilterProps = {
  onFilterChange: (value: 'todas' | 'pendiente' | 'completada') => void
}

export default function TaskFilter({ onFilterChange }: TaskFilterProps) {
  return (
    <Select onValueChange={onFilterChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar por estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todas">Todas</SelectItem>
        <SelectItem value="pendiente">Pendientes</SelectItem>
        <SelectItem value="completada">Completadas</SelectItem>
      </SelectContent>
    </Select>
  )
}