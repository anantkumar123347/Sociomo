import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser=asyncHandler( async(req,res)=>
{
    console.log("Request body:", req.body);
    const{fullname,email,username,password}=req.body
    console.log("email:",email);
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"All fields are required")
    }
    const existedUser=await User.findOne(
        {
            $or:[{username},{email}]
        }
    )
    if(existedUser)
    {
        throw new ApiError(409,"User already existed")
    }
    const avatarLocalPath= req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverimage[0]?.path
    if(!avatarLocalPath)
    {
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar)
    {
        throw new ApiError(400,"Avatar file is required")
    }
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        username:username.toLowerCase(),
        password
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser)
    {
        throw new ApiError(500,"Something went wrong while registring the user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user resgistered sucessfully")
    )
})
export {registerUser}