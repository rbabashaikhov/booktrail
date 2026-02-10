import { useState } from 'react'
import { manualBookFormSchema, type ManualBookFormInput } from '../../lib/manualBookSchema'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import type { Book } from '../../types'

interface ManualBookFormProps {
  initialIsbn: string
  onSave: (book: Book) => void
  onCancel: () => void
}

const INITIAL: ManualBookFormInput = {
  isbn: '',
  title: '',
  authors: '',
  numberOfPages: '',
  publisher: '',
  publishYear: '',
}

export function ManualBookForm({
  initialIsbn,
  onSave,
  onCancel,
}: ManualBookFormProps) {
  const [values, setValues] = useState<ManualBookFormInput>({
    ...INITIAL,
    isbn: initialIsbn,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ManualBookFormInput, string>>>({})

  function handleChange(field: keyof ManualBookFormInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const raw = {
      ...values,
      isbn: values.isbn || initialIsbn,
    }
    const result = manualBookFormSchema.safeParse(raw)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ManualBookFormInput, string>> = {}
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof ManualBookFormInput
        if (path && !fieldErrors[path]) fieldErrors[path] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    const data = result.data
    const isbn = data.isbn
    const book: Book = {
      title: data.title,
      authors: data.authors,
      source: 'manual',
      isbn: isbn.length === 10 ? isbn : undefined,
      isbn13: isbn.length === 13 ? isbn : undefined,
      numberOfPages: data.numberOfPages,
      publisher: data.publisher || undefined,
      publishYear: data.publishYear,
    }
    onSave(book)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="manual-isbn"
        label="ISBN"
        value={values.isbn || initialIsbn}
        readOnly
        aria-readonly="true"
      />
      <Input
        id="manual-title"
        label="Название"
        value={values.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
        autoComplete="off"
      />
      <Input
        id="manual-authors"
        label="Авторы"
        value={values.authors}
        onChange={(e) => handleChange('authors', e.target.value)}
        placeholder="Через запятую"
        error={errors.authors}
        required
        autoComplete="off"
      />
      <Input
        id="manual-pages"
        label="Количество страниц"
        type="number"
        min={1}
        value={values.numberOfPages}
        onChange={(e) => handleChange('numberOfPages', e.target.value)}
        error={errors.numberOfPages}
        required
      />
      <Input
        id="manual-publisher"
        label="Издательство"
        value={values.publisher}
        onChange={(e) => handleChange('publisher', e.target.value)}
        error={errors.publisher}
        autoComplete="off"
      />
      <Input
        id="manual-year"
        label="Год издания"
        value={values.publishYear}
        onChange={(e) => handleChange('publishYear', e.target.value)}
        placeholder="Напр. 2020"
        error={errors.publishYear}
        autoComplete="off"
      />
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" fullWidth>
          Добавить в библиотеку
        </Button>
      </div>
    </form>
  )
}
