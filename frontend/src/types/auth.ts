export interface LoginPayload {
  account: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  nationalId?: string | undefined;
  address?: string | undefined;
  titlePrefix?: string | undefined;
  profileImage?: string | undefined;
  branchId?: number | undefined;
  roleId?: number | undefined;
}

export interface AuthUser {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  branchId: number;
  branchName?: string | undefined;
  branch?: { branchId: number; branchName: string } | undefined;
  roleId: number;
  nationalId?: string | undefined;
  address?: string | undefined;
  titlePrefix?: string | undefined;
  profileImage?: string | undefined;
  status: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
