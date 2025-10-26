import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().min(1, "Email").email("Format email tidak valid"),
  department_id: z.string().min(1, "Department wajib diisi"),
  role: z.string().min(1, "Role wajib diisi"),
  name: z.string().min(1, "Name wajib diisi"),
  is_active: z.boolean({
    required_error: "Status wajib diisi",
    invalid_type_error: "Status wajib diisi",
  }),
});

export const createUserSchema = userSchema.extend({
  password: z.string().min(1, { message: "Password wajib diisi" }),
});

// Schema untuk EDIT (password opsional / tidak dikirim)
export const updateUserSchema = userSchema.extend({
  password: z.string().optional(),
});

export type TUserForm = {
  id?: string;
  email: string;
  password?: string;
  department_id: string;
  role: string;
  name: string;
  is_active: boolean;
};
