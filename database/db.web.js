// database/db.web.js — no expo-sqlite on web (WASM bundle not shipped; app uses Supabase on web).

const notSupported = () => {
  throw new Error(
    "SQLite không dùng trên web. Dữ liệu được lưu qua Supabase khi đã đăng nhập.",
  );
};

export const getDb = async () => {
  notSupported();
};

export const initDatabase = async () => {};

export const addTransaction = async () => {
  notSupported();
};

export const getTransactions = async () => [];

export const getTransactionsByMonth = async () => [];

export const getDebts = async () => [];

export const addDebt = async () => {
  notSupported();
};

export const updateDebtRemaining = async () => {
  notSupported();
};

export const getLocalBudgetsAll = async () => [];
