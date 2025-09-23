import React from "react"
import dynamic from "next/dynamic"
import { 
  MessageBubble, 
  ChatInput, 
  ModeSelector,
  ChatContainer,
  ChatHeader,
  ChatMessages,
  SuggestedQuestions,
  FeaturesShowcase,
  StatsShowcase
} from "./components"
import { useChat, useChatScroll } from "./hooks"
import { BRAND, SUGGESTED_QUESTIONS, UI_CONFIG } from "./constants"

// Navigation component (keep as project structure)
const Navigation = dynamic(() => import("@/components/navigation"), { ssr: false })

/**
 * Main Chatbot Page Component
 * Reorganized with extracted components and modern architecture
 */
export default function ChatbotPage() {
  const {
    messages,
    selectedMode,
    inputValue,
    isSending,
    showModeChangeNotification,
    setInputValue,
    handleSendMessage,
    handleModeChange,
    clearChat,
  } = useChat()

  const messagesEndRef = useChatScroll(messages)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [showQuickActions, setShowQuickActions] = React.useState(false)

  const currentMode = React.useMemo(
    () => selectedMode,
    [selectedMode]
  )

  return (
    <>
      <div 
        className="min-h-screen overflow-hidden" 
        style={{ 
          background: `linear-gradient(140deg, ${BRAND.primary50} 0%, #ffffff 40%, ${BRAND.primary100} 100%)` 
        }}
      >
        <Navigation />

        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-1000">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-gradient-to-br from-[#003663]/20 via-[#1a5490]/20 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-[#1a5490]/20 via-[#003663]/20 to-transparent rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="relative max-w-5xl mx-auto text-center space-y-8">
            {/* Title with gradient text */}
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold">
              <span className="absolute inset-0 bg-gradient-to-r from-[#003663] to-[#1a5490] opacity-50 blur-2xl animate-pulse"></span>
              <span className={`relative ${BRAND.text.gradient} animate-text-shine`}>
                FTC CHATBOT
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className={`text-xl sm:text-2xl ${BRAND.text.muted} leading-relaxed max-w-3xl mx-auto italic`}>
              Trợ lý AI thông minh, hỗ trợ giải đáp thông tin về câu lạc bộ và ngành Fintech cho các bạn tân sinh viên
            </p>

            {/* Mode Selector */}
            <ModeSelector 
              selectedMode={selectedMode}
              onModeChange={handleModeChange}
              showNotification={showModeChangeNotification}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Chat Area (8 columns) */}
              <div className="lg:col-span-8">
                <ChatContainer>
                  <ChatHeader />
                  
                  <ChatMessages isEmpty={messages.length === 0}>
                    {messages.length === 0 ? (
                      // Welcome suggestions
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mx-auto">
                        {SUGGESTED_QUESTIONS.slice(0, UI_CONFIG.WELCOME_SUGGESTIONS_LIMIT).map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(q)}
                            className={`p-3 text-left rounded-2xl ${BRAND.surfaces.card} ${BRAND.borders.medium} border hover:${BRAND.borders.primary} transition-all text-sm ${BRAND.text.primary} hover:text-[${BRAND.primary}] ${BRAND.states.hover}`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <MessageBubble key={message.id} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </ChatMessages>

                  <ChatInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSendMessage}
                    disabled={isSending}
                    placeholder={`Hỏi về ${selectedMode === "club" ? "FTC, hoạt động, cách tham gia" : "FinTech, blockchain, ngân hàng số"}...`}
                  />
                </ChatContainer>
              </div>

              {/* Sidebar (4 columns) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Suggested Questions */}
                <SuggestedQuestions
                  questions={SUGGESTED_QUESTIONS}
                  onQuestionSelect={(question) => {
                    handleModeChange("club")
                    handleSendMessage(question)
                  }}
                  isExpanded={isExpanded}
                  onToggleExpand={() => setIsExpanded(!isExpanded)}
                />

                {/* Features Showcase */}
                <FeaturesShowcase />

                {/* Stats */}
                <StatsShowcase />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`mt-16 py-8 ${BRAND.borders.light} border-t ${BRAND.surfaces.glass}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className={`text-sm ${BRAND.text.muted}`}>
              Powered by ⚡ <span className={`font-semibold ${BRAND.text.gradient}`}>FTC AI</span>
              {selectedMode === "industry" && <span className="ml-2">• Demo FinTech Q&A</span>}
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
