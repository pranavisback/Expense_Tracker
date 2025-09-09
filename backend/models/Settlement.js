import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paidTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  settledAt: { type: Date, default: Date.now },
  note: { type: String, default: '' }
}, { timestamps: true });

settlementSchema.index({ expense: 1 });
settlementSchema.index({ group: 1 });
settlementSchema.index({ paidBy: 1 });
settlementSchema.index({ paidTo: 1 });

export default mongoose.model('Settlement', settlementSchema);