"use server"

const PORTONE_API_URL = "https://api.iamport.kr"

export async function getPortOneToken(): Promise<string> {
  const response = await fetch(`${PORTONE_API_URL}/users/getToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imp_key: process.env.PORTONE_IMP_KEY,
      imp_secret: process.env.PORTONE_IMP_SECRET,
    }),
  })

  const data = await response.json()

  if (data.code !== 0) {
    throw new Error(`PortOne 토큰 발급 실패: ${data.message}`)
  }

  return data.response.access_token
}

export async function verifyPayment(impUid: string) {
  const token = await getPortOneToken()

  const response = await fetch(`${PORTONE_API_URL}/payments/${impUid}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json()

  if (data.code !== 0) {
    throw new Error(`결제 검증 실패: ${data.message}`)
  }

  return data.response as {
    imp_uid: string
    merchant_uid: string
    amount: number
    status: string
    pay_method: string
    paid_at: number
    receipt_url: string
    fail_reason: string | null
    cancel_amount: number
  }
}

export async function requestBillingPayment(
  customerUid: string,
  merchantUid: string,
  amount: number,
  name: string
) {
  const token = await getPortOneToken()

  const response = await fetch(`${PORTONE_API_URL}/subscribe/payments/again`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customer_uid: customerUid,
      merchant_uid: merchantUid,
      amount,
      name,
    }),
  })

  const data = await response.json()

  if (data.code !== 0) {
    throw new Error(`정기결제 실패: ${data.message}`)
  }

  return data.response as {
    imp_uid: string
    merchant_uid: string
    amount: number
    status: string
    paid_at: number
    receipt_url: string
    fail_reason: string | null
  }
}
