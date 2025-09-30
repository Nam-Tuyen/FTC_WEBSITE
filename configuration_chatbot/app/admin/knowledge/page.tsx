'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  filePath: string;
  preview: string;
}

interface KnowledgeStats {
  totalItems: number;
  categories: Record<string, number>;
  lastUpdated: string;
}

export default function KnowledgeAdminPage() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state for adding new knowledge
  const [newKnowledge, setNewKnowledge] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    fileType: 'md' as 'md' | 'json' | 'txt'
  });

  useEffect(() => {
    loadKnowledge();
    loadStats();
  }, []);

  const loadKnowledge = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`/api/knowledge?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setKnowledge(data.data);
      }
    } catch (error) {
      console.error('Error loading knowledge:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/knowledge?stats=true');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    loadKnowledge();
  };

  const handleReload = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/knowledge?action=reload', {
        method: 'PUT'
      });
      const data = await response.json();
      
      if (data.success) {
        await loadKnowledge();
        await loadStats();
        alert('Knowledge base đã được reload thành công!');
      }
    } catch (error) {
      console.error('Error reloading:', error);
      alert('Lỗi khi reload knowledge base');
    }
  };

  const handleAddKnowledge = async () => {
    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newKnowledge,
          tags: newKnowledge.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setNewKnowledge({
          title: '',
          content: '',
          category: '',
          tags: '',
          fileType: 'md'
        });
        setIsAddingNew(false);
        loadKnowledge();
        loadStats();
        alert('Đã thêm kiến thức mới thành công!');
      } else {
        alert(`Lỗi: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding knowledge:', error);
      alert('Lỗi khi thêm kiến thức mới');
    }
  };

  const categories = stats ? Object.keys(stats.categories) : [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Knowledge Base Admin</h1>
        <p className="text-gray-600">Quản lý kiến thức cho chatbot FTC</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tổng số kiến thức</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.categories).length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cập nhật cuối</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                {new Date(stats.lastUpdated).toLocaleString('vi-VN')}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Duyệt kiến thức</TabsTrigger>
          <TabsTrigger value="add">Thêm mới</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Tìm kiếm & Lọc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Tìm kiếm theo tiêu đề, nội dung, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả danh mục</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category} ({stats?.categories[category] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch}>Tìm kiếm</Button>
                <Button variant="outline" onClick={handleReload}>
                  Reload
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge List */}
          <div className="grid gap-4">
            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <p>Đang tải...</p>
                </CardContent>
              </Card>
            ) : knowledge.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p>Không tìm thấy kiến thức nào.</p>
                </CardContent>
              </Card>
            ) : (
              knowledge.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>
                          {item.category} • {new Date(item.lastUpdated).toLocaleDateString('vi-VN')}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {item.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{item.preview}</p>
                    <p className="text-xs text-gray-400">📁 {item.filePath}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thêm kiến thức mới</CardTitle>
              <CardDescription>
                Thêm kiến thức mới vào knowledge base. File sẽ được tạo tự động.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={newKnowledge.title}
                    onChange={(e) => setNewKnowledge(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề..."
                  />
                </div>
                <div>
                  <Label htmlFor="category">Danh mục *</Label>
                  <Input
                    id="category"
                    value={newKnowledge.category}
                    onChange={(e) => setNewKnowledge(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="ftc, fintech, faq..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Nội dung *</Label>
                <Textarea
                  id="content"
                  value={newKnowledge.content}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Nhập nội dung kiến thức..."
                  rows={10}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="tags"
                    value={newKnowledge.tags}
                    onChange={(e) => setNewKnowledge(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="ftc, sự-kiện, tuyển-thành-viên"
                  />
                </div>
                <div>
                  <Label htmlFor="fileType">Loại file</Label>
                  <Select 
                    value={newKnowledge.fileType} 
                    onValueChange={(value: 'md' | 'json' | 'txt') => 
                      setNewKnowledge(prev => ({ ...prev, fileType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="md">Markdown (.md)</SelectItem>
                      <SelectItem value="json">JSON (.json)</SelectItem>
                      <SelectItem value="txt">Text (.txt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleAddKnowledge}
                  disabled={!newKnowledge.title || !newKnowledge.content || !newKnowledge.category}
                >
                  Thêm kiến thức
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setNewKnowledge({
                    title: '',
                    content: '',
                    category: '',
                    tags: '',
                    fileType: 'md'
                  })}
                >
                  Xóa form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}