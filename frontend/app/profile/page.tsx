import { getSiteData } from '@/lib/api'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProfileClient from '@/components/ProfileClient'

export default async function ProfilePage() {
  let siteData: any = null
  try { siteData = await getSiteData() } catch {}
  const nav    = siteData?.navbar ?? { logo: 'CAVENRO', links: [] }
  const footer = siteData?.footer ?? {}
  return (
    <main>
      <AnnouncementBar message={siteData?.announcement} visible={siteData?.announcementVisible} />
      <Navbar navbar={nav} />
      <ProfileClient />
      <Footer data={footer} />
    </main>
  )
}
