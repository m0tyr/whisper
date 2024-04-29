import mongoose from "mongoose";
import { ActivityType } from "../types/notification.types";

const { Schema } = mongoose;


const notificationSchema = new Schema({
    activity_type: { type: String, enum: Object.values(ActivityType), required: true }, 
    source_id: { type: String, required: false }, // activity data recorded
    targetUserID: { type: String, required: true },
    sourceUserID: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    time: { type: Date, default: Date.now } 
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;