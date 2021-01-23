import Card from '@components/card'
import Footer from '@components/footer'
import Nav from '@components/nav'
import SearchBar from '@components/search'
import { useUser } from '@shared/hooks'

function Header ({ title, id }: { title: string, id: string }): JSX.Element {
  return (
    <div className='text-xl uppercase font-normal mb-4' id={id}>
      {title}
    </div>
  )
}

export default function HomePage (): JSX.Element {
  const user = useUser('/login')

  return (
    <>
      <Nav />

      {user !== null &&
        <div className='p-20 pt-5'>
          <div className='flex mb-12 gap-4'>
            <button className='bg-accent-1-500 basis flex justify-center items-center gap-1 px-6 text-gray-100 uppercase'><ion-icon name='add-outline' /> New Document</button>
            <SearchBar />
          </div>

          <div className='flex items-center mb-4'>
            <button className='text-xl dark:text-gray-50 uppercase font-medium'>Recently edited</button>
            <button className='text-xl text-gray-500 hover:text-gray-700 dark:text-gray-50 uppercase font-normal ml-5 transition-all'>Invitations</button>
          </div>
          <div className='flex justify-between'>
            {Array(4).fill({}).map(() => (
              <Card key={Math.random() * 100}>
                <div>hi</div>
              </Card>
            ))}
          </div>

          <div className='py-48' />
        </div>}
      <Footer />
    </>
  )
}
