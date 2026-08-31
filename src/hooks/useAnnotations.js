import { useEffect, useState } from 'react'

const STORAGE_PREFIX = 'provision-pdf-annotations:'

function getStorageKey(documentKey) {
  return `${STORAGE_PREFIX}${documentKey}`
}

function readAnnotations(documentKey) {
  if (!documentKey) return []

  try {
    const savedValue = localStorage.getItem(getStorageKey(documentKey))
    const parsedValue = savedValue ? JSON.parse(savedValue) : []

    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

function writeAnnotations(documentKey, annotations) {
  try {
    localStorage.setItem(getStorageKey(documentKey), JSON.stringify(annotations))
  } catch {
  }
}

export function useAnnotations(documentKey) {
  const [annotations, setAnnotations] = useState(() => readAnnotations(documentKey))

  useEffect(() => {
    writeAnnotations(documentKey, annotations)
  }, [documentKey, annotations])

  const addAnnotation = (annotation) => {
    setAnnotations((currentAnnotations) => [...currentAnnotations, annotation])
  }

  return {
    annotations,
    addAnnotation,
  }
}
