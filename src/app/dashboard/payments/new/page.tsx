import { getStudentsForPayment } from "@/actions/payment"
import { NewPaymentForm } from "./new-payment-form"

export const metadata = { title: "새 결제" }

export default async function NewPaymentPage() {
  const students = await getStudentsForPayment()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">새 결제</h1>
        <p className="text-muted-foreground">학생을 선택하고 결제를 진행합니다.</p>
      </div>
      <NewPaymentForm students={students} />
    </div>
  )
}
