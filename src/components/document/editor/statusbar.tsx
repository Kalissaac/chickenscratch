import { Clock, Save, Type } from '@kalissaac/react-feather'
import { ReactNode, useState } from 'react'
import dayjs from 'dayjs'
import ParchmentDocument from '@interfaces/document'
import { Node } from 'slate'
import { Transition } from '@headlessui/react'

const serialize = (nodes: Node[]): string => nodes.map(n => Node.string(n)).join('\n')

export default function DocumentStatusBar ({ activeDocument, lastUpdate, updateLock, saveDocument }: { activeDocument: ParchmentDocument, lastUpdate: number, updateLock: boolean, saveDocument: () => void }): JSX.Element {
  const [openMenu, setOpenMenu] = useState('')
  return (
    <div className='fixed left-0 bottom-0 right-0 text-gray-900 dark:text-gray-50 text-opacity-60 dark:text-opacity-60 hover:text-opacity-100 dark:hover:text-opacity-100 transition-opacity text-xs font-editor flex justify-between items-center h-6 px-8'>
      <section className='h-full space-x-1'>
        <StatusBarItem onClick={() => { setOpenMenu(openMenu === 'counter' ? '' : 'counter') }}><CounterMenu openMenu={openMenu} setOpenMenu={setOpenMenu} /><Type className='inline' /></StatusBarItem>
        <StatusBarItem onClick={() => {}}>{serialize(activeDocument.body).match(/[\w\d’'-]+/gi)?.length ?? 0} words</StatusBarItem>
        <StatusBarItem onClick={() => {}}>{((serialize(activeDocument.body).match(/[\w\d’'-]+/gi)?.length ?? 0) / 250).toFixed(2)} pages</StatusBarItem>
        <StatusBarItem onClick={() => {}}>{Math.ceil((serialize(activeDocument.body).match(/[\w\d’'-]+/gi)?.length ?? 0) / 265)} min</StatusBarItem>
        {/* <StatusBarItem onClick={() => {}}>English</StatusBarItem> */}
      </section>
      <section className='h-full space-x-1'>
        <StatusBarItem onClick={() => {}} title={new Date().toString()}>
          <Clock className='inline' /> {dayjs().format('HH:mm')}
        </StatusBarItem>
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
    <button onClick={onClick} title={title} className='hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors px-2 h-full relative'>{children}</button>
  )
}

function CounterMenu ({ openMenu, setOpenMenu }): JSX.Element {
  return (
    <Transition show={openMenu === 'counter'} onBlur={() => setOpenMenu('')} className='absolute left-0 right-0 bottom-24 -top-24 h-24 bg-gray-300 dark:bg-gray-800'>
      Words
    </Transition>
  )
}
