export type ValueImportance = "Core" | "Supporting";

export type Value = {
  id: string;
  title: string;
  description: string;
  importance: ValueImportance;
  createdAt: string;
  updatedAt: string;
};
