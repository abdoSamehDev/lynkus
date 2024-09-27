require("dotenv").config();
const express = require("express")
const cors = require("cors")

const morgan = require("morgan")
const hpp=require( "hpp")
const  compression= require("compression")
const  path= require("path")
const cookieSession= require("cookie-session")
const limit= require("express-rate-limit")
// eslint-disable-next-line import/no-extraneous-dependencies
const xss= require("xss-clean")


const helmet= require("helmet");


const mongoSanitize = require('express-mongo-sanitize');

const routes=require ("./Routes/routes");
const DBConnection=require("./Db/database")
const globalError= require("./Middleware/errorMiddleware");
const ApiError = require("./utils/apiError");

DBConnection()
const app = express()

app.use(cors())

//compress all responses
app.use(compression());

//limit requests
app.use(express.json({ limit: '20kb' }))

//for Static files
app.use(express.static(path.join(__dirname, 'uploads')))

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan("dev"))
    console.log(`mode: ${process.env.NODE_ENV}`);
}


// prevent NoSQL injection
app.use(mongoSanitize)

app.use(xss());

// set secure HTTP headers
app.use(helmet());

// Configure Content Security Policy (CSP) to prevent XSS
app.use(helmet.contentSecurityPolicy({
  directives: {
      defaultSrc: ["'self'"],  // Only allow resources from the same origin
      scriptSrc: ["'self'"],    // Only allow scripts from the same origin
      // Add additional directives as needed
  },
}));

// Set X-XSS-Protection header
app.use(helmet.xssFilter());

// Set X-Content-Type-Options header to prevent MIME-sniffing
app.use(helmet.noSniff());


const limiter=limit({
    windowMs: 15*60*1000, //15 MIN
    max: 100,
    message:"too many Request Created From this IP , Please Try Again After"
})


const loginLimiter = limit({
    windowMs: 15* 60 * 1000, // 15 minute
    max: 5,
    message: "Too many login attempts from this IP, please try again after a few minutes."
  });

app.use('/api', limiter);
app.use('/login', loginLimiter);



// ANTI Http Parameters Pollution
app.use(hpp())



app.use(
    cookieSession({
      name: 'session',
      keys: [process.env.SESSION_SECRET || 'defaultSecretKey'], // Replace with environment variable in production
    
      httpOnly: true, // Prevents client-side JS from accessing the cookie xss
      secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS
      sameSite: 'strict', // make sure cookies are only sent from the same site
    })
  );

routes(app);

// Catch all other routes and return 404
app.all("*",(req, res,next) =>{
    next(ApiError("cant find this route",404));
})

app.use(globalError)

const PORT = process.env.PORT || 7000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});




// Handle error outside of express
process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error(`Shutting down`);
      process.exit(1);
    });
  });