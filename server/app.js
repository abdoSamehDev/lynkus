require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const hpp = require("hpp");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
const routes = require("./routes");
const DBConnection = require("./DB");
const globalError = require("./Middleware/errorMiddleware");
const ApiError = require("./utils/apiError");

// Initialize Database
DBConnection();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "20kb" })); // Limit request payload size
app.use(express.static(path.join(__dirname, "uploads"))); // Serve static files
app.use(compression()); // Compress responses
app.use(hpp()); // Protect against HTTP parameter pollution
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent cross-site scripting attacks

// Security Headers
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"]
    }
}));
app.use(helmet.xssFilter()); // X-XSS-Protection
app.use(helmet.noSniff()); // X-Content-Type-Options

// Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again later."
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts, please try again later."
});

// Apply to all requests
app.use(generalLimiter);
app.use("/api/users/login", loginLimiter);

// Cookie Session
app.use(
    cookieSession({
        name: "session",
        keys: [process.env.SESSION_SECRET || "defaultSecretKey"],
        httpOnly: true, // Prevent client-side JS access to the cookie
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "strict" // Restrict cookies to the same site
    })
);

app.use(cookieParser())

// Development Logging
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
    console.log(`Running in ${process.env.NODE_ENV} mode`);
}

// Swagger Setup
const swaggerOptions = {
    swaggerDefinition: {
        openvpn: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "API documentation for Social Media App",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 7000}`,
            },
        ],
    },
    apis: ['./Resources/**/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api", routes);

// Handle unrecognized routes
app.all("*", (req, res, next) => {
    next(new ApiError("Route not found", 404));
});

// Global Error Handler
app.use(globalError);

// Server setup
const PORT = process.env.PORT || 7000;
const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.name} - ${err.message}`);
    server.close(() => {
        console.error("Shutting down server");
        process.exit(1);
    });
});
