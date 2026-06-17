const cron = require('node-cron');
const Transaction = require('../models/Transaction');

async function applyRecurringTransactions() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const templates = await Transaction.find({
      isRecurring: true,
      $or: [
        { lastApplied: null },
        { lastApplied: { $lt: startOfMonth } },
      ],
    });

    for (const template of templates) {
      await Transaction.create({
        user: template.user,
        title: template.title,
        amount: template.amount,
        type: template.type,
        category: template.category,
        paymentMethod: template.paymentMethod,
        date: new Date(),
        notes: template.notes,
        isRecurring: false,
      });
      await Transaction.findByIdAndUpdate(template._id, { lastApplied: now });
    }

    if (templates.length > 0)
      console.log(`[Cron] Applied ${templates.length} recurring transaction(s)`);
  } catch (err) {
    console.error('[Cron] Error applying recurring transactions:', err.message);
  }
}

function startRecurringJob() {
  // Run at 00:05 on the 1st of each month
  cron.schedule('5 0 1 * *', applyRecurringTransactions, { timezone: 'Asia/Kolkata' });
  console.log('[Cron] Recurring transaction job scheduled');
}

module.exports = startRecurringJob;
