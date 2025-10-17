import axios from 'axios';
import type { FormSchema, CreateFormSchemaDto, UpdateFormSchemaDto } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const formSchemaApi = {
  getAll: async (): Promise<FormSchema[]> => {
    const response = await apiClient.get<FormSchema[]>('/FormSchemas');
    return response.data;
  },

  getById: async (id: number): Promise<FormSchema> => {
    const response = await apiClient.get<FormSchema>(`/FormSchemas/${id}`);
    return response.data;
  },

  create: async (dto: CreateFormSchemaDto): Promise<FormSchema> => {
    const response = await apiClient.post<FormSchema>('/FormSchemas', dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateFormSchemaDto): Promise<void> => {
    await apiClient.put(`/FormSchemas/${id}`, dto);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/FormSchemas/${id}`);
  },

  exportSchemas: async (ids: number[]): Promise<FormSchema[]> => {
    const response = await apiClient.post<FormSchema[]>('/FormSchemas/export', ids);
    return response.data;
  },

  importSchemas: async (schemas: CreateFormSchemaDto[]): Promise<FormSchema[]> => {
    const response = await apiClient.post<FormSchema[]>('/FormSchemas/import', schemas);
    return response.data;
  },
};
