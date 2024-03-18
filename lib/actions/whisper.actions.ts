"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Whisper from "../models/whisper.model";
import { connectToDB } from "../mongoose"

interface Params {
    content: string | undefined,
    author: string,
    media: string | undefined,
    path: string,
}

export async function createWhisper({ content, author, media, path }: Params) {
    try {
        connectToDB();

        const createdWhisper = await Whisper.create({
            content,
            author,
            media,
        });

        await User.findByIdAndUpdate(author, {
            $push: { whispers: createdWhisper._id }
        })

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`error oncreate: ${error.message} `)
    }
};

export async function GetLastestWhisperfromUserId({ author }: any) {
    try {
        connectToDB();

        const lastWhisper = await Whisper.findOne({ author }).sort({ createdAt: -1 }).limit(1);
        return lastWhisper;
    } catch (error: any) {
        throw new Error(`Error retrieving last whisper: ${error.message}`);
    }
}
export async function fetchwhispers(pagenumber = 1, pagesize = 15) {

    try {
        connectToDB();

        const skipamount = (pagenumber - 1) * pagesize;

        const posts_query = Whisper.find({
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
        const allposts_count = await Whisper.countDocuments({
            parentId: {
                $in: [null, undefined]
            }
        })

        const posts_exec = await posts_query.exec();

        const isnext = allposts_count > skipamount + posts_exec.length;

        return { posts_exec, isnext };
    } catch (error: any) {
        throw new Error(`error onfetchpots: ${error.message} `)


    }
}

export async function createComment({ content, author, media, path }: Params, whisperId: any) {
    connectToDB()

    try {
        const isactive = await Whisper.findById(whisperId);

        if (!isactive) {
            throw new Error("Whisper indisponible ou supprimé...")
            //add error page
        }

        const commentitem = new Whisper({
            content: content,
            author: author,
            media: media,
            parentId: whisperId,
        })

        const commentobject = await commentitem.save()

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
export async function fetchallParentsFromWhisper(parentid:string){
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

            // Recursively call the function for the parent whisper
            await populateParents(parentWhisper.parentId);
        }
    }

    await populateParents(parentid);
    let array = Object.entries(computeparent);
    let reversedArray = array.reverse();
    let reversedObject = Object.fromEntries(reversedArray);
    return reversedObject;


}