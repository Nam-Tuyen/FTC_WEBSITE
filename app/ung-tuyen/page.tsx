"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, GraduationCap, Code, Heart, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

const steps = [
  { id: 1, title: "Thông tin cá nhân", icon: User },
  { id: 2, title: "Học vấn & Kinh nghiệm", icon: GraduationCap },
  { id: 3, title: "Kỹ năng & Sở thích", icon: Code },
  { id: 4, title: "Động lực & Mục tiêu", icon: Heart },
]

const departments = ["Ban Kỹ thuật", "Ban Truyền thông", "Ban Sự kiện", "Ban Đối ngoại", "Chưa quyết định"]

const skills = [
  "JavaScript/TypeScript",
  "Python",
  "React/Next.js",
  "Node.js",
  "Blockchain",
  "Smart Contracts",
  "AI/Machine Learning",
  "Data Analysis",
  "UI/UX Design",
  "Digital Marketing",
  "Content Writing",
  "Project Management",
  "Business Analysis",
  "Financial Analysis",
]

const interests = [
  "DeFi (Decentralized Finance)",
  "Digital Banking",
  "Payment Systems",
  "Cryptocurrency",
  "RegTech",
  "InsurTech",
  "WealthTech",
  "Lending Technology",
  "Robo-advisors",
  "Open Banking",
]

export default function ApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",

    // Education & Experience
    university: "",
    major: "",
    year: "",
    gpa: "",
    workExperience: "",
    projects: "",

    // Skills & Interests
    technicalSkills: [] as string[],
    fintechInterests: [] as string[],
    preferredDepartment: "",

    // Motivation & Goals
    motivation: "",
    goals: "",
    contribution: "",
    availability: "",
    agreeTerms: false,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.includes(skill)
        ? prev.technicalSkills.filter((s) => s !== skill)
        : [...prev.technicalSkills, skill],
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      fintechInterests: prev.fintechInterests.includes(interest)
        ? prev.fintechInterests.filter((i) => i !== interest)
        : [...prev.fintechInterests, interest],
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData)
    alert("Đơn ứng tuyển đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="0123456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Số nhà, đường, quận/huyện, thành phố"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university">Trường đại học *</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) => handleInputChange("university", e.target.value)}
                  placeholder="Đại học Bách Khoa Hà Nội"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Chuyên ngành *</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  placeholder="Công nghệ Thông tin"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Năm học hiện tại *</Label>
                <Select onValueChange={(value) => handleInputChange("year", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn năm học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Năm 1</SelectItem>
                    <SelectItem value="2">Năm 2</SelectItem>
                    <SelectItem value="3">Năm 3</SelectItem>
                    <SelectItem value="4">Năm 4</SelectItem>
                    <SelectItem value="5">Năm 5</SelectItem>
                    <SelectItem value="graduate">Đã tốt nghiệp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA (nếu có)</Label>
                <Input
                  id="gpa"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange("gpa", e.target.value)}
                  placeholder="3.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workExperience">Kinh nghiệm làm việc</Label>
              <Textarea
                id="workExperience"
                value={formData.workExperience}
                onChange={(e) => handleInputChange("workExperience", e.target.value)}
                placeholder="Mô tả kinh nghiệm làm việc, thực tập liên quan đến fintech hoặc công nghệ..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projects">Dự án đã thực hiện</Label>
              <Textarea
                id="projects"
                value={formData.projects}
                onChange={(e) => handleInputChange("projects", e.target.value)}
                placeholder="Mô tả các dự án cá nhân, nhóm hoặc học tập mà bạn đã tham gia..."
                rows={4}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Kỹ năng kỹ thuật (chọn tất cả kỹ năng bạn có)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.technicalSkills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                    />
                    <Label htmlFor={skill} className="text-sm cursor-pointer">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Lĩnh vực fintech quan tâm (chọn tất cả lĩnh vực bạn quan tâm)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={formData.fintechInterests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                    />
                    <Label htmlFor={interest} className="text-sm cursor-pointer">
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ban muốn tham gia *</Label>
              <Select onValueChange={(value) => handleInputChange("preferredDepartment", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ban muốn tham gia" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="motivation">Tại sao bạn muốn tham gia Câu lạc bộ Công nghệ Tài chính? *</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange("motivation", e.target.value)}
                placeholder="Chia sẻ động lực và lý do bạn muốn tham gia câu lạc bộ..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Mục tiêu cá nhân khi tham gia câu lạc bộ *</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => handleInputChange("goals", e.target.value)}
                placeholder="Bạn mong muốn đạt được gì khi tham gia câu lạc bộ..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contribution">Bạn có thể đóng góp gì cho câu lạc bộ? *</Label>
              <Textarea
                id="contribution"
                value={formData.contribution}
                onChange={(e) => handleInputChange("contribution", e.target.value)}
                placeholder="Kỹ năng, kinh nghiệm, ý tưởng mà bạn có thể chia sẻ với cộng đồng..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Thời gian có thể tham gia hoạt động *</Label>
              <RadioGroup
                value={formData.availability}
                onValueChange={(value) => handleInputChange("availability", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full-time" id="full-time" />
                  <Label htmlFor="full-time">Toàn thời gian (có thể tham gia hầu hết các hoạt động)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="part-time" id="part-time" />
                  <Label htmlFor="part-time">Bán thời gian (tham gia một số hoạt động)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekend" id="weekend" />
                  <Label htmlFor="weekend">Chỉ cuối tuần</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Label htmlFor="flexible">Linh hoạt theo lịch học</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => handleInputChange("agreeTerms", checked)}
              />
              <Label htmlFor="agreeTerms" className="text-sm">
                Tôi đồng ý với các điều khoản và cam kết tham gia tích cực vào các hoạt động của câu lạc bộ *
              </Label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-6">
            Ứng tuyển <span className="text-primary">Thành viên</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Tham gia cộng đồng fintech năng động và cùng nhau xây dựng tương lai công nghệ tài chính
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.id} className="text-center">
                <p className="text-sm font-medium text-muted-foreground">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading">
              Bước {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>

              {currentStep < steps.length ? (
                <Button onClick={nextStep}>
                  Tiếp theo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.agreeTerms}
                  className="bg-primary hover:bg-primary/90"
                >
                  Gửi đơn ứng tuyển
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Học hỏi & Phát triển</h3>
              <p className="text-muted-foreground text-sm">
                Tham gia các workshop, hackathon và dự án thực tế để nâng cao kỹ năng
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Mạng lưới Kết nối</h3>
              <p className="text-muted-foreground text-sm">
                Kết nối với cộng đồng fintech và các chuyên gia trong ngành
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Cơ hội Nghề nghiệp</h3>
              <p className="text-muted-foreground text-sm">
                Tiếp cận cơ hội việc làm và thực tập tại các công ty fintech
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
