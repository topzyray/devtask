import { useEffect, useId, useRef, type ReactNode } from 'react'
import { CloseIcon } from './icons.tsx'
import { ghostButton } from './styles.ts'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

type DialogProps = {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export function Dialog({ title, description, onClose, children }: DialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function getFocusable(): HTMLElement[] {
      const panel = panelRef.current
      if (!panel) return []
      return [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((element) => !element.hasAttribute('disabled'))
    }

    getFocusable()[0]?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = getFocusable()
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      const inside = panelRef.current?.contains(active instanceof Node ? active : null) ?? false
      if (!inside) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
        return
      }
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#141816]/55 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative max-h-[min(42rem,calc(100svh-2rem))] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-2xl sm:p-6"
      >
        <div className="pr-10">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight text-ink">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="mt-1 text-sm text-muted">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-5">{children}</div>
        <button
          type="button"
          className={`${ghostButton} absolute top-3 right-3`}
          onClick={onClose}
          aria-label="Close dialog"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
