import express from 'express'
import urlRouter from './routes/url.routes.js';
import connectToMongoDB from './connect.js';
import URL from './models/url.model.js';

const PORT=8001
const app=express()
// MiddleWares 

app.use(express.json())

// routes
app.use('/url',urlRouter);
app.get("/:id",async (req,res)=>{
    const idFromUser=req.params.id;
    try {
        const updatingTheVisitHistory = await URL.findOneAndUpdate(
            { shortId: idFromUser },
            {
                $push: {
                    clickHistory: {
                        timestamp: Date.now()
                    }
                }
            },
            { new: true } // To return the updated document
        );
        console.log(updatingTheVisitHistory);
        return res.status(200).redirect(updatingTheVisitHistory.redirectedUrl);
    } 
    catch (error) {
        console.error("Error updating visit history:", error);
        return res.status(500).send("Internal Server Error");
    }
})

connectToMongoDB("mongodb://localhost:27017/Url-Shortner");
app.listen(PORT,()=>{
    console.log(`The Server is Running at PORT : ${PORT}`)
})