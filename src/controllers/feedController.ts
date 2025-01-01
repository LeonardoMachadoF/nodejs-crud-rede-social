import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { validadeFeedSchema } from "../schemas/feedSchema";
import { getUserFollowing } from "../services/userService";
import { findTweetFeed } from "../services/tweetService";

export const getFeed = async (req: ExtendedRequest, res: Response) => {
    const data = validadeFeedSchema(req.query);
    if (data.error) {
        res.json(data);
        return;
    }

    let perPage = 2;
    let currentPage = data.page || 0;

    const following = await getUserFollowing(req.userSlug as string);
    const tweets = await findTweetFeed(following, currentPage, perPage);

    res.json({ tweets, page: currentPage })
}

