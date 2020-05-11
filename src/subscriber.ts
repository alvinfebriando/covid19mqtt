import mqtt, {
  OnMessageCallback,
  Packet,
  OnErrorCallback,
  OnPacketCallback,
  MqttClient,
} from 'mqtt';
import emitter from './event';

const PROTOCOL = 'mqtt';
const SERVER_URL = '127.0.0.1';
const PORT = 1883;
const MQTT_URI = `${PROTOCOL}://${SERVER_URL}:${PORT}`;

export class Subscriber {
  client: MqttClient;
  constructor() {
    this.client = mqtt.connect(MQTT_URI, { clientId: 'Subscriber' });
    this.client.on('connect', this.handleConnect);
    this.client.on('message', this.handleMessage);
    this.client.on('error', this.handleError);
  }

  subscribe(topic: string) {
    this.client.subscribe(topic);
  }

  private handleConnect: Function = () => {
    // Ketika sudah terhubung dengan server, kirim pesan kepada client (cli)
    // Untuk kemudian menampilkan pertanyaan
    emitter.emit('connect');
  };

  private handleMessage: OnMessageCallback = (
    topic: string,
    payload: Buffer,
    packet: Packet
  ) => {
    console.log(payload.toString());
    // Ketika sudah menerima pesan akan langsung unsubscribe topic tersebut
    // dan memberitahu client (cli)
    this.client.unsubscribe(topic);
    emitter.emit('done');
  };

  private handleError: OnErrorCallback = (err: Error) => {
    console.log(err);
  };
}

const handlePacketReceive: OnPacketCallback = packet => {
  console.log(`Receive: ${packet.cmd}`);
};

const handlePacketSend: OnPacketCallback = packet => {
  console.log(`Send: ${packet.cmd}`);
};

const debug = (client: MqttClient) => {
  client.on('packetreceive', handlePacketReceive);
  client.on('packetsend', handlePacketSend);
};
