import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema, validadeTweetSchema } from "../schemas/addTweetSchema";
import { createTweet, findTweetById } from "../services/tweetService";
import { addHashtag } from "../services/trendService";


export const addTweet = async (req: ExtendedRequest, res: Response) => {
    const data = validadeTweetSchema(req.body);
    if (data.error) {
        res.json(data);
        return;
    }

    if (data.answer) {
        const hasAnswerTweet = await findTweetById(parseInt(data.answer));
        if (!hasAnswerTweet) {
            res.json({ error: "Tweet original inexistente" });
            return;
        }
    }

    const newTweet = await createTweet({
        slug: req.userSlug as string,
        body: data.body,
        answer: data.answer ? parseInt(data.answer) : 0
    });

    const hashtags = data.body.match(/#[a-zA-Z0-9_]+/g);
    if (hashtags) {
        for (let hashtag of hashtags) {
            if (hashtag.length >= 2) {
                await addHashtag(hashtag);
            }
        }
    }
    res.json({ tweet: newTweet });
}