export default function Loading() {
  return (
    <div className="py-24 px-6 max-w-6xl mx-auto min-h-screen">
      <header className="mb-12">
        <div className="h-12 w-3/4 max-w-md bg-surface-container-high rounded-lg animate-pulse mb-4" />
        <div className="h-6 w-full max-w-2xl bg-surface-container-high rounded-lg animate-pulse" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <div className="h-80 w-full bg-surface-container-high rounded-xl animate-pulse" />
        </div>
        <div className="lg:col-span-7">
          <div className="h-96 w-full bg-surface-container-high rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
