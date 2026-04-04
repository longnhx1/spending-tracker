// database/db.native.js — SQLite on iOS / Android
import * as SQLite from "expo-sqlite";

let db = null;

export const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("spending.db");
  }
  return db;
};

export const initDatabase = async () => {
  const database = await getDb();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      note TEXT,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      total_amount REAL NOT NULL,
      remaining_amount REAL NOT NULL,
      due_date TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
};

export const addTransaction = async (amount, type, category, note, date) => {
  const database = await getDb();
  return await database.runAsync(
    "INSERT INTO transactions (amount, type, category, note, date) VALUES (?, ?, ?, ?, ?)",
    [amount, type, category, note, date],
  );
};

export const getTransactions = async () => {
  const database = await getDb();
  return await database.getAllAsync(
    "SELECT * FROM transactions ORDER BY date DESC, created_at DESC",
  );
};

export const getTransactionsByMonth = async (monthStr) => {
  const database = await getDb();
  return await database.getAllAsync(
    "SELECT * FROM transactions WHERE strftime('%Y-%m', date) = ? ORDER BY date DESC",
    [monthStr],
  );
};

export const getDebts = async () => {
  const database = await getDb();
  return await database.getAllAsync(
    "SELECT * FROM debts ORDER BY created_at DESC",
  );
};

export const addDebt = async (name, totalAmount, dueDate) => {
  const database = await getDb();
  return await database.runAsync(
    "INSERT INTO debts (name, total_amount, remaining_amount, due_date) VALUES (?, ?, ?, ?)",
    [name, totalAmount, totalAmount, dueDate],
  );
};

export const updateDebtRemaining = async (id, remainingAmount) => {
  const database = await getDb();
  return await database.runAsync(
    "UPDATE debts SET remaining_amount = ? WHERE id = ?",
    [remainingAmount, id],
  );
};

/** All budget rows for one-time cloud migration (table may not exist yet). */
export const getLocalBudgetsAll = async () => {
  try {
    const database = await getDb();
    return (await database.getAllAsync("SELECT * FROM budgets")) ?? [];
  } catch {
    return [];
  }
};
