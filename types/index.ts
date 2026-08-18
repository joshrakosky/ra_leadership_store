// Types for Republic Airways Airport Operations vest orders.

/** One vest + size/color chosen on the vest page (sessionStorage). */
export interface VestSelection {
  style: string
  color: string
  size: string
  sku: string
  imageUrl: string
}

/** User-entered fields on /shipping (sessionStorage). Address is locked to HQ. */
export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
}

/** Row in ra_ao_orders — one vest per order. */
export interface Order {
  id: string
  order_number: string
  email: string
  first_name: string
  last_name: string
  style: string
  color: string
  size: string
  sku: string
  shipping_name: string
  shipping_attention?: string | null
  shipping_address: string
  shipping_address2?: string | null
  shipping_city: string
  shipping_state: string
  shipping_zip: string
  shipping_country: string
  created_at: string
}
