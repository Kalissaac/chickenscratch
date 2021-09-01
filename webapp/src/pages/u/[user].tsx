import Nav from '@components/nav'
import Footer from '@components/footer'
import { useRouter } from 'next/router'
import { useUser } from '@shared/hooks'
import useSWR, { mutate } from 'swr'
import InitialLoader from '@components/loader'
import ParchmentDocument from '@interfaces/document'
import { SkeletonLine } from '@components/skeleton'
import dayjs from 'dayjs'
import { FileText, Info, Plus } from '@kalissaac/react-feather'
import { useState } from 'react'
import DocumentPreview from '@components/document/preview'
import Image from 'next/image'
import Head from 'next/head'

export default function UserProfilePage (): JSX.Element {
  const router = useRouter()
  const { loading: userLoading, error: userError } = useUser()
  const { data: pageData, error: dataError } = useSWR(`/api/user/get?id=${router.query.user as string}`)
  const [activeDocumentPreview, setActiveDocumentPreview] = useState<ParchmentDocument | null>(null)

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

  return (
    <>
      <Head>
        <title>{pageData?.user?.name || 'Unknown user'} | Parchment</title>
      </Head>

      <Nav files={pageData?.commonFiles} />
      <DocumentPreview activeDocument={activeDocumentPreview} setActiveDocument={setActiveDocumentPreview} />

      <div className='lg:p-20 pt-8 lg:pt-4 min-h-screen'>
        <div id='homesearch' />

        <div className='flex items-center gap-4 p-4 mb-12'>
          <div className='w-14 h-14 relative'>
            <Image src='/images/user.jpg' alt='Profile picture' layout='fill' objectFit='cover' className='rounded-full' />
          </div>
          <div className='flex flex-col'>
            <h2 className='text-xl capitalize font-semibold'>{pageData?.user ? pageData.user.name : router.query.user}</h2>
            <p className='text-gray-800 dark:text-gray-200'>{pageData?.commonFiles.length} common documents</p>
          </div>
          <button className='basis ml-auto bg-accent-1-500 focus:border-gray-darker dark:focus:border-gray-100 focus:outline-none flex justify-center items-center p-3 px-4 text-gray-100 font-light uppercase' title='Create new document together' onClick={async () => await router.push(`/d/new?collaborators=${pageData?.user.email as string}`)}><Plus size='1.25em' className='mr-2' aria-label='Add Icon' /> New Document</button>
        </div>

        <section className="flex flex-col">
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
                    {pageData?.commonFiles.filter((d: ParchmentDocument) => !d.archived).length > 0
                      ? pageData?.commonFiles.filter((d: ParchmentDocument) => !d.archived).map((file: ParchmentDocument) => (
                        <tr className='cursor-pointer hover:bg-gray-50 focus:bg-gray-100 dark:hover:bg-gray-900 dark:focus:bg-gray-800 focus:outline-none' key={file._id} onClick={async () => await mutate(`/api/document/get?id=${file._id}`, file) && await router.push(`/d/${file._id}/edit`)} tabIndex={0}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm font-medium">
                              <FileText className='mr-4 text-base' aria-label='Document Icon' />
                              {file.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            Document
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {dayjs().to(dayjs(file.lastModified))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-2">
                            {file.tags.length > 0
                              ? file.tags.map(tag => (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" key={tag}>
                                  {tag}
                                </span>
                              ))
                              : <span className="text-sm text-gray-500 dark:text-gray-400">No tags</span>
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
        </section>
      </div>

      <Footer />
    </>
  )
}

// display user name, email, profile picture through gravatar
// show documents that both users have access to
// button to create a document with that user as a collaborator
