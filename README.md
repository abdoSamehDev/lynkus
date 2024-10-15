## Note:

create .env file in the root directory and add the following:

```
# MongoDB Connection String
MONGO_URI=mongodb://<username>:<password>@localhost:27017/<dbname>

# Port Configuration
PORT=7000

# Session Configuration
SESSION_SECRET=your-session-secret-key

# Node Environment
NODE_ENV=development       # or "production"

```
## use this to genrate the SESSION_SECRET key
```
const crypto = require('crypto');
const sessionSecret = crypto.randomBytes(64).toString('hex');
console.log(sessionSecret);
```

## this is the link for swagger documentation
```
http://localhost:7000/api-docs/
```
