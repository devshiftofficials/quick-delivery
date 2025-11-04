// src/util/prisma.js
import { PrismaClient } from '@prisma/client';

// Validate DATABASE_URL format
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	console.error('❌ DATABASE_URL environment variable is not set!');
	throw new Error('DATABASE_URL environment variable is required');
}

if (!databaseUrl.startsWith('mysql://')) {
	console.error('❌ Invalid DATABASE_URL format. It must start with "mysql://"');
	console.error('Current DATABASE_URL:', databaseUrl ? `${databaseUrl.substring(0, 20)}...` : 'undefined');
	throw new Error('DATABASE_URL must start with mysql:// protocol. Example: mysql://user:password@host:port/database');
}

// Create the client instance with connection pool settings
const rawPrisma = new PrismaClient({
	log: ['error'], // Only log actual errors, suppress connection warnings
});

// Helper to detect common connection errors
function isConnectionError(err) {
	if (!err || !err.message) return false;
	const msg = err.message.toLowerCase();
	return (
		msg.includes("can't reach database server") ||
		msg.includes('could not connect') ||
		msg.includes('connect econnrefused') ||
		msg.includes('getaddrinfo enotfound') ||
		msg.includes('epool') ||
		msg.includes('timed out') ||
		msg.includes('connection') ||
		msg.includes('network')
	);
}

// Retry helper function with exponential backoff
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
	let lastError;
	
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			// Attempt to connect if not already connected
			if (attempt > 1) {
				try {
					await rawPrisma.$connect();
				} catch (connectErr) {
					// Ignore connection errors, we'll try the operation anyway
				}
			}
			
			const result = await operation();
			return result;
		} catch (err) {
			lastError = err;
			
			// If it's not a connection error, fail immediately
			if (!isConnectionError(err)) {
				throw err;
			}
			
			// If it's the last attempt, throw the error
			if (attempt === maxRetries) {
				break;
			}
			
			// Wait before retrying with exponential backoff (silent retry)
			const waitTime = delay * Math.pow(2, attempt - 1);
			await new Promise(resolve => setTimeout(resolve, waitTime));
		}
	}
	
	// If we get here, all retries failed
	if (isConnectionError(lastError)) {
		// Only log once when all retries have failed, suppress verbose error details
		const sanitizedError = new Error('Database unavailable. Please check your connection and try again later.');
		sanitizedError.originalError = lastError;
		throw sanitizedError;
	}
	
	throw lastError;
}

// Proxy wrapper to catch promise rejections from Prisma methods
const prisma = new Proxy(rawPrisma, {
	get(target, prop, receiver) {
		const orig = Reflect.get(target, prop, receiver);
		
		// Special handling for $connect and $disconnect
		if (prop === '$connect' || prop === '$disconnect' || prop === '$transaction') {
			return orig.bind(target);
		}
		
		// If it's a plain function on the client, wrap it
		if (typeof orig === 'function') {
			return function wrapped(...args) {
				const operation = () => {
					try {
						const result = orig.apply(target, args);
						// If it returns a promise, return it; otherwise wrap in resolved promise
						if (result && typeof result.then === 'function') {
							return result;
						}
						return Promise.resolve(result);
					} catch (err) {
						return Promise.reject(err);
					}
				};
				
				return retryOperation(operation);
			};
		}

		// If the property is an object (model delegate like prisma.user), wrap its methods too
		if (orig && typeof orig === 'object') {
			return new Proxy(orig, {
				get(tgt, key) {
					const val = tgt[key];
					if (typeof val === 'function') {
						return function modelMethod(...args) {
							const operation = () => {
								try {
									const r = val.apply(tgt, args);
									// If it returns a promise, return it; otherwise wrap in resolved promise
									if (r && typeof r.then === 'function') {
										return r;
									}
									return Promise.resolve(r);
								} catch (err) {
									return Promise.reject(err);
								}
							};
							
							return retryOperation(operation);
						};
					}
					return val;
				},
			});
		}

		return orig;
	},
});

// Attempt initial connection (non-blocking, silent - errors will be handled on first operation)
rawPrisma
	.$connect()
	.then(() => {
		// Connection successful - no need to log
	})
	.catch(() => {
		// Connection failed - will retry on first operation, no need to log now
	});

export default prisma;
