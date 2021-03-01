import { Save } from '@kalissaac/react-feather'
import { ReactNode } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function DocumentStatusBar ({ lastUpdate }): JSX.Element {
  console.log(lastUpdate)
  return (
    <div className='fixed left-0 bottom-0 right-0 bg-gray-100 text-xs font-mono flex justify-between items-center h-6 px-8'>
      <StatusBarItem onClick={() => {}}>124 words</StatusBarItem>
      <StatusBarItem onClick={() => {}}><Save className=' inline' /> last saved {dayjs(lastUpdate).fromNow()}</StatusBarItem>
    </div>
  )
}

function StatusBarItem ({ children, onClick }: { children: ReactNode, onClick: any }): JSX.Element {
  return (
    <button onClick={onClick} className='hover:bg-gray-200 transition-colors px-2 h-full'>{children}</button>
  )
}
