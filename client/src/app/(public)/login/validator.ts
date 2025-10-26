import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email').email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export type TLoginForm = z.infer<typeof loginSchema>;
