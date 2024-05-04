"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Whisper from "../models/whisper.model";
import { connectToDB } from "../mongoose"
import { DBImageData, ExtractedElement, FeedOptions, MentionsDatas } from "../types/whisper.types";
import { notify } from "./notifications.actions";
import { Activity } from "lucide-react";
import { ActivityType } from "../types/notification.types";
import { redis } from "../redis";
import { cp } from "fs";
import { shuffleArray } from "../utils";


interface Params {
    content: ExtractedElement[] | undefined;
    author: any;
    media?: DBImageData[];
    path: string;
    caption: string;
    mentions?: MentionsDatas[];
}

export async function createWhisper({ content, author, media, path, caption, mentions }: Params) {
    try {
        connectToDB();
        const mentionData = mentions?.map(factor => ({
            link: `/${factor.mention.substring(1)}`,
            text: factor.mention,
            version: 1
        }));
        const createdWhisper = await Whisper.create({
            content,
            author,
            media,
            caption,
            mentions: mentionData,
            interaction_info: {
                like_count: 0,
                liketracker: []
            }
        });
        if (mentions) {
            for (const mention of mentions) {
                await notify({
                    activity_type: ActivityType.MENTION,
                    source_id: `${createdWhisper._id}`,
                    targetUserID: mention.id,
                    sourceUserID: `${author}`,
                });
            }
        }


        await User.findByIdAndUpdate(author, {
            $push: { whispers: createdWhisper._id }
        })
        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`error oncreate: ${error.message} `)
    }
}

export async function isliking(userid: string, liketracker: any) {
    try {
        const isLiking = liketracker.some((liketracker: { id: string }) => liketracker.id === userid);
        return isLiking
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

export async function likewhisper(user_liking: string, whisper_id: string, user_getting_the_like: string) {
    const liker = await User.findOne({ username: user_liking });
    const tolike = await Whisper.findOne({ _id: whisper_id });
    const isLiking = tolike.interaction_info.liketracker.some((liketracker: { id: string }) => liketracker.id === liker.id);
    if (!isLiking) {
        await notify({
            activity_type: ActivityType.LIKE,
            source_id: whisper_id,
            targetUserID: user_getting_the_like,
            sourceUserID: liker.id
        });
        tolike.interaction_info.liketracker.push({
            id: liker.id
        })
        tolike.interaction_info.like_count++

    } else {
        const get_index = tolike.interaction_info.liketracker.findIndex((liketracker: { id: string }) => liketracker.id === liker.id);

        if (get_index !== -1) {
            tolike.interaction_info.liketracker.splice(get_index, 1);
        }
        tolike.interaction_info.like_count--
    }
    const like_count = tolike.interaction_info.like_count
    await tolike.save()
    return like_count

}

export async function GetLastestWhisperfromUserId({ author }: any) {
    try {
        connectToDB();

        const lastWhisper = await Whisper.findOne({ author }).sort({ createdAt: -1 }).limit(1);
        return lastWhisper;
    } catch (error: any) {
        throw new Error(`Error retrieving last whisper: ${error.message}`);
    }
}

export async function searchwhispersV1(input: string | string[] | undefined, pagenumber: number, pagesize: number) {
    try {
        if (!input) {
            return;
        }
        const skipamount = (pagenumber - 1) * pagesize;

        const whispers = await Whisper.find({
            caption: { $regex: input, $options: 'i' },
            parentId: { $in: [null, undefined] }
        })
            .sort({ createdAt: 'desc' })
            .skip(skipamount)
            .limit(pagesize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id username parentId image"
                }
            })
            .exec();

        return { whispers };

    } catch (error) {
        // Handle errors
        console.error("Error searching whispers:", error);
        throw error;
    }
}

