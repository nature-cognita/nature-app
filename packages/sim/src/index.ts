import express from "express";
import SerialPort from "serialport";
// import Readline from "@serialport/parser-readline";

const Readline = SerialPort.parsers.Readline;
const sPort = new SerialPort(
  "/dev/ttyACM0",
  {
    baudRate: 9600,
  },
  (err) => {
    console.error(err);
  }
);

const parser = sPort.pipe(new Readline({ delimiter: "\r\n" }));

const app = express();
const port = 4000;

type SensorRecord = {
  id: string;
  value: Number;
};

let storedData: { [id: string]: Array<SensorRecord> } = {};

const sensorIds = [
  "ckmux7l0b00390961jfgw9im1",
  "ckmux8cnr003y096102a48kzh",
  "ckmux8l6d004c0961fma03b1q",
];

const PLANT_ID = "ckmux79e7002s0961irqmfzhq";

// Switches the port into "flowing mode"
parser.on("data", (rawData) => {
  const data = rawData.toString("utf8");
  console.log("Data:", data);

  const [humidity, temperature, voltage] = data.split(" ");
  const [humidityId, temperatureId, voltageId] = sensorIds;

  const timestamp = new Date().toISOString();
  const records: Array<SensorRecord> = [
    { id: humidityId, value: parseFloat(humidity) },
    { id: temperatureId, value: parseFloat(temperature) },
    { id: voltageId, value: parseFloat(voltage) },
  ];

  storedData[timestamp] = records;

  console.log(`Added new records: ${records}`);
});

const returnData = () => {
  const data = { ...storedData };
  storedData = {};

  console.log("Returned data: ");
  console.log(data);
  return { id: PLANT_ID, data };
};

// setInterval(generateData, 5000);

app.get("/", (_req, res) => res.send(returnData()));

app.listen(port, () => console.log(`App is listening on port ${port}!`));
