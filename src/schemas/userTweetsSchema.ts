import { Request } from "express";
import { ParsedUrlQuery } from "querystring";
import { z } from "zod";

export const userTweets = z.object({
    page: z.coerce.number().min(0).optional()
});

export const validadeUserTweetsSchema = (body: Request['query']) => {
    const safeData = userTweets.safeParse(body);

    if (!safeData.success) {

        return { error: safeData.error.flatten().fieldErrors };
    }

    return { ...safeData.data };
}