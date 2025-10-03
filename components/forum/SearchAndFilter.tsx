"use client";
import { useState } from "react";
import { Search, Filter, BarChart3, Users, MessageSquare, Heart, TrendingUp } from "lucide-react";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  selectedCategory: string;
  selectedSort: string;
  stats: {
    totalQuestions: number;
    totalResponses: number;
    totalLikes: number;
    activeUsers: number;
  };
}

export default function SearchAndFilter({
  onSearch,
  onCategoryFilter,
  onSortChange,
  searchQuery,
  selectedCategory,
  selectedSort,
  stats
}: SearchAndFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: "", label: "Tất cả danh mục", icon: "📋" },
    { value: "Hỏi về ngành học", label: "Hỏi về ngành học", icon: "🎓" },
    { value: "Hỏi về câu lạc bộ", label: "Hỏi về câu lạc bộ", icon: "🏛️" },
    { value: "Thảo luận", label: "Thảo luận", icon: "💬" }
  ];

  const sortOptions = [
    { value: "newest", label: "Mới nhất", icon: "🕒", description: "Hiển thị câu hỏi mới nhất trước" },
    { value: "oldest", label: "Cũ nhất", icon: "⏰", description: "Hiển thị câu hỏi cũ nhất trước" },
    { value: "most_liked", label: "Nhiều like nhất", icon: "❤️", description: "Sắp xếp theo số lượt thích" },
    { value: "most_responses", label: "Nhiều phản hồi nhất", icon: "💬", description: "Sắp xếp theo số phản hồi" },
    { value: "alphabetical", label: "A-Z", icon: "🔤", description: "Sắp xếp theo thứ tự bảng chữ cái" },
    { value: "trending", label: "Xu hướng", icon: "📈", description: "Câu hỏi có tương tác cao gần đây" }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Bar - Mobile Optimized */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-300" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi, nội dung..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-[#003663]/50 to-[#004a7c]/50 border-2 border-blue-400/30 rounded-xl sm:rounded-2xl text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-sm sm:text-base lg:text-lg"
        />
        {searchQuery && (
          <button
            onClick={() => onSearch("")}
            className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-blue-300 hover:text-white transition-colors duration-200"
          >
            <span className="text-sm sm:text-base">✕</span>
          </button>
        )}
      </div>

      {/* Filter Toggle Button - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg sm:rounded-xl text-white font-semibold hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200 text-sm sm:text-base"
        >
          <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Bộ lọc & Sắp xếp</span>
          <span className={`transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {/* Current Sort Indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg">
          <span className="text-green-400 text-sm">
            {sortOptions.find(opt => opt.value === selectedSort)?.icon}
          </span>
          <span className="text-green-200 text-xs sm:text-sm font-medium">
            {sortOptions.find(opt => opt.value === selectedSort)?.label}
          </span>
        </div>

        {/* Quick Stats - Mobile Optimized */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-200">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{stats.totalQuestions}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{stats.totalLikes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{stats.activeUsers}</span>
          </div>
        </div>
      </div>

      {/* Filters Panel - Mobile Optimized */}
      {showFilters && (
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Category Filter */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-lg sm:text-xl">🏷️</span>
              <span className="text-sm sm:text-base">Danh mục</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onCategoryFilter(category.value)}
                  className={`flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 text-xs sm:text-sm ${
                    selectedCategory === category.value
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105"
                      : "bg-gradient-to-r from-slate-600/50 to-slate-700/50 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:scale-105"
                  }`}
                >
                  <span className="text-sm sm:text-base">{category.icon}</span>
                  <span className="text-xs sm:text-sm truncate">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options - Enhanced Design */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-base">🔄</span>
              </div>
              <span className="text-sm sm:text-base">Sắp xếp theo</span>
              <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
            </h4>
            
            {/* Sort Options Grid - Enhanced */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {sortOptions.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
                    selectedSort === option.value
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30 scale-105 border-2 border-green-400/60"
                      : "bg-gradient-to-br from-slate-700/50 to-slate-800/50 text-slate-300 hover:text-white hover:bg-gradient-to-br hover:from-green-500/20 hover:to-emerald-500/20 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 border border-slate-600/30 hover:border-green-400/40"
                  }`}
                >
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 opacity-10 ${
                    selectedSort === option.value ? 'bg-white/20' : 'bg-green-400/10'
                  }`}></div>
                  
                  {/* Content */}
                  <div className="relative flex items-center gap-3 sm:gap-4">
                    {/* Icon Container */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedSort === option.value
                        ? "bg-white/20 shadow-lg"
                        : "bg-gradient-to-r from-green-500/20 to-emerald-500/20 group-hover:bg-gradient-to-r group-hover:from-green-500/30 group-hover:to-emerald-500/30"
                    }`}>
                      <span className="text-lg sm:text-xl">{option.icon}</span>
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 text-left">
                      <div className="font-bold text-sm sm:text-base mb-1">
                        {option.label}
                      </div>
                      <div className={`text-xs sm:text-sm opacity-80 ${
                        selectedSort === option.value ? 'text-white/80' : 'text-slate-400 group-hover:text-white/80'
                      }`}>
                        {option.description}
                      </div>
                    </div>
                    
                    {/* Selection Indicator */}
                    {selectedSort === option.value && (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-green-300 text-sm sm:text-base">✓</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>
              ))}
            </div>
            
            {/* Sort Info */}
            <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-lg sm:rounded-xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-blue-400 text-sm sm:text-base">💡</span>
                <p className="text-blue-200 text-xs sm:text-sm">
                  Chọn cách sắp xếp phù hợp để tìm kiếm câu hỏi dễ dàng hơn
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-xs sm:text-sm font-semibold">Tổng câu hỏi</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stats.totalQuestions}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-xs sm:text-sm font-semibold">Tổng phản hồi</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stats.totalResponses}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-red-400/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-xs sm:text-sm font-semibold">Tổng lượt thích</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stats.totalLikes}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-xs sm:text-sm font-semibold">Thành viên hoạt động</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stats.activeUsers}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display - Mobile Optimized */}
      {(searchQuery || selectedCategory || selectedSort !== "newest") && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
            <span className="text-orange-200 font-semibold text-sm sm:text-base">Bộ lọc đang áp dụng:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {searchQuery && (
              <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-full text-blue-200 text-xs sm:text-sm">
                Tìm kiếm: "{searchQuery}"
              </span>
            )}
            {selectedCategory && (
              <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full text-green-200 text-xs sm:text-sm">
                Danh mục: {categories.find(c => c.value === selectedCategory)?.label}
              </span>
            )}
            {selectedSort !== "newest" && (
              <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full text-purple-200 text-xs sm:text-sm">
                Sắp xếp: {sortOptions.find(s => s.value === selectedSort)?.label}
              </span>
            )}
            <button
              onClick={() => {
                onSearch("");
                onCategoryFilter("");
                onSortChange("newest");
              }}
              className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-full text-red-200 text-xs sm:text-sm hover:bg-gradient-to-r hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  );
}