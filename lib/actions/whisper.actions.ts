"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Whisper from "../models/whisper.model";
import { connectToDB } from "../mongoose"

interface Params{
    content:string,
    author:string,
    media:string,
    path:string,
}
export async function createWhisper({content,author,media,path}: Params){
    try {
        connectToDB();
    
        const createdWhisper = await Whisper.create({
            content,
            author,
            media,
        });
    
        await User.findByIdAndUpdate(author,{
            $push: { whispers: createdWhisper._id } 
        })
    
        revalidatePath(path)
    } catch (error:any) {
        throw new Error(`error oncreate: ${error.message} `)
    }
};