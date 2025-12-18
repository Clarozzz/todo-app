import s from '../style'

export function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getBoxStyle: Record<string, object> = {
  'Completado': s.todoCompleted,
  'En proceso': s.todoInProgress,
}

export const statusOptions = [
  { label: 'Pendiente', value: 1 },
  { label: 'En proceso', value: 2 },
  { label: 'Completado', value: 3 },
];
