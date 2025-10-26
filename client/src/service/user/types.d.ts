export type TUserListResponse = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  is_active: boolean;
  department: string;
  department_id: string;
};

export type TUserForm = {
  name?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
  department_id?: string;
};
