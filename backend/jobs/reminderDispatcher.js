const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const mailer = require('../utils/mailer');

function addInterval(date, repeat) {
  const d = new Date(date);
  switch (repeat) {
    case 'daily': d.setDate(d.getDate() + 1); break;
    case 'weekly': d.setDate(d.getDate() + 7); break;
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'yearly': d.setFullYear(d.getFullYear() + 1); break;
    default: return null;
  }
  return d;
}

async function dispatchReminders() {
  try {
    const now = new Date();
    const due = await Reminder.find({ isActive: true, date: { $lte: now } });
    if (!due || due.length === 0) return;

    for (const r of due) {
      // attempt to load user's email and send an email notification if configured
      try {
        const user = await User.findById(r.user).select('email name');
        const subject = `Reminder: ${r.title}`;
        const text = `Hi ${user?.name || 'user'},\n\nThis is a reminder: ${r.title} scheduled for ${r.date.toISOString()}`;
        const sent = await mailer.sendMail({ to: user?.email, subject, text });
        if (sent) console.log(`Reminder email sent to ${user?.email} (${r.title})`);
        else console.log(`Reminder logged for user ${r.user}: ${r.title} scheduled ${r.date.toISOString()}`);
      } catch (e) {
        console.error('Reminder delivery error', e);
      }

      if (r.repeat && r.repeat !== 'none') {
        const next = addInterval(r.date, r.repeat);
        if (next) {
          r.date = next;
          await r.save();
          continue;
        }
      }

      // non-repeating: mark inactive
      r.isActive = false;
      await r.save();
    }
  } catch (err) {
    console.error('Reminder dispatcher error', err);
  }
}

function startReminderDispatcher() {
  // Run once at startup then every 15 minutes
  dispatchReminders();
  cron.schedule('*/15 * * * *', () => dispatchReminders());
  console.log('Reminder dispatcher scheduled (every 15 minutes)');
}

module.exports = startReminderDispatcher;