export async function createComment({ content, author, media, path, mentions, caption }: Params, whisperId: any) {

    connectToDB();
    try {
        const isactive = await Whisper.findById(whisperId);

        if (!isactive) {
            throw new Error("Whisper indisponible ou supprimé...")
            //add error page
        }
        const mentionData = mentions?.map(factor => ({
            link: `/${factor.mention.substring(1)}`,
            text: factor.mention,
            version: 1
        }));

        const commentitem = new Whisper({
            content: content,
            author: author,
            media: media,
            mentions: mentionData,
            caption: caption,
            parentId: whisperId,
            interaction_info: {
                like_count: 0,
                liketracker: []
            }
        })

        await commentitem.save()

        if (mentions) {
            for (const mention of mentions) {
                await notify({
                    activity_type: ActivityType.MENTION,
                    source_id: `${commentitem._id}`,
                    targetUserID: mention.id,
                    sourceUserID: `${author}`,
                });
            }
        }
        await notify({
            activity_type: ActivityType.REPLY,
            source_id: `${commentitem._id}`,
            targetUserID: `${isactive.author}`,
            sourceUserID: `${author}`
        })
        isactive.children.push(commentitem._id)

        await isactive.save()

        revalidatePath(path)


    } catch (error) {
        throw new Error("l'ajout du commentaire à échoué...")
    }
}

export async function fetchwhisperById(id: string) {
    try {
        connectToDB();
        const WhisperById = Whisper.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id username image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id username parentId image"
                    },
                    {
                        path: 'children',
                        model: Whisper,
                        populate: {
                            path: "author",
                            model: User,
                            select: "_id id username parentId image"
                        }
                    }
                ]
            }).exec();
        return WhisperById;
    } catch (error: any) {
        throw new Error(`error onfetchpostbyId: ${error.message} `)


    }
}

export async function fetchallParentsFromWhisper(parentid: string) {
    let computeparent: { [key: string]: any } = {};

    async function populateParents(whisperId: string) {
        if (whisperId) {
            const parentWhisper = await Whisper.findById(whisperId)
                .populate({
                    path: 'author',
                    model: User,
                    select: "_id id username image"
                })
                .populate({
                    path: 'children',
                    populate: [
                        {
                            path: 'author',
                            model: User,
                            select: "_id id username parentId image"
                        },
                        {
                            path: 'children',
                            model: Whisper,
                            populate: {
                                path: "author",
                                model: User,
                                select: "_id id username parentId image"
                            }
                        }
                    ]
                }).exec();

            computeparent[parentWhisper._id] = parentWhisper;

            await populateParents(parentWhisper.parentId);
        }
    }

    await populateParents(parentid);
    let array = Object.entries(computeparent);
    let reversedArray = array.reverse();
    let reversedObject = Object.fromEntries(reversedArray);
    return reversedObject;


}

export async function fetchwhispers(userID: string, pagenumber = 1, pagesize = 15, path = '/') {

    try {
        const skipamount = (pagenumber - 1) * pagesize;

        const max_count = 200

        //if we see a custom_feed object from this userID then we instantly retrieve it until he "force-refresh" the page
        /*   const CACHEDFEED = await redis.get("custom_feed_v1_" + userID)
          if (CACHEDFEED) {
              const isnext = max_count > skipamount + CACHEDFEED.length;
              const posts_exec = JSON.parse(CACHEDFEED)
              return { posts_exec, isnext };
          } */

        //Feed Algorithm V1
        const output_feed = await custom_feed_v1(userID, {
            skipamount: skipamount,
            pagesize: pagesize,
            affinity_deep_search_min_value: 0,
            affinity_deep_search_max_value: 30,
            affinity_deep_talk_value: 0.09,
            affinity_deep_like_value: 0.04,
            affinity_deep_followage_value: 0.045,
            ranking_like_effect: 0.2,
            ranking_time_effect: 0.7
        })
/*         console.log(Object.keys(posts_exec));
 */        const isnext = max_count > skipamount + output_feed.ranked_feed_redis.length;
        let posts_exec: any[] = [];
        for (const [affinity, feed_items] of Object.entries(output_feed.ranked_feed)) {
            posts_exec.push(feed_items)
        }
        /*   for (const key in posts_exec) {
              if (Object.hasOwnProperty.call(posts_exec, key)) {
                  const object_feed = posts_exec[key];
                  console.log(`Object feed ${key}: ${object_feed.length} posts`);
              }
          } */
        //REDIS Caching

        /*  await redis.set("custom_feed_v1_" + userID, JSON.stringify(posts_exec))
         await redis.expire("custom_feed_v1_" + userID, 100) */

        revalidatePath(path)
        return { posts_exec, isnext };
    } catch (error: any) {
        throw new Error(`error onfetchpots: ${error.message} `)


    }
}

