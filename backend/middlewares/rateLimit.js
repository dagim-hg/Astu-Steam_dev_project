import rateLimit from 'express-rate-limit';

// Standard rate limiter for all API requests
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});

// Stricter limiter for sensitive endpoints like auth
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login requests per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many login attempts from this IP, please try again after an hour'
    }
});
