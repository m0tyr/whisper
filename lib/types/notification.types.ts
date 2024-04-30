import { UserDefinition } from "./user.types";
import { ExtractedElement } from "./whisper.types";

export enum ActivityType {
    LIKE = 'like', // done
    MENTION = 'mention', // done
    FOLLOW = 'follow', // done
    REPLY = 'reply', // done
    QUOTE = 'quote',
    REPOST = 'repost'
}

export interface Notification{
    _id:string;
    activity_type: string;
    source_id: string;
    targetUserID: string;
    sourceUserID: string;
    isActive: boolean;
    time: Date;
}

export interface UserNotification{
    activity_type: string;
    user_notification_sender: UserDefinition;
    isActive: boolean;
    caption?: string | undefined;
    notification_link?: string | undefined;
    time:Date;
}