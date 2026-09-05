'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'

export default function NotesEditor({
  subId,
  initialNotes,
}: {
  subId: string
  initialNotes: string | null
}) {
  const [notes, setNotes] = useState(initialNotes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const savedTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFirstRender = useRef(true)

  const saveNotes = async (value: string) => {
    setSaving(true)
    setError('')

    const { error: saveError } = await supabase
      .from('subscriptions')
      .update({ notes: value.trim() || null, updated_at: new Date().toISOString() })
      .eq('id', subId)

    setSaving(false)

    if (saveError) {
      setError('Could not save. Your text is still here — try again.')
      return
    }

    setSaved(true)
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    savedTimeoutRef.current = setTimeout(() => setSaved(false), 2000)
  }

  // Debounced autosave: wait 1.5s after the user stops typing before saving,
  // so we're not hitting the database on every keystroke.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveNotes(notes)
    }, 1500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes])

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Add a note — e.g. shared with family, cancel before renewal..."
        className="w-full rounded-lg border border-gray-300 p-3 text-sm text-foreground focus:border-navy focus:outline-none"
      />
      <div className="mt-2 h-4 text-xs">
        {saving && <span className="text-gray-400">Saving...</span>}
        {saved && !saving && <span className="text-green">Saved</span>}
        {error && <span className="text-alert">{error}</span>}
      </div>
    </div>
  )
}