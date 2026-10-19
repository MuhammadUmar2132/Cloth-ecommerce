import { getSiteData } from '@/lib/api'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CheckoutClient from '@/components/CheckoutClient'

export const revalidate = 0

export default async function CheckoutPage() {
  let siteData: any = null
  try { siteData = await getSiteData() } catch {
    siteData = {
      announcement: '', announcementVisible: false,
      navbar: { logo: 'CAVENRO', links: [] },
      footer: { phone: '+923001234567', companyName: 'CAVENRO', email: '', address: '', quickLinks: [], infoLinks: [], social: {}, copyright: '' },
    }
  }

  const whatsapp = siteData?.footer?.phone?.replace(/\D/g, '') || '923001234567'

  return (
    <main>
      <AnnouncementBar message={siteData.announcement} visible={siteData.announcementVisible} />
      <Navbar navbar={siteData.navbar} />
      <CheckoutClient whatsapp={whatsapp} />
      <Footer data={siteData.footer} />
    </main>
  )
}
