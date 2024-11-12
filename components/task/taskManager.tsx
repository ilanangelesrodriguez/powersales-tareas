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
import { CalendarIcon, Pencil, Trash2, Plus, Search, Loader2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestor de Tareas</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
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
              <Card key={tarea.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                    onClick={() => handleEstadoChange(tarea.id!, tarea.estado === 'completada' ? 'pendiente' : 'completada')}
                  >
                    {tarea.estado === 'completada' ? 'Completada' : 'Pendiente'}
                  </Badge>
                  <div>
                    <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleEdit(tarea)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(tarea.id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

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