import mongoose from "mongoose";

const UrlSchema = mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  redirectedUrl: {
    type: String,
    required: true,
    unique: true,
  },
  clickHistory: [{ timestamp: { type: Date } }],
});

const URL=mongoose.model("URL",UrlSchema);

export default URL