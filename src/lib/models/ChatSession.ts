import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  messages: [{
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  resolved: { type: Boolean, default: false },
  escalatedToHuman: { type: Boolean, default: false },
  escalationReason: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, default: null },
  feedback: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.ChatSession || mongoose.model('ChatSession', chatSessionSchema);
