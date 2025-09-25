import { FastMCP } from "fastmcp";
import { OuraApi } from "./client/client.ts";
import { mcpLogger } from "./utils/logger.ts";
import { wrapToolExecution } from "./utils/tool-wrapper.ts";
import * as http from "node:http";

import * as v from 'valibot';

interface SessionData {
	api: OuraApi;
	sessionId: string;
	userEmail: string;
	[key: string]: unknown;
}

const startServer = (): FastMCP => {
	// setup the MCP server
	const server: FastMCP = new FastMCP({
		name: "Oura MCP",
		version: "1.0.0",
		authenticate: async (request: http.IncomingMessage): Promise<SessionData> => {
			const headers = request.headers ?? {}

			// grab the api key
			const getHeaderString = (header: string | string[] | undefined) =>
				Array.isArray(header) ? header.join(", ") : (header ?? "N/A");

			// @ts-ignore: this is fine
			const authorization = getHeaderString(headers['authorization']);
			if (!authorization) {
				throw new Response(null, {
					status: 401,
					statusText: 'Unauthroized'
				})
			}

			// check if the bearer keyword is included
			if (!authorization.toLowerCase().includes('bearer ')) {
				throw new Response(null, {
					status: 400,
					statusText: 'Bad Request: Missing Bearer Token'
				})
			}

			// pull out the API key
			const apiKey = authorization.slice(7);

			// create the api client
			const api = new OuraApi(apiKey);

			// ensure the api can grab user information and extract email
			let personalInfo;
			try {
				personalInfo = await api.getPersonalInfo();
			} catch (err) {
				throw new Response(null, {
					status: 401,
					statusText: 'Unauthroized'
				})
			}

			// Generate session ID and extract user email
			const sessionId = crypto.randomUUID();
			const userEmail = personalInfo.email;

			// Log session creation
			mcpLogger.logSessionCreated(sessionId, userEmail);

			// Authentication logic
			return {
				api: api,
				sessionId: sessionId,
				userEmail: userEmail
			};
		},
		health: {
			enabled: true,
			message: 'healthy!',
			path: '/health',
			status: 200,
		},
		ping: {
			enabled: true,
			intervalMs: 10_000,
			logLevel: 'debug'
		}
	})

	server.addTool({
		name: 'daily-activity',
		description: "get the user's daily activity for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: wrapToolExecution('daily-activity', async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getDailyActivity();
				return JSON.stringify(response);
			} else {
				const response = await api.getDailyActivity(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		})
	})

	server.addTool({
		name: 'daily-readiness',
		description: "get the user's daily readiness for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: wrapToolExecution('daily-readiness', async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getDailyReadiness();
				return JSON.stringify(response);
			} else {
				const response = await api.getDailyReadiness(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		})
	})

	server.addTool({
		name: 'daily-sleep',
		description: "get the user's daily sleep for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: wrapToolExecution('daily-sleep', async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getDailySleep();
				return JSON.stringify(response);
			} else {
				const response = await api.getDailySleep(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		})
	})

	server.addTool({
		name: 'heart-rate',
		description: "get the user's heart rate data for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: wrapToolExecution('heart-rate', async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getHeartRate();
				return JSON.stringify(response);
			} else {
				const response = await api.getHeartRate(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		})
	})

	server.addTool({
		name: 'daily-stress',
		description: "get the user's daily stress data for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: wrapToolExecution('daily-stress', async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getDailyStress();
				return JSON.stringify(response);
			} else {
				const response = await api.getDailyStress(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		})
	})

	server.addTool({
		name: 'workouts',
		description: "get the user's workout data for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this fetches the last 7 days of data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: wrapToolExecution('workouts', async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getWorkouts();
				return JSON.stringify(response);
			} else {
				const response = await api.getWorkouts(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		})
	})

	server.addTool({
		name: 'daily-spo2',
		description: "get the user's daily blood oxygen (SpO2) data for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: wrapToolExecution('daily-spo2', async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getDailySPO2();
				return JSON.stringify(response);
			} else {
				const response = await api.getDailySPO2(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		})
	})

	return server;
}


// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	// setup the server
	const server = startServer();

	// start the server
	await server.start({
		transportType: 'httpStream',
		httpStream: {
			host: Deno.env.get('HOST') || '0.0.0.0',
			port: parseInt(Deno.env.get('PORT') || '3000'),
		}
	})
}
