// store/useStore.js
import { create } from 'zustand';
import { DARK, LIGHT } from '../constants/theme';
import {
    getTransactions,
    addTransaction,
    getDebts,
    addDebt,
    updateDebtRemaining,
    getTransactionsByMonth,
    updateTransaction,
    deleteTransaction,
    getCategories,
    upsertCategory,
    deleteCategory,
} from '../database/db';

const useStore = create((set, get) => ({
    // ── Theme ──────────────────────────────────────────
    isDark: true,
    colors: DARK,

    toggleTheme: () => {
        const next = !get().isDark;
        set({ isDark: next, colors: next ? DARK : LIGHT });
    },

    // State
    transactions: [],
    debts: [],
    categories: [],
    currentMonth: new Date().toISOString().slice(0, 7), // "2026-03"

    // Load dữ liệu từ database
    loadTransactions: () => {
        const data = getTransactions();
        set({ transactions: data });
    },

    loadDebts: () => {
        const data = getDebts();
        set({ debts: data });
    },

    loadCategories: () => {
        const data = getCategories();
        set({ categories: data });
    },

    // Thêm giao dịch mới
    addTransaction: (amount, type, category, note, date) => {
        addTransaction(amount, type, category, note, date);
        get().loadTransactions(); // Reload lại list
    },

    // Thêm khoản nợ
    addDebt: (name, totalAmount, dueDate) => {
        addDebt(name, totalAmount, dueDate);
        get().loadDebts();
    },

    // Cập nhật nợ
    updateDebtRemaining: (id, remainingAmount) => {
        updateDebtRemaining(id, remainingAmount);
        get().loadDebts();
    },

    updateTransaction: async (id, amount, type, category, note, date) => {
        await updateTransaction(id, amount, type, category, note, date);
        await get().loadTransactions();
    },

    deleteTransaction: async (id) => {
        await deleteTransaction(id);
        await get().loadTransactions();
    },

    // ── Categories (danh mục chi tiêu) ─────────────────────────
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

    // Tính tổng thu/chi trong tháng hiện tại
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