import Link from 'next/link'
import { Wallet } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white px-6 py-3">
      <Link href="/" className="flex w-fit items-center gap-2">
        <div className="rounded-md bg-navy p-1.5">
          <Wallet className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-navy">SubVault</span>
      </Link>
    </header>
  )
}