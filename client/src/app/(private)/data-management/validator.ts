import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Name wajib diisi"),
});

export const satuanSchema = z.object({
  name: z.string().min(1, "Name wajib diisi"),
});

export const typeOfWorkSchema = z.object({
  name: z.string().min(1, "Name wajib diisi"),
  type: z.string().min(1, "Type wajib diisi"),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Name wajib diisi"),
  code: z.string().min(1, "Name wajib diisi"),
});

export const goodsSchema = z.object({
  name: z.string().min(1, "Name wajib diisi"),
  code: z.string().min(1, "Name wajib diisi"),
});
