"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Whisper from "../models/whisper.model";
import { FeedOptions } from "../types/feed.types";
import { redis } from "../redis";


/**
 * Whisper's feed algorithm based on a `Feed Context`, multiple values such as the userID `string` and custom properties/options doing the magic `FeedOptions`.
 * The feed system is a `ranking based system allowing most valuable post toward a userID to be showed as soon as possible`.
 * We basically try to keep track of the user interactions on the website to feed him with what he wants.
 * The feed is (after generate) cached in a redis implementation during a certain ammount of time until the person request a new feed.
 * 
 * @param {string} userID - The ID of the user
 * @param {FeedOptions} options - Options for generating the feed
 * @returns {Promise<Object.<string, any>>} - Ranked feed output
 */
export async function custom_feed_v1(userID: string, options: FeedOptions) {
    try {
        const feed_output: { [key: string]: any } = {};
        const user = await User.findById(userID)
            .select('user_social_info')
            .exec();

        for (const following of user.user_social_info.following) {
            const following_user = await User.findOne({ username: following.id }, { id: 1, user_social_info: 1 });
            const id = following_user.id.toString();
            const sub_following_search = following_user.user_social_info.following
            let followage_affinity_boost = 0;
            for (const sub_follower of sub_following_search) {
                const isNotFollowing = true
                if (user.user_social_info.following.some((item: { id: any; }) => item.id === sub_follower.id)) {
                    followage_affinity_boost += options.affinity_deep_followage_value;
                }
                const sub_following_user = await User.findOne({ username: sub_follower.id }, { id: 1 });
                const id = sub_following_user.id.toString();
                const sub_following_user_info = await calcul_affinity(following.id, userID, id, options, isNotFollowing,)
                if (sub_following_user_info) {
                    feed_output[sub_following_user_info.affinity] = sub_following_user_info?.posts_exec;
                }
            }
            const isNotFollowing = false
            const following_user_info = await calcul_affinity(following.id, userID, id, options, isNotFollowing, followage_affinity_boost)
            if (following_user_info) {
                feed_output[following_user_info.affinity] = following_user_info?.posts_exec;
            }

        }

        const sortedFeed = Object.entries(feed_output).sort(([keyA], [keyB]) => parseFloat(keyB) - parseFloat(keyA));
        const sortedFeedOutput = Object.fromEntries(sortedFeed);
        const ranked_feed = ranking_algorithm(sortedFeedOutput, options)
        return ranked_feed;
    } catch (error: any) {
        console.error("Error generating custom feed :", error);
        throw error;
    }
}


/**
 * Calculates the affinity value and retrieves the latest posts from a foreign user.
 * Affinity is based on various factors including user interactions and post data.
 * 
 * @param {string} username - The username of the foreign user.
 * @param {string} userID - The unique user ID of the current user.
 * @param {string} id - The unique user ID of the foreign user.
 * @param {FeedOptions} options - Options for generating the feed.
 * @param {boolean} isNotFollowing - Indicates whether the current user is not following the foreign user.
 * @param {number} [followage_affinity_boost] - Computed followage boost toward both user information (refer: affinity_deep_followage_value).
 * @returns {Promise<{ affinity: number, posts_exec: any[] } | undefined>} - The affinity value and latest posts from the user.
 */
async function calcul_affinity(username: string, userID: string, id: string, options: FeedOptions, isNotFollowing: boolean, followage_affinity_boost?: number) {
    const posts_query = Whisper.find({
        author: id,
        parentId: { $in: [null, undefined] }
    })
        .sort({
            createdAt: 'desc',
            'interaction_info.like_count': 'desc'
        })
        .skip(options.skipamount)
        .limit(options.pagesize)
        .populate({
            path: 'author',
            select: "_id id username name image"
        })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id username parentId image"
            }
        });


    let posts_exec = await posts_query.exec();

    let time_sample = 0

    let talk_value = 0

    let like_value = 0
    for (const post of posts_exec) {
        time_sample += Date.now() - post.createdAt;
        post.interaction_info.liketracker.map((id: any) => {
            if (id === userID) {
                like_value += options.affinity_deep_like_value
            }
        });
        post.children.map((child: any) => {
            if (child.author.id === userID) {
                talk_value += options.affinity_deep_talk_value;
            }
        });
    }
    posts_exec = posts_exec.filter(post => {
        return !post.interaction_info.liketracker.some((id: any) => {
            return id === userID;
        });
    });
    time_sample = time_sample;
    const count_affinity = await Whisper.countDocuments({
        author: userID,
        "content.type": "mention",
        "content.text": { $regex: `@${username}\\b`, $options: 'i' }
    })
        .sort({ createdAt: 'desc' })
        .skip(options.affinity_deep_search_min_value)
        .limit(options.affinity_deep_search_max_value);

    // Normalize values
    const affinity_value_1 = Math.min(1, talk_value / (options.affinity_deep_talk_value * posts_exec.length));
    const affinity_value_2 = Math.min(1, count_affinity / options.affinity_deep_search_max_value);
    const affinity_value_3 = (Math.min(1, time_sample / (10000 * posts_exec.length)));
    const affinity_value_4 = Math.min(1, like_value)
    let affinity_value_5 = 0;
    if (followage_affinity_boost) {
        affinity_value_5 = Math.min(1, followage_affinity_boost)
    }
    // Calculate the affinity

    if (isNotFollowing) {
        let affinity = (affinity_value_1 + affinity_value_2 + affinity_value_3 + affinity_value_4 + affinity_value_5) - 0.1999;
        if (isNaN(affinity)) {
            return;
        }
        return { affinity, posts_exec }
    } else {
        let affinity = (affinity_value_1 + affinity_value_2 + affinity_value_3 + affinity_value_4 + affinity_value_5);
        if (isNaN(affinity)) {
            return;
        }
        return { affinity, posts_exec }
    }

}


