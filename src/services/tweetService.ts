import { prisma } from "../utils/prisma"
import { getPublicUrl } from "../utils/url";

export const findTweetById = async (id: number) => {
    const tweet = await prisma.tweet.findFirst({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { id }
    });

    if (tweet) {
        tweet.user.avatar = getPublicUrl(tweet.user.avatar);
        return tweet;
    }

    return null;
}

interface CreateTweet {
    slug: string;
    body: string;
    image?: string;
    answer?: number;
}

export const createTweet = async ({ slug, body, answer, image }: CreateTweet) => {
    const newTweet = await prisma.tweet.create({
        data: {
            body,
            userSlug: slug,
            image,
            answerOf: answer ?? 0
        }
    });

    return newTweet;
}

export const findAnswersFromTweet = async (id: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: {
            answerOf: id
        }
    });

    for (let tweetIndex in tweets) {
        tweets[tweetIndex].user.avatar = getPublicUrl(tweets[tweetIndex].user.avatar);
    }

    return tweets;
}

export const checkIfTweetIsLikedByUser = async (slug: string, id: number) => {
    const isLiked = await prisma.tweetLike.findFirst({
        where: {
            userSlug: slug,
            tweetId: id
        }
    });

    return isLiked ? true : false;
}

export const unlikeTweet = async (slug: string, id: number) => {
    await prisma.tweetLike.deleteMany({
        where: {
            userSlug: slug,
            tweetId: id
        }
    });
}

export const likeTweet = async (slug: string, id: number) => {
    await prisma.tweetLike.create({
        data: {
            userSlug: slug,
            tweetId: id
        }
    });
}

export const findTweetFeed = async (following: string[], currentPage: number, perPage: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true,
                },
            },
            likes: {
                select: {
                    userSlug: true,
                },
            },
        },
        where: {
            userSlug: { in: following },
            answerOf: 0,
        },
        orderBy: { createdAt: 'desc' },
        skip: currentPage * perPage,
        take: perPage,
    });

    const tweetsWithRetweetCounts = await Promise.all(
        tweets.map(async (tweet) => {
            const retweetCount = await prisma.tweet.count({
                where: {
                    answerOf: tweet.id,
                },
            });

            return {
                ...tweet,
                retweetCount,
                user: {
                    ...tweet.user,
                    avatar: getPublicUrl(tweet.user.avatar),
                },
            };
        })
    );

    return tweetsWithRetweetCounts;

}
export const findTweetsByBody = async (bodyContains: string, currentPage: number, perPage: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: {
            body: {
                contains: bodyContains,
                mode: 'insensitive'
            },
            answerOf: 0
        },
        orderBy: { createdAt: "desc" },
        skip: currentPage * perPage,
        take: perPage
    });

    const tweetsWithRetweetCounts = await Promise.all(
        tweets.map(async (tweet) => {
            const retweetCount = await prisma.tweet.count({
                where: {
                    answerOf: tweet.id,
                },
            });

            return {
                ...tweet,
                retweetCount,
                user: {
                    ...tweet.user,
                    avatar: getPublicUrl(tweet.user.avatar),
                },
            };
        })
    );

    return tweetsWithRetweetCounts;
}