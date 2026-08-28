// Types for Republic Airways Leadership store orders.

/** One product chosen on the products page (sessionStorage). */
export interface ProductSelection {
  id: string
  name: string
  sku: string
  imageUrl: string
  size?: string
  color?: string
}

/** User-entered fields on /shipping (sessionStorage). Packages ship to first + last name. */
export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  address: string
  address2: string
  city: string
  state: string
  zip: string
  country: string
}

/** Row in ra_leadership_orders — one product per order. */
export interface Order {
  id: string
  order_number: string
  email: string
  first_name: string
  last_name: string
  product_id?: string | null
  product_name: string
  sku: string
  color?: string | null
  size?: string | null
  price: number | string
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
