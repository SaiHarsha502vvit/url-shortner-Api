import mongoose from 'mongoose';

const DomainSchema = new mongoose.Schema({
  domain: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Domain', DomainSchema);
