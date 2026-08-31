import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { AnnotationLayer } from './AnnotationLayer.jsx'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

function LoadingMessage({ children }) {
  return (
    <div className="p-8 text-center">
      {children}
    </div>
  )
}

function RenderedPage({
  pageNumber,
  pageWidth,
  annotations,
  tool,
  onCreateAnnotation,
}) {
  const [pageIsReady, setPageIsReady] = useState(false)

  return (
    <div className="relative inline-block max-w-full overflow-hidden">
      <Page
        pageNumber={pageNumber}
        width={pageWidth}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        loading={<LoadingMessage>Rendering page {pageNumber}...</LoadingMessage>}
        onRenderSuccess={() => setPageIsReady(true)}
      />

      <AnnotationLayer
        key={tool}
        annotations={annotations}
        tool={tool}
        disabled={!pageIsReady}
        onCreate={onCreateAnnotation}
      />
    </div>
  )
}

export function PdfViewer({
  file,
  pageNumber,
  annotations,
  tool,
  onDocumentLoad,
  onCreateAnnotation,
}) {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.floor(entry.contentRect.width))
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const pageWidth = Math.min(containerWidth, 1400)

  return (
    <div ref={containerRef} className="w-full">
      <Document
        className="flex w-full justify-center"
        file={file}
        loading="loading"
        onLoadSuccess={onDocumentLoad}
      >
        {pageWidth > 0 && (
          <RenderedPage
            key={pageNumber}
            pageNumber={pageNumber}
            pageWidth={pageWidth}
            annotations={annotations}
            tool={tool}
            onCreateAnnotation={onCreateAnnotation}
          />
        )}
      </Document>
    </div>
  )
}
