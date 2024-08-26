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
            metadata: {
              item_data: `${item.name} x ${
                item.quantity || 1
              } | ${JSON.stringify(item.options)}`,
            },
          },
          unit_amount: Math.floor(item.price * 100),
        },
        quantity: item.quantity || 1,
      })),
      locale: 'it',
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['IT'],
      },
      billing_address_collection: 'required',
      //       metadata: {
      //         cart_data: `Iniz. Carrello: ${format(
      //           new Date(cart.createdAt),
      //           'dd/MM/yyyy HH:mm'
      //         )}
      // dettaglio oggetti: `,
      //       },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 490,
              currency: 'eur',
            },
            tax_code: 'txcd_99999999',
            display_name: 'Spedizione tramite corriere',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
      custom_fields: [
        {
          key: 'license',
          label: {
            type: 'custom',
            custom: 'Se hai una licenza, inseriscila per aggiornarla.',
          },
          type: 'text',
          optional: true,
        },
      ],
      success_url: `${PUBLIC_WEBSITE_URL}/checkout-success`,
      cancel_url: `${PUBLIC_WEBSITE_URL}/checkout-cancel`,
      // return_url: `${PUBLIC_WEBSITE_URL}#cart`,
    });

    res.send({ checkout_url: session.url || PUBLIC_WEBSITE_URL });
  })
);

export { router as postSalesCheckoutRouter };
