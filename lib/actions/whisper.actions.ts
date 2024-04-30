"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Whisper from "../models/whisper.model";
import { connectToDB } from "../mongoose"
import { DBImageData, ExtractedElement, MentionsDatas } from "../types/whisper.types";
import { notify } from "./notifications.actions";
import { Activity } from "lucide-react";
import { ActivityType } from "../types/notification.types";


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


export async function fetchwhispers(pagenumber = 1, pagesize = 15, path = '/') {

    try {
        await new Promise((resolve) => {
            setTimeout(resolve, 4000); // Wait for 4 seconds
        });

        connectToDB();
        
        const skipamount = (pagenumber - 1) * pagesize;

        const posts_query = Whisper.find({
            parentId: { $in: [null, undefined] }
        })
            .sort({ createdAt: 'desc' })
            .skip(skipamount)
            .limit(pagesize)
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
            })
        const allposts_count = await Whisper.countDocuments({
            parentId: {
                $in: [null, undefined]
            }
        })

        const posts_exec = await posts_query.exec();

        const isnext = allposts_count > skipamount + posts_exec.length;


        revalidatePath(path)
        return { posts_exec, isnext };
    } catch (error: any) {
        throw new Error(`error onfetchpots: ${error.message} `)


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

        console.log(isactive)

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