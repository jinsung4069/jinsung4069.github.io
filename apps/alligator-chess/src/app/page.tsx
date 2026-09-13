/* The portfolio home is outside this Next.js app's basePath. */
/* eslint-disable @next/next/no-html-link-for-pages */
import AlligatorChess from '@/components/AlligatorChess'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <nav aria-label="사이트 이동" className="mx-auto max-w-xl px-4 mb-2">
          <a href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900">← 전인성 홈페이지</a>
        </nav>
        <AlligatorChess />
      </div>
    </main>
  )
}