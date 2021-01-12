import Card from '@components/card'
import Footer from '@components/footer'
import Nav from '@components/nav'
import { useUser } from '@shared/hooks'

function Header ({ title, id }: { title: string, id: string }): JSX.Element {
  return (
    <div className='text-xl uppercase font-light mb-4' id={id}>
      {title}
    </div>
  )
}

export default function HomePage (): JSX.Element {
  const user = useUser('/login')

  return (
    <>
      <Nav />

      <div className='p-20'>
        <Header title='Recently edited' id='recent' />
        <div className='flex justify-between'>
          {Array(4).fill({}).map(() => (
            <Card key={Math.random() * 100}>
              <div>hi</div>
            </Card>
          ))}
        </div>

        <div className='py-48' />
      </div>

      <Footer />
    </>
  )
}
