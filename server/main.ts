import { FastMCP } from "npm:fastmcp";
import { OuraApi } from "./client.ts";

import * as v from 'npm:valibot';

const generateClientSideURL = () => {
	const clientId = Deno.env.get('CLIENT_ID');
	const clientSecret = Deno.env.get('CLIENT_SECRET');
	const port = Deno.env.get('PORT') || 3000;
	const redirectURL = Deno.env.get('REDIRECT_URL') || `http://localhost:${port}/auth/callback`

	if (!clientId || !clientSecret) {
		throw new Error('Missing CLIENT_ID or CLIENT_SECRET; check environment variables');
	}

	// generate a random state string 
	const state = crypto.randomUUID();

	const params = new URLSearchParams();
	params.append('client_id', clientId);
	params.append('state', state);
	params.append('redirect_uri', redirectURL);
	params.append('response_type', 'token');

	return `https://cloud.ouraring.com/oauth/authorize?${params.toString()}`
}

interface SessionData {
	api: OuraApi,
	[key: string]: unknown;
}

const startServer = (): FastMCP => {
	// setup the MCP server
	const server: FastMCP = new FastMCP({
		name: "Oura MCP",
		version: "1.0.0",
		authenticate: async (request: any): Promise<SessionData> => {
			const headers = request.headers ?? {}

			// grab the api key
			const getHeaderString = (header: string | string[] | undefined) =>
				Array.isArray(header) ? header.join(", ") : (header ?? "N/A");

			const authorization = getHeaderString(headers['authorization']);
			if (!authorization) {
				throw new Response(null, {
					status: 401,
					statusText: 'Unauthroized'
				})
			}

			// create the api client
			const api = new OuraApi(authorization);

			// ensure the api can grab user information
			try {
				await api.getPersonalInfo();
			} catch (err) {
				throw new Response(null, {
					status: 401,
					statusText: 'Unauthroized'
				})
			}

			// Authentication logic
			return {
				api: api
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
		execute: async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getDailyActivity();
				return JSON.stringify(response);
			} else {
				const response = await api.getDailyActivity(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		}
	})

	server.addTool({
		name: 'daily-readiness',
		description: "get the user's daily readiness for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getDailyReadiness();
				return JSON.stringify(response);
			} else {
				const response = await api.getDailyReadiness(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		}
	})

	server.addTool({
		name: 'daily-sleep',
		description: "get the user's daily sleep for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getDailySleep();
				return JSON.stringify(response);
			} else {
				const response = await api.getDailySleep(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		}
	})

	server.addTool({
		name: 'heart-rate',
		description: "get the user's heart rate data for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getHeartRate();
				return JSON.stringify(response);
			} else {
				const response = await api.getHeartRate(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		}
	})

	server.addTool({
		name: 'daily-stress',
		description: "get the user's daily stress data for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getDailyStress();
				return JSON.stringify(response);
			} else {
				const response = await api.getDailyStress(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		}
	})

	server.addTool({
		name: 'workouts',
		description: "get the user's workout data for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this fetches the last 7 days of data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getWorkouts();
				return JSON.stringify(response);
			} else {
				const response = await api.getWorkouts(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		}
	})

	server.addTool({
		name: 'daily-spo2',
		description: "get the user's daily blood oxygen (SpO2) data for a set of days. takes two dates in the YYYY-MM-DD format. If no date is provided this just fetches the current days data.",
		parameters: v.object({
			startDate: v.optional(v.string()),
			endDate: v.optional(v.string()),
		}),
		execute: async (args: { startDate?: string; endDate?: string }, context: any) => {
			const session = context.session as SessionData;
			const api = session.api

			if (!args.startDate || !args.endDate) {
				const response = await api.getDailySPO2();
				return JSON.stringify(response);
			} else {
				const response = await api.getDailySPO2(new Date(args.startDate), new Date(args.endDate));
				return JSON.stringify(response);
			}
		}
	})

	return server;
}


// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	// if you're missing your CLIENT_ID 
	if (!Deno.env.get('CLIENT_ID') || !Deno.env.get('CLIENT_SECRET')) {
		console.log('No CLIENT_ID/CLIENT_SECRET found in the environment! create an app here');
		console.log('https://cloud.ouraring.com/oauth/applications')
		Deno.exit(0);
	}

	// if you're missing your API key
	if (!Deno.env.get('API_KEY')) {
		console.log('No API_KEY found in the environment! fetch one here')
		console.log(generateClientSideURL());
		Deno.exit(0);
	}

	// setup the server
	const server = startServer();

	// start the server
	await server.start({
		transportType: 'httpStream',
		httpStream: {
			port: parseInt(Deno.env.get('PORT') || '3000'),
		}
	})
}
