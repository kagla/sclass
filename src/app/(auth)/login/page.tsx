import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/components/forms/login-form"

export const metadata = { title: "로그인" }

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">S-Class</CardTitle>
        <CardDescription>학원 관리 시스템에 로그인하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            회원가입
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
