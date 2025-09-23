import React from 'react'
import { ModeSelectorProps } from '../../types'
import { BRAND, CHAT_MODES } from '../../constants'
import { cn } from '../../lib'

/**
 * Mode Selector Component
 * Allows users to switch between different chat modes (club/industry)
 */
export function ModeSelector({ 
  selectedMode, 
  onModeChange, 
  showNotification = false 
}: ModeSelectorProps) {

  return (
    <div className="mt-8 relative">
      <div className={`absolute inset-0 ${BRAND.gradients.ethereal} rounded-3xl transform transition-all`} />
      <div className={`relative ${BRAND.surfaces.glass} rounded-3xl ${BRAND.borders.primary} border p-6`}>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative">
              <div className={`absolute inset-0 ${BRAND.gradients.glow} rounded-xl blur-lg animate-pulse`} />
              <div className={`relative w-full h-full ${BRAND.surfaces.glass} rounded-xl flex items-center justify-center`}>
                <span className={`text-[${BRAND.primary}] text-lg`}>🤖</span>
              </div>
            </div>
            <div>
              <h2 className={`text-lg font-bold ${BRAND.text.primary}`}>Chọn chế độ</h2>
              <p className={`text-sm ${BRAND.text.muted}`}>Tùy chỉnh trải nghiệm chat</p>
            </div>
          </div>

          <div className="flex gap-2">
            {CHAT_MODES.map((mode) => {
              const isActive = selectedMode === mode.mode
              return (
                <button
                  key={mode.mode}
                  onClick={() => onModeChange(mode.mode)}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all duration-300 transform",
                    BRAND.states.hover,
                    isActive 
                      ? `${mode.gradient} text-white ${BRAND.shadows.medium} scale-105` 
                      : `${BRAND.surfaces.interactive} ${BRAND.text.muted} hover:${BRAND.text.secondary}`
                  )}
                  aria-label={`Chuyển sang chế độ ${mode.label}`}
                >
                  <span>{mode.icon}</span>
                  {mode.label}
                </button>
              )
            })}
          </div>
        </div>

        {showNotification && (
          <div className={`mt-4 inline-flex items-center gap-2 text-sm ${BRAND.text.muted} animate-in slide-in-from-top-2 duration-300`}>
            <div className={`w-2 h-2 rounded-full bg-[${BRAND.primary}] animate-pulse`} />
            Đã chuyển sang chế độ: <span className={`font-semibold text-[${BRAND.primary}]`}>
              {CHAT_MODES.find((m) => m.mode === selectedMode)?.label}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
