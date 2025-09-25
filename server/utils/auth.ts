export const generateClientSideURL = () => {
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