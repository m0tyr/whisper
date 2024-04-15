import mongoose from "mongoose";
import { string } from "zod";

const mentionsSUBSchema = new mongoose.Schema({
    link:String,
    text: String,
    version: Number,
});
const captionsSUBSchema = new mongoose.Schema({
    text: String,
    type: String,
});
const liketrackerchema = new mongoose.Schema({
    id: String,
    liked_at : {
        type: Date,
        default: Date.now
    },
  });
const mediaSUBSchema = new mongoose.Schema({
    s3url : String,
    aspectRatio: String,
    width : String,
    isVideo: Boolean
})
  const interaction_info = new mongoose.Schema({
    like_count: { type: Number, default: 0, min: 0 }, 
    liketracker: [liketrackerchema],
  });
const whisperSchema = new mongoose.Schema({
    interaction_info: interaction_info,
    content: [captionsSUBSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mentions : [mentionsSUBSchema],
    media: [mediaSUBSchema],
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