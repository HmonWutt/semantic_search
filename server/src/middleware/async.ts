import type { Request, Response, NextFunction } from 'express'

/** This is added so that the async errors like those from DB etc don't get swallowed */
type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

export const asyncHandler =
  (fn: AsyncFn) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)
