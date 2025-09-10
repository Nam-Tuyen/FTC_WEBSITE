import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ForumCategory } from '@/lib/forum/schemas'
import { supabase } from '@/lib/supabase'

const IdParams = z.object({ id: z.string().uuid() })

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const p = IdParams.safeParse(params)
  if (!p.success) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { data, error } = await (supabase as any)
    .from('questions')
    .select('*')
    .eq('id', p.data.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ item: data })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const p = IdParams.safeParse(params)
  if (!p.success) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await req.json().catch(() => null) as { title?: string; content?: string; category?: string }
  const update: Record<string, any> = {}
  if (typeof body?.title === 'string')   update.title = body.title
  if (typeof body?.content === 'string') update.content = body.content
  if (typeof body?.category === 'string' && ForumCategory.safeParse(body.category).success) {
    update.category = body.category
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
  }

  const { data, error } = await (supabase as any)
    .from('questions')
    .update(update)
    .eq('id', p.data.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const p = IdParams.safeParse(params)
  if (!p.success) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { error } = await (supabase as any).from('questions').delete().eq('id', p.data.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
