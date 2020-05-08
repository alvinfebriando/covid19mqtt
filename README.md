# covid19mqtt

## Step

```bash
npm install
npm run start:dev
# open in new terminal
node build/subscriber
# open in new terminal
node build/publisher
# run subscriber and publisher alongside with server
```
## EZ way
```bash
npm install
npx tsc
npx concurrently "tsc -w" "nodemon build/server" "nodemon build/publisher"

# in another terminal
node build/client
```
