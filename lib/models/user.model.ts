import mongoose from "mongoose";
const followerschema = new mongoose.Schema({
  id: String
});

const followingschema = new mongoose.Schema({
  id: String
});

const user_social_info = new mongoose.Schema({
  follow_count: { type: Number, default: 0, min: 0 }, 
  followers: [followerschema],
  following: [followingschema]
});


const userSchema = new mongoose.Schema({
    user_social_info: user_social_info,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(value: any) {
          // Simple email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    isOAuth : {
      type: Boolean,
      required: true,
      default : false
    },
    password : {
      type : String,
      required: false,
    },
    isEmailVerified: {
      type: Date,
      required: false,
      default: undefined 
    },
    id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: String,
    bio: String,
    whispers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Whisper",
      },
    ],
    onboarded: {
      type: Boolean,
      default: false,
    },

});
  

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;