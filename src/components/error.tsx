export default function ErrorPage ({ error }: { error: Error }): JSX.Element {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='uppercase font-serif font-bold text-5xl border-black dark:border-white border-b-2 pb-4 animate-pulse'>we encountered a fucky wucky: {error.message}</div>
    </div>
  )
}
