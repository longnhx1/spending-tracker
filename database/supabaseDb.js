import { supabase } from "../lib/supabase";

function mapTransaction(row) {
  return {
    id: row.id,
    amount: row.amount,
    type: row.type,
    category: row.category,
    note: row.note,
    date: row.date,
    created_at: row.created_at,
  };
}

export async function fetchTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapTransaction);
}

export async function addTransaction(amount, type, category, note, date) {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      amount,
      type,
      category,
      note: note || null,
      date,
    })
    .select()
    .single();
  if (error) throw error;
  return mapTransaction(data);
}

export async function insertTransactionsMigratedBatch(rows) {
  if (!rows.length) return;
  const payload = rows.map((row) => {
    const p = {
      amount: row.amount,
      type: row.type,
      category: row.category,
      note: row.note ?? null,
      date: row.date,
    };
    if (row.created_at) p.created_at = row.created_at;
    return p;
  });
  const { error } = await supabase.from("transactions").insert(payload);
  if (error) throw error;
}

export async function insertDebtsMigratedBatch(rows) {
  if (!rows.length) return;
  const payload = rows.map((d) => {
    const p = {
      name: d.name,
      total_amount: d.total_amount,
      remaining_amount: d.remaining_amount,
      due_date: d.due_date ?? null,
    };
    if (d.created_at) p.created_at = d.created_at;
    return p;
  });
  const { error } = await supabase.from("debts").insert(payload);
  if (error) throw error;
}

function mapDebt(row) {
  return {
    id: row.id,
    name: row.name,
    total_amount: row.total_amount,
    remaining_amount: row.remaining_amount,
    due_date: row.due_date,
    created_at: row.created_at,
  };
}

export async function fetchDebts() {
  const { data, error } = await supabase
    .from("debts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapDebt);
}

export async function addDebt(name, totalAmount, dueDate) {
  const { data, error } = await supabase
    .from("debts")
    .insert({
      name,
      total_amount: totalAmount,
      remaining_amount: totalAmount,
      due_date: dueDate ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return mapDebt(data);
}

export async function updateDebtRemaining(id, remainingAmount) {
  const { error } = await supabase
    .from("debts")
    .update({
      remaining_amount: remainingAmount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}

export async function countTransactions() {
  const { count, error } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function fetchBudgetsForMonth(month) {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("month", month);
  if (error) throw error;
  return data || [];
}

export async function upsertBudget(category, amount, month) {
  const { error } = await supabase.from("budgets").upsert(
    { category, amount, month },
    { onConflict: "user_id,category,month" },
  );
  if (error) throw error;
}

export async function deleteBudgetRow(category, month) {
  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("category", category)
    .eq("month", month);
  if (error) throw error;
}

export async function insertBudgetsMigratedBatch(rows) {
  if (!rows.length) return;
  const payload = rows.map((b) => ({
    category: b.category,
    amount: b.amount,
    month: b.month,
  }));
  const { error } = await supabase.from("budgets").upsert(payload, {
    onConflict: "user_id,category,month",
  });
  if (error) throw error;
}
