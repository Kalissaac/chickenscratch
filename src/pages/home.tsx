import Card from '@components/card'
import Footer from '@components/footer'
import InitialLoader from '@components/loader'
import Nav from '@components/nav'
import SearchBar from '@components/search'
import { useUser } from '@shared/hooks'
import { ChevronRight, FileText, Plus } from '@kalissaac/react-feather'
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

  const activeTabClasses = 'font-medium border-gray-darker'
  const inactiveTabClasses = 'text-gray-600 hover:text-gray-900 border-transparent'

  async function createDocument (): Promise<void> {
    const response = await fetch('/api/document/create')
    const data = await response.json()
    await router.push(`/d/${data.id as string}/edit`)
  }

  return (
    <>
      <Nav user={user} />

      <div className='p-20 pt-4'>
        <div className='flex mb-12 gap-4' id='homesearch'>
          <button className='bg-accent-1-500 focus:border-gray-darker focus:outline-none basis flex justify-center items-center gap-1 px-6 text-gray-100 font-light uppercase' onClick={createDocument}><Plus size='1.25em' aria-label='Plus Icon' /> New Document</button>
          <SearchBar />
        </div>

        <div className='flex items-center mb-4'>
          <button className={`text-xl uppercase border-b-2 transition-all ${activeTab === 'recentEdit' ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab('recentEdit')} id='recent'>Recently edited</button>
          <button className={`text-xl uppercase border-b-2 ml-5 transition-all ${activeTab === 'invitations' ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab('invitations')} id='invitations'>Invitations</button>
        </div>
        <div className='flex justify-between -ml-2 -mr-2 mb-12'>
          {activeTab === 'recentEdit' && Array(4).fill({}).map(() => (
            <Card key={Math.random() * 100}>
              <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores rerum necessitatibus ullam vitae adipisci iste fugit at impedit.</div>
            </Card>
          ))}
          {activeTab === 'invitations' && Array(5).fill({}).map(() => (
            <Card key={Math.random() * 100}>
              <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem dolorem error incidunt eum pariatur perspiciatis minima ipsam et qui maiores inventore asperiores est quasi esse ex, repellat numquam nulla repudiandae?</div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex justify-center items-center">
                            <FileText className='w-1/2 h-1/2' />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              Jane Cooper
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Regional Paradigm Technician</div>
                        <div className="text-sm text-gray-500">Optimization</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Admin
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                        <a href="#" className="float-right"><ChevronRight /></a>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


        <div className='py-96' />
      </div>

      <Footer />
    </>
  )
}
