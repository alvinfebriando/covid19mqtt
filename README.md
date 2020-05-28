# covid19mqtt

## Step

```bash
# Install dependencies
npm install
# Compile typescript to javascript
npm run compile

# Terminal 1: start server and publisher
npx concurrently "npm run start:server" "npm run start:publisher"

# Terminal 2: start client
npm run start:client
```
