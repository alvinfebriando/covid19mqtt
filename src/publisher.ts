import mqtt, {
  OnMessageCallback,
  Packet,
  OnErrorCallback,
  OnPacketCallback,
  MqttClient,
} from 'mqtt';
import { getGlobalSummary, getCountrySummary, getDayOneField } from './api';

const PROTOCOL = 'mqtt';
const SERVER_URL = '127.0.0.1';
const PORT = 1883;
const MQTT_URI = `${PROTOCOL}://${SERVER_URL}:${PORT}`;
const client = mqtt.connect(MQTT_URI, { clientId: 'Publisher' });

const publish = async (client: MqttClient, scope: string, field: string) => {
  if (scope === 'Global') {
    const global = await getGlobalSummary();
    client.publish(`${scope}/${field}`, global[field].toString());
  } else {
    if (field.startsWith('DayOne')) {
      const fieldData = await getDayOneField(scope, field.substring(6));
      client.publish(`Country/${scope}/${field}`, JSON.stringify(fieldData));
    } else {
      console.log('lol');
      const countryData = await getCountrySummary(scope);
      if (countryData) {
        client.publish(
          `Country/${scope}/${field}`,
          countryData[field].toString()
        );
      }
    }
  }
};

const handleConnect: Function = () => {
  console.log(`Connected to ${MQTT_URI}`);
  client.subscribe('/request');
};

const handleMessage: OnMessageCallback = (
  topic: string,
  payload: Buffer,
  packet: Packet
) => {
  let scope: string;
  let field: string;
  let country: string;
  if (topic === '/request') {
    const { topic } = <{ topic: string }>JSON.parse(payload.toString());
    scope = topic.split('/')[0];
    if (topic.startsWith('Global')) {
      field = topic.split('/')[1];
      publish(client, scope, field);
    } else {
      country = topic.split('/')[1];
      field = topic.split('/')[2];
      publish(client, country, field);
    }
  }
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
