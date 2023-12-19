import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { IconSeparator } from '@/components/ui/icons'
import CreateAssistant from './custom/create-assistant'
import { Suspense } from 'react'
import { ClearThread } from './custom/create-user-thread'

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        {/* <Sidebar>
          <Suspense
            fallback={<div className="flex-1 overflow-auto" />}
          ></Suspense>
          <Button variant="link" asChild className="-ml-2">
            <ClearThread />
          </Button>
        </Sidebar> */}
        <div className="flex items-center">
          <IconSeparator className="w-6 h-6 text-muted-foreground/50" />

          <Button variant="link" asChild className="-ml-2">
            <CreateAssistant />
          </Button>
        </div>
      </div>
    </header>
  )
}
