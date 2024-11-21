// tasks表类型
export interface Task {
  id: string;
  name: string;
  type: string;
  cronExpression: string;
  isEnabled?: number;
  paramsBody?: string | null;
  lastExecutedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// task_logs表类型
export interface TaskLog {
  id?: string;
  taskId: string;
  status: "success" | "failed";
  message?: string | null;
  executedAt?: Date;
  content?: string | null;
}

export interface TaskConfig {
  id: string;
  name: string;
  type: string;
  cronExpression: string;
}


export interface MenuData {
  key: string;
  name: string;
  icon: string;
  click?: (item: Task) => void;
}