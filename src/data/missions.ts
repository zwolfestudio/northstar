import type { Mission } from "../models/mission";
import { createId } from "../utils/id";

const now = new Date().toISOString();

export const missions: Mission[] = [
  {
    id: createId(),
    title: "Build Northstar",
    category: "Development",
    status: "Active",
    progress: 15,
    priority: "Critical",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createId(),
    title: "Staff Making Project",
    category: "Craft",
    status: "Active",
    progress: 25,
    priority: "Medium",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createId(),
    title: "AI Training",
    category: "Learning",
    status: "Planning",
    progress: 5,
    priority: "High",
    createdAt: now,
    updatedAt: now,
  },
];
