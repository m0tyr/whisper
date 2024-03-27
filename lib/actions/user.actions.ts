"use server"

import { connect } from "http2"
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Whisper from "../models/whisper.model";

interface Params {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string,
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
export async function fetchUserbyUsername(username: string) {
  try {
    connectToDB();

    return await User.findOne({ username: username })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
export async function fetchUserWhisper(userId: string) {
  try {
    connectToDB();
    const whispers = await User.findOne({ id: userId })
      .populate({
        path: 'whispers',
        model: Whisper,
        options: { sort: { createdAt: -1 } }, 
        populate: {
          path: 'children',
          model: Whisper,
          populate: {
            path: 'author',
            model: User,
            select: 'image id username'
          }
        }
      });
    return whispers;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
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

    if (path === `/${username}`) {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`La MAJ des données a échouée... :  ${error.message}`);
  }
}

export async function MentionSearchModel(input : string){

  
  const result = await User.find({
    $or: [
      { username: { $regex: input, $options: "i" } },
    ]
  }).limit(10);

  // for ui purpose nd to remove
  const additionalResults = result.concat(result);
  const additionalResult2 = additionalResults.concat(additionalResults); 
  return additionalResult2;
  //

  
  // return result;
}