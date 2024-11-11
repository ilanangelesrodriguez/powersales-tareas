"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, CheckCircle, Circle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  const addTask = () => {
    if (newTask.title.trim() !== '') {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }])
      setNewTask({ title: '', description: '', dueDate: '' })
    }
  }

  const updateTask = () => {
    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? editingTask : task))
      setEditingTask(null)
    }
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-8 py-12 px-4 max-w-4xl mx-auto"
    >
      <motion.h1 
        className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        Gestión de Tareas
      </motion.h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus size={20} />
            Agregar Tarea
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Tarea</DialogTitle>
            <DialogDescription>Ingresa los detalles de la nueva tarea aquí.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Título</Label>
              <Input 
                id="title" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descripción</Label>
              <Textarea 
                id="description" 
                value={newTask.description}
                onChange={(e: { target: { value: any } }) => setNewTask({...newTask, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">Fecha de vencimiento</Label>
              <Input 
                id="dueDate" 
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addTask}>Agregar Tarea</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex gap-4 mb-4">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Todas</Button>
        <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>Completadas</Button>
        <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>Pendientes</Button>
      </div>

      <motion.div 
        className="grid gap-4 w-full md:grid-cols-2 lg:grid-cols-3"
        variants={{
          hidden: { opacity: 1, scale: 0 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              delayChildren: 0.3,
              staggerChildren: 0.2
            }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        {filteredTasks.map((task) => (
          <motion.div key={task.id} variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1
            }
          }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                  <Button variant="ghost" size="icon" onClick={() => toggleTaskCompletion(task.id)}>
                    {task.completed ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </Button>
                </CardTitle>
                {task.dueDate && (
                  <CardDescription>Vence: {new Date(task.dueDate).toLocaleDateString()}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p>{task.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Tarea</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-title" className="text-right">Título</Label>
                        <Input
                          id="edit-title"
                          value={editingTask?.title || ''}
                          onChange={(e) => setEditingTask(editingTask ? {...editingTask, title: e.target.value} : null)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-description" className="text-right">Descripción</Label>
                        <Textarea
                          id="edit-description"
                          value={editingTask?.description || ''}
                          onChange={(e: { target: { value: any } }) => setEditingTask(editingTask ? {...editingTask, description: e.target.value} : null)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-dueDate" className="text-right">Fecha de vencimiento</Label>
                        <Input
                          id="edit-dueDate"
                          type="date"
                          value={editingTask?.dueDate || ''}
                          onChange={(e) => setEditingTask(editingTask ? {...editingTask, dueDate: e.target.value} : null)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={updateTask}>Guardar Cambios</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="icon" onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}