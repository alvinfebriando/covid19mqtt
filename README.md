# covid19mqtt

## Step

```bash
# Install dependencies
npm install
# Compile typescript to javascript
npx tsc
# Run publisher and server
npx concurrently "node build/server" "node build/publisher"

# in another terminal
node build/client
```
