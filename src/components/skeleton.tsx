export function DocumentSkeleton (): JSX.Element {
  const lineStyle = 'h-4 bg-gray-300 dark:bg-gray-600 rounded'
  return (
    <div className="animate-pulse flex flex-col space-y-8">
      <div className="flex-1 space-y-4 py-1">
        <div className={`${lineStyle} w-3/4`}></div>
        <div className="space-y-2">
          <div className={`${lineStyle}`}></div>
          <div className={`${lineStyle} w-5/6`}></div>
        </div>
      </div>
      <div className="flex-1 space-y-4 py-1">
        <div className={`${lineStyle} w-2/4`}></div>
        <div className="space-y-2">
          <div className={`${lineStyle} w-4/6`}></div>
          <div className={`${lineStyle} w-5/6`}></div>
        </div>
        <div className="space-y-2">
          <div className={`${lineStyle} w-11/12`}></div>
          <div className={`${lineStyle} w-5/6`}></div>
        </div>
      </div>
      <div className="flex-1 space-y-4 py-1">
        <div className={`${lineStyle} w-1/4`}></div>
        <div className="space-y-2">
          <div className={`${lineStyle} w-11/12`}></div>
          <div className={`${lineStyle} w-5/6`}></div>
        </div>
        <div className="space-y-2">
          <div className={`${lineStyle} w-3/6`}></div>
          <div className={`${lineStyle} w-2/6`}></div>
        </div>
      </div>
    </div>
  )
}
