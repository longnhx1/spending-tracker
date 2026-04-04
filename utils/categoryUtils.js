export const getCategoryLabel = (categoryId, categories) => {
  if (categoryId === "thu_nhap") return "Thu nhập";
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? cat.label : categoryId;
};

export const getCategoryEmoji = (categoryId, categories) => {
  if (categoryId === "thu_nhap") return "💸";
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? cat.emoji : "📦";
};
