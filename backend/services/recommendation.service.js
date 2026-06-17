const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

async function getRecommendationsForUser(userId) {
  // Basic heuristics-based recommendations
  const recs = [];
  // Fetch last 12 months of transactions for better trend detection
  const since = new Date();
  since.setMonth(since.getMonth() - 12);
  const tx = await Transaction.find({ user: userId, date: { $gte: since } });
  const total = tx.reduce((s, t) => s + t.amount, 0);
  const spending = tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const invest = tx.filter(t => t.type === 'investment' || t.type === 'savings').reduce((s, t) => s + t.amount, 0);

  // Per-category totals to find big spends
  const byCategory = tx.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});

  if (total > 0) {
    const spendRatio = spending / total;
    if (spendRatio > 0.5) {
      recs.push({ key: 'reduce-spending', message: 'You spend over 50% of tracked cash—consider trimming discretionary expenses.' });
    } else if (spendRatio < 0.3) {
      recs.push({ key: 'good-spending', message: 'Good job keeping spending under 30% of tracked cash.' });
    }
    if (invest / total < 0.1) {
      recs.push({ key: 'increase-investing', message: 'Consider allocating at least 10% of your income to investments/SIP.' });
    }

    // Suggest top category to cut if it dominates
    const cats = Object.entries(byCategory).sort((a,b)=>b[1]-a[1]);
    if (cats.length && cats[0][1] / total > 0.25) {
      recs.push({ key: 'cut-category', message: `Your spending on ${cats[0][0]} is ${Math.round((cats[0][1]/total)*100)}% of tracked cash — consider reducing it.` });
    }
  }

  // Goal based suggestions
  const goals = await Goal.find({ user: userId, isActive: true }).limit(5);
  if (goals.length === 0) recs.push({ key: 'no-goals', message: 'Set long-term goals (e.g., emergency fund, retirement) to get tailored plans.' });

  return recs;
}

module.exports = { getRecommendationsForUser };
