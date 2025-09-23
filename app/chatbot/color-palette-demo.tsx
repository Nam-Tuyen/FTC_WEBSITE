import React from "react"

// ===== Color Palette Demo Component =====
export default function ColorPaletteDemo() {
  // Màu sắc chính từ hệ thống BRAND
  const colors = {
    primary: "#003663",        // Deep Navy
    secondary: "#0e1117",      // Dark Blue-Black
    primary50: "#f0f4f8",      // Very light blue
    primary100: "#d1e0eb",     // Light blue
    primary200: "#a3c2d6",    // Medium light blue
    primary300: "#7498b3",    // Medium blue
    primary400: "#456a8a",    // Medium dark blue
    primary500: "#003663",    // Main primary
    primary600: "#002a4f",    // Darker primary
    primary700: "#001f3b",    // Very dark primary
    primary800: "#001426",    // Extremely dark
    primary900: "#0e1117",    // Secondary (darkest)
    accent: "#1a5490",         // Bright navy
    accentLight: "#2563eb",    // Lighter accent
    warm: "#f59e0b",          // Golden yellow
    warmLight: "#fbbf24",     // Light warm
  }

  const gradients = [
    {
      name: "Primary Gradient",
      class: "bg-gradient-to-r from-[#003663] to-[#0e1117]",
      description: "Gradient chính cho các elements quan trọng"
    },
    {
      name: "Reverse Gradient", 
      class: "bg-gradient-to-r from-[#0e1117] to-[#003663]",
      description: "Gradient ngược cho sự đa dạng"
    },
    {
      name: "Radial Gradient",
      class: "bg-gradient-to-br from-[#003663] via-[#1a5490] to-[#0e1117]",
      description: "Gradient xuyên tâm cho avatars và icons"
    },
    {
      name: "Soft Gradient",
      class: "bg-gradient-to-br from-[#003663]/10 via-[#1a5490]/5 to-[#0e1117]/10",
      description: "Gradient nhẹ cho backgrounds"
    },
    {
      name: "Glass Effect",
      class: "bg-gradient-to-br from-white/10 via-[#003663]/5 to-[#0e1117]/10",
      description: "Hiệu ứng kính trong suốt"
    },
    {
      name: "Ethereal",
      class: "bg-gradient-to-br from-[#003663]/5 via-transparent to-[#0e1117]/5",
      description: "Gradient siêu nhẹ cho subtle effects"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#003663] via-[#1a5490] to-[#0e1117] bg-clip-text text-transparent mb-4">
            FTC Color Palette System
          </h1>
          <p className="text-gray-600 text-lg">
            Modern color system kết hợp #003663 (Navy Blue) và #0e1117 (Dark Blue-Black)
          </p>
        </div>

        {/* Primary Colors Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#0e1117] mb-6">Màu Sắc Chính</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(colors).map(([name, color]) => (
              <div key={name} className="group">
                <div 
                  className="w-full h-20 rounded-2xl shadow-lg transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color }}
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-800">{name}</p>
                  <p className="text-xs text-gray-500 font-mono">{color}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradients Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#0e1117] mb-6">Gradient Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gradients.map((gradient, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className={`w-full h-32 rounded-2xl ${gradient.class} mb-4 shadow-md`} />
                <h3 className="text-lg font-semibold text-[#003663] mb-2">{gradient.name}</h3>
                <p className="text-sm text-gray-600">{gradient.description}</p>
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <code className="text-xs text-gray-700">{gradient.class}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UI Components Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#0e1117] mb-6">Component Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Button Styles */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-[#003663] mb-4">Buttons</h3>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#003663] to-[#0e1117] text-white font-medium transition-all hover:scale-105 shadow-lg">
                  Primary Button
                </button>
                <button className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0e1117] to-[#003663] text-white font-medium transition-all hover:scale-105 shadow-lg">
                  Secondary Button
                </button>
                <button className="w-full py-3 px-4 rounded-2xl bg-gradient-to-br from-[#003663]/10 to-[#0e1117]/10 text-[#003663] font-medium border border-[#003663]/20 transition-all hover:scale-105">
                  Outline Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-[#003663] mb-4">Cards</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#003663]/5 via-white to-[#0e1117]/5 border border-[#003663]/10">
                  <h4 className="font-medium text-[#0e1117]">Soft Card</h4>
                  <p className="text-sm text-gray-600 mt-1">Với gradient nhẹ</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#003663]/20 shadow-lg shadow-[#003663]/10">
                  <h4 className="font-medium text-[#0e1117]">Glass Card</h4>
                  <p className="text-sm text-gray-600 mt-1">Hiệu ứng kính trong suốt</p>
                </div>
              </div>
            </div>

            {/* Text Styles */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-[#003663] mb-4">Typography</h3>
              <div className="space-y-3">
                <h4 className="text-xl font-bold bg-gradient-to-r from-[#003663] via-[#1a5490] to-[#0e1117] bg-clip-text text-transparent">
                  Gradient Heading
                </h4>
                <p className="text-[#0e1117] font-medium">Primary Text Color</p>
                <p className="text-[#003663] font-medium">Secondary Text Color</p>
                <p className="text-gray-600">Muted Text Color</p>
                <p className="text-gray-500">Light Text Color</p>
              </div>
            </div>
          </div>
        </div>

        {/* Color Usage Guidelines */}
        <div className="bg-gradient-to-br from-[#003663]/5 via-white to-[#0e1117]/5 rounded-3xl p-8 border border-[#003663]/10">
          <h2 className="text-2xl font-semibold text-[#0e1117] mb-6">Hướng Dẫn Sử Dụng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#003663] mb-3">Màu Chính (#003663)</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Sử dụng cho CTA buttons và links quan trọng</li>
                <li>• Text headings và labels chính</li>
                <li>• Icons và accents nổi bật</li>
                <li>• Focus states và active states</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#0e1117] mb-3">Màu Phụ (#0e1117)</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Text content chính và paragraphs</li>
                <li>• Dark mode backgrounds</li>
                <li>• Contrast elements</li>
                <li>• Secondary buttons và borders</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6">
          <p className="text-gray-500">
            ✨ Thiết kế bởi <span className="font-semibold bg-gradient-to-r from-[#003663] to-[#0e1117] bg-clip-text text-transparent">FTC Design System</span>
          </p>
        </div>
      </div>
    </div>
  )
}
