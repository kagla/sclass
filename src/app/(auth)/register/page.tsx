import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RegisterForm } from "@/components/forms/register-form"

export const metadata = { title: "회원가입" }

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
        <CardDescription>S-Class 학원 관리 시스템에 가입하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            로그인
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
