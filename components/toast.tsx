import { ToastProps } from 'react-toast-notifications'

export default function Toast ({ appearance, children }: ToastProps): JSX.Element {
  return (
    <div className={`rounded-lg p-6 shadow-xl text-gray-50 text-base flex justify-center items-center ${appearance === 'error' ? 'bg-red-500' : 'bg-gray-600'}`}>
      <ion-icon name='alert-circle' />
      <span className='mx-1' />
      {children}
    </div>
  )
}
