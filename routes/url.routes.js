import { Router } from "express";
 import creatingShortLink from "../controllers/url.controller.js";
const urlRouter = Router();

urlRouter
    .route("/")
    .get((req,res)=>{
        res.status(200).send("<h1>Hello This is Url Shortner Project</h1>")
    })
    .post(creatingShortLink)


export default urlRouter
