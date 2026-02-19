import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12)
  const userPassword = await bcrypt.hash("password123", 12)

  // ============================================
  // 1. Admin
  // ============================================
  const admin = await prisma.user.upsert({
    where: { email: "admin@sclass.kr" },
    update: {},
    create: {
      name: "관리자",
      email: "admin@sclass.kr",
      password: hashedPassword,
      role: "ADMIN",
      phone: "010-0000-0000",
    },
  })

  // ============================================
  // 2. Academy
  // ============================================
  const academy = await prisma.academy.upsert({
    where: { id: "default-academy" },
    update: {},
    create: {
      id: "default-academy",
      name: "S-Class 학원",
      address: "서울특별시 강남구 테헤란로 123",
      detailAddress: "S-Class 빌딩 3~5층",
      phone: "02-555-1234",
      fax: "02-555-1235",
      email: "info@sclass.kr",
      description:
        "S-Class 학원은 2010년 개원 이래 체계적인 교육 시스템과 우수한 강사진을 바탕으로 수많은 학생들의 꿈을 실현해 왔습니다.\n\n개인별 맞춤 커리큘럼, 소수 정예 수업, 철저한 학습 관리를 통해 학생 한 명 한 명의 잠재력을 극대화합니다.\n\n매년 서울대, 연세대, 고려대 등 상위권 대학 합격생을 다수 배출하고 있으며, 학부모님과의 긴밀한 소통을 통해 가정과 학원이 함께 성장하는 교육 환경을 만들어 가고 있습니다.",
      operatingHours:
        "평일: 14:00 ~ 22:00\n토요일: 10:00 ~ 18:00\n일요일 및 공휴일: 휴원",
      visionStatement:
        "모든 학생이 자신의 잠재력을 발견하고, 꿈을 향해 도약할 수 있도록 최고의 교육 환경을 제공합니다.",
    },
  })

  // ============================================
  // 3. Boards
  // ============================================
  const boardTypes = [
    { name: "공지사항", type: "NOTICE" as const },
    { name: "학부모 게시판", type: "PARENT" as const },
    { name: "문의 게시판", type: "INQUIRY" as const },
  ]

  const boards: Record<string, { id: string }> = {}
  for (const board of boardTypes) {
    const b = await prisma.board.upsert({
      where: { id: `default-${board.type.toLowerCase()}` },
      update: {},
      create: {
        id: `default-${board.type.toLowerCase()}`,
        academyId: academy.id,
        name: board.name,
        type: board.type,
      },
    })
    boards[board.type] = b
  }

  // ============================================
  // 4. Classrooms
  // ============================================
  const classroomData = [
    { name: "301호", capacity: 30, floor: "3층" },
    { name: "302호", capacity: 20, floor: "3층" },
    { name: "303호", capacity: 15, floor: "3층" },
    { name: "401호", capacity: 30, floor: "4층" },
    { name: "402호", capacity: 20, floor: "4층" },
    { name: "501호 (자습실)", capacity: 40, floor: "5층" },
  ]

  const classrooms = []
  for (const c of classroomData) {
    const classroom = await prisma.classroom.create({
      data: { academyId: academy.id, ...c },
    })
    classrooms.push(classroom)
  }

  // ============================================
  // 5. Teachers (8명)
  // ============================================
  const teacherData = [
    {
      name: "김수학",
      email: "kim.math@sclass.kr",
      phone: "010-1111-0001",
      specialization: "수학",
      bio: "서울대학교 수학교육과 졸업. 15년 경력의 수학 전문 강사로, 개념 이해 중심의 수업으로 수많은 학생들의 수학 실력 향상을 이끌었습니다. 수능 수학 만점자 다수 배출.",
    },
    {
      name: "이영어",
      email: "lee.eng@sclass.kr",
      phone: "010-1111-0002",
      specialization: "영어",
      bio: "연세대학교 영어영문학과 졸업, 미국 UCLA 석사. 원어민 수준의 영어 실력과 체계적인 문법 교육으로 학생들의 영어 성적을 비약적으로 끌어올립니다.",
    },
    {
      name: "박국어",
      email: "park.kor@sclass.kr",
      phone: "010-1111-0003",
      specialization: "국어",
      bio: "고려대학교 국어국문학과 졸업. 12년간 국어 전문 강사로 활동하며, 비문학 독해와 문학 분석을 쉽고 재미있게 가르칩니다. 국어 1등급 비율 학원 내 최고.",
    },
    {
      name: "최과학",
      email: "choi.sci@sclass.kr",
      phone: "010-1111-0004",
      specialization: "과학 (물리/화학)",
      bio: "KAIST 물리학과 졸업. 과학적 사고력을 키우는 실험 중심 수업을 진행합니다. 물리올림피아드 금상 수상 경력, 과학고 입시 전문.",
    },
    {
      name: "정사회",
      email: "jung.social@sclass.kr",
      phone: "010-1111-0005",
      specialization: "사회탐구",
      bio: "서울대학교 사회학과 졸업. 한국사, 사회문화, 생활과 윤리 전문. 시사 이슈를 활용한 흥미로운 수업으로 학생들의 사회탐구 만점을 이끌어냅니다.",
    },
    {
      name: "한논술",
      email: "han.essay@sclass.kr",
      phone: "010-1111-0006",
      specialization: "논술",
      bio: "서울대학교 철학과 졸업, 동 대학원 석사. 논리적 사고력과 글쓰기 능력을 동시에 키워주는 논술 수업을 진행합니다. 서울대/연세대/고려대 논술 합격자 50명 이상 배출.",
    },
    {
      name: "윤수학",
      email: "yoon.math@sclass.kr",
      phone: "010-1111-0007",
      specialization: "수학",
      bio: "포항공대 수학과 졸업. 심화 수학 및 경시대회 전문. 수학적 직관을 키우는 독창적인 교수법으로 최상위권 학생들에게 큰 호응을 얻고 있습니다.",
    },
    {
      name: "서영어",
      email: "seo.eng@sclass.kr",
      phone: "010-1111-0008",
      specialization: "영어",
      bio: "이화여자대학교 영어교육과 졸업, 영국 옥스포드 TESOL 수료. 영어 회화와 듣기 중심의 실용 영어 교육 전문. 토플/텝스 고득점 전략 강의.",
    },
  ]

  const teachers = []
  for (const t of teacherData) {
    const existing = await prisma.user.findUnique({ where: { email: t.email } })
    if (existing) continue

    const user = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        password: userPassword,
        role: "TEACHER",
        phone: t.phone,
      },
    })
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        academyId: academy.id,
        specialization: t.specialization,
        bio: t.bio,
        hireDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), 1),
      },
    })
    teachers.push(teacher)
  }

  // ============================================
  // 6. Subjects (10개 과목)
  // ============================================
  const subjectData = [
    { name: "수학 기본반", description: "기초 개념부터 탄탄하게! 수학에 자신감을 불어넣는 기본반입니다. 교과서 핵심 개념 정리와 기본 문제 풀이를 중심으로 수업합니다.", level: "기본", maxStudents: 25 },
    { name: "수학 심화반", description: "상위권을 목표로 하는 학생들을 위한 심화 수학 과정입니다. 고난도 문제 풀이 전략과 수능 킬러 문항 대비 훈련을 진행합니다.", level: "심화", maxStudents: 20 },
    { name: "수학 최상위반", description: "수학 만점을 목표로 하는 최상위권 학생 전용 반입니다. 경시대회 수준의 문제부터 수능 4점 문항 완벽 분석까지.", level: "최상위", maxStudents: 15 },
    { name: "영어 기본반", description: "문법 기초부터 독해까지, 영어 실력의 토대를 다지는 과정입니다. 핵심 문법 정리와 지문 분석 훈련을 병행합니다.", level: "기본", maxStudents: 25 },
    { name: "영어 심화반", description: "수능 영어 1등급을 목표로 하는 심화 영어 과정입니다. 고난도 지문 독해, 빈칸 추론, 순서 배열 등 고득점 전략을 학습합니다.", level: "심화", maxStudents: 20 },
    { name: "국어 종합반", description: "비문학 독해력과 문학 감상력을 동시에 키우는 국어 종합반입니다. 수능 국어 전 영역을 체계적으로 학습합니다.", level: "기본", maxStudents: 25 },
    { name: "국어 심화반", description: "국어 1등급을 위한 심화 과정. 고난도 비문학과 현대/고전 문학 심층 분석, 화법과 작문 고득점 전략을 다룹니다.", level: "심화", maxStudents: 20 },
    { name: "과학탐구 (물리)", description: "물리학I·II 개념 정리와 문제 풀이를 병행하는 과정입니다. 실험과 시뮬레이션을 활용한 직관적 이해를 추구합니다.", level: "기본", maxStudents: 20 },
    { name: "사회탐구 종합", description: "한국사, 사회문화, 생활과 윤리 등 주요 사회탐구 과목을 종합적으로 학습합니다. 개념 암기보다 이해 중심의 수업.", level: "기본", maxStudents: 25 },
    { name: "논술 특강", description: "서울대, 연세대, 고려대 등 주요 대학 논술 시험 대비 특강입니다. 논리적 글쓰기 훈련과 실전 모의고사를 진행합니다.", level: "심화", maxStudents: 15 },
  ]

  const subjects = []
  for (const s of subjectData) {
    const subject = await prisma.subject.create({
      data: { academyId: academy.id, ...s },
    })
    subjects.push(subject)
  }

  // Teacher-Subject 배정
  if (teachers.length >= 8 && subjects.length >= 10) {
    const assignments = [
      [0, 0], [0, 1], // 김수학 → 수학 기본/심화
      [6, 2],         // 윤수학 → 수학 최상위
      [1, 3], [1, 4], // 이영어 → 영어 기본/심화
      [7, 3],         // 서영어 → 영어 기본
      [2, 5], [2, 6], // 박국어 → 국어 종합/심화
      [3, 7],         // 최과학 → 물리
      [4, 8],         // 정사회 → 사회탐구
      [5, 9],         // 한논술 → 논술
    ]
    for (const [ti, si] of assignments) {
      await prisma.teacherSubject.create({
        data: { teacherId: teachers[ti].id, subjectId: subjects[si].id },
      })
    }
  }

  // ============================================
  // 7. Students (20명)
  // ============================================
  const studentNames = [
    { name: "강민준", grade: "고1", school: "서울고등학교" },
    { name: "김서연", grade: "고2", school: "강남고등학교" },
    { name: "이도윤", grade: "고2", school: "대치고등학교" },
    { name: "박지호", grade: "고3", school: "서울고등학교" },
    { name: "최서현", grade: "고1", school: "강남고등학교" },
    { name: "정예준", grade: "고3", school: "한영고등학교" },
    { name: "윤하윤", grade: "고2", school: "대치고등학교" },
    { name: "임지민", grade: "고1", school: "서울고등학교" },
    { name: "한수아", grade: "고3", school: "강남고등학교" },
    { name: "오시우", grade: "고2", school: "대원고등학교" },
    { name: "신지유", grade: "고1", school: "한영고등학교" },
    { name: "권도현", grade: "고3", school: "대치고등학교" },
    { name: "배수빈", grade: "고2", school: "서울고등학교" },
    { name: "조하준", grade: "고1", school: "강남고등학교" },
    { name: "문예린", grade: "고3", school: "대원고등학교" },
    { name: "송지안", grade: "고2", school: "한영고등학교" },
    { name: "노은우", grade: "고1", school: "대치고등학교" },
    { name: "황시연", grade: "고3", school: "서울고등학교" },
    { name: "전유진", grade: "고2", school: "강남고등학교" },
    { name: "안서준", grade: "고1", school: "대원고등학교" },
  ]

  const students = []
  for (let i = 0; i < studentNames.length; i++) {
    const s = studentNames[i]
    const email = `student${i + 1}@sclass.kr`

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) continue

    const user = await prisma.user.create({
      data: {
        name: s.name,
        email,
        password: userPassword,
        role: "STUDENT",
        phone: `010-2222-${String(i + 1).padStart(4, "0")}`,
      },
    })
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        academyId: academy.id,
        grade: s.grade,
        school: s.school,
        enrollDate: new Date(2024, Math.floor(Math.random() * 12), 1),
      },
    })
    students.push(student)
  }

  // 수강 등록 (학생별 2~4과목)
  for (let i = 0; i < students.length; i++) {
    const numSubjects = 2 + Math.floor(Math.random() * 3) // 2~4
    const shuffled = [...subjects].sort(() => Math.random() - 0.5)
    for (let j = 0; j < numSubjects && j < shuffled.length; j++) {
      await prisma.enrollment.create({
        data: {
          studentId: students[i].id,
          subjectId: shuffled[j].id,
          status: "ACTIVE",
        },
      }).catch(() => {}) // unique 충돌 무시
    }
  }

  // ============================================
  // 8. Parents (12명) + 학생 연결
  // ============================================
  const parentData = [
    { name: "강영수", relationship: "아버지", children: [0] },
    { name: "김미영", relationship: "어머니", children: [1, 4] },
    { name: "이정훈", relationship: "아버지", children: [2] },
    { name: "박은지", relationship: "어머니", children: [3, 11] },
    { name: "최현우", relationship: "아버지", children: [5] },
    { name: "정수진", relationship: "어머니", children: [6, 9] },
    { name: "윤지혜", relationship: "어머니", children: [7, 10] },
    { name: "임태호", relationship: "아버지", children: [8] },
    { name: "한소영", relationship: "어머니", children: [12, 13] },
    { name: "오성민", relationship: "아버지", children: [14] },
    { name: "신미래", relationship: "어머니", children: [15, 16] },
    { name: "권동석", relationship: "아버지", children: [17, 18, 19] },
  ]

  for (let i = 0; i < parentData.length; i++) {
    const p = parentData[i]
    const email = `parent${i + 1}@sclass.kr`

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) continue

    const user = await prisma.user.create({
      data: {
        name: p.name,
        email,
        password: userPassword,
        role: "PARENT",
        phone: `010-3333-${String(i + 1).padStart(4, "0")}`,
      },
    })
    const parent = await prisma.parent.create({
      data: {
        userId: user.id,
        academyId: academy.id,
        relationship: p.relationship,
      },
    })

    // 학생-학부모 연결
    for (const childIdx of p.children) {
      if (students[childIdx]) {
        await prisma.studentParent.create({
          data: {
            studentId: students[childIdx].id,
            parentId: parent.id,
          },
        }).catch(() => {})
      }
    }
  }

  // ============================================
  // 9. Schedules
  // ============================================
  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const

  if (teachers.length >= 8 && subjects.length >= 10 && classrooms.length >= 5) {
    const scheduleData = [
      { subjectIdx: 0, teacherIdx: 0, classroomIdx: 0, day: "MONDAY", start: "15:00", end: "17:00" },
      { subjectIdx: 0, teacherIdx: 0, classroomIdx: 0, day: "WEDNESDAY", start: "15:00", end: "17:00" },
      { subjectIdx: 1, teacherIdx: 0, classroomIdx: 1, day: "TUESDAY", start: "18:00", end: "20:00" },
      { subjectIdx: 1, teacherIdx: 0, classroomIdx: 1, day: "THURSDAY", start: "18:00", end: "20:00" },
      { subjectIdx: 2, teacherIdx: 6, classroomIdx: 2, day: "MONDAY", start: "18:00", end: "20:00" },
      { subjectIdx: 2, teacherIdx: 6, classroomIdx: 2, day: "FRIDAY", start: "18:00", end: "20:00" },
      { subjectIdx: 3, teacherIdx: 1, classroomIdx: 3, day: "MONDAY", start: "15:00", end: "17:00" },
      { subjectIdx: 3, teacherIdx: 7, classroomIdx: 4, day: "WEDNESDAY", start: "18:00", end: "20:00" },
      { subjectIdx: 4, teacherIdx: 1, classroomIdx: 3, day: "TUESDAY", start: "15:00", end: "17:00" },
      { subjectIdx: 4, teacherIdx: 1, classroomIdx: 3, day: "THURSDAY", start: "15:00", end: "17:00" },
      { subjectIdx: 5, teacherIdx: 2, classroomIdx: 0, day: "TUESDAY", start: "15:00", end: "17:00" },
      { subjectIdx: 5, teacherIdx: 2, classroomIdx: 0, day: "FRIDAY", start: "15:00", end: "17:00" },
      { subjectIdx: 6, teacherIdx: 2, classroomIdx: 1, day: "WEDNESDAY", start: "18:00", end: "20:00" },
      { subjectIdx: 7, teacherIdx: 3, classroomIdx: 4, day: "TUESDAY", start: "18:00", end: "20:00" },
      { subjectIdx: 7, teacherIdx: 3, classroomIdx: 4, day: "FRIDAY", start: "18:00", end: "20:00" },
      { subjectIdx: 8, teacherIdx: 4, classroomIdx: 3, day: "WEDNESDAY", start: "15:00", end: "17:00" },
      { subjectIdx: 8, teacherIdx: 4, classroomIdx: 3, day: "FRIDAY", start: "15:00", end: "17:00" },
      { subjectIdx: 9, teacherIdx: 5, classroomIdx: 2, day: "SATURDAY", start: "10:00", end: "13:00" },
    ]

    for (const s of scheduleData) {
      await prisma.schedule.create({
        data: {
          subjectId: subjects[s.subjectIdx].id,
          teacherId: teachers[s.teacherIdx].id,
          classroomId: classrooms[s.classroomIdx].id,
          dayOfWeek: s.day as (typeof days)[number],
          startTime: s.start,
          endTime: s.end,
        },
      })
    }
  }

  // ============================================
  // 10. Success Stories (8건)
  // ============================================
  const stories = [
    {
      studentName: "이준영",
      title: "서울대학교 수학교육과 합격!",
      content:
        "S-Class 학원에서 고1 때부터 3년간 수학을 배웠습니다. 처음에는 수학이 너무 어렵고 싫었는데, 김수학 선생님의 개념 중심 수업 덕분에 수학의 재미를 알게 되었습니다.\n\n특히 고3 때 심화반에서 킬러 문항 집중 훈련을 받으며 실전 감각을 키울 수 있었습니다. 수능에서 수학 만점을 받고, 꿈이었던 서울대 수학교육과에 합격했습니다.\n\n포기하지 않고 끝까지 함께해주신 선생님들께 진심으로 감사드립니다.",
      university: "서울대학교",
      year: 2025,
    },
    {
      studentName: "김하은",
      title: "연세대학교 영어영문학과 수시 합격",
      content:
        "영어를 잘하고 싶어서 S-Class에 등록했는데, 이영어 선생님의 체계적인 수업 덕분에 영어 내신 1등급을 꾸준히 유지할 수 있었습니다.\n\n특히 독해력과 영작문 실력이 크게 늘어서 수시 면접에서도 큰 도움이 되었습니다. 연세대 합격 소식을 듣고 가장 먼저 학원에 달려가서 선생님들과 함께 기뻐한 기억이 납니다.\n\n학원에서 보낸 시간이 제 인생의 터닝포인트였습니다.",
      university: "연세대학교",
      year: 2025,
    },
    {
      studentName: "박서진",
      title: "고려대학교 경영학과 논술 전형 합격",
      content:
        "논술 준비가 막막했는데, 한논술 선생님의 논리적 글쓰기 훈련이 정말 큰 도움이 되었습니다. 매주 실전 논술 모의고사를 보고 개별 첨삭을 받으며 실력이 빠르게 늘었습니다.\n\n선생님이 항상 말씀하신 '주장-근거-예시' 구조가 시험장에서도 자연스럽게 나왔고, 고려대 논술에서 높은 점수를 받을 수 있었습니다.",
      university: "고려대학교",
      year: 2025,
    },
    {
      studentName: "최민서",
      title: "KAIST 물리학과 합격 후기",
      content:
        "과학고를 준비하면서 S-Class의 최과학 선생님을 만났습니다. 선생님의 실험 중심 수업은 물리에 대한 제 시야를 완전히 바꿔놓았습니다.\n\n물리올림피아드 대비반에서 훈련하며 전국대회 은상을 수상했고, 이 경험이 KAIST 입학에 큰 도움이 되었습니다. 과학을 즐기면서 배울 수 있게 해주신 선생님께 감사합니다.",
      university: "KAIST",
      year: 2024,
    },
    {
      studentName: "정유나",
      title: "서울대학교 국어국문학과 정시 합격",
      content:
        "국어 성적이 오르지 않아 고민하던 중 S-Class의 박국어 선생님을 만났습니다. 비문학 독해법과 문학 작품 분석법을 체계적으로 배우며, 국어가 제 가장 강한 과목이 되었습니다.\n\n수능에서 국어 백분위 99를 받았고, 정시로 서울대 국어국문학과에 합격했습니다. 3년간의 노력이 빛을 발하는 순간이었습니다.",
      university: "서울대학교",
      year: 2024,
    },
    {
      studentName: "윤재혁",
      title: "성균관대학교 소프트웨어학과 합격!",
      content:
        "S-Class에서 수학과 과학을 배우며 논리적 사고력을 키울 수 있었습니다. 특히 수학 심화반에서 배운 문제 해결 능력이 코딩과 알고리즘 공부에도 큰 도움이 되었습니다.\n\n선생님들의 격려와 체계적인 학습 관리 덕분에 내신과 수능 모두 좋은 결과를 얻을 수 있었습니다.",
      university: "성균관대학교",
      year: 2024,
    },
    {
      studentName: "한소율",
      title: "이화여대 영어교육과 수시 합격 수기",
      content:
        "S-Class 영어 심화반에서 이영어 선생님과 서영어 선생님의 수업을 들으며 영어에 대한 자신감을 얻었습니다. 특히 서영어 선생님의 실용 영어 수업은 면접 준비에 큰 도움이 되었습니다.\n\n영어 교사가 되겠다는 꿈을 키우며 열심히 공부한 결과, 이화여대 영어교육과에 합격할 수 있었습니다. S-Class 선생님들처럼 좋은 선생님이 되겠습니다.",
      university: "이화여자대학교",
      year: 2025,
    },
    {
      studentName: "임건우",
      title: "한양대학교 기계공학과 합격",
      content:
        "수학과 물리 성적이 낮아서 공대 진학이 어려울 것 같았는데, S-Class에서 1년 반 동안 집중적으로 공부하며 성적을 크게 올렸습니다.\n\n윤수학 선생님의 최상위 수학반에서 자신감을 얻었고, 최과학 선생님의 물리 수업으로 과학적 사고력을 키웠습니다. 포기하지 않으면 된다는 걸 S-Class에서 배웠습니다.",
      university: "한양대학교",
      year: 2025,
    },
  ]

  for (const s of stories) {
    await prisma.successStory.create({
      data: {
        academyId: academy.id,
        ...s,
        isPublished: true,
      },
    })
  }

  // ============================================
  // 11. Board Posts (공지 8건, 학부모 5건, 문의 4건)
  // ============================================

  // 공지사항
  const notices = [
    { title: "2026년 봄학기 수강 신청 안내", content: "안녕하세요, S-Class 학원입니다.\n\n2026년 봄학기 수강 신청이 2월 24일(월)부터 시작됩니다.\n\n■ 신청 기간: 2026.02.24(월) ~ 03.07(금)\n■ 수업 시작: 2026.03.10(월)\n■ 신청 방법: 학원 방문 또는 전화 (02-555-1234)\n\n조기 등록 시 수강료 10% 할인 혜택이 있으니 많은 관심 부탁드립니다.\n\n감사합니다.", isPinned: true },
    { title: "[필독] 학원 이용 수칙 안내", content: "학원을 이용하시는 학생 및 학부모님께 알려드립니다.\n\n1. 수업 시작 10분 전까지 입실해 주세요.\n2. 수업 중 휴대폰 사용은 금지됩니다.\n3. 자습실은 평일 14:00~22:00, 토요일 10:00~18:00 이용 가능합니다.\n4. 음식물 반입은 휴게실에서만 가능합니다.\n5. 주차 공간이 제한적이니 대중교통을 이용해 주세요.\n\n쾌적한 학습 환경을 위해 협조 부탁드립니다.", isPinned: true },
    { title: "3월 모의고사 일정 안내", content: "3월 전국연합학력평가 일정을 안내드립니다.\n\n■ 일시: 2026년 3월 12일(목)\n■ 대상: 고1, 고2, 고3 전체\n■ 장소: 각 학교\n\n학원에서는 모의고사 대비 특강을 아래와 같이 진행합니다.\n\n- 3/7(토) 14:00~17:00: 수학 파이널 특강\n- 3/8(일) 14:00~17:00: 영어 파이널 특강\n\n참가비는 무료이며, 사전 신청이 필요합니다.", isPinned: false },
    { title: "설 연휴 휴원 안내", content: "설 연휴 기간 학원 운영을 안내드립니다.\n\n■ 휴원 기간: 2026.01.28(수) ~ 02.01(일)\n■ 정상 운영: 2026.02.02(월)부터\n\n즐거운 명절 보내시고, 건강하게 다시 만나요!\n\n감사합니다.", isPinned: false },
    { title: "2025년 대학 합격자 발표", content: "2025학년도 대입 결과를 발표합니다.\n\n🎉 S-Class 학원 합격 현황\n\n■ 서울대학교: 3명\n■ 연세대학교: 5명\n■ 고려대학교: 4명\n■ KAIST: 1명\n■ 성균관대학교: 6명\n■ 한양대학교: 5명\n■ 이화여자대학교: 3명\n■ 기타 상위권 대학: 20명 이상\n\n합격한 모든 학생들에게 축하를 보내며, 함께 노력해주신 학부모님과 선생님들께 감사드립니다.\n\n자세한 합격 수기는 '합격수기' 게시판에서 확인하실 수 있습니다.", isPinned: false },
    { title: "여름방학 특강 프로그램 안내", content: "여름방학 특강 프로그램을 안내드립니다.\n\n■ 기간: 2026.07.20(월) ~ 08.14(금), 4주\n■ 과목: 수학, 영어, 국어, 과학, 논술\n\n[프로그램]\n1. 수능 집중반 (고3): 매일 09:00~17:00\n2. 내신 대비반 (고1~2): 매일 14:00~20:00\n3. 논술 집중반 (고3): 매주 토 10:00~16:00\n\n조기 등록 할인 및 형제자매 할인 적용 가능합니다.\n문의: 02-555-1234", isPinned: false },
    { title: "학부모 간담회 개최 안내", content: "2026년 1학기 학부모 간담회를 개최합니다.\n\n■ 일시: 2026년 3월 21일(토) 14:00~16:00\n■ 장소: S-Class 학원 5층 대강당\n■ 대상: 재원생 학부모\n\n[주요 안내사항]\n- 2026년 교육과정 변화 설명\n- 학원 커리큘럼 소개\n- 담당 강사와 1:1 상담 (사전 예약)\n\n참석 여부를 3월 14일까지 알려주시면 감사하겠습니다.", isPinned: false },
    { title: "자습실 좌석 배정 안내", content: "5층 자습실 좌석 배정을 아래와 같이 진행합니다.\n\n■ 신청 기간: 매월 25일~말일\n■ 이용 기간: 다음 달 1일~말일\n■ 좌석 수: 40석 (선착순)\n■ 이용 시간: 평일 14:00~22:00, 토 10:00~18:00\n\n자습실 이용 규칙:\n- 3회 이상 무단 불참 시 좌석 취소\n- 음식물 반입 금지\n- 정숙 유지\n\n신청은 학원 프론트에서 받습니다.", isPinned: false },
  ]

  for (const n of notices) {
    await prisma.post.create({
      data: {
        boardId: boards["NOTICE"].id,
        authorId: admin.id,
        title: n.title,
        content: n.content,
        isPinned: n.isPinned,
        viewCount: Math.floor(Math.random() * 200) + 10,
      },
    })
  }

  // 학부모 게시판
  const parentPosts = [
    { title: "수학 심화반 수업 정말 만족합니다", content: "안녕하세요, 고2 아이 엄마입니다.\n\n아이가 수학 심화반에 다닌 지 3개월이 되었는데, 내신 성적이 3등급에서 1등급으로 올랐습니다. 김수학 선생님이 개인별로 취약 부분을 파악해서 보충 자료도 챙겨주시고, 매주 테스트로 학습 확인도 해주시니 아이가 스스로 공부하는 습관이 생겼어요.\n\n학원 선택 고민하시는 분들께 강력 추천드립니다!" },
    { title: "영어 수업 커리큘럼 문의", content: "고1 아이 아버지입니다.\n\n현재 영어 기본반을 다니고 있는데, 아이 수준에 비해 조금 쉬운 것 같습니다. 반 변경이 가능한지, 심화반으로 올라가려면 어떤 기준이 있는지 궁금합니다.\n\n그리고 토플이나 텝스 같은 공인영어 시험 대비도 가능한지 알고 싶습니다.\n\n답변 부탁드려요. 감사합니다." },
    { title: "자습실 이용 시간 연장 건의", content: "학부모 의견을 남깁니다.\n\n시험 기간에 자습실 이용 시간이 22시까지로 제한되어 있는데, 시험 2주 전부터라도 23시까지 연장해주시면 좋겠습니다.\n\n다른 학원들은 시험 기간에 야간 자습을 운영하는 곳이 많아서요. 검토 부탁드립니다.\n\n감사합니다." },
    { title: "국어 수업 후기 공유합니다", content: "고3 딸 어머니입니다.\n\n박국어 선생님의 국어 심화반 수업을 듣고 아이의 국어 성적이 정말 많이 올랐어요. 특히 비문학 독해 수업이 아주 체계적이고, 매주 실전 모의고사로 실력을 점검해주셔서 좋습니다.\n\n아이도 국어에 자신감이 생겼다고 하니 감사한 마음입니다. 앞으로도 잘 부탁드립니다!" },
    { title: "주차 문제 개선 요청", content: "학원 앞 주차 공간이 너무 부족합니다. 하원 시간에 이중 주차가 많아서 위험한 상황이 자주 발생합니다.\n\n인근 주차장과 제휴하거나, 하원 시간대에 교통 정리를 해주시면 좋겠습니다.\n\n안전한 등하원 환경을 위해 검토 부탁드립니다." },
  ]

  // 학부모 유저 목록에서 작성자 지정
  const parentUsers = await prisma.user.findMany({
    where: { role: "PARENT" },
    take: 5,
  })

  for (let i = 0; i < parentPosts.length; i++) {
    const p = parentPosts[i]
    const authorId = parentUsers[i]?.id || admin.id
    await prisma.post.create({
      data: {
        boardId: boards["PARENT"].id,
        authorId,
        title: p.title,
        content: p.content,
        viewCount: Math.floor(Math.random() * 80) + 5,
      },
    })
  }

  // 문의 게시판
  const inquiryPosts = [
    { title: "수강 상담 예약 가능한가요?", content: "안녕하세요. 중3 아이를 둔 학부모입니다.\n\n고등학교 입학 전에 선행 학습을 시작하고 싶은데, 방문 상담이 가능한지요?\n\n평일 오후 시간이 좋고, 수학과 영어 위주로 상담 받고 싶습니다.\n\n연락 부탁드립니다. 감사합니다." },
    { title: "수강료 할인 제도가 있나요?", content: "형제자매 할인이나 장기 수강 할인 같은 제도가 있는지 궁금합니다.\n\n아이 둘을 모두 등록하려고 하는데, 부담이 되어서요.\n\n관련 안내 부탁드립니다." },
    { title: "온라인 수업 운영 여부 문의", content: "지방에 거주하고 있어서 학원 통학이 어렵습니다.\n\n혹시 온라인으로 수업을 들을 수 있는 방법이 있을까요?\n\n특히 논술 특강에 관심이 있습니다.\n\n답변 부탁드립니다." },
    { title: "교재 별도 구매 필요한가요?", content: "수강 등록을 고려 중인데, 교재비가 수강료에 포함되어 있는지 궁금합니다.\n\n별도 구매가 필요하다면 어디서 구매할 수 있는지도 알려주세요.\n\n감사합니다." },
  ]

  for (const p of inquiryPosts) {
    await prisma.post.create({
      data: {
        boardId: boards["INQUIRY"].id,
        authorId: admin.id,
        title: p.title,
        content: p.content,
        viewCount: Math.floor(Math.random() * 50) + 3,
      },
    })
  }

  // ============================================
  // 12. Consultations (5건)
  // ============================================
  const consultationPassword = await bcrypt.hash("1234", 12)
  const consultationData = [
    { parentName: "이미란", studentName: "이수현", phone: "010-4444-0001", studentGrade: "중3", subject: "수학, 영어", message: "고등학교 입학 전 선행 학습을 시작하고 싶습니다. 현재 수학은 상위권이고 영어는 중위권입니다. 맞춤 커리큘럼 상담 부탁드립니다.", status: "PENDING" },
    { parentName: "박현수", studentName: "박지원", phone: "010-4444-0002", studentGrade: "고1", subject: "국어", message: "국어 내신이 3등급인데 1등급으로 올리고 싶습니다. 비문학 독해가 특히 약합니다.", status: "CONFIRMED", adminNote: "3/5(수) 16:00 방문 상담 예정" },
    { parentName: "김정아", studentName: "김태현", phone: "010-4444-0003", studentGrade: "고2", subject: "수학, 과학", message: "이과 진학 예정이라 수학과 물리를 집중적으로 공부하고 싶습니다. 현재 수학 2등급, 물리 3등급입니다.", status: "PENDING" },
    { parentName: "조영미", studentName: "조서연", phone: "010-4444-0004", studentGrade: "고3", subject: "논술", message: "연세대 논술 전형을 준비하고 있습니다. 논술 특강 수강이 가능한지, 합격 실적이 어떤지 알고 싶습니다.", status: "COMPLETED", adminNote: "논술 특강반 등록 완료 (토요일반)" },
    { parentName: "송민호", studentName: "송하늘", phone: "010-4444-0005", studentGrade: "고1", subject: "영어", message: "영어 회화와 수능 영어를 동시에 준비할 수 있는 수업이 있는지 궁금합니다.", status: "PENDING" },
  ]

  for (const c of consultationData) {
    await prisma.consultation.create({
      data: {
        academyId: academy.id,
        parentName: c.parentName,
        studentName: c.studentName,
        phone: c.phone,
        password: consultationPassword,
        email: null,
        studentGrade: c.studentGrade,
        subject: c.subject,
        message: c.message,
        status: c.status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
        adminNote: c.adminNote || null,
      },
    })
  }

  // ============================================
  // 13. Meal Plan (이번 주)
  // ============================================
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  monday.setHours(0, 0, 0, 0)

  const meals = {
    월_점심: "비빔밥, 미역국, 김치, 계란말이, 깍두기",
    월_저녁: "돈까스, 우동, 샐러드, 단무지, 음료",
    화_점심: "김치찌개, 쌀밥, 잡채, 시금치나물, 깍두기",
    화_저녁: "치킨마요덮밥, 된장국, 콩나물무침, 김치",
    수_점심: "제육볶음, 쌀밥, 된장찌개, 어묵볶음, 깍두기",
    수_저녁: "짜장면, 군만두, 단무지, 음료",
    목_점심: "불고기, 쌀밥, 순두부찌개, 감자조림, 깍두기",
    목_저녁: "카레라이스, 미니돈까스, 샐러드, 음료",
    금_점심: "삼겹살구이, 쌀밥, 김치찌개, 쌈장, 깍두기",
    금_저녁: "떡볶이, 순대, 어묵국, 김밥, 음료",
  }

  await prisma.mealPlan.upsert({
    where: {
      academyId_weekStart: {
        academyId: academy.id,
        weekStart: monday,
      },
    },
    update: { meals: JSON.stringify(meals) },
    create: {
      academyId: academy.id,
      weekStart: monday,
      meals: JSON.stringify(meals),
    },
  })

  // ============================================
  // Summary
  // ============================================
  console.log("\n✅ Seed completed!\n")
  console.log(`  👤 Admin: admin@sclass.kr / admin123`)
  console.log(`  🏫 Academy: ${academy.name}`)
  console.log(`  👨‍🏫 Teachers: ${teachers.length}명`)
  console.log(`  👨‍🎓 Students: ${students.length}명`)
  console.log(`  👨‍👩‍👧 Parents: ${parentData.length}명`)
  console.log(`  📚 Subjects: ${subjects.length}개`)
  console.log(`  🏆 Success Stories: ${stories.length}건`)
  console.log(`  📋 Board Posts: ${notices.length + parentPosts.length + inquiryPosts.length}건`)
  console.log(`  📞 Consultations: ${consultationData.length}건`)
  console.log(`  🍽️  Meal Plan: 이번 주`)
  console.log(`\n  ℹ️  강사/학생/학부모 공통 비밀번호: password123`)
  console.log(`  ℹ️  상담신청 조회 비밀번호: 1234`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
