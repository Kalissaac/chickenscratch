export function SkeletonLine ({ width = '4', className = '' }: { width?: string, className?: string }): JSX.Element {
  return (
    <div className={`h-4 w-${width} bg-gray-300 dark:bg-gray-600 rounded ${className}`} />
  )
}

export function DocumentSkeleton (): JSX.Element {
  return (
    <div className="animate-pulse flex flex-col space-y-8">
      <div className="flex-1 space-y-4 py-1">
        <SkeletonLine width='3/4' />
        <div className="space-y-2">
          <SkeletonLine width='' />
          <SkeletonLine width='5/6' />
        </div>
      </div>
      <div className="flex-1 space-y-4 py-1">
        <SkeletonLine width='2/4' />
        <div className="space-y-2">
          <SkeletonLine width='4/6' />
          <SkeletonLine width='5/6' />
        </div>
        <div className="space-y-2">
          <SkeletonLine width='11/12' />
          <SkeletonLine width='5/6' />
        </div>
      </div>
      <div className="flex-1 space-y-4 py-1">
        <SkeletonLine width='1/4' />
        <div className="space-y-2">
          <SkeletonLine width='11/12' />
          <SkeletonLine width='5/6' />
        </div>
          <div className="space-y-2">
          <SkeletonLine width='3/6' />
          <SkeletonLine width='2/6' />
        </div>
      </div>
    </div>
  )
}
