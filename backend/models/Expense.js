import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  splitBetween: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date }
  }],
  date: { type: Date, default: Date.now },
  receipt: { type: String, default: '' },
  isFullySettled: { type: Boolean, default: false },
  splitMethod: { type: String, enum: ['equal', 'exact', 'percentage'], default: 'equal' }
}, { timestamps: true });

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ group: 1, date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ 'splitBetween.user': 1 });

export default mongoose.model('Expense', expenseSchema);