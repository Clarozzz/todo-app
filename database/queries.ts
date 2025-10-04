import { SQLiteDatabase } from "expo-sqlite";
import { Todo } from "../types/object-types";

export async function getTodos(db: SQLiteDatabase): Promise<Todo[]> {
  const result = await db.getAllAsync(`
    SELECT 
      todos.id,
      todos.title,
      status.name AS completed,
      todos.description,
      todos.due_date
    FROM todos
    JOIN status ON todos.completed = status.id
    ORDER BY todos.due_date ASC
  `);

  return result as Todo[];
}

export async function addTodo(db: SQLiteDatabase, title: string, due_date: string, description: string) {
  await db.runAsync(
    `INSERT INTO todos
      (title, due_date, description)
      VALUES (?, ?, ?)`,
    title, due_date, description
  )
}