import winston from 'winston';

export interface LogContext {
	sessionId: string;
	userEmail: string;
	toolName?: string;
	parameters?: Record<string, unknown>;
	duration?: number;
	timestamp: string;
	event: 'session_created' | 'tool_called' | 'tool_completed' | 'tool_failed';
	error?: string;
}

const logger = winston.createLogger({
	level: Deno.env.get('LOG_LEVEL') || 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json()
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			)
		})
	]
});

export class MCPLogger {
	private static instance: MCPLogger;

	private constructor() {}

	static getInstance(): MCPLogger {
		if (!MCPLogger.instance) {
			MCPLogger.instance = new MCPLogger();
		}
		return MCPLogger.instance;
	}

	logSessionCreated(sessionId: string, userEmail: string): void {
		const context: LogContext = {
			sessionId,
			userEmail,
			timestamp: new Date().toISOString(),
			event: 'session_created'
		};

		logger.info('Session created', context);
	}

	logToolCalled(sessionId: string, userEmail: string, toolName: string, parameters: Record<string, unknown>): void {
		const context: LogContext = {
			sessionId,
			userEmail,
			toolName,
			parameters,
			timestamp: new Date().toISOString(),
			event: 'tool_called'
		};

		logger.info('Tool called', context);
	}

	logToolCompleted(sessionId: string, userEmail: string, toolName: string, duration: number): void {
		const context: LogContext = {
			sessionId,
			userEmail,
			toolName,
			duration,
			timestamp: new Date().toISOString(),
			event: 'tool_completed'
		};

		logger.info('Tool completed', context);
	}

	logToolFailed(sessionId: string, userEmail: string, toolName: string, error: string, duration?: number): void {
		const context: LogContext = {
			sessionId,
			userEmail,
			toolName,
			error,
			duration,
			timestamp: new Date().toISOString(),
			event: 'tool_failed'
		};

		logger.error('Tool failed', context);
	}
}

export const mcpLogger = MCPLogger.getInstance();