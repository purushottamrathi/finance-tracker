const cron = require('node-cron');
const Milestone = require('../models/Milestone');
const Account = require('../models/Account');

async function checkMilestones() {
  try {
    const pending = await Milestone.find({ achievedAt: null });
    if (!pending || pending.length === 0) return;

    // Group milestones by user for efficient account aggregation
    const byUser = pending.reduce((acc, m) => {
      const k = String(m.user);
      acc[k] = acc[k] || [];
      acc[k].push(m);
      return acc;
    }, {});

    for (const userId of Object.keys(byUser)) {
      const accounts = await Account.find({ user: userId });
      const total = accounts.reduce((s, a) => s + (a.balance || 0), 0);
      const userMilestones = byUser[userId];
      for (const m of userMilestones) {
        if (m.thresholdAmount <= total) {
          m.achievedAt = new Date();
          await m.save();
          console.log(`Milestone achieved for user ${userId}: ${m.key} at ${m.achievedAt.toISOString()}`);
        }
      }
    }
  } catch (err) {
    console.error('Milestone checker error', err);
  }
}

function startMilestoneChecker() {
  // Run immediately then schedule every hour
  checkMilestones();
  // every 60 minutes
  cron.schedule('0 * * * *', () => {
    checkMilestones();
  });
  console.log('Milestone checker scheduled (hourly)');
}

module.exports = startMilestoneChecker;
