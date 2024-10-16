"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Whisper from "../models/whisper.model";
import { connectToDB } from "../mongoose"
import { DBImageData, ExtractedElement, MentionsDatas } from "../types/whisper.types";
import { notify } from "./notifications.actions";
import { ActivityType } from "../types/notification.types";
import { redis } from "../redis";
import { custom_feed_v1, interpolate_feed } from "./feed.actions";


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
        const CACHEDFEED = await redis.get("custom_feed_v1_" + userID)
        if (CACHEDFEED) {
            const isnext = max_count > skipamount + CACHEDFEED.length;
            const posts_exec = JSON.parse(CACHEDFEED)
            return { posts_exec, isnext };

        }

        //Feed Algorithm V1 
        const output_feed = await custom_feed_v1(userID, {
            skipamount: skipamount,
            pagesize: pagesize,
            affinity_deep_search_min_value: 0,
            affinity_deep_search_max_value: 30,
            affinity_deep_talk_value: 0.091023,
            affinity_deep_like_value: 0.171244,
            affinity_deep_followage_value: 0.005333333333336,
            ranking_media_effect: 0.0911941241333,
            ranking_like_effect: -1.58341341341,
            ranking_time_effect: 0.0781824129,
            ranking_default_like_effect: 0.86530391510359
        });
        if(!output_feed){
            return;
        }
        const isnext = max_count > skipamount + output_feed?.ranked_feed_redis.length;
        const my_username = await User.findById(userID)
            .select('username')
            .exec();
        const posts_exec = await interpolate_feed(my_username, userID, output_feed?.ranked_feed)
        posts_exec.sort((a, b) => a.rankScore - b.rankScore);

        //REDIS Caching
        await redis.set("custom_feed_v1_" + userID, JSON.stringify(posts_exec))
        await redis.expire("custom_feed_v1_" + userID, 1000)
        revalidatePath(path)
        return { posts_exec, isnext };
    } catch (error: any) {
        throw new Error(`error onfetchpots: ${error.message} `)


    }
}

