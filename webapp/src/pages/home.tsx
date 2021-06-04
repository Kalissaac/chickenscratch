import Card from '@components/card'
import DocumentPreview from '@components/document/preview'
import Footer from '@components/footer'
import InitialLoader from '@components/loader'
import Nav from '@components/nav'
import SearchBar from '@components/search'
import { SkeletonLine } from '@components/skeleton'
import type ParchmentDocument from '@interfaces/document'
import { FileText, Grid, Info, List, Plus } from '@kalissaac/react-feather'
import { useUser } from '@shared/hooks'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Node } from 'slate'
import useSWR from 'swr'

const serialize = (nodes: Node[]): string => nodes.map(n => Node.string(n)).join('\n')

enum tabs {
  recent = 'recent',
  invitations = 'invitations',
  favorites = 'favorites'
}

export default function HomePage (): JSX.Element {
  const { user, loading: userLoading, error: userError } = useUser()
  const [activeTab, setActiveTab] = useState<tabs>(tabs.recent)
  const [activeDocumentPreview, setActiveDocumentPreview] = useState<ParchmentDocument | null>(null)
  const { data: pageData, error: dataError } = useSWR(user ? '/api/home' : null)
  const router = useRouter()

  useEffect(() => {
    const id = router.asPath.split('#').pop()
    if (id && Object.values(tabs).includes(id as tabs)) {
      setActiveTab(id as tabs)
    }
  }, [router.asPath])

  if (userLoading) {
    return <InitialLoader />
  }
  if (userError) {
    if (userError.name === 'USER_NOT_AUTHENTICATED' || userError.name === 'USER_NOT_FOUND') return <InitialLoader />
    if (userError.message === 'NetworkError when attempting to fetch resource.') return <InitialLoader message='Reconnecting...' />
    throw userError
  }
  if (dataError) {
    if (dataError.name === 'USER_NOT_AUTHENTICATED') return <InitialLoader />
    if (dataError.message === 'NetworkError when attempting to fetch resource.') return <InitialLoader message='Reconnecting...' />
    throw dataError
  }

  const dataLoading = !pageData && !dataError

  const baseTabClasses = 'text-xl uppercase border-b-2 transition-all'
  const activeTabClasses = 'font-medium border-gray-darker dark:border-gray-lighter'
  const inactiveTabClasses = 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-500 border-transparent'

  return (
    <>
      <Head>
        <title>Home | Parchment</title>
      </Head>

      <Nav files={pageData?.allFiles} />
      <DocumentPreview activeDocument={activeDocumentPreview} setActiveDocument={setActiveDocumentPreview} />

      <div className='lg:p-20 pt-8 lg:pt-4'>
        <div className='hidden lg:flex mb-12 space-x-4' id='homesearch'>
          <button className='basis bg-accent-1-500 focus:border-gray-darker dark:focus:border-gray-100 focus:outline-none flex justify-center items-center px-6 text-gray-100 font-light uppercase' title='Create new document' onClick={async () => await router.push('/d/new')}><Plus size='1.25em' className='mr-1' aria-label='Add Icon' /> New Document</button>
          <SearchBar files={pageData?.allFiles} />
        </div>

        <div className='flex items-center mb-4 ml-4 lg:ml-0 space-x-6'>
          <button className={`${baseTabClasses} ${activeTab === tabs.recent ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab(tabs.recent)} id='recent'>Recently edited</button>
          <button className={`${baseTabClasses} ${activeTab === tabs.invitations ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab(tabs.invitations)} id='invitations'>Invitations</button>
          <button className={`${baseTabClasses} ${activeTab === tabs.favorites ? activeTabClasses : inactiveTabClasses}`} onClick={() => setActiveTab(tabs.favorites)} id='favorites'>Favorites</button>
        </div>
        <div className='flex flex-col lg:flex-row justify-between -ml-2 -mr-2 mb-12 gap-y-2 lg:gap-y-0'>
          {dataLoading && Array(4).fill(0).map((_, i) => (
            <Card
              title={<SkeletonLine width='2/4' className='animate-pulse h-5 my-1' />}
              subtitle={<SkeletonLine width='3/4' className='bg-gray-400 animate-pulse' />}
              background='bg-gray-600 dark:bg-gray-800'
              key={i}
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
          {activeTab === tabs.recent && pageData && (pageData?.recentFiles.length > 0
            ? pageData?.recentFiles.slice(0, 4).map((file: ParchmentDocument) => {
              const serializedBody = typeof file.body === 'string' ? file.body : serialize(file.body)
              return (
              <Card
                title={file.title}
                subtitle={<>{dayjs().to(dayjs(file.lastModified))} &#8226; {serializedBody.match(/[\w\d’'-]+/gi)?.length ?? 0} {serializedBody.match(/[\w\d’'-]+/gi)?.length === 1 ? 'word' : 'words'} {file.due && <>&#8226; due {dayjs().to(dayjs(file.due))}</>}</>}
                background='bg-gradient-to-r from-pink-600 to-purple-500'
                href={`/d/${file._id}/edit`}
                key={file._id}
              >
                {serializedBody}
              </Card>
              )
            })
            : <Card
              title='No recent documents'
              background='bg-gray-600 dark:bg-gray-800'
              href='/d/new'
              >
              Click to create a new document
            </Card>
          )}
          {activeTab === tabs.invitations && pageData?.recentFiles.slice(0, 5).map((file: ParchmentDocument) => {
            const serializedBody = typeof file.body === 'string' ? file.body : serialize(file.body)
            return (
              <Card
                title={file.title}
                subtitle={<>{dayjs().to(dayjs(file.lastModified))} &#8226; {serializedBody.match(/[\w\d’'-]+/gi)?.length ?? 0} {serializedBody.match(/[\w\d’'-]+/gi)?.length === 1 ? 'word' : 'words'} {file.due && <>&#8226; due {dayjs().to(dayjs(file.due))}</>}</>}
                background='bg-gradient-to-r from-yellow-600 to-red-500'
                href={`/d/${file._id}/edit`}
                key={file._id}
              >
                {serializedBody}
              </Card>
            )
          })}
          {activeTab === tabs.favorites && pageData?.recentFiles.slice(0, 3).map((file: ParchmentDocument) => {
            const serializedBody = typeof file.body === 'string' ? file.body : serialize(file.body)
            return (
              <Card
                title={file.title}
                subtitle={<>{dayjs().to(dayjs(file.lastModified))} &#8226; {serializedBody.match(/[\w\d’'-]+/gi)?.length ?? 0} {serializedBody.match(/[\w\d’'-]+/gi)?.length === 1 ? 'word' : 'words'} {file.due && <>&#8226; due {dayjs().to(dayjs(file.due))}</>}</>}
                background='bg-gradient-to-r from-yellow-600 to-red-500'
                href={`/d/${file._id}/edit`}
                key={file._id}
              >
                {serializedBody}
              </Card>
            )
          })}
        </div>

        <div className='flex items-center justify-between mb-4 ml-4 lg:ml-0 text-xl'>
          <h2 className='uppercase font-medium text-gray-600 dark:text-gray-400 border-b-2m border-gray-darker dark:border-gray-lighter' id='files'>{pageData?.allFiles.length ?? 0} documents</h2>
          <div className='flex justify-center items-center text-xl space-x-2'>
            <button className='bg-black bg-opacity-25 rounded-lg p-1'>
              <List />
            </button>
            <button className=''>
              <Grid />
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-800 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
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
                      <th scope="col" className="relative px-6 py-3 w-[5%]">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                    {dataLoading && Array(5).fill(0).map((_, i) => (
                      <tr key={i} className='focus:outline-none animate-pulse'>
                        <td className="px-6 py-4 my-1 whitespace-nowrap">
                          <div className="flex items-center">
                            <SkeletonLine className='mr-4' />
                            <SkeletonLine width='3/4' />
                          </div>
                        </td>
                        <td className="px-6 py-4 my-1 whitespace-nowrap">
                          <SkeletonLine width='[66%]' />
                        </td>
                        <td className="px-6 py-4 my-1 whitespace-nowrap">
                          <SkeletonLine width='[66%]' />
                        </td>
                        <td className="px-6 py-4 my-1 whitespace-nowrap flex space-x-4">
                          {Array(3).fill(0).map((_, j) => (
                            <SkeletonLine key={`${i}-${j}`} width='1/3' />
                          ))}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <SkeletonLine className='mr-8 float-right rounded-full' />
                        </td>
                      </tr>
                    ))}
                    {pageData?.allFiles.length > 0
                      ? pageData?.allFiles.map((file: ParchmentDocument) => (
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
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          {file.tags.length > 0
                            ? file.tags.map(tag => (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" key={tag}>
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
                      ))
                      : <tr className='cursor-pointer hover:bg-gray-50 focus:bg-gray-100 dark:hover:bg-gray-900 dark:focus:bg-gray-800 focus:outline-none' onClick={async () => await router.push('/d/new')} tabIndex={0}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium">
                          <FileText className='mr-4 text-base' aria-label='Document Icon' />
                          Create a new document
                        </div>
                      </td>
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>}
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
