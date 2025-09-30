'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Search } from 'lucide-react'
import { CATEGORIES, ForumCategory } from '@/app/dien-dan/types'

interface SearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  selectedCategory: ForumCategory | ''
  onCategoryChange: (value: ForumCategory | '') => void
}

export function SearchBar({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}: SearchBarProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm câu hỏi..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value) => onCategoryChange(value as ForumCategory | '')}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn chủ đề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả chủ đề</SelectItem>
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
