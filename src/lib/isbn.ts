import { z } from 'zod'

const isbn10Regex = /^\d{9}[\dXx]$/
const isbn13Regex = /^(97[89])\d{9}\d$/

function stripIsbn(value: string): string {
  return value.replace(/[\s-]/g, '')
}

export const isbnSchema = z
  .string()
  .transform(stripIsbn)
  .refine((s) => s.length === 10 || s.length === 13, {
    message: 'ISBN must be 10 or 13 digits',
  })
  .refine(
    (s) => (s.length === 10 ? isbn10Regex.test(s) : isbn13Regex.test(s)),
    { message: 'Invalid ISBN format' }
  )

export type NormalizedIsbn = z.infer<typeof isbnSchema>

export function normalizeIsbn(input: string): string {
  const result = isbnSchema.safeParse(input)
  return result.success ? result.data : ''
}
