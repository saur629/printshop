import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'noreply@printcraft.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendOrderConfirmationEmail(order, email, name) {
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Order Confirmed — ${order.orderNumber} | PrintCraft`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1a1714; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #f97316; font-size: 24px; margin: 0;">PrintCraft</h1>
          </div>
          <h2 style="color: #1a1714;">Hi ${name}, your order is confirmed! 🎉</h2>
          <p style="color: #7a6f5e;">Thank you for your order. We've received your payment and your files are being reviewed.</p>
          
          <div style="background: #f8f7f4; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #1a1714;"><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p style="margin: 8px 0 0; color: #1a1714;"><strong>Total:</strong> $${order.total?.toFixed(2)}</p>
          </div>

          <h3 style="color: #1a1714;">Items Ordered</h3>
          ${order.items?.map(item => `
            <div style="border-bottom: 1px solid #eeece6; padding: 12px 0;">
              <p style="margin: 0; font-weight: 600; color: #1a1714;">${item.productName}</p>
              <p style="margin: 4px 0 0; color: #7a6f5e; font-size: 14px;">Qty: ${item.quantity} · ${item.size || ''}</p>
              <p style="margin: 4px 0 0; color: #1a1714; font-weight: 600;">$${item.totalPrice?.toFixed(2)}</p>
            </div>
          `).join('')}

          <div style="margin-top: 24px; text-align: center;">
            <a href="${APP_URL}/orders/${order._id}" 
               style="background: #f97316; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              Track Your Order
            </a>
          </div>

          <p style="color: #7a6f5e; font-size: 13px; text-align: center; margin-top: 32px;">
            Questions? Reply to this email or contact us at hello@printcraft.com
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send order confirmation email:', err)
  }
}

export async function sendStatusUpdateEmail(order, email, name, newStatus, message) {
  const statusLabels = {
    'confirmed':      'Order Confirmed',
    'in-production':  'Your Order is Being Printed',
    'quality-check':  'Quality Check in Progress',
    'shipped':        'Your Order Has Shipped',
    'delivered':      'Order Delivered',
  }

  const label = statusLabels[newStatus]
  if (!label) return

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `${label} — ${order.orderNumber} | PrintCraft`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1a1714; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #f97316; font-size: 24px; margin: 0;">PrintCraft</h1>
          </div>
          <h2 style="color: #1a1714;">Hi ${name}, update on your order</h2>
          <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 600; color: #c2410c; font-size: 18px;">${label}</p>
            <p style="margin: 8px 0 0; color: #7c2d12;">${message || `Your order ${order.orderNumber} status has been updated.`}</p>
          </div>
          ${order.trackingNumber ? `
            <div style="background: #f8f7f4; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0; color: #7a6f5e; font-size: 14px;">Tracking Number</p>
              <p style="margin: 4px 0 0; font-weight: 700; font-size: 18px; color: #1a1714; font-family: monospace;">${order.trackingNumber}</p>
              ${order.trackingCarrier ? `<p style="margin: 4px 0 0; color: #7a6f5e; font-size: 13px;">via ${order.trackingCarrier}</p>` : ''}
            </div>
          ` : ''}
          <div style="margin-top: 24px; text-align: center;">
            <a href="${APP_URL}/orders/${order._id}" 
               style="background: #f97316; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              View Order Details
            </a>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send status update email:', err)
  }
}
