import mongoose from "mongoose";

const messageCollection = 'messages'

const messageSchema = new mongoose.Schema({
    id: String,
    name: String,
    message:String
})

export const messageModel = mongoose.model(messageCollection,messageSchema)