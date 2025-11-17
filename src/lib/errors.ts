export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

export function createError(
  status: number,
  message: string,
  details?: unknown
): ApiError {
  return { status, message, details };
}

export function notFoundError(resource: string, id?: number | string): ApiError {
  return createError(
    404,
    `${resource}${id ? ` with ID ${id}` : ''} not found`
  );
}

export function validationError(
  message: string,
  details?: unknown
): ApiError {
  return createError(422, message, details);
}

export function conflictError(message: string, details?: unknown): ApiError {
  return createError(409, message, details);
}

export function badRequestError(
  message: string,
  details?: unknown
): ApiError {
  return createError(400, message, details);
}

export function internalError(message: string, details?: unknown): ApiError {
  return createError(500, message, details);
}

