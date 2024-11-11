import api from '../config/api';
import { Tarea } from '../models/tarea.model';

export const obtenerTareas = async (): Promise<Tarea[]> => {
    try {
        const response = await api.get('/tareas');
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo tareas:', error);
        throw error;
    }
};

export const obtenerTareaPorId = async (id: string): Promise<Tarea> => {
    try {
        const response = await api.get(`/tareas/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo tarea con id ${id}:`, error);
        throw error;
    }
};

export const crearTarea = async (tarea: Tarea): Promise<Tarea> => {
    try {
        const response = await api.post('/tareas', tarea);
        console.log(response);
        return response.data;
        
    } catch (error) {
        console.error('Error creando tarea:', error);
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
