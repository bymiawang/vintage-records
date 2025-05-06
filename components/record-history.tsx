"use client"

import { useRecords } from "./record-provider"

export function RecordHistory() {
  const { currentRecord } = useRecords()

  if (!currentRecord) {
    return (
      <div className="bg-amber-900/80 rounded-lg p-6 shadow-xl border border-amber-800">
        <h2 className="text-xl font-medium mb-4">Record History</h2>
        <p className="text-amber-200/60 font-es-allianz font-regular">Select a record to view its history</p>
      </div>
    )
  }

  return (
    <div className="bg-amber-900/80 rounded-lg p-6 shadow-xl border border-amber-800">
      <h2 className="text-xl font-medium mb-4">Record History</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">
            {currentRecord.title} ({currentRecord.year})
          </h3>
          <p className="text-amber-200/80">by {currentRecord.artist}</p>
          {currentRecord.genre && <p className="text-amber-200/60 text-sm">Genre: {currentRecord.genre}</p>}
        </div>

        <div className="prose prose-amber prose-invert max-w-none">
          {currentRecord.description ? (
            <p>{currentRecord.description}</p>
          ) : (
            <p className="text-amber-200/60 italic">
              This record was released in {currentRecord.year} by {currentRecord.artist}. It quickly became a classic in
              the {currentRecord.genre || "music"} scene, known for its distinctive sound and memorable melodies.
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-amber-800/50">
          <h4 className="text-sm font-medium mb-2">Vinyl Characteristics</h4>
          <ul className="text-sm text-amber-200/70 space-y-1">
            <li>• 33⅓ RPM Long Play Record</li>
            <li>• Original Pressing: {currentRecord.year}</li>
            <li>• Condition: Very Good (VG+)</li>
            <li>• Sleeve: Original artwork</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
