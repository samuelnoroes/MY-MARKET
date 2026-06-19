const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { nome, whatsapp, imobiliaria_cidade, coupon } = req.body;

  if (!nome || !whatsapp) {
    return res.status(400).json({ error: 'Nome e WhatsApp são obrigatórios.' });
  }

  try {
    const customer = await stripe.customers.create({
      name: nome,
      metadata: {
        whatsapp,
        imobiliaria_cidade: imobiliaria_cidade || '',
      },
    });

    const subParams = {
      customer: customer.id,
      items: [{ price: 'price_1Tj0OMCpMCWdzTTOQGarlgSz' }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    };

    if (coupon) {
      subParams.discounts = [{ coupon }];
    }

    const subscription = await stripe.subscriptions.create(subParams);

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
