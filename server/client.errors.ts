    export const throwOuraError = (response: Response) => {
        const { status, statusText } = response;
        let error: OuraAPIError;

        if(response.ok) return;

        switch (status) {
            case 400:
                error = new OuraClientError(statusText, response);
                break;
            case 401:
                error = new OuraUnauthorizedError(statusText, response);
                break;
            case 403:
                error = new OuraForbiddenError(statusText, response);
                break;
            case 422:
                error = new OuraValidationError(statusText, response);
                break;
            case 429:
                error = new OuraRateLimitError(statusText, response);
                break;
            case 500:
            default:
                error = new OuraServerError(statusText, status, response);
                break;
        }

        throw error;
    }

    export class OuraAPIError extends Error {
        constructor(
            message: string,
            public statusCode: number,
            public response?: Response
        ) {
            super(message);
            this.name = this.constructor.name;
        }
    }

    export class OuraClientError extends OuraAPIError {
        constructor(message: string = "Bad Request", response?: Response) {
            super(message, 400, response);
        }
    }

    export class OuraUnauthorizedError extends OuraAPIError {
        constructor(message: string = "Unauthorized - token expired or revoked", response?: Response) {
            super(message, 401, response);
        }
    }

    export class OuraForbiddenError extends OuraAPIError {
        constructor(message: string = "Forbidden - insufficient permissions", response?: Response) {
            super(message, 403, response);
        }
    }

    export class OuraValidationError extends OuraAPIError {
        constructor(message: string = "Validation failed - invalid request body or parameters", response?: Response) {
            super(message, 422, response);
        }
    }

    export class OuraRateLimitError extends OuraAPIError {
        constructor(message: string = "Rate limit exceeded - too many requests", response?: Response) {
            super(message, 429, response);
        }
    }

    export class OuraServerError extends OuraAPIError {
        constructor(message: string = "Server error", statusCode: number = 500, response?: Response) {
            super(message, statusCode, response);
        }
    }