import mqtt, {
  OnMessageCallback,
  Packet,
  OnErrorCallback,
  OnPacketCallback,
} from 'mqtt';

const PROTOCOL = 'mqtt';
const SERVER_URL = '127.0.0.1';
const PORT = 1883;
const MQTT_URI = `${PROTOCOL}://${SERVER_URL}:${PORT}`;
const client = mqtt.connect(MQTT_URI);

const loop = async () => {
  client.publish('/all', '10,1,9', { qos: 2 });
  client.publish('/confirmed', '10');
  client.publish('/dead', '1');
  client.publish('/recovered', '9');
};

const handleConnect: Function = () => {
  console.log(`Connected to ${MQTT_URI}`);
  setInterval(loop, 1000);
};

const handleMessage: OnMessageCallback = (
  topic: string,
  payload: Buffer,
  packet: Packet
) => {
  console.log(payload.toString());
};

const handleError: OnErrorCallback = (err: Error) => {
  console.log(err);
};

const handlePacketReceive: OnPacketCallback = packet => {
  console.log(`Receive: ${packet.cmd}`);
};

const handlePacketSend: OnPacketCallback = packet => {
  console.log(`Send: ${packet.cmd}`);
};

const debug = () => {
  client.on('packetreceive', handlePacketReceive);
  client.on('packetsend', handlePacketSend);
};

client.on('connect', handleConnect);
client.on('message', handleMessage);
client.on('error', handleError);
