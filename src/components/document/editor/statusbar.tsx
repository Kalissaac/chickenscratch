import { Save } from '@kalissaac/react-feather'
import { ReactNode } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ParchmentDocument from '@interfaces/document'
import { Node } from 'slate'

dayjs.extend(relativeTime)

const serialize = (nodes: Node[]): string => nodes.map(n => Node.string(n)).join('\n')

export default function DocumentStatusBar ({ activeDocument, lastUpdate, updateLock, saveDocument }: { activeDocument: ParchmentDocument, lastUpdate: number, updateLock: boolean, saveDocument: () => void }): JSX.Element {
  return (
    <div className='fixed left-0 bottom-0 right-0 text-gray-900 dark:text-gray-50 text-opacity-60 dark:text-opacity-60 hover:text-opacity-100 dark:hover:text-opacity-100 transition-opacity text-xs font-editor flex justify-between items-center h-6 px-8'>
      <section className='h-full space-x-1'>
        <StatusBarItem onClick={() => {}}>{serialize(activeDocument.body).match(/[\w\d’'-]+/gi)?.length ?? 0} words</StatusBarItem>
        <StatusBarItem onClick={() => {}}>English (U.S.)</StatusBarItem>
      </section>
      <section className='h-full space-x-1'>
        <StatusBarItem onClick={saveDocument} title={activeDocument.lastModified}>
          {updateLock
            ? <><Save className='inline' /> saving</>
            : <><Save className='inline' /> last saved {dayjs(lastUpdate).fromNow()}</>
          }
        </StatusBarItem>
      </section>
    </div>
  )
}

function StatusBarItem ({ children, onClick, title }: { children: ReactNode, onClick: () => void, title?: string }): JSX.Element {
  return (
    <button onClick={onClick} title={title} className='hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors px-2 h-full'>{children}</button>
  )
}
