import { z } from "zod";

export const addTweetSchema = z.object({
    body: z.string({ message: "Corpo é obrigatório" }),
    answer: z.string().optional(),
    imageUrl: z.string().url({ message: "A URL da imagem é inválida" }).optional()
});

export const validadeTweetSchema = (body: Request['body']) => {
    const safeData = addTweetSchema.safeParse(body);

    if (!safeData.success) {
        return { error: safeData.error.flatten().fieldErrors };
    }

    return { ...safeData.data };
}