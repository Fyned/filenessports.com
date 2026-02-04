import crypto from 'crypto'

// iyzico API yapılandırması
const API_KEY = process.env.IYZICO_API_KEY || ''
const SECRET_KEY = process.env.IYZICO_SECRET_KEY || ''
const BASE_URL = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'

// Ödeme için gerekli tipler
export interface IyzicoAddress {
  contactName: string
  city: string
  country: string
  address: string
  zipCode?: string
}

export interface IyzicoBuyer {
  id: string
  name: string
  surname: string
  email: string
  gsmNumber?: string
  identityNumber: string
  registrationAddress: string
  city: string
  country: string
  ip: string
}

export interface IyzicoBasketItem {
  id: string
  name: string
  category1: string
  category2?: string
  itemType: 'PHYSICAL' | 'VIRTUAL'
  price: string
}

export interface IyzicoPaymentCard {
  cardHolderName: string
  cardNumber: string
  expireMonth: string
  expireYear: string
  cvc: string
  registerCard?: 0 | 1
}

export interface CreatePaymentRequest {
  locale?: 'tr' | 'en'
  conversationId: string
  price: string
  paidPrice: string
  currency: 'TRY' | 'USD' | 'EUR' | 'GBP'
  installment: number
  basketId: string
  paymentChannel?: 'WEB' | 'MOBILE' | 'MOBILE_WEB'
  paymentGroup?: 'PRODUCT' | 'LISTING' | 'SUBSCRIPTION'
  paymentCard: IyzicoPaymentCard
  buyer: IyzicoBuyer
  shippingAddress: IyzicoAddress
  billingAddress: IyzicoAddress
  basketItems: IyzicoBasketItem[]
  callbackUrl?: string
}

// iyzico için hash oluşturma - PKI string
function generatePKIString(request: any): string {
  let pki = '['

  for (const key in request) {
    if (request.hasOwnProperty(key)) {
      const value = request[key]

      if (value === null || value === undefined) {
        continue
      }

      if (Array.isArray(value)) {
        pki += `${key}=[`
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            pki += '['
            for (const itemKey in item) {
              if (item[itemKey] !== null && item[itemKey] !== undefined) {
                pki += `${itemKey}=${item[itemKey]},`
              }
            }
            pki = pki.slice(0, -1) + ']'
          } else {
            pki += item
          }
          if (index < value.length - 1) pki += ', '
        })
        pki += '],'
      } else if (typeof value === 'object') {
        pki += `${key}=[`
        for (const subKey in value) {
          if (value[subKey] !== null && value[subKey] !== undefined) {
            pki += `${subKey}=${value[subKey]},`
          }
        }
        pki = pki.slice(0, -1) + '],'
      } else {
        pki += `${key}=${value},`
      }
    }
  }

  pki = pki.slice(0, -1) + ']'
  return pki
}

// Authorization header oluşturma
function generateAuthorizationHeaderV1(request: any): { authorization: string; randomKey: string } {
  const randomKey = Date.now().toString() + Math.random().toString(36).substring(2, 8)
  const pkiString = generatePKIString(request)
  const hashString = API_KEY + randomKey + SECRET_KEY + pkiString
  const hash = crypto.createHash('sha1').update(hashString, 'utf8').digest('base64')

  return {
    authorization: `IYZWS ${API_KEY}:${hash}`,
    randomKey,
  }
}

// iyzico API'ye istek gönderme
async function makeRequest(endpoint: string, data: any): Promise<any> {
  const url = `${BASE_URL}${endpoint}`
  const { authorization, randomKey } = generateAuthorizationHeaderV1(data)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authorization,
        'x-iyzi-rnd': randomKey,
        'x-iyzi-client-version': 'iyzipay-node-2.0.0',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('iyzico API error:', error)
    throw error
  }
}

// 3D Secure ödeme başlatma
export async function createThreedsPayment(request: CreatePaymentRequest): Promise<any> {
  return makeRequest('/payment/3dsecure/initialize', request)
}

// 3D Secure ödeme tamamlama
export async function completeThreedsPayment(paymentId: string, conversationId?: string): Promise<any> {
  return makeRequest('/payment/3dsecure/auth', {
    locale: 'tr',
    conversationId: conversationId || '',
    paymentId: paymentId,
  })
}

// Normal ödeme (3D Secure olmadan)
export async function createPayment(request: CreatePaymentRequest): Promise<any> {
  return makeRequest('/payment/auth', request)
}

// Taksit seçeneklerini getir
export async function getInstallmentInfo(binNumber: string, price: string): Promise<any> {
  return makeRequest('/payment/iyzipos/installment', {
    locale: 'tr',
    conversationId: Date.now().toString(),
    binNumber: binNumber,
    price: price,
  })
}

// Ödeme sorgulama
export async function retrievePayment(paymentId: string, conversationId?: string): Promise<any> {
  return makeRequest('/payment/detail', {
    locale: 'tr',
    conversationId: conversationId || '',
    paymentId: paymentId,
  })
}

// İptal işlemi
export async function cancelPayment(paymentId: string, ip: string, reason?: string): Promise<any> {
  return makeRequest('/payment/cancel', {
    locale: 'tr',
    conversationId: Date.now().toString(),
    paymentId: paymentId,
    ip: ip,
    reason: reason || 'other',
  })
}

// İade işlemi
export async function refundPayment(
  paymentTransactionId: string,
  price: string,
  ip: string,
  reason?: string
): Promise<any> {
  return makeRequest('/payment/refund', {
    locale: 'tr',
    conversationId: Date.now().toString(),
    paymentTransactionId: paymentTransactionId,
    price: price,
    ip: ip,
    reason: reason || 'other',
  })
}

// Yardımcı fonksiyon: Fiyatı iyzico formatına çevir
export function formatIyzicoPrice(price: number): string {
  return price.toFixed(2)
}

// Yardımcı fonksiyon: Rastgele conversation ID oluştur
export function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`
}
