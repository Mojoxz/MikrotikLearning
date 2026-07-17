import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

export default async function GuruLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session || session.user.role !== 'guru') redirect('/login')

  return <DashboardLayout>{children}</DashboardLayout>
}
