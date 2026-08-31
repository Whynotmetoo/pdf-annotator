import { useRef, useState } from 'react'

const MIN_ANNOTATION_SIZE = 6

function clamp(value) {
  return Math.min(Math.max(value, 0), 1)
}

function getNormalizedPoint(event, element) {
  const bounds = element.getBoundingClientRect()

  return {
    x: clamp((event.clientX - bounds.left) / bounds.width),
    y: clamp((event.clientY - bounds.top) / bounds.height),
  }
}

function toRectangle(start, end) {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  }
}

export function AnnotationLayer({
  annotations,
  tool,
  disabled,
  onCreate,
}) {
  const layerRef = useRef(null)
  const pointerRef = useRef(null)
  const [draft, setDraft] = useState(null)

  const startDrawing = (event) => {
    if (disabled || tool === 'select' || event.button !== 0) return

    const point = getNormalizedPoint(event, layerRef.current)
    pointerRef.current = { id: event.pointerId, start: point }
    layerRef.current.setPointerCapture(event.pointerId)
    setDraft(toRectangle(point, point))
  }

  const continueDrawing = (event) => {
    if (pointerRef.current?.id !== event.pointerId) return

    const point = getNormalizedPoint(event, layerRef.current)
    setDraft(toRectangle(pointerRef.current.start, point))
  }

  const finishDrawing = (event) => {
    if (pointerRef.current?.id !== event.pointerId) return

    const bounds = layerRef.current.getBoundingClientRect()
    const point = getNormalizedPoint(event, layerRef.current)
    const rectangle = toRectangle(pointerRef.current.start, point)
    const isLargeEnough =
      rectangle.width * bounds.width >= MIN_ANNOTATION_SIZE &&
      rectangle.height * bounds.height >= MIN_ANNOTATION_SIZE

    if (layerRef.current.hasPointerCapture(event.pointerId)) {
      layerRef.current.releasePointerCapture(event.pointerId)
    }

    pointerRef.current = null
    setDraft(null)

    if (isLargeEnough) {
      onCreate({ ...rectangle, type: tool })
    }
  }

  return (
    <div
      ref={layerRef}
      className={`absolute inset-0 z-10 ${
        tool === 'select' ? 'cursor-default' : 'cursor-crosshair'
      }`}
      onPointerDown={startDrawing}
      onPointerMove={continueDrawing}
      onPointerUp={finishDrawing}
    >
      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          className={`pointer-events-none absolute border ${
            annotation.type === 'ignore'
              ? 'border-red-600 bg-red-500/20'
              : 'border-green-600 bg-green-500/20'
          }`}
          style={{
            left: `${annotation.x * 100}%`,
            top: `${annotation.y * 100}%`,
            width: `${annotation.width * 100}%`,
            height: `${annotation.height * 100}%`,
          }}
        />
      ))}

      {draft && (
        <div
          className={`pointer-events-none absolute border ${
            tool === 'ignore'
              ? 'border-red-600 bg-red-500/20'
              : 'border-green-600 bg-green-500/20'
          }`}
          style={{
            left: `${draft.x * 100}%`,
            top: `${draft.y * 100}%`,
            width: `${draft.width * 100}%`,
            height: `${draft.height * 100}%`,
          }}
        />
      )}
    </div>
  )
}
