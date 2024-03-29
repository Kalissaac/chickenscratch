import { Transition } from '@headlessui/react'
import { X as IconX } from '@kalissaac/react-feather'
import { ReactNode } from 'react'

export default function Slideover ({ slideoverOpen, setSlideoverOpen, children, style = {} }: { slideoverOpen: boolean, setSlideoverOpen: Function, children: ReactNode, style?: object }): JSX.Element {
  return (
    <div className='fixed inset-0 z-30 overflow-hidden pointer-events-none'>
      <div className='absolute inset-0 overflow-hidden'>
        <Transition
          show={slideoverOpen}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-50 pointer-events-auto' onClick={() => setSlideoverOpen(!slideoverOpen)} />
        </Transition>
        <section className='absolute inset-y-0 right-0 pl-10 max-w-full flex pointer-events-auto'>
          <Transition
            show={slideoverOpen}
            enter='transform transition ease-in-out duration-500 sm:duration-700'
            enterFrom='translate-x-full'
            enterTo='translate-x-0'
            leave='transform transition ease-in-out duration-500 sm:duration-700'
            leaveFrom='translate-x-0'
            leaveTo='translate-x-full'
          >
              <div className='relative w-screen max-w-sm h-full'>
                <Transition.Child
                  enter='opacity transition ease-in-out duration-500'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='opacity transition ease-in-out duration-500'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute top-0 left-0 -ml-8 pt-6 pr-2 flex sm:-ml-10 sm:pr-4'>
                    <button aria-label='Close panel' onClick={() => setSlideoverOpen(!slideoverOpen)} className='text-gray-800 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400 text-3xl transition ease-in-out duration-150'>
                      <IconX />
                    </button>
                  </div>
                </Transition.Child>
                <div className='h-full flex flex-col space-y-6 py-6 px-4 sm:px-6 bg-white dark:bg-gray-900 shadow-xl overflow-y-scroll' style={style}>
                  {children}
                </div>
              </div>
          </Transition>
        </section>
      </div>
    </div>
  )
}
