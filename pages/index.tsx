import Card from '@components/card'
import Footer from '@components/footer'
import Nav from '@components/nav'

export default function IndexPage() {
  return (
    <>
      <Nav />
      <div className='py-20'>
        <h1 className='text-5xl text-center text-gray-700 dark:text-gray-100'>
          Next.js + Tailwind CSS 2.0
        </h1>

        <div className="flex justify-between">
          {Array(10).fill({}).map(() => (
            <Card>
              <div>hi</div>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}
