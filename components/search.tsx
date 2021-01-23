import { useState } from 'react'
import { Search as SearchIcon } from 'react-feather'
import Fuse from 'fuse.js'

const names = ['Applebee\'s', 'Baja Fresh', 'Bob Evans', 'Chili\'s', 'Brann\'s Steakhouse and Grille', 'Champps Americana', 'Carraba\'s', 'Cattlemens Steakhouse', 'Chick-fil-A', 'Cheeseburger in Paradise', 'California Pizza Kitchen', 'Country Cookin', 'Denny\'s', 'IHOP', 'East Side Mario\'s', 'Einstein Bros Bagels', 'Famous Dave\'s', 'Friendly\'s', 'Golden Corral', 'Hoss\'s Family Steak & Sea House', 'Lone Star Steakhouse', 'LongHorn Steakhouse', 'Max & Erma\'s', 'P.F. Chang\'s', 'On The Border', 'Outback Steakhouse', 'Red Robin', 'Perkins Restaurant & Bakery', 'Red Hot & Blue', 'Red Lobster', 'Ruby Tuesday', 'Shoney\'s', 'Starbucks', 'Tim Hortons', 'The Salt Lick', 'The Olive Garden', 'Texas Roadhouse', 'Uno Pizzeria & Grill', 'T.G.I. Fridays', 'Village Inn']

export default function SearchBar ({ style }: { style?: Object }): JSX.Element {
  // @ts-expect-error 2345 TypeScript doesn't like it when we initialize states with null
  const [results, setResults] = useState<Fuse.FuseResult>(null)

  return (
    <div className='bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 basis h-full flex-grow focus-within:border-gray-400' style={style}>
      <div className='flex items-center px-6' style={style}>
        <SearchIcon />
        <input
          type='text' placeholder='What are you looking for?' className='w-full ml-4 py-4 outline-none dark:bg-gray-800 dark:text-gray-100'
          onChange={async (e) => {
            const { value } = e.currentTarget
            // Dynamically load fuse.js
            const fuse = new Fuse(names)

            setResults(fuse.search(value))
          }}
        />
      </div>
      {results && results.length > 0 &&
        <div className='absolute rounded-b-md bg-white dark:bg-gray-900 py-2 px-6 -mt-1' style={{ minWidth: '95rem' }}>
          {results?.map(result => (
            <div>{result.item}</div>
          ))}
        </div>
      }
    </div>
  )
}
