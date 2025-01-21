import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 認証が必要なパスの定義
  const authRequired = req.nextUrl.pathname.startsWith('/setup') ||
                      req.nextUrl.pathname.startsWith('/settings')

  // 未認証ユーザーをログインページへリダイレクト
  if (!session && req.nextUrl.pathname.startsWith('/setup')) {
    return NextResponse.redirect(new URL('/setup/signin', req.url))
  }

  // 認証済みユーザーをセットアップの続きへリダイレクト
  if (session && req.nextUrl.pathname === '/setup/signin') {
    return NextResponse.redirect(new URL('/setup/profile', req.url))
  }

  // 認証済みユーザーがauth関連ページにアクセスした場合、ダッシュボードにリダイレクト
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

// 必要なパスのみにミドルウェアを適用
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/auth/:path*'
  ]
} 