import mongoose from "mongoose";

const mentionsSUBSchema = new mongoose.Schema({
    link:String,
    text: String,
    version: Number,
});
const captionsSUBSchema = new mongoose.Schema({
    text: String,
    type: String,
});

const whisperSchema = new mongoose.Schema({
    content: [captionsSUBSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mentions : [mentionsSUBSchema],
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
    caption:{
        type:String,
        require:false
    }
  
});


const Whisper = mongoose.models.Whisper || mongoose.model('Whisper', whisperSchema);

export default Whisper;