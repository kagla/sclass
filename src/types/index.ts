import type { Role } from "@prisma/client"

export type { Role } from "@prisma/client"

export type SearchParams = {
  page?: string
  search?: string
  sort?: string
  order?: "asc" | "desc"
}

export type PaginatedResult<T> = {
  data: T[]
  total: number
  pageCount: number
  currentPage: number
}

export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: Role
}
