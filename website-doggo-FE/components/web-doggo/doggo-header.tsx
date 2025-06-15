export const DoggoHeader = () => {
  return (
    <div className="p-4 flex items-center justify-between border-b-2 border-amber-200 dark:border-amber-700 bg-gradient-to-r from-amber-100 to-orange-200 dark:from-amber-800/30 dark:to-orange-800/30">
      <div className="flex items-center gap-3">
        <div className="text-2xl">🐕</div>
        <div>
          <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
            Web-Doggo
            <span className="text-sm">🦴</span>
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-300">Your faithful website fetching companion!</p>
        </div>
      </div>
      <div className="text-xl animate-bounce">🐾</div>
    </div>
  )
}
