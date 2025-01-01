import { Request } from "express";
import { ParsedUrlQuery } from "querystring";
import { z } from "zod";

const feedSchema = z.object({
    page: z.coerce.number().min(0).optional()
});

export const validadeFeedSchema = (body: Request['query']) => {
    const safeData = feedSchema.safeParse(body);

    if (!safeData.success) {
        return { error: safeData.error.flatten().fieldErrors };
    }

    return { ...safeData.data };
}