export type TUserListResponse = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  is_active: boolean;
  departmentId: string;
};

export type TUserForm = {
  name?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
  departmentId?: string;
};
