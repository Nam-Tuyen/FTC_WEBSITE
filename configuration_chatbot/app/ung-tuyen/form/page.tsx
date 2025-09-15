"use client"

import { type NextPage } from "next"
import { Navigation } from "@/components/navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { RECRUITMENT_CONFIG } from "../constants"

const RecruitmentFormPage: NextPage = () => {
  const router = useRouter()
  
  useEffect(() => {
    const status = RECRUITMENT_CONFIG.getStatus()

    if (status !== "OPEN") {
      // Nếu không trong thời gian nhận đơn, chuyển về trang chủ
      router.push("/ung-tuyen")
    } else {
      // Nếu đang mở đơn, chuyển đến form
      window.location.href = RECRUITMENT_CONFIG.formUrl
    }
  }, [router])

  // Return loading state or null as the useEffect will redirect
  return null
}

export default RecruitmentFormPage
