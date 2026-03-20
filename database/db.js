// database/db.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('spending.db');
let dbAsyncPromise = null;

export const getDb = async () => {
  if (!dbAsyncPromise) {
    dbAsyncPromise = SQLite.openDatabaseAsync('spending.db');
  }
  return dbAsyncPromise;
};

// Khởi tạo các bảng khi app mở lần đầu
export const initDatabase = () => {
    db.execSync(`
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

  db.execSync(`
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

// Thêm giao dịch mới
export const addTransaction = (amount, type, category, note, date) => {
  return db.runSync(
    'INSERT INTO transactions (amount, type, category, note, date) VALUES (?, ?, ?, ?, ?)',
    [amount, type, category, note, date]
  );
};

// Lấy tất cả giao dịch, mới nhất lên trước
export const getTransactions = () => {
  return db.getAllSync(
    'SELECT * FROM transactions ORDER BY date DESC, created_at DESC'
  );
};

// Lấy giao dịch theo tháng (vd: "2026-03")
export const getTransactionsByMonth = (monthStr) => {
  return db.getAllSync(
    "SELECT * FROM transactions WHERE strftime('%Y-%m', date) = ? ORDER BY date DESC",
    [monthStr]
  );
};

// Lấy tất cả khoản nợ
export const getDebts = () => {
  return db.getAllSync('SELECT * FROM debts ORDER BY created_at DESC');
};

// Thêm khoản nợ mới
export const addDebt = (name, totalAmount, dueDate) => {
  return db.runSync(
    'INSERT INTO debts (name, total_amount, remaining_amount, due_date) VALUES (?, ?, ?, ?)',
    [name, totalAmount, totalAmount, dueDate]
  );
};

// Cập nhật số tiền còn lại của khoản nợ
export const updateDebtRemaining = (id, remainingAmount) => {
  return db.runSync(
    'UPDATE debts SET remaining_amount = ? WHERE id = ?',
    [remainingAmount, id]
  );
};

export const updateTransaction = async (id, amount, type, category, note, date) => {
  const database = await getDb();
  return await database.runAsync(
    'UPDATE transactions SET amount = ?, type = ?, category = ?, note = ?, date = ? WHERE id = ?',
    [amount, type, category, note, date, id]
  );
};

export const deleteTransaction = async (id) => {
  const database = await getDb();
  return await database.runAsync(
    'DELETE FROM transactions WHERE id = ?',
    [id]
  );
};

export default db;