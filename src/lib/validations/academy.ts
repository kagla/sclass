import { z } from "zod"

export const academySchema = z.object({
  name: z.string().min(1, "학원명을 입력해주세요"),
  address: z.string().optional(),
  detailAddress: z.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email("올바른 이메일을 입력해주세요").optional().or(z.literal("")),
  description: z.string().optional(),
  visionStatement: z.string().optional(),
})

export type AcademyInput = z.infer<typeof academySchema>
