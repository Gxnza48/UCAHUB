import React from 'react';

export default function Loading() {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12">
        <div className="flex flex-col gap-6">
          <div className="h-12 w-3/4 max-w-lg bg-surface-container-high rounded-lg animate-pulse" />
          <div className="h-12 w-1/2 max-w-md bg-surface-container-high rounded-lg animate-pulse" />
          
          <div className="relative w-full max-w-3xl mt-4">
            <div className="w-full h-16 bg-surface-container-highest rounded-xl animate-pulse" />
          </div>
        </div>
      </header>

      <section className="mb-10 flex flex-wrap gap-4 items-center">
        <div className="h-10 w-40 bg-surface-container-high rounded-full animate-pulse" />
        <div className="h-10 w-40 bg-surface-container-high rounded-full animate-pulse" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl p-1 h-full shadow-sm">
            <div className="block relative h-48 w-full overflow-hidden rounded-lg mb-4 bg-surface-container-highest animate-pulse"></div>
            <div className="px-5 pb-6 flex-grow flex flex-col space-y-3">
              <div className="h-3 w-24 bg-surface-container-high rounded animate-pulse"></div>
              <div className="h-6 w-full bg-surface-container-high rounded animate-pulse"></div>
              <div className="h-6 w-3/4 bg-surface-container-high rounded animate-pulse"></div>
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-outline-variant/10">
                <div className="h-4 w-24 bg-surface-container-high rounded animate-pulse"></div>
                <div className="ml-auto h-4 w-16 bg-surface-container-high rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
