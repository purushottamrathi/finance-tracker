// Simple financial simulation helpers
function simulateSIP({ monthlyAmount = 1000, years = 10, annualReturn = 0.08 }) {
  const months = years * 12;
  const monthlyRate = Math.pow(1 + annualReturn, 1 / 12) - 1;
  let balance = 0;
  const series = [];
  for (let i = 1; i <= months; i++) {
    balance = (balance + monthlyAmount) * (1 + monthlyRate);
    if (i % 12 === 0) series.push({ year: i / 12, balance: Math.round(balance) });
  }
  return { final: Math.round(balance), series };
}

module.exports = { simulateSIP };
