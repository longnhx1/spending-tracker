import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getDebts,
  getLocalBudgetsAll,
  getTransactions,
} from "../database/db";
import * as supabaseDb from "../database/supabaseDb";
import { isSupabaseConfigured } from "./supabase";

function migrationKey(userId) {
  return `sqlite_migrated_v1_${userId}`;
}

export async function migrateLocalToCloud(userId) {
  if (!isSupabaseConfigured || !userId) return;

  const key = migrationKey(userId);
  const done = await AsyncStorage.getItem(key);
  if (done) return;

  let remoteCount;
  try {
    remoteCount = await supabaseDb.countTransactions();
  } catch {
    return;
  }

  if (remoteCount > 0) {
    await AsyncStorage.setItem(key, "1");
    return;
  }

  const localTx = await getTransactions();
  if (localTx.length === 0) {
    await AsyncStorage.setItem(key, "1");
    return;
  }

  try {
    await supabaseDb.insertTransactionsMigratedBatch(
      localTx.map((tx) => ({
        amount: tx.amount,
        type: tx.type,
        category: tx.category,
        note: tx.note,
        date: tx.date,
        created_at: tx.created_at,
      })),
    );

    const localDebts = await getDebts();
    await supabaseDb.insertDebtsMigratedBatch(
      localDebts.map((d) => ({
        name: d.name,
        total_amount: d.total_amount,
        remaining_amount: d.remaining_amount,
        due_date: d.due_date,
        created_at: d.created_at,
      })),
    );

    const localBudgets = await getLocalBudgetsAll();
    await supabaseDb.insertBudgetsMigratedBatch(
      localBudgets.map((b) => ({
        category: b.category,
        amount: b.amount,
        month: b.month,
      })),
    );

    await AsyncStorage.setItem(key, "1");
  } catch {
    // Không gắn cờ để lần sau thử lại (ví dụ mất mạng giữa chừng).
  }
}
