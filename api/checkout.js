const Stripe = require('stripe');

module.exports = async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: 'price_1Tj0OMCpMCWdzTTOQGarlgSz', quantity: 1 },
      ],
      discounts: [{ coupon: 'PROMO1MES' }],
      custom_fields: [
        {
          key: 'nome',
          label: { type: 'custom', custom: 'Nome completo' },
          type: 'text',
          optional: false,
        },
        {
          key: 'whatsapp',
          label: { type: 'custom', custom: 'WhatsApp (com DDD)' },
          type: 'text',
          optional: false,
        },
        {
          key: 'imobiliaria_cidade',
          label: { type: 'custom', custom: 'Imobili\u00e1ria \u00b7 Cidade / UF' },
          type: 'text',
          optional: false,
        },
      ],
      success_url: 'https://mymarket.myasset.tech/obrigado',
      cancel_url: 'https://mymarket.myasset.tech',
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar sess\u00e3o de checkout.');
  }
};
