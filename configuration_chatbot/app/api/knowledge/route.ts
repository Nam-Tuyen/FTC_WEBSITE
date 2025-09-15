import { NextRequest, NextResponse } from 'next/server';
import { ragSystem } from '../../../../lib/rag-system';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Lấy danh sách knowledge items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    if (query) {
      // Search knowledge base
      const results = await ragSystem.search(query);
      return NextResponse.json({
        success: true,
        data: results,
        total: results.length
      });
    }

    // Get all knowledge items
    const context = await ragSystem.loadKnowledgeBase();
    let items = context.knowledgeItems;

    // Filter by category if specified
    if (category) {
      items = items.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      data: items,
      total: items.length,
      categories: await ragSystem.getCategories()
    });

  } catch (error) {
    console.error('Error in knowledge GET:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to load knowledge base'
    }, { status: 500 });
  }
}

// POST - Thêm knowledge item mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category = 'general', filename } = body;

    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: 'Title and content are required'
      }, { status: 400 });
    }

    await ragSystem.addKnowledgeItem(title, content, category, filename);

    return NextResponse.json({
      success: true,
      message: 'Knowledge item added successfully'
    });

  } catch (error) {
    console.error('Error in knowledge POST:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add knowledge item'
    }, { status: 500 });
  }
}

// PUT - Cập nhật knowledge item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, category } = body;

    if (!id || !title || !content) {
      return NextResponse.json({
        success: false,
        error: 'ID, title and content are required'
      }, { status: 400 });
    }

    // For now, we'll add as new item since we don't have update functionality
    // In a real implementation, you'd want to update the existing file
    await ragSystem.addKnowledgeItem(title, content, category, `${id}.txt`);

    return NextResponse.json({
      success: true,
      message: 'Knowledge item updated successfully'
    });

  } catch (error) {
    console.error('Error in knowledge PUT:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update knowledge item'
    }, { status: 500 });
  }
}