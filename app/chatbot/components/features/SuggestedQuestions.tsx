import React from 'react'
import { SuggestedQuestionsProps } from '../../types'
import { BRAND } from '../../constants'
import { cn } from '../../lib'

/**
 * Suggested Questions Component
 * Displays a list of suggested questions that users can click to send
 */
export function SuggestedQuestions({ 
  questions, 
  onQuestionSelect, 
  isExpanded = false, 
  onToggleExpand 
}: SuggestedQuestionsProps) {

  const displayedQuestions = isExpanded ? questions : questions.slice(0, 5)
  const hasMore = questions.length > 5

  return (
    <div className={`rounded-3xl ${BRAND.shadows.xl} overflow-hidden ${BRAND.borders.glow} border ${BRAND.surfaces.card}`}>
      {/* Header */}
      <div className={`px-6 py-4 ${BRAND.borders.light} border-b ${BRAND.gradients.ambient}`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-3xl flex items-center justify-center ${BRAND.gradients.radial}`}>
            <span className="text-white text-2xl">❓</span>
          </div>
          <div>
            <h3 className={`font-semibold ${BRAND.text.primary}`}>Câu hỏi gợi ý</h3>
            <p className={`text-sm ${BRAND.text.muted}`}>Bấm để hỏi ngay</p>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="p-4">
        <div className="space-y-3">
          {displayedQuestions.map((question, idx) => (
            <button
              key={`${question}-${idx}`}
              onClick={() => onQuestionSelect(question)}
              className={cn(
                "w-full text-left p-4 rounded-2xl transition-all group",
                BRAND.gradients.ethereal,
                `hover:${BRAND.gradients.ambient}`,
                `hover:${BRAND.borders.accent}`,
                BRAND.borders.light,
                "border"
              )}
              aria-label={`Hỏi: ${question}`}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  BRAND.gradients.soft
                )}>
                  <span className={`text-sm font-semibold text-[${BRAND.primary}]`}>
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-medium leading-relaxed",
                    BRAND.text.primary,
                    `group-hover:text-[${BRAND.primary}]`
                  )}>
                    {question}
                  </p>
                </div>
                <span className={cn(
                  "transition-all",
                  BRAND.text.light,
                  `group-hover:text-[${BRAND.primary}]`,
                  "opacity-0 group-hover:opacity-100"
                )}>
                  ➤
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {hasMore && onToggleExpand && (
          <button
            onClick={onToggleExpand}
            className={cn(
              "w-full mt-4 p-3 rounded-2xl border transition-colors",
              "flex items-center justify-center gap-2 text-sm font-medium",
              BRAND.borders.medium,
              BRAND.surfaces.hover,
              BRAND.text.muted
            )}
            aria-label={isExpanded ? "Thu gọn danh sách" : "Mở rộng danh sách"}
          >
            {isExpanded ? (
              <>
                <span>🔼</span>
                Thu gọn
              </>
            ) : (
              <>
                <span>🔽</span>
                Xem thêm {questions.length - 5} câu hỏi
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
