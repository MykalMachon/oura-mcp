import { mcpLogger } from "./logger.ts";

interface SessionData {
	sessionId: string;
	userEmail: string;
	[key: string]: unknown;
}

export function wrapToolExecution<T extends Record<string, unknown>>(
	toolName: string,
	originalExecute: (args: T, context: any) => Promise<string>
) {
	return async (args: T, context: any): Promise<string> => {
		const session = context.session as SessionData;
		const startTime = performance.now();

		// Log tool call initiation
		mcpLogger.logToolCalled(session.sessionId, session.userEmail, toolName, args);

		try {
			// Execute the original tool function
			const result = await originalExecute(args, context);
			const duration = performance.now() - startTime;

			// Log successful completion
			mcpLogger.logToolCompleted(session.sessionId, session.userEmail, toolName, duration);

			return result;
		} catch (error) {
			const duration = performance.now() - startTime;
			const errorMessage = error instanceof Error ? error.message : String(error);

			// Log tool failure
			mcpLogger.logToolFailed(session.sessionId, session.userEmail, toolName, errorMessage, duration);

			// Re-throw the error to maintain original behavior
			throw error;
		}
	};
}