import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema, validadeTweetSchema } from "../schemas/addTweetSchema";
import { checkIfTweetIsLikedByUser, createTweet, findAnswersFromTweet, findTweetById, likeTweet, unlikeTweet } from "../services/tweetService";
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

export const getTweet = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const tweet = await findTweetById(parseInt(id));
    if (!tweet) {
        res.json({ error: "Tweet inexistente!" })
        return;
    }

    res.json(tweet);
}

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const answers = await findAnswersFromTweet(parseInt(id));

    res.json({ answers })
}

export const likeToggle = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const liked = await checkIfTweetIsLikedByUser(req.userSlug as string, parseInt(id));

    if (liked) {
        unlikeTweet(req.userSlug as string, parseInt(id));
    } else {
        likeTweet(req.userSlug as string, parseInt(id));
    }

    res.json({});
}