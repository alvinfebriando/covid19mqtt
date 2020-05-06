import net from 'net';
import Aedes from 'aedes';

const aedes = Aedes();
const server = net.createServer(aedes.handle);

const PORT = 1883;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
