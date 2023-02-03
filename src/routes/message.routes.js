import { Router } from "express";
import { messageModel } from "../models/chat.model.js";
const router = Router();

router.get('/', async (req,res)=>{
    try{
        let messages = await messageModel.find()
        console.log(messages)
        res.status(200).json(messages);
    } catch(err){
        res.status(500).json({error:err});
    }
})
router.get('/',(req,res)=>{
    let message = []
    res.json(message)
})

export default router;