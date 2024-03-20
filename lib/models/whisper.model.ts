import mongoose from "mongoose";

const whisperSchema = new mongoose.Schema({
    content: {
        type: String,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    media: {
        type: String,
        required: false
    },
    aspectRatio: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Whisper',
        }
    ],
    parentId: {
        type: String,
    },
  
});


const Whisper = mongoose.models.Whisper || mongoose.model('Whisper', whisperSchema);

export default Whisper;