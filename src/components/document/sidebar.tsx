import { Transition } from '@headlessui/react'
import { X as IconX } from 'react-feather'

export default function DocumentSidebar ({ setSidebarOpen, sidebarOpen }: { setSidebarOpen: Function, sidebarOpen: boolean }): JSX.Element {
  return (
    <div className='fixed inset-0 z-30 overflow-hidden pointer-events-none'>
      <div className='absolute inset-0 overflow-hidden'>
        {/*
        Background overlay, show/hide based on slide-over state.

        Entering: 'ease-in-out duration-500'
          From: 'opacity-0'
          To: 'opacity-100'
        Leaving: 'ease-in-out duration-500'
          From: 'opacity-100'
          To: 'opacity-0'
        */}
        <Transition
          show={sidebarOpen}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          {(ref) => (
            <div ref={ref} className='absolute inset-0 bg-gray-900 bg-opacity-5 transition-opacity pointer-events-auto' style={{ backdropFilter: 'blur(4px)' }} onClick={() => setSidebarOpen(!sidebarOpen)} />
          )}
        </Transition>
        <section className='absolute inset-y-0 right-0 pl-10 max-w-full flex pointer-events-auto'>
          {/*
            Slide-over panel, show/hide based on slide-over state.

            Entering: 'transform transition ease-in-out duration-500 sm:duration-700'
              From: 'translate-x-full'
              To: 'translate-x-0'
            Leaving: 'transform transition ease-in-out duration-500 sm:duration-700'
              From: 'translate-x-0'
              To: 'translate-x-full'
          */}
          <Transition
            show={sidebarOpen}
            enter='transform transition ease-in-out duration-500 sm:duration-700'
            enterFrom='translate-x-full'
            enterTo='translate-x-0'
            leave='transform transition ease-in-out duration-500 sm:duration-700'
            leaveFrom='translate-x-0'
            leaveTo='translate-x-full'
          >
            {(ref) => (
              <div ref={ref} className='relative w-screen max-w-md'>
                {/*
                  Close button, show/hide based on slide-over state.

                  Entering: 'ease-in-out duration-500'
                    From: 'opacity-0'
                    To: 'opacity-100'
                  Leaving: 'ease-in-out duration-500'
                    From: 'opacity-100'
                    To: 'opacity-0'
                */}
                <div className='absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4'>
                  <Transition.Child>
                    <button aria-label='Close panel' onClick={() => setSidebarOpen(!sidebarOpen)} className='text-gray-800 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400 text-3xl transition ease-in-out duration-150'>
                      {/* Heroicon name: x */}
                      <IconX />
                    </button>
                  </Transition.Child>
                </div>
                <div className='h-full flex flex-col space-y-6 py-6 bg-white dark:bg-gray-900 shadow-xl overflow-y-scroll'>
                  <header className='px-4 sm:px-6'>
                    <h2 className='text-lg leading-7 font-medium'>
                      Preferences
                    </h2>
                  </header>
                  <div className='relative flex-1 px-4 sm:px-6'>
                    <div className='absolute inset-0 px-4 sm:px-6'>
                      <div className='h-full border-2 border-dashed border-gray-200'>hey</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Transition>
        </section>
      </div>
    </div>
  )
}
