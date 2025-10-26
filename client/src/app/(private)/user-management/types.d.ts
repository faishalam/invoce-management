export type TUserList = {
  id: string;
  name: string;
  email: string;
  role: string;
  department_id: string;
  is_active: boolean;
};

export type TUserListCol = ColDef<TUserList> | ColGroupDef<TUserList>;
