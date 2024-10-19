import { inject, Injectable } from '@angular/core';
import { UnknownType } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private _httpService = inject(HttpService);

  public getInvoice(invoiceId: string) {
    return this._httpService.get<IStripeInvoice>('/v1/stripe/invoice', {
      invoiceId,
    });
  }

  public getInvoices() {
    return this._httpService.get<IStripeInvoice[]>('/v1/stripe/invoices');
  }
}

export const provideStripeService = () => ({
  provide: StripeService,
  useFactory: () => new StripeService(),
});

export interface IStripeInvoice {
  id: string;
  object: string;
  account_country: string;
  account_name: string;
  account_tax_ids: null;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  amount_shipping: number;
  application: null;
  application_fee_amount: null;
  attempt_count: number;
  attempted: boolean;
  auto_advance: boolean;
  automatic_tax: Automatic_tax;
  billing_reason: string;
  charge: null;
  collection_method: string;
  created: number;
  currency: string;
  custom_fields: null;
  customer: string;
  customer_address: {
    city: string;
    country: string;
    line1: string;
    line2: null;
    postal_code: string;
    state: string;
  };
  customer_email: string;
  customer_name: string;
  customer_phone: null;
  customer_shipping: IStripeCustomerShipping;
  customer_tax_exempt: string;
  customer_tax_ids: any[];
  default_payment_method: null;
  default_source: null;
  default_tax_rates: any[];
  description: null;
  discount: null;
  discounts: any[];
  due_date: null;
  ending_balance: null;
  footer: null;
  from_invoice: null;
  hosted_invoice_url: null;
  invoice_pdf: null;
  issuer: Issuer;
  last_finalization_error: null;
  latest_revision: null;
  lines: Lines;
  livemode: boolean;
  metadata: Metadata;
  next_payment_attempt: null;
  number: null;
  on_behalf_of: null;
  paid: boolean;
  paid_out_of_band: boolean;
  payment_intent: null;
  payment_settings: Payment_settings;
  period_end: number;
  period_start: number;
  post_payment_credit_notes_amount: number;
  pre_payment_credit_notes_amount: number;
  quote: null;
  receipt_number: null;
  rendering_options: null;
  shipping_cost: null;
  shipping_details: null;
  starting_balance: number;
  statement_descriptor: null;
  status: string;
  status_transitions: Status_transitions;
  subscription: null;
  subtotal: number;
  subtotal_excluding_tax: number;
  tax: null;
  test_clock: null;
  total: number;
  total_discount_amounts: any[];
  total_excluding_tax: number;
  total_tax_amounts: any[];
  transfer_data: null;
  webhooks_delivered_at: number;
}
interface Automatic_tax {
  enabled: boolean;
  liability: null;
  status: null;
}
interface Issuer {
  type: string;
}
interface Lines {
  object: string;
  data: Line[];
  has_more: boolean;
  total_count: number;
  url: string;
}
interface Metadata {}
interface Payment_settings {
  default_mandate: null;
  payment_method_options: null;
  payment_method_types: null;
}
interface Status_transitions {
  finalized_at: null;
  marked_uncollectible_at: null;
  paid_at: null;
  voided_at: null;
}

type IStripeCustomerShipping = {
  address: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
  };
  name: string;
  phone: string;
};

type Line = {
  id: string;
  object: string;
  amount: number;
  amount_excluding_tax: number;
  currency: string;
  description: string;
  discount_amounts: any[];
  discountable: boolean;
  discounts: any[];
  invoice_item: string;
  livemode: boolean;
  metadata: Metadata;
  period: UnknownType;
  plan: UnknownType;
  price: Price;
  proration: boolean;
  quantity: number;
  proration_details: UnknownType;
  subscription: string;
  subscription_item: string;
  tax_amounts: any[];
  tax_rates: any[];
  type: string;
  unit_amount_excluding_tax: number;
};

interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: null;
  livemode: boolean;
  lookup_key: null;
  metadata: Metadata;
  nickname: null;
  product: Product;
  recurring: null;
  tax_behavior: string;
  tiers_mode: null;
  transform_quantity: null;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

interface Product {
  product?: Product;
  id?: string;
  object?: string;
  active?: boolean;
  attributes?: any[];
  created?: number;
  default_price?: null;
  description?: null;
  images?: any[];
  livemode?: boolean;
  marketing_features?: any[];
  metadata?: Metadata;
  name?: string;
  package_dimensions?: null;
  shippable?: null;
  statement_descriptor?: null;
  tax_code?: null;
  type?: string;
  unit_label?: null;
  updated?: number;
  url?: null;
}
interface Metadata {
  item_data?: string;
  options?: string;
}
