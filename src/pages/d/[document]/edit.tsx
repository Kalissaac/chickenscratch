import { useState } from 'react'
import Titlebar from '@components/document/titlebar'
import Sidebar from '@components/document/sidebar'
import Editor from '@components/document/editor'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { connectToDatabase } from '@shared/mongo'
import { ObjectId } from 'mongodb'

export default function DocumentEditPage (props): JSX.Element {
  const activeDocument = JSON.parse(props.activeDocument)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Head>
        <title>{activeDocument.title} | Parchment</title>
      </Head>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeDocument={activeDocument} />
      <Titlebar setSidebarOpen={setSidebarOpen} activeDocument={activeDocument} />
      <div className='p-32 px-56'>
        <Editor activeDocument={activeDocument} />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { client } = await connectToDatabase()
  try {
    const requestedDocument = await client.db('data').collection('documents').findOne({ _id: ObjectId.createFromHexString(params?.document as string) })
    if (!requestedDocument) throw new Error('Document not found')
    return {
      props: {
        activeDocument: JSON.stringify(requestedDocument)
      }
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}
