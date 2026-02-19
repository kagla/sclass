export const ROLES = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  PARENT: "PARENT",
  STUDENT: "STUDENT",
} as const

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "관리자",
  TEACHER: "강사",
  PARENT: "학부모",
  STUDENT: "학생",
}

export const DAY_LABELS: Record<string, string> = {
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
  SUNDAY: "일요일",
}

export const ENROLLMENT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "수강중",
  DROPPED: "수강취소",
  COMPLETED: "수강완료",
}

export const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  PRESENT: "출석",
  ABSENT: "결석",
  LATE: "지각",
  EXCUSED: "사유결석",
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "대기",
  PAID: "완료",
  FAILED: "실패",
  CANCELLED: "취소",
  REFUNDED: "환불",
}

export const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "활성",
  PAUSED: "일시정지",
  CANCELLED: "취소",
  EXPIRED: "만료",
}

export const CONSULTATION_STATUS_LABELS: Record<string, string> = {
  PENDING: "대기",
  CONFIRMED: "확인",
  COMPLETED: "완료",
  CANCELLED: "취소",
}

export const BOARD_TYPE_LABELS: Record<string, string> = {
  NOTICE: "공지사항",
  PARENT: "학부모 게시판",
  INQUIRY: "문의 게시판",
}

export const ITEMS_PER_PAGE = 10
