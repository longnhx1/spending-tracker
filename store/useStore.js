// store/useStore.js — UI theme + SQLite; khi đăng nhập Supabase dùng cloud cho giao dịch & nợ.
import { create } from "zustand";
import { DARK, LIGHT } from "../constants/theme";
import {
  getTransactions,
  addTransaction as sqliteAddTransaction,
  getDebts,
  addDebt as sqliteAddDebt,
  updateDebtRemaining as sqliteUpdateDebtRemaining,
  updateDebtDetails as sqliteUpdateDebtDetails,
  deleteDebtRow as sqliteDeleteDebtRow,
  updateTransaction as sqliteUpdateTransaction,
  deleteTransaction as sqliteDeleteTransaction,
  getCategories,
  upsertCategory,
  deleteCategory,
} from "../database/db";
import * as supabaseDb from "../database/supabaseDb";
import { isSupabaseConfigured } from "../lib/supabase";

const useStore = create((set, get) => ({
  cloudSyncEnabled: false,
  setCloudSyncEnabled: (enabled) => set({ cloudSyncEnabled: Boolean(enabled) }),

  isDark: true,
  colors: DARK,

  toggleTheme: () => {
    const next = !get().isDark;
    set({ isDark: next, colors: next ? DARK : LIGHT });
  },

  /** Đặt chế độ tối/sáng tường minh (vd. Switch: sáng = false). */
  setThemeIsDark: (next) => {
    const dark = Boolean(next);
    set({ isDark: dark, colors: dark ? DARK : LIGHT });
  },

  transactions: [],
  debts: [],
  categories: [],
  goals: [],
  currentMonth: new Date().toISOString().slice(0, 7),

  clearLocalData: () =>
    set({ transactions: [], debts: [], goals: [] }),

  loadTransactions: async () => {
    if (get().cloudSyncEnabled && isSupabaseConfigured) {
      const data = await supabaseDb.fetchTransactions();
      set({ transactions: data });
      return;
    }
    const data = getTransactions();
    set({ transactions: data });
  },

  loadDebts: async () => {
    if (get().cloudSyncEnabled && isSupabaseConfigured) {
      const data = await supabaseDb.fetchDebts();
      set({ debts: data });
      return;
    }
    const data = getDebts();
    set({ debts: data });
  },

  loadCategories: () => {
    const data = getCategories();
    set({ categories: data });
  },

  addTransaction: async (amount, type, category, note, date) => {
    if (get().cloudSyncEnabled && isSupabaseConfigured) {
      await supabaseDb.addTransaction(amount, type, category, note, date);
    } else {
      sqliteAddTransaction(amount, type, category, note, date);
    }
    await get().loadTransactions();
  },

  addDebt: async (name, totalAmount, dueDate) => {
    if (get().cloudSyncEnabled && isSupabaseConfigured) {
      await supabaseDb.addDebt(name, totalAmount, dueDate);
    } else {
      sqliteAddDebt(name, totalAmount, dueDate);
    }
    await get().loadDebts();
  },

  updateDebtRemaining: async (id, remainingAmount) => {
    if (get().cloudSyncEnabled && isSupabaseConfigured) {
      await supabaseDb.updateDebtRemaining(id, remainingAmount);
    } else {
      sqliteUpdateDebtRemaining(id, remainingAmount);
    }
    await get().loadDebts();
  },

  updateDebtDetails: async (id, name, totalAmount, dueDate) => {
    if (get().cloudSyncEnabled && isSupabaseConfigured) {
      await supabaseDb.updateDebtDetails(id, name, totalAmount, dueDate);
    } else {
      await sqliteUpdateDebtDetails(id, name, totalAmount, dueDate);
    }
    await get().loadDebts();
  },

  deleteDebt: async (id) => {
    if (get().cloudSyncEnabled && isSupabaseConfigured) {
      await supabaseDb.deleteDebtRow(id);
    } else {
      await sqliteDeleteDebtRow(id);
    }
    await get().loadDebts();
  },

  updateTransaction: async (id, amount, type, category, note, date) => {
    if (get().cloudSyncEnabled && isSupabaseConfigured) {
      await supabaseDb.updateTransaction(
        id,
        amount,
        type,
        category,
        note,
        date,
      );
    } else {
      await sqliteUpdateTransaction(id, amount, type, category, note, date);
    }
    await get().loadTransactions();
  },

  deleteTransaction: async (id) => {
    if (get().cloudSyncEnabled && isSupabaseConfigured) {
      await supabaseDb.deleteTransaction(id);
    } else {
      await sqliteDeleteTransaction(id);
    }
    await get().loadTransactions();
  },

  addCategory: (id, label, emoji) => {
    upsertCategory(id, label, emoji);
    get().loadCategories();
  },

  updateCategory: (id, label, emoji) => {
    upsertCategory(id, label, emoji);
    get().loadCategories();
  },

  deleteCategory: (id) => {
    deleteCategory(id);
    get().loadCategories();
  },

  addGoal: (title, targetAmount, savedAmount = 0, note = "") => {
    const cleanTitle = String(title || "").trim();
    const target = Number(targetAmount) || 0;
    const saved = Number(savedAmount) || 0;
    if (!cleanTitle || target <= 0) return;

    const newGoal = {
      id: `goal_${Date.now()}`,
      title: cleanTitle,
      targetAmount: target,
      savedAmount: Math.max(0, Math.min(saved, target)),
      note: String(note || "").trim(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ goals: [newGoal, ...state.goals] }));
  },

  updateGoal: (id, patch) => {
    set((state) => ({
      goals: state.goals.map((goal) => {
        if (goal.id !== id) return goal;
        const next = { ...goal, ...patch };
        const target = Number(next.targetAmount) || 0;
        const saved = Number(next.savedAmount) || 0;
        return {
          ...next,
          targetAmount: target,
          savedAmount: target > 0 ? Math.max(0, Math.min(saved, target)) : 0,
        };
      }),
    }));
  },

  deleteGoal: (id) => {
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
    }));
  },

  addGoalProgress: (id, amount) => {
    const delta = Number(amount) || 0;
    if (delta <= 0) return;
    set((state) => ({
      goals: state.goals.map((goal) => {
        if (goal.id !== id) return goal;
        const nextSaved = Math.min(
          goal.targetAmount,
          goal.savedAmount + delta,
        );
        return { ...goal, savedAmount: nextSaved };
      }),
    }));
  },

  getMonthlySummary: () => {
    const { currentMonth, transactions } = get();
    const monthTx = transactions.filter((tx) =>
      tx.date.startsWith(currentMonth),
    );

    const income = monthTx
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expense = monthTx
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return { income, expense, balance: income - expense };
  },
}));

export default useStore;
