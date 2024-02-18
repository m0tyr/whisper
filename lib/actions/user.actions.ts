"use server"

import { connect } from "http2"
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

export async function updateUser(
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
): Promise<void> {
    connectToDB();

   try {
     await User.findOneAndUpdate(
         { id: userId },
         {
             username: username.toLowerCase(),
             name,
             bio,
             image,
             onboarded: true,
         },
 
         {
             upsert: true //search upsert = update and also insert if row doesnt exist
         }
     );
 
     if(path === '/profile/edit') {
         revalidatePath(path);
     }
   } catch (error :any) {
        throw new Error(`La MAJ des données a échouée... :  ${error.message}`);
   }
}