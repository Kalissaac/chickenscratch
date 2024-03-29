import { Clock, Save, Type } from '@kalissaac/react-feather'
import { ReactNode, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import ParchmentDocument from '@interfaces/document'
import { Node } from 'slate'
import { Transition } from '@headlessui/react'

const serialize = (nodes: Node[]): string => nodes.map(n => Node.string(n)).join('\n')

export default function DocumentStatusBar ({ activeDocument, lastUpdate, updateLock, saveDocument }: { activeDocument: ParchmentDocument, lastUpdate: number, updateLock: boolean, saveDocument: () => void }): JSX.Element {
  const [openMenu, setOpenMenu] = useState('')
  const wordCount = useMemo(() => serialize(activeDocument.body).match(/[\w\d’'-]+/gi)?.length ?? 0, [activeDocument.body])
  return (
    <div className='fixed left-0 bottom-0 right-0 text-gray-900 dark:text-gray-50 text-opacity-60 dark:text-opacity-60 hover:text-opacity-100 dark:hover:text-opacity-100 transition-opacity text-xs font-editor flex justify-between items-center h-6 px-8' id='document_statusbar'>
      <section className='h-full space-x-1 bg-gray-lighter dark:bg-gray-darker flex items-center'>
        <StatusBarItem onClick={() => { setOpenMenu(openMenu === 'counter' ? '' : 'counter') }}><CounterMenu openMenu={openMenu} setOpenMenu={setOpenMenu} /><Type /></StatusBarItem>
        <StatusBarItem onClick={() => {}}>{wordCount} words</StatusBarItem>
        <StatusBarItem onClick={() => {}}>{(wordCount / 250).toFixed(2)} pages</StatusBarItem>
        <StatusBarItem onClick={() => {}}>{Math.ceil(wordCount / 265)} min</StatusBarItem>
        {/* <StatusBarItem onClick={() => {}}>English</StatusBarItem> */}
      </section>
      <section className='h-full space-x-1 bg-gray-lighter dark:bg-gray-darker flex items-center'>
        <StatusBarItem onClick={() => {}} title={new Date().toString()}>
          <Clock className='mr-2' /> {dayjs().format('HH:mm')}
        </StatusBarItem>
        <StatusBarItem onClick={saveDocument} title={activeDocument.lastModified}>
          {updateLock
            ? <><Save className='mr-2' /> saving</>
            : <><Save className='mr-2' /> last saved {dayjs(lastUpdate).fromNow()}</>
          }
        </StatusBarItem>
      </section>
    </div>
  )
}

function StatusBarItem ({ children, onClick, title }: { children: ReactNode, onClick: () => void, title?: string }): JSX.Element {
  return (
    <button onClick={onClick} title={title} className='hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors px-2 h-full relative flex items-center'>{children}</button>
  )
}

function CounterMenu ({ openMenu, setOpenMenu }: { openMenu: string, setOpenMenu: React.Dispatch<React.SetStateAction<string>> }): JSX.Element {
  return (
    <Transition show={openMenu === 'counter'} onBlur={() => setOpenMenu('')} className='absolute left-0 right-0 bottom-24 -top-24 h-24 bg-gray-300 dark:bg-gray-800'>
      Words
    </Transition>
  )
}
