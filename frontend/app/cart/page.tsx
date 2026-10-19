import { getSiteData } from '@/lib/api'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartPageClient from '@/components/CartPageClient'

export const revalidate = 0

export default async function CartPage() {
  let siteData: any = null
  try { siteData = await getSiteData() } catch {
    siteData = {
      announcement: '', announcementVisible: false,
      navbar: { logo: 'CAVENRO', links: [] },
      footer: { companyName: 'CAVENRO', phone: '', email: '', address: '', quickLinks: [], infoLinks: [], social: {}, copyright: '' },
    }
  }
  return (
    <main>
      <AnnouncementBar message={siteData.announcement} visible={siteData.announcementVisible} />
      <Navbar navbar={siteData.navbar} />
      <CartPageClient />
      <Footer data={siteData.footer} />
    </main>
  )
}
