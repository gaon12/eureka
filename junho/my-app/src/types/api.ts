import type {
  CarInfo,
  ComplaintArticle,
  PendingCarInfo,
  UserInfo,
  UserRole,
  WorkLog,
} from "./domain";

export interface ApiErrorDetail {
  errorCode?: string;
  message?: string;
}

export interface ApiEnvelope<T> {
  status: number;
  message?: string | number;
  role?: Exclude<UserRole, "">;
  results?: T;
  error?: ApiErrorDetail;
}

export interface AuthResponse extends ApiEnvelope<never> {
  message?: 0 | 1 | string;
  role?: "admin" | "user";
}

export interface CarDashboardResults {
  rcars: CarInfo[];
  nrcars: PendingCarInfo[];
}

export interface DashboardResponses {
  users: ApiEnvelope<UserInfo[]>;
  cars: ApiEnvelope<CarDashboardResults>;
  complaints: ApiEnvelope<ComplaintArticle[]>;
  works: ApiEnvelope<WorkLog[]>;
}
