import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon, UsersIcon, SettingsIcon } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 bg-primary/10 text-primary-foreground p-4 shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-primary">Health Claim Verifier</h1>
      <nav>
        <ul className="space-y-2">
          <li>
            <Button asChild variant="ghost" className="w-full justify-start hover:bg-primary/20">
              <Link href="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="w-full justify-start hover:bg-primary/20">
              <Link href="/influencers">
                <UsersIcon className="mr-2 h-4 w-4" />
                Influencers
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="w-full justify-start hover:bg-primary/20">
              <Link href="/research">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Research Config
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

