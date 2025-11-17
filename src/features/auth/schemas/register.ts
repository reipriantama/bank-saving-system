import z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nama minimal 2 karakter." })
      .max(100, { message: "Nama terlalu panjang." }),
    email: z.email({ message: "Email tidak valid." }),
    password: z.string().min(8, { message: "Password minimal 8 karakter." }),
    confirm_password: z
      .string()
      .min(8, { message: "Konfirmasi password minimal 8 karakter." }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Konfirmasi password tidak cocok.",
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const defaultRegisterValues: RegisterSchemaType = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
};
