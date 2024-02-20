'use client';

interface WhisperProps {
    id: string; 
    author: {
      name: string; 
      username: string; 
      image: string;
    };
    content: string;
    date: string;
    likes?: number; 
    retweets?: number; 
    replies?: number; 
    media?: string[]; 
  }
  

const CreateWhisper  = ({ author }: WhisperProps) => {
    return ( 
        <div className="text-white  bg-black z-0 "> I AM HIM </div>
    )
}


export default CreateWhisper;