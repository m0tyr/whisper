"use server"

import { connectToDB } from "../mongoose"
import Notifications from "../models/notifications.model";
import { ActivityType, Notification, UserNotification } from "../types/notification.types";
import Whisper from "../models/whisper.model";
import { ExtractedElement } from "../types/whisper.types";
import User from "../models/user.model";
import { UserDefinition } from "../types/user.types";

interface Params {
    activity_type: string;
    source_id?: string;
    targetUserID: string;
    sourceUserID: string;
}

export async function notify(params: Params): Promise<void> {
    try {
        connectToDB();
        if (params.activity_type === ActivityType.FOLLOW) {
            console.log("test")
            const existingNotification = await Notifications.findOne({
                activity_type: params.activity_type,
                targetUserID: params.targetUserID,
                sourceUserID: params.sourceUserID,
            });

            if (existingNotification) {
                console.log("Notification already exists for targetUserID, sourceUserID, and activity_type");
                return;
            }
            await Notifications.create({
                activity_type: params.activity_type,
                targetUserID: params.targetUserID,
                sourceUserID: params.sourceUserID,
            });
            return;
        }
        if (params.targetUserID === params.sourceUserID) {
            console.log("Notification targetUserID is the same as sourceUserID. Skipping notification.");
            return;
        }

        const existingNotification = await Notifications.findOne({
            targetUserID: params.targetUserID,
            sourceUserID: params.sourceUserID,
            source_id: params.source_id
        });

        if (existingNotification) {
            console.log("Notification already exists for targetUserID, sourceUserID, and source_id");
            return;
        }

        await Notifications.create({
            activity_type: params.activity_type,
            source_id: params.source_id,
            targetUserID: params.targetUserID,
            sourceUserID: params.sourceUserID,
        });

        console.log("Notification created successfully");
    } catch (error: any) {
        console.error("Error creating notification:", error);
        throw error;
    }
}

export async function countActiveNotifications(userId: string): Promise<number> {
    try {
        connectToDB();

        const activeNotificationCount = await Notifications.countDocuments({
            targetUserID: userId,
            isActive: true
        });

        return activeNotificationCount;
    } catch (error: any) {
        console.error("Error counting active notifications:", error);
        throw error;
    }
}

export async function getAllNotifications(userId: string) {
    try {
        connectToDB();

        const notifications: Notification[] = await Notifications.find({
            targetUserID: userId
        }).sort({ time: 'desc' })
        return await ComputeNotifications(notifications);
    } catch (error: any) {
        console.error("Error getting notifications:", error);
        throw error;
    }
}
export async function ComputeNotifications(notifications: Notification[]) {
    try {
        const user_notification_output: UserNotification[] = [];

        for (const notification of notifications) {
            const { activity_type, source_id, sourceUserID, isActive, time } = notification;

            let notification_content = undefined;

            if (activity_type === ActivityType.FOLLOW) {
                notification_content = undefined;
            } else {
                notification_content = await getNotificationContent(source_id);
            }
            const user_notification: UserNotification = {
                activity_type: activity_type,
                user_notification_sender: await getSourceNotifier(sourceUserID),
                isActive: isActive,
                caption: notification_content?.caption,
                notification_link: notification_content?._id,
                time: time
            };

            user_notification_output.push(user_notification);
        }

        return user_notification_output;
    } catch (error: any) {
        console.error("Error getting notifications:", error);
        throw error;
    }
}




async function getNotificationContent(source_id: string) {
    try {
        const whisper = await Whisper.findOne({ _id: source_id }, { caption: 1, _id: 1 });
        return whisper ? { caption: whisper.caption, _id: whisper._id } : undefined;
    } catch (error) {
        console.error("Error fetching whisper content:", error);
        return undefined;
    }
}

async function getSourceNotifier(sourceUserID: string) {
    try {
        const user = await User.findOne({ id: sourceUserID }, { username: 1, name: 1, id: 1, image: 1 });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}