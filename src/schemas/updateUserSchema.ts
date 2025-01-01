import { Request } from "express";
import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().min(2, "Precisa ter 2 ou mais caracteres").optional(),
    bio: z.string().optional(),
    link: z.string().url("Precisa ser uma url válida").optional(),
});

export const validadeUpdateUserSchema = (body: Request['body']) => {
    const safeData = updateUserSchema.safeParse(body);

    if (!safeData.success) {

        return { error: safeData.error.flatten().fieldErrors };
    }

    return { ...safeData.data };
}