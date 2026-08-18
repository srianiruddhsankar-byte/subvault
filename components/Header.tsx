import Link from 'next/link'
import { Wallet } from 'lucide-react'

export default function Header({ loggedIn = false }: { loggedIn?: boolean }) {
  return (
    <header className="border-b border-gray-100 bg-white px-6 py-3">
      <Link href={loggedIn ? '/dashboard' : '/'} className="flex w-fit items-center gap-2">
        <div className="rounded-md bg-navy p-2">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold text-navy">SubVault</span>
      </Link>
    </header>
  )
}