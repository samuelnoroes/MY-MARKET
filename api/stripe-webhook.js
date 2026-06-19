// api/stripe-webhook.js
// Recebe webhook do Stripe (HTTPS via Vercel) e repassa para o n8n (HTTP na VPS)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = JSON.stringify(req.body);
    const response = await fetch('http://2.25.128.157:5678/webhook/stripe/mymarket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': req.headers['stripe-signature'] || '',
      },
      body,
    });
    res.status(200).json({ forwarded: true, n8n_status: response.status });
  } catch (err) {
    console.error('[stripe-webhook] Erro:', err.message);
    res.status(200).json({ forwarded: false, error: err.message });
  }
};
