import { create } from "zustand";
import * as supabaseDb from "../database/supabaseDb";
import { isSupabaseConfigured } from "../lib/supabase";

const useStore = create((set, get) => ({
  transactions: [],
  debts: [],
  budgetsMonth: [],

  currentMonth: new Date().toISOString().slice(0, 7),

  clearLocalData: () =>
    set({ transactions: [], debts: [], budgetsMonth: [] }),

  loadTransactions: async () => {
    if (!isSupabaseConfigured) return;
    const data = await supabaseDb.fetchTransactions();
    set({ transactions: data });
  },

  loadDebts: async () => {
    if (!isSupabaseConfigured) return;
    const data = await supabaseDb.fetchDebts();
    set({ debts: data });
  },

  loadBudgetsForMonth: async (month) => {
    if (!isSupabaseConfigured) return;
    const data = await supabaseDb.fetchBudgetsForMonth(month);
    set({ budgetsMonth: data, currentMonth: month });
  },

  addTransaction: async (amount, type, category, note, date) => {
    await supabaseDb.addTransaction(amount, type, category, note, date);
    await get().loadTransactions();
  },

  addDebt: async (name, totalAmount, dueDate) => {
    await supabaseDb.addDebt(name, totalAmount, dueDate);
    await get().loadDebts();
  },

  updateDebtRemaining: async (id, remainingAmount) => {
    await supabaseDb.updateDebtRemaining(id, remainingAmount);
    await get().loadDebts();
  },

  saveBudget: async (category, amount, month) => {
    await supabaseDb.upsertBudget(category, amount, month);
    await get().loadBudgetsForMonth(month);
  },

  deleteBudget: async (category, month) => {
    await supabaseDb.deleteBudgetRow(category, month);
    await get().loadBudgetsForMonth(month);
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
