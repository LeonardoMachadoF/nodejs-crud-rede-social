import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { checkIfFollows, findTweetsByUser, findUserBySlug, follow, getUserFollowersCount, getUserFollowingCount, getUserTweetCount, unfollow, updateUserInfo } from "../services/userService";
import { validadesignupSchema } from "../schemas/signupSchema";
import { validadeTweetSchema } from "../schemas/addTweetSchema";
import { validadeUserTweetsSchema } from "../schemas/userTweetsSchema";
import { validadeUpdateUserSchema } from "../schemas/updateUserSchema";

export const getUser = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    const user = await findUserBySlug(slug);
    if (!user) {
        res.json({ error: "Usuário inexistente" });
        return;
    }
    const followingCount = await getUserFollowingCount(user.slug);
    const followersCount = await getUserFollowersCount(user.slug);
    const tweetCount = await getUserTweetCount(user.slug);

    res.json({ user, followersCount, followingCount, tweetCount })
}

export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    const data = validadeUserTweetsSchema(req.query);
    if (data.error) {
        res.json(data);
        return;
    }

    let perPage = 10;
    let currentPage = data.page || 0;

    const tweets = await findTweetsByUser(slug, currentPage, perPage)

    res.json({ tweets, page: currentPage });
}

export const followToggle = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    const me = req.userSlug as string;

    const hasUserToBeFollowed = await findUserBySlug(slug);
    if (!hasUserToBeFollowed) {
        res.json({ error: "Usuário inexistente" });
        return;
    }

    const follows = await checkIfFollows(me, slug);
    if (!follows) {
        try {
            await follow(me, slug);
            res.json({ following: true })
            return;
        } catch (err) {
            res.json({ error: "Não pode seguir a si mesmo" })
            return;
        }
    }

    await unfollow(me, slug);
    res.json({ following: false })
}

export const updateUser = async (req: ExtendedRequest, res: Response) => {
    const data = validadeUpdateUserSchema(req.body);
    if (data.error) {
        res.json(data);
        return;
    }

    await updateUserInfo(req.userSlug as string, data);

    res.json({});
}