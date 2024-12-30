import { Request } from "express";
import { z } from "zod";

export const signinSchema = z.object({
    email: z.string({ message: "Email é obrigatório" }).email("Email inválido"),
    password: z.string({ message: "Senha é obrigatório" }).min(4, "Precisa ter 4 ou mais caracteres")
});

export const validadesigninSchema = (body: Request['body']) => {
    const safeData = signinSchema.safeParse(body);

    if (!safeData.success) {
        return { error: safeData.error.flatten().fieldErrors };
    }

    return { ...safeData.data };
}