/**
 * Interpolates the feed by combining posts from multiple users while ensuring correctness and redundancy.
 * It modifies the feed to apply and sort individual post item rank and make sure we dont see 20 posts from an user in a row.
 *
 * @param {string} my_username - The username object of the current user.
 * @param {string} my_id - The unique ID of the current user.
 * @param {Object.<string, any[]>} feed_object - The feed object containing posts from multiple users.
 * @returns {Promise<any[]>} - The final interpolated feed.
 */
export async function interpolate_feed(my_username: any, my_id: string, feed_object: { [key: string]: any[] }) {
    const feed_final: any[] = [];
    const seenIds = new Set<string>();
    let maxLength = 0;
    for (const value of Object.values(feed_object)) {
        maxLength = Math.max(maxLength, value.length);
    }
    for (let index = 0; index < maxLength; index++) {
        for (const [key, value] of Object.entries(feed_object)) {
            if (Array.isArray(value) && value.length > index) {
                const currentItem = value[index];
                for (let index = 0; index < currentItem.interaction_info.liketracker.length; index++) {
                    const likerId = currentItem.interaction_info.liketracker[index].id;
                    if (likerId === my_id) {
                        break;
                    }
                }

                if (!seenIds.has(currentItem._id.toString()) && currentItem.author.username !== my_username.username) {
                    currentItem.rankScore = Math.abs(currentItem.rankScore);
                    feed_final.push(currentItem);
                    seenIds.add(currentItem._id.toString());
                }
            }
        }
    }

    return feed_final;
}

/**
 * Calculates the sub rank score based on the number of likes and the effect of likes in a feed context.
 *
 * @param {number} likeCount - The number of likes.
 * @param {number} ranking_like_effect - The effect of likes on the feed context.
 * @param {number} ranking_default_like_effect - The default effect of likes on ranking when likeCount is 0.
 * @returns {number} - The rank score multiplier.
 */
function like_multiplicator(likeCount: number, ranking_like_effect: number, ranking_default_like_effect: number) {
    let rankScore = ranking_default_like_effect;

    if (likeCount !== 0) {
        rankScore =  (ranking_like_effect / likeCount);
    }

    return rankScore;
}

/**
 * Ranks the feed's posts of every user found based on their affinity with the current user.
 * We use data from posts and computed affinity to calculate how good a post can be and add a row ranking it.
 * This ranking is based on a Feed Context and return both output feed and cached feed.
 *
 * @param {any} input - The input feed to be ranked.
 * @param {FeedOptions} options - Options for ranking the feed based on a feed context.
 * @returns {{ ranked_feed_redis: any, ranked_feed: any }} - Ranked feed and cached feed for Redis.
 */
function ranking_algorithm(input: any, options: FeedOptions) {
    const ranked_feed: any = {};
    const ranked_feed_redis: any = {};
    for (const [key, value] of Object.entries(input)) {
        const posts = value as any[];
        const rankedPosts = posts.map((post: any) => {
            const maxTime = 1000 * 60 * 60 * 24 * 30;
            const timeSinceCreation = Date.now() - new Date(post.createdAt).getTime();
            const normalizedScore = Math.min(1, timeSinceCreation / maxTime);
            const asMedia = options.ranking_media_effect * post.media.length;
            let rankScore = like_multiplicator(post.interaction_info.like_count, options.ranking_like_effect, options.ranking_default_like_effect);
             rankScore = Math.max(0, Math.min(2000, (Math.abs(rankScore - parseFloat(key)) - (asMedia)) + (normalizedScore * 10)));
             return { cached_posts: { id: post._id.toString(), rankScore }, rendered_posts: { ...post.toObject(), rankScore } };
        });
        rankedPosts.sort((a, b) => b.cached_posts.rankScore - a.cached_posts.rankScore);
        ranked_feed[key] = rankedPosts.map((post: any) => {
            return post.rendered_posts
        });
        ranked_feed_redis[key + "_redis"] = rankedPosts.map((post: any) => {
            return post.cached_posts
        });;
    }

    return { ranked_feed_redis, ranked_feed };
}

/**
 * Requests a new feed for the specified user and path.
 * 
 * @param {string} userID - The unique ID of the user.
 * @param {string} path - The path of the request.
 * @returns {Promise<void>} - A promise that resolves once the request is processed.
 */
export async function requestNewFeed(userID: string, path: string) {
    console.log(path)
    if (path !== "/") {
        return;
    }
    await redis.del("custom_feed_v1_" + userID)
    revalidatePath(path)
}
