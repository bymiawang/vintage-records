"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Record } from "@/lib/types"
import { records } from "@/lib/data"

type RecordContextType = {
  records: Record[]
  currentRecord: Record | null
  isPlaying: boolean
  selectRecord: (id: string) => void
  togglePlay: () => void
}

const RecordContext = createContext<RecordContextType | undefined>(undefined)

export function RecordProvider({ children }: { children: React.ReactNode }) {
  const [allRecords] = useState<Record[]>(records)
  const [currentRecord, setCurrentRecord] = useState<Record | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const selectRecord = (id: string) => {
    const record = allRecords.find((r) => r.id === id) || null
    setCurrentRecord(record)
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (!currentRecord) return
    setIsPlaying(!isPlaying)
  }

  return (
    <RecordContext.Provider
      value={{
        records: allRecords,
        currentRecord,
        isPlaying,
        selectRecord,
        togglePlay,
      }}
    >
      {children}
    </RecordContext.Provider>
  )
}

export function useRecords() {
  const context = useContext(RecordContext)
  if (context === undefined) {
    throw new Error("useRecords must be used within a RecordProvider")
  }
  return context
}
