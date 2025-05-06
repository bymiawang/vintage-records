"use client"

import { useRecords } from "./record-provider"
import Image from "next/image"

export function RecordShelf() {
  const { records, currentRecord, selectRecord } = useRecords()

  return (
    <div className="bg-amber-900/80 rounded-lg p-6 shadow-xl border border-amber-800 flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-medium">Your Collection</h2>
      </div>

      {/* Realistic wooden shelf */}
      <div className="relative p-2 py-4 bg-[url('/wood-texture.png')] bg-cover rounded-lg shadow-inner h-full flex flex-col justify-center">
        {/* Shelf dividers with realistic wood texture */}
        <div className="space-y-4">
          {/* Top shelf */}
          <div className="relative pb-2">
            {/* Shelf surface */}
            <div className="absolute inset-x-0 bottom-0 h-3 bg-amber-950/30 z-10"></div>
            {/* Records container */}
            <div className="flex gap-2 justify-center items-end">
              {records.slice(0, 2).map((record) => (
                <div
                  key={record.id}
                  className={`
                    relative cursor-pointer transition-all duration-300
                    $g{currentRecord?.id === record.id ? "scale-105" : "hover:scale-105"}
                  `}
                  style={{ minWidth: 140, width: 140, aspectRatio: '1 / 1' }}
                  onClick={() => selectRecord(record.id)}
                >
                  <div className="relative w-full h-full aspect-square flex items-end">
                    <Image
                      src={record.coverUrl || "/placeholder.svg"}
                      alt={record.title}
                      fill
                      className="object-cover rounded"
                      sizes="140px"
                    />
                    {/* Vinyl wear effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent rounded-md"></div>
                    <div className="absolute inset-0 bg-[url('/images/dust.jpg')] opacity-30 mix-blend-overlay rounded-md"></div>
                    {/* Record spine and shadow */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 blur-sm z-20"></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Bottom edge of shelf with shadow */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-amber-950/40 z-0"></div>
            <div className="absolute inset-x-0 -bottom-4 h-4 bg-black/20 blur-sm z-0"></div>
          </div>

          {/* Middle shelf */}
          <div className="relative pb-2">
            
            {/* Shelf surface */}
            <div className="absolute inset-x-0 bottom-0 h-3 bg-amber-950/30 z-10"></div>
            {/* Records container */}
            <div className="flex gap-2 justify-center items-end">
              {records.slice(2, 4).map((record) => (
                <div
                  key={record.id}
                  className={`
                    relative cursor-pointer transition-all duration-300
                    ${currentRecord?.id === record.id ? "scale-105" : "hover:scale-105"}
                  `}
                  style={{ minWidth: 140, width: 140, aspectRatio: '1 / 1' }}
                  onClick={() => selectRecord(record.id)}
                >
                  <div className="relative w-full h-full aspect-square flex items-end">
                    <Image
                      src={record.coverUrl || "/placeholder.svg"}
                      alt={record.title}
                      fill
                      className="object-cover rounded"
                      sizes="140px"
                    />
                    {/* Vinyl wear effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent rounded-md"></div>
                    <div className="absolute inset-0 bg-[url('/images/dust.jpg')] opacity-30 mix-blend-overlay rounded-md"></div>
                    {/* Record spine and shadow */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 blur-sm z-20"></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Bottom edge of shelf with shadow */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-amber-950/40 z-0"></div>
            <div className="absolute inset-x-0 -bottom-4 h-4 bg-black/20 blur-sm z-0"></div>
          </div>

          {/* Bottom shelf */}
          <div className="relative pb-2">
            {/* Shelf surface */}
            <div className="absolute inset-x-0 bottom-0 h-3 bg-amber-950/30 z-10"></div>
            {/* Records container */}
            <div className="flex gap-2 justify-center items-end">
              {records.slice(4, 6).map((record) => (
                <div
                  key={record.id}
                  className={`
                    relative cursor-pointer transition-all duration-300
                    ${currentRecord?.id === record.id ? "scale-105" : "hover:scale-105"}
                  `}
                  style={{ minWidth: 140, width: 140, aspectRatio: '1 / 1' }}
                  onClick={() => selectRecord(record.id)}
                >
                  <div className="relative w-full h-full aspect-square flex items-end">
                    <Image
                      src={record.coverUrl || "/placeholder.svg"}
                      alt={record.title}
                      fill
                      className="object-cover rounded"
                      sizes="140px"
                    />
                    {/* Vinyl wear effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent rounded-md"></div>
                    <div className="absolute inset-0 bg-[url('/images/dust.jpg')] opacity-30 mix-blend-overlay rounded-md"></div>
                    {/* Record spine and shadow */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 blur-sm z-20"></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Bottom edge of shelf with shadow */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-amber-950/40 z-0"></div>
            <div className="absolute inset-x-0 -bottom-4 h-4 bg-black/20 blur-sm z-0"></div>
          </div>
        </div>
        {/* Side supports */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-amber-950/60 rounded-l"></div>
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-amber-950/60 rounded-r"></div>
      </div>
    </div>
  )
}
