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
      completed INTEGER DEFAULT 1,
      description TEXT,
      due_date TEXT,
      created_at TEXT,
      FOREIGN KEY (completed) REFERENCES status(id)
    );
  `);

  // Insertar estados iniciales si no existen
  await db.execAsync(`
    INSERT OR IGNORE INTO status (id, name) VALUES
      (1, 'Pendiente'),
      (2, 'En proceso'),
      (3, 'Completado');
  `);
}
