import { AlertTriangle } from '@kalissaac/react-feather'

export default function InitialLoader ({ message }: { message?: string }): JSX.Element {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='uppercase font-newYorkExtraLarge font-bold text-5xl 2xl:text-6xl border-accent-1-500 border-b-2 pb-4 animate-pulse'>Parchment</div>
      {message &&
        <div className={'rounded-lg absolute bottom-6 right-6 p-4 mt-2 shadow-xl text-gray-50 text-base flex justify-center items-center bg-accent-1-500'}>
          <AlertTriangle />
          <span className='mx-1' />
          {message}
        </div>
      }
    </div>
  )
}
