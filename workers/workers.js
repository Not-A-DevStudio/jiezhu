const ALLOWED_ORIGIN = "https://not-a-devstudio.github.io";
const ALLOWED_REFERER_PREFIX = "https://not-a-devstudio.github.io/jiezhu/";
const FIXED_SYSTEM_MESSAGE = "You are Jiezhu AI assistant. Follow product safety rules and answer clearly in the user's language.";

function buildCorsHeaders(origin) {
	return {
		"Access-Control-Allow-Origin": origin,
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Access-Control-Max-Age": "86400",
		Vary: "Origin"
	};
}

function isAllowedSource(request) {
	const origin = request.headers.get("Origin") || "";
	const referer = request.headers.get("Referer") || "";

	if (origin !== ALLOWED_ORIGIN) {
		return false;
	}

	return referer.startsWith(ALLOWED_REFERER_PREFIX);
}

function rewriteSystemMessage(messages) {
	if (!Array.isArray(messages)) {
		return messages;
	}

	return messages.map((msg) => {
		if (msg && typeof msg === "object" && msg.role === "system") {
			return {
				...msg,
				content: FIXED_SYSTEM_MESSAGE
			};
		}
		return msg;
	});
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname !== "/chat/completions") {
			return new Response("Not Found", { status: 404 });
		}

		const origin = request.headers.get("Origin") || "";
		if (request.method === "OPTIONS") {
			if (origin !== ALLOWED_ORIGIN) {
				return new Response("Forbidden", { status: 403 });
			}

			return new Response(null, {
				status: 204,
				headers: buildCorsHeaders(origin)
			});
		}

		if (request.method !== "POST") {
			return new Response("Method Not Allowed", { status: 405 });
		}

		if (!isAllowedSource(request)) {
			return new Response("Forbidden: invalid source", { status: 403 });
		}

		if (!env.CF_AI_GATEWAY_URL || !env.CF_AI_TOKEN) {
			return new Response("Worker is not configured", { status: 500 });
		}

		let payload;
		try {
			payload = await request.json();
		} catch {
			return new Response("Invalid JSON body", {
				status: 400,
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
					...buildCorsHeaders(origin)
				}
			});
		}

		const forwardedBody = {
			...payload,
			messages: rewriteSystemMessage(payload?.messages)
		};

		const upstreamResponse = await fetch(env.CF_AI_GATEWAY_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${env.CF_AI_TOKEN}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(forwardedBody)
		});

		const responseHeaders = new Headers(upstreamResponse.headers);
		const corsHeaders = buildCorsHeaders(origin);
		Object.entries(corsHeaders).forEach(([key, value]) => responseHeaders.set(key, value));

		return new Response(upstreamResponse.body, {
			status: upstreamResponse.status,
			statusText: upstreamResponse.statusText,
			headers: responseHeaders
		});
	}
};
