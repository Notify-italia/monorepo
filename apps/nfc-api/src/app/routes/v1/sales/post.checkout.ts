import { INotifyEcommerceCart } from '@notify/interfaces';
import { declareEnvs, requestHandler } from '@notify/nfc-api-core';
import { Router } from 'express';
import { body } from 'express-validator';
import Stripe from 'stripe';

const { STRIPE_SECRET_KEY, PUBLIC_WEBSITE_URL } = declareEnvs([
  'STRIPE_SECRET_KEY',
  'PUBLIC_WEBSITE_URL',
]);

const stripe = new Stripe(STRIPE_SECRET_KEY);

const router = Router();

router.post(
  '/',
  body('cart').isObject().withMessage('Carrello non valido'),
  requestHandler(async (req, res) => {
    const cart: INotifyEcommerceCart = req.body.cart;

    const session = await stripe.checkout.sessions.create({
      line_items: cart.items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',

      // success_url: `${YOUR_DOMAIN}/success.html`,
      // cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.redirect(303, session.url || PUBLIC_WEBSITE_URL);
  })
);

export { router as postSalesCheckoutRouter };
