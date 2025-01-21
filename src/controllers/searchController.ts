import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { validadeSearchTweetsSchema } from "../schemas/searchSchema";
import { findTweetsByBody } from "../services/tweetService";
import { getTrending } from "../services/trendService";
import { getUserSuggestions } from "../services/userService";

export const searchTweets = async (req: ExtendedRequest, res: Response) => {
    const data = validadeSearchTweetsSchema(req.query);
    if (data.error) {
        res.json(data);
        return;
    }

    let perPage = 6;
    let currentPage = data.page || 0;

    const tweets = await findTweetsByBody(data.q, currentPage, perPage);

    res.json({ tweets, page: currentPage });
}

export const getTrends = async (req: ExtendedRequest, res: Response) => {
    const trends = await getTrending();
    res.json(trends);
}

export const getSuggestions = async (req: ExtendedRequest, res: Response) => {
    const suggestions = await getUserSuggestions(req.userSlug as string);

    res.json({ users: suggestions })
}