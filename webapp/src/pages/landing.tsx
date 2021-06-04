// import DocumentEditor, { EditorWrapper } from '@components/document/editor'
import DocumentTitlebar from '@components/document/titlebar'
import Link from 'next/link'
// import ParchmentEditorContext, { createDocumentValue } from '@components/document/editor/context'

export default function LandingPage (): JSX.Element {
  return (
    <main className='flex flex-col min-h-screen m-12 my-8 items-center'>
      <nav className='self-end'>
        <Link href='/login'>
          <a className='login-btn py-2 px-6 text-base'>Sign In</a>
        </Link>
      </nav>

      <h1 className='uppercase font-newYorkExtraLarge font-bold text-6xl dark:text-white tracking-wider border-b-4 border-transparent hover:border-accent-1-500 transition-colors my-24'>Parchment</h1>

      <div className='w-1/2'>
        <DocumentTitlebar setSidebarOpen={() => {}} showBackButton={false} />
        {/* <DocumentEditor /> */}
      </div>
    </main>
  )
}
