import { Request } from "express";
import { z } from "zod";

export const signupSchema = z.object({
    name: z.string({ message: "Nome é obrigatório" }).min(2, "Precisa ter 2 ou mais caracteres"),
    email: z.string({ message: "Email é obrigatório" }).email("Email inválido"),
    password: z.string({ message: "Senha é obrigatório" }).min(4, "Precisa ter 4 ou mais caracteres")
});

export const validadesignupSchema = (body: Request['body']) => {
    const safeData = signupSchema.safeParse(body);

    if (!safeData.success) {

        return { error: safeData.error.flatten().fieldErrors };
    }

    return { ...safeData.data };
}