import Footer from '@components/footer'
import InitialLoader from '@components/loader'
import Nav from '@components/nav'
import { useUser } from '@shared/hooks'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Plus } from '@kalissaac/react-feather'
import { toUpper } from '@shared/util'
import ParchmentDocument from '@interfaces/document'
import Link from 'next/link'
import dayjs from 'dayjs'

export default function TagDetailPage (): JSX.Element {
  const router = useRouter()
  const { user, loading: userLoading, error: userError } = useUser()
  const { data: pageData, error: dataError } = useSWR(user ? `/api/tag/get?id=${router.query.tag as string}` : null)

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

  return (
    <>
      <Head>
        <title>{toUpper((pageData?.tag ? pageData.tag.name : router.query.tag) || 'Unknown')} tag | Parchment</title>
      </Head>

      <Nav files={pageData?.files} />

      <div className='lg:p-20 pt-8 lg:pt-4 min-h-screen'>
        <div id='homesearch' />

        <div className='flex items-center gap-4 p-4 mb-12'>
          <div className='bg-gray-500 text-gray-50 dark:text-gray-900 rounded-full w-12 h-12 flex justify-center items-center' style={{ backgroundColor: pageData?.tag?.color }}>
            <span className='font-semibold text-lg uppercase'>{(pageData?.tag ? pageData.tag.name : router.query.tag).charAt(0)}</span>
          </div>
          <div className='flex flex-col'>
            <h2 className='text-xl capitalize font-semibold'>{pageData?.tag ? pageData.tag.name : router.query.tag}</h2>
            <p className='text-gray-800 dark:text-gray-200'>{pageData?.files.length} documents</p>
          </div>
        </div>

        <section className='grid grid-cols-4 gap-6'>
          {pageData?.files?.length > 0
            ? pageData?.files.map((file: ParchmentDocument) => (
              <Link href={`/d/${file._id}/edit`} key={file._id}>
                <a className='shadow-md hover:shadow-lg transition-all rounded-md bg-white hover:bg-gray-50 dark:bg-black p-4 py-3 flex flex-col gap-2'>
                  <div className='space-x-2'>
                    {file.tags.length > 0
                      ? file.tags.map(tag => (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" key={tag}>
                          {tag}
                        </span>
                      ))
                      : <span className="text-sm text-gray-500 dark:text-gray-400">No tags</span>
                    }
                  </div>
                  <h4 className='font-medium'>{file.title}</h4>
                  <div className='text-sm text-gray-600'>last modified {dayjs().to(dayjs(file.lastModified))}</div>
                </a>
              </Link>
            ))
            : <Link href='/d/new'>
                <a className='shadow-md hover:shadow-lg transition-all rounded-md bg-white hover:bg-gray-50 dark:bg-black p-4 py-3 flex flex-col gap-2'>
                  <h4 className='font-medium flex items-center gap-2'><Plus /> New Document</h4>
                  <div className='text-sm text-gray-700'>No documents found for this tag. Why don't you make a new one?</div>
                </a>
              </Link>
          }
        </section>
      </div>

      <Footer />
    </>
  )
}
