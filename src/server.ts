import net from 'net';
import Aedes from 'aedes';

const aedes = Aedes();
const server = net.createServer(aedes.handle);

const PORT = 1883;

// Menampilkan client yang terhubung
aedes.on('client', client => {
  console.log(`${client.id} connected`);
});

// Menampilkan client yang putus
aedes.on('clientDisconnect', client => {
  console.log(`${client.id} disconnected`);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
