export default function SearchBar ({ style }: { style?: Object }): JSX.Element {
  return (
    <>
      <div className='bg-white basis px-6 flex-grow flex items-center text-gray-600 dark:bg-gray-800 dark:text-gray-200 h-full focus-within:border-gray-400' style={style}>
        <ion-icon name='search-outline' /> <input type='text' placeholder='What are you looking for?' className='w-full ml-2 py-4 outline-none dark:bg-gray-800 dark:text-gray-100' />
      </div>
    </>
  )
}
