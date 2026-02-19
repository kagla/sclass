"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PaymentButton } from "@/components/payment/payment-button"

interface Student {
  id: string
  user: { name: string | null }
}

interface NewPaymentFormProps {
  students: Student[]
}

export function NewPaymentForm({ students }: NewPaymentFormProps) {
  const [studentId, setStudentId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>결제 정보 입력</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="student">학생 선택 *</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="학생을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">금액 (원) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">설명 *</Label>
          <Textarea
            id="description"
            placeholder="예: 2024년 3월 수학 수강료"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="pt-4">
          <PaymentButton
            studentId={studentId}
            amount={Number(amount) || 0}
            description={description}
          />
        </div>
      </CardContent>
    </Card>
  )
}
