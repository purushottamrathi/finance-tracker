const axios = require('axios');

async function main() {
  const base = process.env.API_BASE || 'http://localhost:5000/api';
  console.log('Validating backend at', base);

  try {
    // login
    const loginRes = await axios.post(`${base}/auth/login`, {
      email: 'demo+user@example.com',
      password: 'password123',
    });
    const token = loginRes.data.token;
    console.log('Login OK, token length:', token.length);

    const headers = { Authorization: `Bearer ${token}` };

    // settings
    const settings = await axios.get(`${base}/settings`, { headers });
    console.log('GET /settings ->', settings.status, JSON.stringify(settings.data));

    // budgets for current month/year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const budgets = await axios.get(`${base}/budgets?month=${month}&year=${year}`, { headers });
    console.log(`GET /budgets?month=${month}&year=${year} ->`, budgets.status, 'count=', Array.isArray(budgets.data) ? budgets.data.length : 0);

    // transactions
    const tx = await axios.get(`${base}/transactions?limit=5`, { headers });
    console.log('GET /transactions?limit=5 ->', tx.status, 'count=', Array.isArray(tx.data) ? tx.data.length : 0);

    console.log('Validation completed successfully');
    process.exit(0);
  } catch (err) {
    if (err.response) {
      console.error('Request failed:', err.response.status, err.response.data);
    } else {
      console.error('Validation error', err.message);
    }
    process.exit(1);
  }
}

main();
