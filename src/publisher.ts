import mqtt, {
  OnMessageCallback,
  Packet,
  OnErrorCallback,
  OnPacketCallback,
} from 'mqtt';
import {
  getGlobalSummary,
  getCountrySummary,
  getCountriesName,
  getCountriesSlug,
} from './api';
import { fieldChoices } from './data';

const PROTOCOL = 'mqtt';
const SERVER_URL = '127.0.0.1';
const PORT = 1883;
const MQTT_URI = `${PROTOCOL}://${SERVER_URL}:${PORT}`;
const client = mqtt.connect(MQTT_URI, { clientId: 'Publisher' });

const loop = async () => {
  // Ambil data yang dibutuhkan
  const global = await getGlobalSummary();
  const countryNames = await getCountriesName();

  const countrySlugs: string[] = [];
  for (const name of countryNames) {
    countrySlugs.push(<string>await getCountriesSlug(name));
  }

  // Untuk setiap field yang ada (total infeksi, total meninggal, dll)
  for (const field of Object.keys(fieldChoices)) {
    // Publish data sesuai field
    client.publish(`Global/${field}`, global[field].toString());

    // Untuk setiap negara yang ada
    for (const slug of countrySlugs) {
      // ambil data negara
      const countryData = await getCountrySummary(slug);
      // publish ke topic yang sesuai jika data negara tersebut tersedia
      if (countryData) {
        client.publish(
          `Country/${slug}/${field}`,
          countryData[field].toString()
        );
      } else {
        client.publish(`Country/${slug}/${field}`, 'Data tidak tersedia');
      }
    }
  }
};

const handleConnect: Function = () => {
  console.log(`Connected to ${MQTT_URI}`);
  // Publish setiap 5 detik
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
