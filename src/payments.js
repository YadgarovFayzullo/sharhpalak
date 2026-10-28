/**
 * Click / Payme checkout. The payment backend is not connected yet: set VITE_PAY_URL (POST, JSON
 * { amount, method, purpose, ref } → { url }) and the visitor is sent to the returned checkout page.
 * Until then payments run in test mode: nothing is charged and the flow simply continues.
 */
const URL = import.meta.env.VITE_PAY_URL

export const paymentsLive = Boolean(URL)

export const PAY_METHODS = ['click', 'payme']

/** Starts a payment. Resolves { url } to redirect to, or { test: true } in test mode. */
export async function startPayment({ amount, method, purpose, ref }) {
  if (!URL) return { test: true }
  const r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, method, purpose, ref, returnUrl: window.location.href }) })
  if (!r.ok) throw new Error(`payment ${r.status}`)
  return r.json()
}
