import mqtt, {
  OnMessageCallback,
  Packet,
  OnErrorCallback,
  OnPacketCallback,
} from 'mqtt';
import { getGlobalSummary, getCountrySummary } from './api';
import { fieldChoices, getCountriesName, getCountriesSlug } from './data';

const PROTOCOL = 'mqtt';
const SERVER_URL = '127.0.0.1';
const PORT = 1883;
const MQTT_URI = `${PROTOCOL}://${SERVER_URL}:${PORT}`;
const client = mqtt.connect(MQTT_URI, { clientId: 'Publisher' });

const loop = async () => {
  const global = await getGlobalSummary();
  const countryNames = await getCountriesName();
  const countrySlugs: string[] = [];
  for (const name of countryNames) {
    countrySlugs.push(<string>await getCountriesSlug(name));
  }

  for (const field of Object.keys(fieldChoices)) {
    client.publish(`Global/${field}`, global[field].toString());
    for (const slug of countrySlugs) {
      const countryData = await getCountrySummary(slug);
      if (countryData) {
        client.publish(
          `Country/${slug}/${field}`,
          countryData[field].toString()
        );
      }
    }
  }
};

const handleConnect: Function = () => {
  console.log(`Connected to ${MQTT_URI}`);
  setInterval(loop, 5000);
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
