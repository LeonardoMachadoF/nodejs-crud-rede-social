import { Request } from "express";
import { z } from "zod";

const searchSchema = z.object({
    q: z.string({ message: "Preencha a busca" }).min(3, "Mínimo 3 caracteres"),
    page: z.coerce.number().min(0).optional()
});

export const validadeSearchTweetsSchema = (body: Request['query']) => {
    const safeData = searchSchema.safeParse(body);

    if (!safeData.success) {
        return { error: safeData.error.flatten().fieldErrors };
    }

    return { ...safeData.data };
}