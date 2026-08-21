
import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

/** Add status, so middleware can fromat the response. */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, 'Route not found'))
}

/** Generic error handler — returns JSON { error } with a proper status code. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message })
  }
  // Zod validation errors 
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation failed', issues: err.issues })
  }
  // Mongoose validation errors → 400
  if (err instanceof Error && err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  console.error(err)
  // the rest
  res.status(500).json({ error: 'Internal server error' })
}

