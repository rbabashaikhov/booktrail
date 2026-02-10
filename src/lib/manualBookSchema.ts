import { z } from 'zod'

export const manualBookFormSchema = z.object({
  isbn: z.string().min(1, 'ISBN обязателен'),
  title: z.string().min(1, 'Введите название книги'),
  authors: z
    .string()
    .min(1, 'Введите автора или авторов (через запятую)')
    .transform((s) => s.split(',').map((a) => a.trim()).filter(Boolean))
    .refine((arr) => arr.length > 0, 'Укажите хотя бы одного автора'),
  numberOfPages: z
    .string()
    .min(1, 'Укажите количество страниц')
    .refine((s) => /^\d+$/.test(s), 'Введите целое число')
    .transform(Number)
    .refine((n) => n > 0, 'Количество страниц должно быть больше 0'),
  publisher: z.string().optional(),
  publishYear: z
    .string()
    .optional()
    .refine((s) => !s || /^\d{4}$/.test(s), 'Год: 4 цифры')
    .transform((s) => (s ? parseInt(s, 10) : undefined))
    .refine((n) => n === undefined || (n >= 1000 && n <= 2100), 'Укажите корректный год'),
})

/** Input shape for the form (before Zod transform). */
export interface ManualBookFormInput {
  isbn: string
  title: string
  authors: string
  numberOfPages: string
  publisher?: string
  publishYear?: string
}
