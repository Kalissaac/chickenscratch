import Card from '@components/card'
import Footer from '@components/footer'
import InitialLoader from '@components/loader'
import Nav from '@components/nav'
import SearchBar from '@components/search'
import { useUser } from '@shared/hooks'
import { Plus } from '@kalissaac/react-feather'
import { useState } from 'react'
import { useRouter } from 'next/router'

function Header ({ title, id }: { title: string, id: string }): JSX.Element {
  return (
    <div className='text-xl uppercase font-normal mb-4' id={id}>
      {title}
    </div>
  )
}

export default function HomePage (): JSX.Element {
  const user = useUser('/login')
  const [activeTab, setActiveTab] = useState('recentEdit')
  if (!user) {
    return <InitialLoader />
  }

  const router = useRouter()

  const activeTabClasses = 'font-medium'
  const inactiveTabClasses = 'text-gray-500 hover:text-gray-700'

  async function createDocument (): Promise<void> {
    const response = await fetch('/api/document/create')
    const data = await response.json()
    await router.push(`/d/${data.id as string}/edit`)
  }

  return (
    <>
      <Nav user={user} />

      <div className='p-20 pt-5'>
        <div className='flex mb-12 gap-4'>
          <button className='bg-accent-1-500 basis flex justify-center items-center gap-1 px-6 text-gray-100 text-base uppercase' onClick={createDocument}><Plus /> New Document</button>
          <SearchBar />
        </div>

        <div className='flex items-center mb-4'>
          <button className={`text-xl uppercase transition-all ${activeTab === 'recentEdit' ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab('recentEdit')}>Recently edited</button>
          <button className={`text-xl uppercase ml-5 transition-all ${activeTab === 'invitations' ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab('invitations')}>Invitations</button>
        </div>
        <div className='flex justify-between -ml-2 -mr-2'>
          {activeTab === 'recentEdit' && Array(4).fill({}).map(() => (
            <Card key={Math.random() * 100}>
              <div>hi</div>
            </Card>
          ))}
          {activeTab === 'invitations' && Array(5).fill({}).map(() => (
            <Card key={Math.random() * 100}>
              <div>bye</div>
            </Card>
          ))}
        </div>

        <div className='py-48' />
      </div>

      <Footer />
    </>
  )
}
