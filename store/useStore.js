// store/useStore.js
import { create } from 'zustand';
import {
  getTransactions,
  addTransaction,
  getDebts,
  addDebt,
  updateDebtRemaining,
} from '../database/db';

const useStore = create((set, get) => ({
  transactions: [],
  debts: [],
  currentMonth: new Date().toISOString().slice(0, 7),

  loadTransactions: async () => {
    const data = await getTransactions();
    set({ transactions: data });
  },

  loadDebts: async () => {
    const data = await getDebts();
    set({ debts: data });
  },

  addTransaction: async (amount, type, category, note, date) => {
    await addTransaction(amount, type, category, note, date);
    await get().loadTransactions();
  },

  addDebt: async (name, totalAmount, dueDate) => {
    await addDebt(name, totalAmount, dueDate);
    await get().loadDebts();
  },

  updateDebtRemaining: async (id, remainingAmount) => {
    await updateDebtRemaining(id, remainingAmount);
    await get().loadDebts();
  },

  getMonthlySummary: () => {
    const { currentMonth, transactions } = get();
    const monthTx = transactions.filter(tx =>
      tx.date.startsWith(currentMonth)
    );
    const income = monthTx
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expense = monthTx
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { income, expense, balance: income - expense };
  },
}));

export default useStore;