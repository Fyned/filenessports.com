import { NextRequest, NextResponse } from 'next/server'
import { getInstallmentInfo } from '@/lib/iyzico'

export async function POST(request: NextRequest) {
  try {
    const { binNumber, price } = await request.json()

    if (!binNumber || binNumber.length < 6) {
      return NextResponse.json(
        { error: 'Geçerli bir kart numarası girin' },
        { status: 400 }
      )
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { error: 'Geçerli bir tutar girin' },
        { status: 400 }
      )
    }

    // İlk 6 hane (BIN numarası)
    const bin = binNumber.replace(/\s/g, '').substring(0, 6)

    const result = await getInstallmentInfo(bin, price.toFixed(2))

    if (result.status === 'success' && result.installmentDetails) {
      const installmentDetails = result.installmentDetails[0]

      if (!installmentDetails) {
        return NextResponse.json({
          success: true,
          cardType: 'UNKNOWN',
          cardAssociation: 'UNKNOWN',
          cardFamily: 'UNKNOWN',
          installments: [
            { installment: 1, totalPrice: price, installmentPrice: price }
          ],
        })
      }

      return NextResponse.json({
        success: true,
        cardType: installmentDetails.cardType,
        cardAssociation: installmentDetails.cardAssociation,
        cardFamily: installmentDetails.cardFamilyName,
        bankName: installmentDetails.bankName,
        bankCode: installmentDetails.bankCode,
        installments: installmentDetails.installmentPrices?.map((inst: any) => ({
          installment: inst.installmentNumber,
          totalPrice: parseFloat(inst.totalPrice),
          installmentPrice: parseFloat(inst.installmentPrice),
        })) || [
          { installment: 1, totalPrice: price, installmentPrice: price }
        ],
      })
    } else {
      // Hata durumunda tek çekim döndür
      return NextResponse.json({
        success: true,
        cardType: 'UNKNOWN',
        installments: [
          { installment: 1, totalPrice: price, installmentPrice: price }
        ],
      })
    }
  } catch (error: any) {
    console.error('Installment info error:', error)
    return NextResponse.json(
      { error: error.message || 'Taksit bilgisi alınamadı' },
      { status: 500 }
    )
  }
}
