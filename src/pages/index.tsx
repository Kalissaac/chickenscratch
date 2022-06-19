import { EditorWrapper } from '@components/document/editor'
import ParchmentEditorContext, { createDocumentValue } from '@components/document/editor/context'
import DocumentTitlebar from '@components/document/titlebar'
import { AccessLevels } from '@interfaces/document'
import { GitHub } from '@kalissaac/react-feather'
import Link from 'next/link'
import type { GetServerSideProps } from 'next'

export default function LandingPage (): JSX.Element {
  return (
    <main className='flex flex-col min-h-screen p-12 py-8 items-center bg-gradient-to-b from-gray-lighter to-gray-100 dark:from-gray-darker dark:to-gray-900'>
      <nav className='flex items-center justify-between w-full'>
        <a href='https://github.com/Kalissaac/chickenscratch' className='text-lg transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'>
          <GitHub />
        </a>
        <Link href='/login'>
          <a className='login-btn py-2 px-6 text-base'>Sign In</a>
        </Link>
      </nav>

      <section className='my-24 text-center'>
        <h1 className='uppercase font-newYorkExtraLarge font-bold text-6xl dark:text-white tracking-wider border-b-4 border-transparent hover:border-accent-1-500 transition-colors'>Parchment</h1>
        <p className='mt-2 text-lg font-light'>Blazing fast. Highly extensible. Open source. Gratis.</p>
      </section>

      <ParchmentEditorContext.Provider value={createDocumentValue({
        _id: 'undefined',
        title: 'Welcome to Parchment!',
        body: [{
          type: 'paragraph',
          children: [{
            text: 'Why don\'t you take it for a spin?'
          }]
        },
        {
          type: 'paragraph',
          children: [{
            text: 'Just start typing!'
          }]
        }],
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        collaborators: [],
        tags: [],
        access: AccessLevels.public,
        archived: false,
        integrations: {
          googleDrive: ''
        }
      })}>
        <div className='w-1/2 min-h-[100vh] relative shadow-md rounded-xl overflow-hidden hide-statusbar'>
          <DocumentTitlebar setSidebarOpen={() => {}} showBackButton={false} mode={1} />
          <EditorWrapper mode={0} className='!mx-10 min-h-[4rem] relative' />
        </div>
      </ParchmentEditorContext.Provider>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.cookies.token) {
    return {
      redirect: {
        destination: '/home',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
