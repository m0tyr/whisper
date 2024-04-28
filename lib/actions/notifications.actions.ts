"use server"

import { connectToDB } from "../mongoose"
import Notifications from "../models/notifications.model";

interface Params {
    activity_type: string;
    source_id: string;
    targetUserID: string;
    sourceUserID: string;
}

export async function notify(params: Params): Promise<void> {
    try {
        console.log(params);
        connectToDB();

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