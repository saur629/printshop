import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date) {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const ORDER_STATUS_COLORS = {
  pending:         'bg-yellow-100 text-yellow-800',
  confirmed:       'bg-blue-100 text-blue-800',
  'in-production': 'bg-purple-100 text-purple-800',
  'quality-check': 'bg-indigo-100 text-indigo-800',
  shipped:         'bg-orange-100 text-orange-800',
  delivered:       'bg-green-100 text-green-800',
  cancelled:       'bg-red-100 text-red-800',
  refunded:        'bg-gray-100 text-gray-800',
}

export const ORDER_STATUS_STEPS = [
  { key: 'pending',        label: 'Order Placed',  icon: '📋' },
  { key: 'confirmed',      label: 'Confirmed',      icon: '✅' },
  { key: 'in-production',  label: 'In Production', icon: '🖨️' },
  { key: 'quality-check',  label: 'Quality Check', icon: '🔍' },
  { key: 'shipped',        label: 'Shipped',        icon: '🚚' },
  { key: 'delivered',      label: 'Delivered',      icon: '📦' },
]

export const PRODUCT_CATEGORIES = [
  { value: 'business-cards', label: 'Business Cards', icon: '💼' },
  { value: 'flyers',         label: 'Flyers',          icon: '📄' },
  { value: 'banners',        label: 'Banners',         icon: '🏳️' },
  { value: 'brochures',      label: 'Brochures',       icon: '📰' },
  { value: 'posters',        label: 'Posters',         icon: '🖼️' },
  { value: 'stickers',       label: 'Stickers',        icon: '⭐' },
  { value: 'envelopes',      label: 'Envelopes',       icon: '✉️' },
  { value: 'notebooks',      label: 'Notebooks',       icon: '📓' },
]