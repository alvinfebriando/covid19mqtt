import net from 'net';
import Aedes from 'aedes';

const aedes = Aedes();
const server = net.createServer(aedes.handle);

const PORT = 1883;

aedes.on('client', client => {
  console.log(`${client.id} connected`);
});

aedes.on('clientDisconnect', client => {
  console.log(`${client.id} disconnected`);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
