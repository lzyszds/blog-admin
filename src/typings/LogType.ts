export interface LogTypeError {
  level: string;
  message: string;
  time: string;
}

export interface LogRequestResult {
  data: LogTypeError[];
  total: number;
}
