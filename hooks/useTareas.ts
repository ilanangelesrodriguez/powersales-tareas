"use client"

import { useState, useEffect } from 'react';
import { Tarea } from '@/models/tarea.model';
import { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea } from '../services/tareaService';

export const useTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const data = await obtenerTareas();
        setTareas(data);
      } catch (err) {
        setError('Error al obtener las tareas');
      } finally {
        setLoading(false);
      }
    };

    fetchTareas();
  }, []);

  const agregarTarea = async (tarea: Tarea) => {
    try {
      const nuevaTarea = await crearTarea(tarea);
      setTareas([...tareas, nuevaTarea]);
    } catch (err) {
      setError('Error al crear la tarea');
    }
  };

  const modificarTarea = async (id: string, tarea: Partial<Tarea>) => {
    try {
      const tareaActualizada = await actualizarTarea(id, tarea);
      setTareas(tareas.map(t => (t.id === id ? tareaActualizada : t)));
    } catch (err) {
      setError('Error al actualizar la tarea');
    }
  };

  const borrarTarea = async (id: string) => {
    try {
      await eliminarTarea(id);
      setTareas(tareas.filter(t => t.id !== id));
    } catch (err) {
      setError('Error al eliminar la tarea');
    }
  };

  return { tareas, loading, error, agregarTarea, modificarTarea, borrarTarea };
};