// Redireciona para o checkout customizado com Payment Element (cartão, débito, boleto)
module.exports = (req, res) => {
  res.redirect(302, '/checkout?coupon=PROMO1MES');
};
