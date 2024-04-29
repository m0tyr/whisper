import { UserDefinition } from "./user.types";
import { ExtractedElement } from "./whisper.types";

export enum ActivityType {
    LIKE = 'like',
    MENTION = 'mention',
    FOLLOW = 'follow',
    REPLY = 'reply',
    QUOTE = 'quote',
    REPOST = 'repost'
}

export interface Notification{
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