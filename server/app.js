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
// Configure CORS options
const corsOptions = {
    origin: '*', // Allow requests from all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "20kb" })); // Limit request payload size
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/users/headerImg', express.static(path.join(__dirname, 'uploads/users/headerImg')));
app.use('/users/profileImg', express.static(path.join(__dirname, 'uploads/users/profileImg')));
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
    max: 1000,
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
        openapi: "3.0.0", // Corrected from openvpn to openapi
        info: {
            title: "LYNKUS API",
            version: "1.0.0",
            description: "API documentation for Social Media App",
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://lynkus-3.onrender.com/api'
                    : `http://localhost:${process.env.PORT || 7000}/api`,
            },
        ],
        components: {
            securitySchemes: {
                tokenAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'User ID',
                            example: '613a1f4fcb1b8a5f7c89360a',
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the user',
                            example: 'John Doe',
                        },
                        userName: {
                            type: 'string',
                            description: 'Username of the user',
                            example: 'johndoe123',
                        },
                        email: {
                            type: 'string',
                            description: 'Email of the user',
                            example: 'johndoe@example.com',
                        },
                        profileImg: {
                            type: 'string',
                            description: 'URL of the profile image',
                            example: 'http://localhost:3000/users/johndoe.png',
                        },
                        headerImg:{
                            type:'string',
                            description: 'URL of the header image',
                            example: 'http://localhost:3000/users/header.jpg',
                        
                        },
                        password: {
                            type: 'string',
                            description: 'Password of the user',
                            example: 'mypassword123',
                        },
                        bio:{
                            type:'string',
                            description: 'Bio of the user',
                            example: 'I am a software engineer.',
                        },
                        
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'User creation timestamp',
                            example: '2023-10-01T12:34:56.789Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'User update timestamp',
                            example: '2023-10-02T14:15:16.789Z',
                        },
                    },
                    required: ['name', 'userName', 'email', 'password'],
                },
                Post: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Post ID',
                            example: '613a1f4fcb1b8a5f7c89360b',
                        },
                        image: {
                            type: 'string',
                            description: 'Image URL of the post',
                            example: 'http://localhost:3000/posts/image1.jpg',
                        },
                        body: {
                            type: 'string',
                            description: 'Content of the post',
                            example: 'This is a sample post.',
                        },
                        authorId: {
                            type: 'string',
                            description: 'ID of the author',
                            example: '613a1f4fcb1b8a5f7c89360a',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Post creation timestamp',
                            example: '2023-10-01T12:34:56.789Z',
                        },
                    },
                    required: ['body', 'authorId'],
                },
                Like: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Like ID',
                            example: '613a1f4fcb1b8a5f7c89360c',
                        },
                        postId: {
                            type: 'string',
                            description: 'ID of the liked post',
                            example: '613a1f4fcb1b8a5f7c89360b',
                        },
                        userId: {
                            type: 'string',
                            description: 'ID of the user who liked the post',
                            example: '613a1f4fcb1b8a5f7c89360a',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Like creation timestamp',
                            example: '2023-10-01T12:34:56.789Z',
                        },
                    },
                    required: ['postId', 'userId'],
                },
                Hashtag: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Hashtag ID',
                            example: '613a1f4fcb1b8a5f7c89360d',
                        },
                        text: {
                            type: 'string',
                            description: 'Text of the hashtag',
                            example: '#sampleHashtag',
                        },
                        postId: {
                            type: 'string',
                            description: 'ID of the post associated with the hashtag',
                            example: '613a1f4fcb1b8a5f7c89360b',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Hashtag creation timestamp',
                            example: '2023-10-01T12:34:56.789Z',
                        },
                        count: {
                            type: 'integer',
                            description: 'Count of how many times the hashtag was used',
                            example: 1,
                        },
                    },
                    required: ['text', 'postId'],
                },
                Comment: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Comment ID',
                            example: '613a1f4fcb1b8a5f7c89360e',
                        },
                        text: {
                            type: 'string',
                            description: 'Text of the comment',
                            example: 'This is a comment.',
                        },
                        replies: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            description: 'List of replies to the comment',
                        },
                        userId: {
                            type: 'string',
                            description: 'ID of the user who made the comment',
                            example: '613a1f4fcb1b8a5f7c89360a',
                        },
                        postId: {
                            type: 'string',
                            description: 'ID of the post being commented on',
                            example: '613a1f4fcb1b8a5f7c89360b',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Comment creation timestamp',
                            example: '2023-10-01T12:34:56.789Z',
                        },
                    },
                    required: ['text', 'userId', 'postId'],
                },
                Bookmark: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Bookmark ID',
                            example: '613a1f4fcb1b8a5f7c89360f',
                        },
                        user: {
                            type: 'string',
                            description: 'ID of the user who created the bookmark',
                            example: '613a1f4fcb1b8a5f7c89360a',
                        },
                        post: {
                            type: 'string',
                            description: 'ID of the bookmarked post',
                            example: '613a1f4fcb1b8a5f7c89360b',
                        },
                        tags: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            description: 'Tags associated with the bookmark',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Bookmark creation timestamp',
                            example: '2023-10-01T12:34:56.789Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Bookmark update timestamp',
                            example: '2023-10-02T14:15:16.789Z',
                        },
                    },
                    required: ['user', 'post'],
                },
                Follows: {
                    type: 'object',
                    properties: {
                        user: {
                            type: 'string',
                            description: 'ID of the user who is following another user',
                            example: '613a1f4fcb1b8a5f7c89360a',
                        },
                        following: {
                            type: 'string',
                            description: 'ID of the user being followed',
                            example: '613a1f4fcb1b8a5f7c89360b',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Follow creation timestamp',
                            example: '2023-10-01T12:34:56.789Z',
                        },
                    },
                    required: ['user', 'following'],
                },
                Notifications: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Notification ID',
                            example: '613a1f4fcb1b8a5f7c893610',
                        },
                        to: {
                            type: 'string',
                            description: 'ID of the user receiving the notification',
                            example: '613a1f4fcb1b8a5f7c89360a',
                        },
                        from: {
                            type: 'string',
                            description: 'ID of the user who triggered the notification',
                            example: '613a1f4fcb1b8a5f7c89360b',
                        },
                        post: {
                            type: 'string',
                            description: 'ID of the post associated with the notification (if applicable)',
                            example: '613a1f4fcb1b8a5f7c89360b',
                        },
                        type: {
                            type: 'string',
                            enum: ['FOLLOW', 'LIKE', 'COMMENT', 'POST'],
                            description: 'Type of the notification',
                            example: 'LIKE',
                        },
                        content: {
                            type: 'string',
                            description: 'Content of the notification',
                            example: 'John Doe liked your post.',
                        },
                        read: {
                            type: 'boolean',
                            description: 'Indicates if the notification has been read',
                            example: false,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Notification creation timestamp',
                            example: '2023-10-01T12:34:56.789Z',
                        },
                    },
                    required: ['to', 'from', 'type', 'content'],
                },
            },
        },
        tags: [
            {
                name: 'Auth',
                description: 'Authentication operations',
            },
            {
                name: 'Users',
                description: 'User management and operations',
            },
            {
                name: 'Posts',
                description: 'Post management and operations',
            },
            {
                name: 'Notifications',
                description: 'Notification operations',
            },
            {
                name: 'Comments',
                description: 'Comment operations',
            },
            {
                name: 'Likes',
                description: 'Like operations',
            },
            {
                name: 'Hashtags',
                description: 'Hashtag operations',
            },
            {
                name: 'Bookmarks',
                description: 'Bookmark operations',
            },
        ],
    },
    apis: ["./Resources/**/*.js"],
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
