"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Whisper from "../models/whisper.model";
import { connectToDB } from "../mongoose"

interface Params{
    content:string | undefined,
    author:string,
    media:string | undefined,
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
export async function fetchwhispers(pagenumber=1 , pagesize=15) {

   try {
     connectToDB();

     const skipamount = (pagenumber - 1) * pagesize;
 
     const posts_query = Whisper.find({
         parentId: {$in: [null,undefined]}
     })
     .sort({createdAt: 'desc'})
     .skip(skipamount)
     .limit(pagesize)
     .populate({ path: 'author', model: User})
     .populate({
         path: 'children',
         populate:{
             path:'author',
             model: User,
             select: "_id username parentId image"
         }
     })
     const allposts_count = await Whisper.countDocuments({ parentId: {
         $in : [null,undefined]
     }})
 
     const posts_exec = await posts_query.exec();
 
     const isnext = allposts_count> skipamount + posts_exec.length;
 
     return { posts_exec, isnext};
   } catch (error:any) {    
    throw new Error(`error onfetchpots: ${error.message} `)

    
   }
}