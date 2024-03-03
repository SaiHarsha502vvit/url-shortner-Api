import mongoose from "mongoose";
import URL from "../models/url.model.js"
import {nanoid} from 'nanoid'
async function creatingShortLink(req,res){
      const link=req.body.url;
      console.log(link)
      if(!link){
        res.status(404).json(`Please Provide the Url ....`)
      }
      // const alreadyUsed=await URL.findOne({link})
      // if (!alreadyUsed) {
      //   res.send(`This Link is Already Used ${alreadyUsed}`)

      // }
      const sid=nanoid(8);
      try {
        const hello=await URL.create({
          shortId:sid,
          redirectedUrl:link,
          clickHistory : []
        });
        res.status(200).json({url:`${sid}`});
      } catch (error) {
        const foundvalue=await URL.findOne({redirectedUrl:link})
        res.send(`This Link is alredy \n ShortId: ${foundvalue.shortId} \n RedirectedUrl ${foundvalue.redirectedUrl}`)
        
      }

}


export default creatingShortLink;