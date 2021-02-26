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
import type ParchmentDocument from '@interfaces/document'
import useSWR from 'swr'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { SkeletonLine } from '@components/skeleton'
import { Node } from 'slate'

dayjs.extend(relativeTime)

const serialize = (nodes: Node[]): string => {
  return nodes.map(n => Node.string(n)).join('\n')
}

export default function HomePage (): JSX.Element {
  const { user, loading: userLoading, error: userError } = useUser()
  const [activeTab, setActiveTab] = useState('recentEdit')
  const [activeDocumentPreview, setActiveDocumentPreview] = useState<ParchmentDocument | null>(null)
  const { data: pageData, error: dataError } = useSWR(user ? '/api/home' : null)
  const router = useRouter()

  if (userLoading) {
    return <InitialLoader />
  }
  if (userError) {
    if (userError.name === 'USER_NOT_AUTHENTICATED') return <InitialLoader />
    if (userError.message === 'NetworkError when attempting to fetch resource.') return <InitialLoader message='Reconnecting...' />
    throw userError
  }
  if (dataError) {
    if (dataError.name === 'USER_NOT_AUTHENTICATED') return <InitialLoader />
    if (dataError.message === 'NetworkError when attempting to fetch resource.') return <InitialLoader message='Reconnecting...' />
    throw dataError
  }

  const dataLoading = !pageData && !dataError

  const activeTabClasses = 'font-medium border-gray-darker dark:border-gray-lighter'
  const inactiveTabClasses = 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-500 border-transparent'

  return (
    <>
      <Nav files={pageData?.allFiles} />
      <DocumentPreview activeDocument={activeDocumentPreview} setActiveDocument={setActiveDocumentPreview} />

      <div className='lg:p-20 lg:pt-4'>
        <div className='flex mb-12 space-x-4' id='homesearch'>
          <button className='basis bg-accent-1-500 focus:border-gray-darker dark:focus:border-gray-100 focus:outline-none flex justify-center items-center px-6 text-gray-100 font-light uppercase' onClick={async () => await router.push('/d/new')}><Plus size='1.25em' className='mr-1' aria-label='Add Icon' /> New Document</button>
          <SearchBar files={pageData?.allFiles} />
        </div>

        <div className='flex items-center mb-4'>
          <button className={`text-xl uppercase border-b-2 transition-all ${activeTab === 'recentEdit' ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab('recentEdit')} id='recent'>Recently edited</button>
          <button className={`text-xl uppercase border-b-2 ml-5 transition-all ${activeTab === 'invitations' ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab('invitations')} id='invitations'>Invitations</button>
        </div>
        <div className='flex justify-between -ml-2 -mr-2 mb-12'>
          {dataLoading && Array(4).fill(0).map(() => (
            <Card
              title={<SkeletonLine width='2/4' className='animate-pulse h-5 my-1' />}
              subtitle={<SkeletonLine width='3/4' className='bg-gray-400 animate-pulse' />}
              background='bg-gray-600 dark:bg-gray-800'
            >
              <div className='space-y-3'>
                <SkeletonLine width='2/6' className='animate-pulse' />
                <SkeletonLine width='5/6' className='animate-pulse' />
                <SkeletonLine width='4/6' className='animate-pulse' />
                <SkeletonLine width='5/6' className='animate-pulse' />
                <SkeletonLine width='3/6' className='animate-pulse' />
              </div>
            </Card>
          ))}
          {activeTab === 'recentEdit' && pageData?.recentFiles.slice(0, 4).map((file: ParchmentDocument) => {
            const serializedBody = typeof file.body === 'string' ? file.body : serialize(file.body)
            return (
              <Card
                title={file.title}
                subtitle={<>{dayjs().to(dayjs(file.lastModified))} &#8226; {serializedBody.split(' ').length} {serializedBody.split(' ').length === 1 ? 'word' : 'words'} {file.due && `&#8226; due ${dayjs().to(dayjs(file.due))}`}</>}
                background='bg-gradient-to-r from-yellow-600 to-red-500'
                href={`/d/${file._id}/edit`}
                key={file._id}
              >
                {serializedBody}
              </Card>
            )
          })}
          {activeTab === 'invitations' && pageData?.recentFiles.slice(0, 5).map((file: ParchmentDocument) => {
            const serializedBody = typeof file.body === 'string' ? file.body : serialize(file.body)
            return (
              <Card
                title={file.title}
                subtitle={<>{dayjs().to(dayjs(file.lastModified))} &#8226; {serializedBody.split(' ').length} {serializedBody.split(' ').length === 1 ? 'word' : 'words'} {file.due && `&#8226; due ${dayjs().to(dayjs(file.due))}`}</>}
                background='bg-gradient-to-r from-yellow-600 to-red-500'
                href={`/d/${file._id}/edit`}
                key={file._id}
              >
                {serializedBody}
              </Card>
            )
          })}
        </div>

        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-800 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800" id='files'>
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr className='text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 w-1/6">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 w-1/6">
                        Last Modified
                      </th>
                      <th scope="col" className="px-6 py-3 w-1/6">
                        Tags
                      </th>
                      <th scope="col" className="relative px-6 py-3" style={{ width: '5%' }}>
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                    {dataLoading && Array(5).fill(0).map(() => (
                      <tr key={Date.now()} className='focus:outline-none animate-pulse'>
                        <td className="px-6 py-4 my-1 whitespace-nowrap">
                          <div className="flex items-center">
                            <SkeletonLine className='mr-4' />
                            <SkeletonLine width='3/4' />
                          </div>
                        </td>
                        <td className="px-6 py-4 my-1 whitespace-nowrap">
                          <SkeletonLine width='2/4' />
                        </td>
                        <td className="px-6 py-4 my-1 whitespace-nowrap">
                          <SkeletonLine width='1/4' />
                        </td>
                        <td className="px-6 py-4 my-1 whitespace-nowrap flex space-x-4">
                          {Array(3).fill(0).map(() => (
                            <SkeletonLine key={Date.now()} width='1/3' />
                          ))}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <SkeletonLine className='mr-8 float-right rounded-full' />
                        </td>
                      </tr>
                    ))}
                    {pageData?.allFiles.map((file: ParchmentDocument) => (
                      <tr className='cursor-pointer hover:bg-gray-50 focus:bg-gray-100 dark:hover:bg-gray-900 dark:focus:bg-gray-800 focus:outline-none' key={file._id} onClick={async () => await router.push(`/d/${file._id}/edit`)} tabIndex={0}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm font-medium">
                            <FileText className='mr-4 text-base' aria-label='Document Icon' />
                            {file.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Document
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dayjs().to(dayjs(file.lastModified))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {file.tags.length > 0
                            ? file.tags.map(tag => (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                                {tag}
                              </span>
                            ))
                            : <span className="text-sm text-gray-500">No tags</span>
                          }
                        </td>
                        <td className="p-4 whitespace-nowrap text-right font-medium focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none" onClick={async (e) => { e.stopPropagation(); setActiveDocumentPreview(file) }} tabIndex={0}>
                          <Info className='float-right mr-8' aria-label='Information Icon' />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
