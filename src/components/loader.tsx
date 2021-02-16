export default function InitialLoader ({ message }: { message?: string }): JSX.Element {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='uppercase font-serif font-bold text-5xl border-black dark:border-white border-b-2 pb-4 animate-pulse'>Parchment</div>
      <code className='text-gray-500 mt-8'>{message}</code> {/* Redesign to show toast instead */}
    </div>
  )
}