async function interpolate_feed(postsByRank:any){
    const rankedPosts: [number, number][] = [];
    let lastPerson: string | null = null;
    const remainingPosts: [string, { id: number; rank: number }][] = [];

    // Flatten postsByRank into a list of (person, post) tuples
    for (const [rank, posts] of Object.entries(postsByRank)) {
        for (const post of posts as any) {
            remainingPosts.push([rank, post]);
        }
    }

    while (remainingPosts.length > 0) {
        // Shuffle the remaining posts to avoid bias towards any specific person's posts
        shuffleArray(remainingPosts);

        for (const [rank, post] of remainingPosts) {
            if (lastPerson !== rank) {
                const combinedScore = parseFloat(rank) + post.rank;
                rankedPosts.push([post.id, combinedScore]);
                lastPerson = rank;
                // Remove the selected post from the remaining posts
                remainingPosts.splice(remainingPosts.findIndex(([r, p]) => r === rank && p.id === post.id), 1);
            }
        }
    }

    // Sort the posts based on combined score
    rankedPosts.sort((a, b) => b[1] - a[1]);
    return rankedPosts;
}

async function custom_feed_v1(userID: string, options: FeedOptions) {
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
            console.log(followage_affinity_boost)
            const following_user_info = await calcul_affinity(following.id, userID, id, options, isNotFollowing, followage_affinity_boost)
            if (following_user_info) {
                feed_output[following_user_info.affinity] = following_user_info?.posts_exec;
            }

        }

        const sortedFeed = Object.entries(feed_output).sort(([keyA], [keyB]) => parseFloat(keyB) - parseFloat(keyA));
        const sortedFeedOutput = Object.fromEntries(sortedFeed);
        const ranked_feed = await ranking_algorithm(sortedFeedOutput, options)
        return ranked_feed;
    } catch (error: any) {
        console.error("Error generating custom feed :", error);
        throw error;
    }
}
async function ranking_algorithm(input: any, options: FeedOptions) {
    const ranked_feed: any = {};
    const ranked_feed_redis: any = {};
    for (const [key, value] of Object.entries(input)) {
        const posts = value as any[];
        const rankedPosts = posts.map((post: any) => {
            const timeSinceCreation = Date.now() - new Date(post.createdAt).getTime();
            let rankScore = Math.abs(0.5 - ((post.interaction_info.like_count * (options.ranking_like_effect * 1000) + timeSinceCreation / (options.ranking_time_effect * 10000)) / posts.length / 10000));
            rankScore = Math.max(0, Math.min(1, rankScore));
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

async function calcul_affinity(username: string, userID: string, id: string, options: FeedOptions, isNotFollowing: boolean, followage_affinity_boost?:number) {
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


    const posts_exec = await posts_query.exec();

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
    time_sample = time_sample / 7000;
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
    const affinity_value_3 = Math.min(1, time_sample / (100000 * posts_exec.length));
    let affinity_value_4 = 0;
    if(followage_affinity_boost){
        affinity_value_4 = Math.min(1, followage_affinity_boost)
    }
    // Calculate the affinity

    if (isNotFollowing) {
        let affinity = (affinity_value_1 + affinity_value_2 + affinity_value_3 + affinity_value_4) - 0.0999;
        if (isNaN(affinity)) {
            return;
        }
        return { affinity, posts_exec }
    } else {
        let affinity = affinity_value_1 + affinity_value_2 + affinity_value_3 + affinity_value_4;
        if (isNaN(affinity)) {
            return;
        }
        return { affinity, posts_exec }
    }

}