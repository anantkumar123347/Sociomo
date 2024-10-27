import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { User } from "./user.model";
const videoSchema=new Schema({
    videoFile:{
        type:String,//from extrenal file 
        required:true
    },
    thumbnail:
    {
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:User
    }
}
    ,{
        timestamps:true
    }
)
videoSchema.plugin(mongooseAggregatePaginate)//to use middleware and pass controls
export const Video=Schema.model("Video",videoSchema)