import { RecordPlayer } from "@/components/record-player"
import { RecordShelf } from "@/components/record-shelf"
import { RecordHistory } from "@/components/record-history"
import { RecordProvider } from "@/components/record-provider"

export default function Home() {
  return (
    <RecordProvider>
      <main className="min-h-screen bg-amber-950/90 text-amber-100">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-es-allianz font-extrabold tracking-normal mb-2">Public Records</h1>
            <p className="text-amber-200/80 font-es-allianz font-regular tracking-normal">An immersive journey through time and sound.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecordPlayer />
            </div>
            <div className="lg:col-span-1">
              <RecordShelf />
            </div>
          </div>

          <div className="mt-12">
            <RecordHistory />
          </div>
        </div>
      </main>
    </RecordProvider>
  )
}
