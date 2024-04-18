"use server"

import { connect } from "http2"
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Whisper from "../models/whisper.model";
import bcrypt from 'bcryptjs';
interface Params {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string,
}

export async function Login(email: string, password: string) {
  try {
    if (email.trim() !== "" && password.trim() !== "") {
      connectToDB();
      const hashpass = await bcrypt.hash(password, 10)
      console.log(email)
      console.log(hashpass)
    }
    else{
      throw new Error(`Failed to login the user: data empty `);
    }
  } catch (error: any) {
    throw new Error(`Failed to login the user: ${error.message}`);
  }
}

export async function Register(email: string, password: string) {
  try {
    if (email.trim() !== "" && password.trim() !== "") {
      connectToDB();
      const hashpass = await bcrypt.hash(password, 10)
      console.log(email)
      console.log(hashpass)
    }
    else{
      throw new Error(`Failed to login the user: data empty `);
    }
  } catch (error: any) {
    throw new Error(`Failed to login the user: ${error.message}`);
  }
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
export async function updateAccountUser({
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
        image
      },
      {
        upsert: true
      }
    );

    if (path === `/${username}`) {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`La MAJ des données a échouée... :  ${error.message}`);
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
        $set: {
          user_social_info: {
            follow_count: 0,
            followers: []
          }
        }
      },
      {
        upsert: true
      }
    );

    if (path === `/${username}`) {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`La MAJ des données a échouée... :  ${error.message}`);
  }
}


export async function follow(from: string, to: string) {
  try {
    const currentuser = await User.findOne({ username: from });
    const foreignuser = await User.findOne({ username: to });
    if (!currentuser || !foreignuser) {
      throw new Error(`User '${from}' or '${to}' not found.`);
    }
    const isFollowing = currentuser.user_social_info.following.some((follower: { id: string }) => follower.id === to);
    if (!isFollowing) {
      foreignuser.user_social_info.followers.push({ id: from });
      currentuser.user_social_info.following.push({ id: to });
      foreignuser.user_social_info.follow_count++;
    } else {
      const foreignuserFollowerIndex = foreignuser.user_social_info.followers.findIndex((follower: { id: string }) => follower.id === from);
      const currentuserFollowingIndex = currentuser.user_social_info.following.findIndex((following: { id: string }) => following.id === to);
      if (foreignuserFollowerIndex !== -1) {
        foreignuser.user_social_info.followers.splice(foreignuserFollowerIndex, 1);
      }
      if (currentuserFollowingIndex !== -1) {
        currentuser.user_social_info.following.splice(currentuserFollowingIndex, 1);
      }
      foreignuser.user_social_info.follow_count--;
    }
    await currentuser.save();
    await foreignuser.save();
    console.log(`${from} -> ${to}`);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}
export async function isFollowing(username: string, foreignusername: string) {
  try {
    const currentuser = await User.findOne({ username: username });
    const isFollowing = currentuser.user_social_info.following.some((follower: { id: string }) => follower.id === foreignusername);
    return isFollowing
  } catch (error: any) {
    console.error('Error:', error.message);
  }

}
export async function MentionSearchModel(input: string) {
  const result = await User.find(
    { username: { $regex: input, $options: "i" } },
    { _id: 0, name: 1, image: 1, username: 1 }
  ).limit(10).lean();
  return result;
}
type SearchResultType = { id: string, name: string, image: string, username: string, isfollowing: boolean };

export async function SearchModel(input: string) {
  try {
    const result = await User.find(
      { username: { $regex: input, $options: "i" } },
      { id: 1, name: 1, image: 1, username: 1 }
    ).limit(10).lean();

    const formattedResult: SearchResultType[] = result.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      username: item.username,
      isfollowing: false
    }));

    return formattedResult;
  } catch (error) {
    console.error("Erreur dans SearchModel:", error);
    throw error;
  }
}
export async function getMentionActivityFromUser(username: string) {
  try {
    username = "@" + username
    console.log(username)
    const mentions = await Whisper.find({
      'mentions.text': username
    }).populate('author');
    console.log(mentions)
    return mentions;
  } catch (error: any) {
    throw new Error(`Error fetching mentions: ${error.message}`);
  }
}
export async function getActivityFromUser(username: string, type: string) {
  try {
    console.log(type)
    if (type === "mentions") {
      username = "@" + username
      console.log(username)
      const mentions = await Whisper.find({
        'mentions.text': username
      }).populate(
        'author'
      ).sort({ createdAt: 'desc' });
      console.log(mentions)
      return mentions;
    }
    else if (type === "replies") {
      const replies = await Whisper.find({
        'username': username
      }).populate(
        'author'
      ).sort({ createdAt: 'desc' });
      console.log(replies)
      return replies;
    }
  } catch (error: any) {
    throw new Error(`Error fetching mentions: ${error.message}`);
  }
}