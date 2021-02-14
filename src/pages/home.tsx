import Card from '@components/card'
import Footer from '@components/footer'
import InitialLoader from '@components/loader'
import Nav from '@components/nav'
import SearchBar from '@components/search'
import { useUser } from '@shared/hooks'
import { FileText, Info, Plus } from '@kalissaac/react-feather'
import { useState } from 'react'
import { useRouter } from 'next/router'
import DocumentPreview from '@components/document/preview'
import { GetServerSideProps } from 'next'
import { connectToDatabase } from '@shared/mongo'
import { verifyTokenCookie } from '@shared/cookies'
import type User from '@interfaces/user'
import type File from '@interfaces/file'

export default function HomePage (props): JSX.Element {
  const userToken = useUser('/login')
  const [activeTab, setActiveTab] = useState('recentEdit')
  const [activeDocumentPreview, setActiveDocumentPreview] = useState<any | null>(null)
  if (!userToken) {
    return <InitialLoader />
  }

  const user: User = JSON.parse(props.userData)
  console.log(user)
  const userFiles: File[] = props.userFiles.map((f: string) => JSON.parse(f))
  const router = useRouter()

  const activeTabClasses = 'font-medium border-gray-darker'
  const inactiveTabClasses = 'text-gray-600 hover:text-gray-900 border-transparent'

  return (
    <>
      <Nav user={user} />
      <DocumentPreview activeDocument={activeDocumentPreview} setActiveDocument={setActiveDocumentPreview} />

      <div className='lg:p-20 lg:pt-4'>
        <div className='flex mb-12 gap-4' id='homesearch'>
          <button className='bg-accent-1-500 focus:border-gray-darker focus:outline-none basis flex justify-center items-center gap-1 px-6 text-gray-100 font-light uppercase' onClick={async () => await router.push('/api/document/create')}><Plus size='1.25em' aria-label='Plus Icon' /> New Document</button>
          <SearchBar />
        </div>

        <div className='flex items-center mb-4'>
          <button className={`text-xl uppercase border-b-2 transition-all ${activeTab === 'recentEdit' ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab('recentEdit')} id='recent'>Recently edited</button>
          <button className={`text-xl uppercase border-b-2 ml-5 transition-all ${activeTab === 'invitations' ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab('invitations')} id='invitations'>Invitations</button>
        </div>
        <div className='flex justify-between -ml-2 -mr-2 mb-12'>
          {activeTab === 'recentEdit' && Array(4).fill({}).map(() => (
            <Card key={Math.random() * 100}>
              <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam officia, quae labore totam possimus laudantium dolorem consequuntur dolore iste architecto quasi doloremque nobis sequi repudiandae est laborum velit dicta quisquam.</div>
            </Card>
          ))}
          {activeTab === 'invitations' && Array(5).fill({}).map(() => (
            <Card key={Math.random() * 100}>
              <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quod similique saepe voluptas quis quas harum quisquam. Ea voluptatum provident minima libero eaque. Sit consequatur deleniti, nihil magnam est tempora, fugiat officia, possimus aspernatur nesciunt fugit et dolorum id? Molestias suscipit aut quasi sit temporibus sint asperiores enim reiciendis quidem.</div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-800 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800" id='files'>
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr className=' text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Last Modified
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Tags
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                    {userFiles.map(file => (
                      <tr className='cursor-pointer hover:bg-gray-50 focus:bg-gray-100 dark:hover:bg-gray-900 dark:focus:bg-gray-800 focus:outline-none' onClick={async () => await router.push(`/d/${file._id}/edit`)} tabIndex={0}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm font-medium">
                            <FileText className='mr-4 text-base' />
                            {file.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">Regional Paradigm Technician</div>
                          <div className="text-sm text-gray-500">Optimization</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Admin
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                            Active
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-right font-medium" onClick={async (e) => { e.stopPropagation(); setActiveDocumentPreview(file) }} tabIndex={0}>
                          <Info className='float-right mr-8' />
                        </td>
                      </tr>
                    ))}
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = verifyTokenCookie(req.cookies.token)
  const { client } = await connectToDatabase()
  try {
    const userData: User = await client.db('data').collection('users').findOne({ _id: user.publicAddress })
    const userFiles: File[] = await client.db('data').collection('documents').find({ collaborators: user.email }).toArray()
    return {
      props: {
        userData: JSON.stringify(userData),
        recentDocuments: [],
        documentInvitations: [],
        userFiles: userFiles.map(f => JSON.stringify(f))
      }
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}
