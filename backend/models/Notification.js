import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['group_invite', 'expense_added', 'payment_request', 'payment_received'] 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    expenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
    amount: { type: Number }
  },
  isRead: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);