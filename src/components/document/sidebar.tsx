import Slideover from '@components/slideover'

export default function DocumentSidebar ({ setSidebarOpen, sidebarOpen }: { setSidebarOpen: Function, sidebarOpen: boolean }): JSX.Element {
  return (
    <Slideover slideoverOpen={sidebarOpen} setSlideoverOpen={setSidebarOpen}>
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
    </Slideover>
  )
}
