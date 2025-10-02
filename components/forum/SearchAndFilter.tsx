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
    { value: "newest", label: "Mới nhất", icon: "🕒" },
    { value: "oldest", label: "Cũ nhất", icon: "⏰" },
    { value: "most_liked", label: "Nhiều like nhất", icon: "❤️" },
    { value: "most_responses", label: "Nhiều phản hồi nhất", icon: "💬" }
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-blue-300" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi, nội dung..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-[#003663]/50 to-[#004a7c]/50 border-2 border-blue-400/30 rounded-2xl text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
        />
        {searchQuery && (
          <button
            onClick={() => onSearch("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-white transition-colors duration-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl text-white font-semibold hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200"
        >
          <Filter className="h-5 w-5" />
          <span>Bộ lọc & Sắp xếp</span>
          <span className={`transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm text-blue-200">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{stats.totalQuestions}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{stats.totalLikes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{stats.activeUsers}</span>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-2xl p-6 space-y-6">
          {/* Category Filter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              Danh mục
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onCategoryFilter(category.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedCategory === category.value
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105"
                      : "bg-gradient-to-r from-slate-600/50 to-slate-700/50 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:scale-105"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🔄</span>
              Sắp xếp
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedSort === option.value
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105"
                      : "bg-gradient-to-r from-slate-600/50 to-slate-700/50 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-500/20 hover:scale-105"
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-semibold">Tổng câu hỏi</p>
              <p className="text-3xl font-bold text-white">{stats.totalQuestions}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-semibold">Tổng phản hồi</p>
              <p className="text-3xl font-bold text-white">{stats.totalResponses}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-sm font-semibold">Tổng lượt thích</p>
              <p className="text-3xl font-bold text-white">{stats.totalLikes}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-semibold">Thành viên hoạt động</p>
              <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedCategory || selectedSort !== "newest") && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-orange-400" />
            <span className="text-orange-200 font-semibold">Bộ lọc đang áp dụng:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-full text-blue-200 text-sm">
                Tìm kiếm: "{searchQuery}"
              </span>
            )}
            {selectedCategory && (
              <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full text-green-200 text-sm">
                Danh mục: {categories.find(c => c.value === selectedCategory)?.label}
              </span>
            )}
            {selectedSort !== "newest" && (
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full text-purple-200 text-sm">
                Sắp xếp: {sortOptions.find(s => s.value === selectedSort)?.label}
              </span>
            )}
            <button
              onClick={() => {
                onSearch("");
                onCategoryFilter("");
                onSortChange("newest");
              }}
              className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-full text-red-200 text-sm hover:bg-gradient-to-r hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  );
}