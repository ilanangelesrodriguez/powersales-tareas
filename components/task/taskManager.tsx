"use client"

import React, { useState, useEffect } from 'react'
import { useTareas } from '@/hooks/useTareas'
import { Tarea } from '@/models/tarea.model'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Pencil, Trash2, Plus, Search } from 'lucide-react'

export default function TaskManager() {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editandoTarea) {
      setEditandoTarea({ ...editandoTarea, [name]: value })
    } else {
      setNuevaTarea({ ...nuevaTarea, [name]: value })
    }
  }

  const handleSubmitNueva = async (e: React.FormEvent) => {
    e.preventDefault()
    await agregarTarea(nuevaTarea)
    setNuevaTarea({ titulo: '', descripcion: '', fecha_vencimiento: '', estado: 'pendiente' })
    setDialogoCreacionAbierto(false)
  }

  const handleSubmitEdicion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editandoTarea) {
      await modificarTarea(editandoTarea.id!, editandoTarea)
      setEditandoTarea(null)
      setDialogoEdicionAbierto(false)
    }
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestor de Tareas</h1>
      
      {loading && <p className="text-gray-600">Cargando tareas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <Search className="mr-2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar tareas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
        <div className="flex items-center w-full md:w-auto gap-4">
          <Select onValueChange={(value: 'todas' | 'pendiente' | 'completada') => setFiltro(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="completada">Completadas</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={dialogoCreacionAbierto} onOpenChange={setDialogoCreacionAbierto}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Agregar Nueva Tarea</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Tarea</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitNueva}>
                <div className="grid gap-4 py-4">
                  <Input
                    name="titulo"
                    value={nuevaTarea.titulo}
                    onChange={handleInputChange}
                    placeholder="Título"
                    required
                  />
                  <Textarea
                    name="descripcion"
                    value={nuevaTarea.descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripción"
                    required
                  />
                  <Input
                    type="date"
                    name="fecha_vencimiento"
                    value={nuevaTarea.fecha_vencimiento}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Agregar Tarea</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {tareasFiltradas.map(tarea => (
          <Card key={tarea.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tarea.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{tarea.descripcion}</p>
              <p className="text-sm text-gray-500 mt-2">
                <CalendarIcon className="inline mr-1" size={16} />
                {tarea.fecha_vencimiento}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Select 
                defaultValue={tarea.estado} 
                onValueChange={(value: 'pendiente' | 'completada') => handleEstadoChange(tarea.id!, value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <Button variant="outline" size="icon" className="mr-2" onClick={() => handleEdit(tarea)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(tarea.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={dialogoEdicionAbierto} onOpenChange={setDialogoEdicionAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdicion}>
            <div className="grid gap-4 py-4">
              <Input
                name="titulo"
                value={editandoTarea?.titulo || ''}
                onChange={handleInputChange}
                placeholder="Título"
                required
              />
              <Textarea
                name="descripcion"
                value={editandoTarea?.descripcion || ''}
                onChange={handleInputChange}
                placeholder="Descripción"
                required
              />
              <Input
                type="date"
                name="fecha_vencimiento"
                value={editandoTarea?.fecha_vencimiento || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">Actualizar Tarea</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}