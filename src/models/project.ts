export type ProjectStatus = "Planning" | "Active" | "On Hold" | "Completed";

export type Task = {
  id: string;
  title: string;
  done: boolean;
};

export type Project = {
  id: string;
  title: string;
  missionId?: string;
  description?: string;
  tasks: Task[];
  progress: number;
  status: ProjectStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
