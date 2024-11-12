'use client'

import React, { useState, useEffect } from 'react'
import { useTareas } from '@/hooks/useTareas'
import { Tarea } from '@/models/tarea.model'
import { Search, Loader2 } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import TaskFilter from '@/components/task/taskFilter'
import AddTaskButton from '@/components/task/addTaskButton'
import TaskCard from '@/components/task/taskCard'
import TaskForm from '@/components/task/taskForm'

export default function TaskPage() {
  const { tareas, loading, error, agregarTarea, modificarTarea, borrarTarea } = useTareas()
  const [nuevaTarea, setNuevaTarea] = useState<Tarea>({ titulo: '', descripcion: '', fecha_vencimiento: '', estado: 'pendiente' })
  const [editandoTarea, setEditandoTarea] = useState<Tarea | null>(null)
  const [filtro, setFiltro] = useState<'todas' | 'pendiente' | 'completada'>('todas')
  const [dialogoEdicionAbierto, setDialogoEdicionAbierto] = useState(false)
  const [dialogoCreacionAbierto, setDialogoCreacionAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [tareasFiltradas, setTareasFiltradas] = useState<Tarea[]>([])

  useEffect(() => {
    const filtrarTareas = () => {
      return tareas.filter(tarea => 
        (filtro === 'todas' || tarea.estado === filtro) &&
        (tarea.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
         tarea.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
      )
    }
    setTareasFiltradas(filtrarTareas())
  }, [tareas, filtro, busqueda])

  const handleSubmitNueva = async (tarea: Tarea) => {
    await agregarTarea(tarea)
    setDialogoCreacionAbierto(false)
  }

  const handleSubmitEdicion = async (tarea: Tarea) => {
    await modificarTarea(tarea.id!, tarea)
    setEditandoTarea(null)
    setDialogoEdicionAbierto(false)
  }

  const handleEdit = (tarea: Tarea) => {
    setEditandoTarea(tarea)
    setDialogoEdicionAbierto(true)
  }

  const handleDelete = async (id: string) => {
    await borrarTarea(id)
  }

  const handleEstadoChange = async (id: string, nuevoEstado: 'pendiente' | 'completada') => {
    await modificarTarea(id, { estado: nuevoEstado })
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestor de Tareas</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <Search className="mr-2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full md:w-64 p-2 border rounded"
          />
        </div>
        <div className="flex items-center w-full md:w-auto gap-4">
          <TaskFilter onFilterChange={setFiltro} />
          <AddTaskButton onOpenDialog={() => setDialogoCreacionAbierto(true)} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">
          {error}
        </div>
      ) : tareasFiltradas.length === 0 ? (
        <div className="text-center text-gray-500 p-8 rounded-md">
          No se encontraron tareas. ¡Agrega una nueva tarea para comenzar!
        </div>
      ) : (
        <ScrollArea className="h-[calc(120vh-250px)] rounded-md border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
            {tareasFiltradas.map(tarea => (
              <TaskCard
                key={tarea.id}
                tarea={tarea}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onEstadoChange={handleEstadoChange}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <TaskForm
        tarea={editandoTarea || nuevaTarea}
        open={dialogoCreacionAbierto || dialogoEdicionAbierto}
        onOpenChange={(open: any) => {
          if (!open) {
            setDialogoCreacionAbierto(false)
            setDialogoEdicionAbierto(false)
            setEditandoTarea(null)
          }
        }}
        onSubmit={editandoTarea ? handleSubmitEdicion : handleSubmitNueva}
        title={editandoTarea ? "Editar Tarea" : "Agregar Nueva Tarea"}
        submitText={editandoTarea ? "Actualizar Tarea" : "Agregar Tarea"}
      />
    </div>
  )
}