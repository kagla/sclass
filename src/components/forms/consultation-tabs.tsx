"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConsultationForm } from "./consultation-form"
import { ConsultationLookup } from "./consultation-lookup"

export function ConsultationTabs() {
  return (
    <Tabs defaultValue="apply">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="apply">상담 신청</TabsTrigger>
        <TabsTrigger value="lookup">신청 조회 / 수정</TabsTrigger>
      </TabsList>
      <TabsContent value="apply" className="mt-6">
        <ConsultationForm />
      </TabsContent>
      <TabsContent value="lookup" className="mt-6">
        <ConsultationLookup />
      </TabsContent>
    </Tabs>
  )
}
