import { useState } from 'react'
import { PdfViewer } from './components/PdfViewer.jsx'
import { useAnnotations } from './hooks/useAnnotations.js'

const PDF_FILE = '/construction-model.pdf'
const tools = [
  { value: 'ignore', label: 'Ignore' },
  { value: 'capture', label: 'Capture' },
]

function App() {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [tool, setTool] = useState('select')
  const { annotations, addAnnotation } = useAnnotations(PDF_FILE)

  const pageAnnotations = annotations.filter(
    (annotation) => annotation.page === pageNumber,
  )

  const createAnnotation = (rectangle) => {
    addAnnotation({
      id: crypto.randomUUID(),
      page: pageNumber,
      ...rectangle,
    })
  }

  return (
    <main className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between px-4">
        <div className="flex gap-2">
          {tools.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`border px-3 py-2 ${tool === item.value ? 'bg-amber-400' : ''}`}
              onClick={() => setTool(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <nav className="flex items-center gap-3">
          <button
            type="button"
            className="px-3 py-2 border"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((page) => page - 1)}
          >
            &larr;
          </button>
          <span>
            Page {pageNumber} / {numPages || '...'}
          </span>
          <button
            type="button"
            className="px-3 py-2 border"
            disabled={!numPages || pageNumber >= numPages}
            onClick={() => setPageNumber((page) => page + 1)}
          >
            &rarr;
          </button>
        </nav>
      </header>

      <section className="min-h-0 flex-1 overflow-auto p-4">
        <PdfViewer
          file={PDF_FILE}
          pageNumber={pageNumber}
          annotations={pageAnnotations}
          tool={tool}
          onDocumentLoad={({ numPages: loadedPages }) => setNumPages(loadedPages)}
          onCreateAnnotation={createAnnotation}
        />
      </section>
    </main>
  )
}

export default App
