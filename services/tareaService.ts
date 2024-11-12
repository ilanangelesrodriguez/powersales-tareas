import api from '../config/api';
import { Tarea } from '../models/tarea.model';

export const obtenerTareas = async (): Promise<Tarea[]> => {
    try {
        const response = await api.get('/tareas');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const obtenerTareaPorId = async (id: string): Promise<Tarea> => {
    try {
        const response = await api.get(`/tareas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const crearTarea = async (tarea: Tarea): Promise<Tarea> => {
    try {
        const response = await api.post('/tareas', tarea);
        return response.data;
        
    } catch (error) {
        throw error;
    }
};

export const actualizarTarea = async (id: string, tarea: Partial<Tarea>): Promise<Tarea> => {
    try {
        const response = await api.put(`/tareas/${id}`, tarea);
        return response.data;
    } catch (error) {
        console.error(`Error actualizando tarea con id ${id}:`, error);
        throw error;
    }
};

export const eliminarTarea = async (id: string): Promise<void> => {
    try {
        await api.delete(`/tareas/${id}`);
    } catch (error) {
        console.error(`Error eliminando tarea con id ${id}:`, error);
        throw error;
    }
};
