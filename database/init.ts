import { SQLiteDatabase } from "expo-sqlite";

export async function initDB(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS status (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL,
      description TEXT,
      due_date TEXT,
      FOREIGN KEY (completed) REFERENCES status(id)
    );
  `);
}

