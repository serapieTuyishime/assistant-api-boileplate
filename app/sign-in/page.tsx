import Link from 'next/link'

export default async function SignInPage() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <Link href="/">Go home</Link>
    </div>
  )
}
