import express from "express";
import SerialPort from "serialport";
const sPort = new SerialPort(
  "/dev/ttyACM0",
  {
    baudRate: 9600,
  },
  (err) => {
    console.error(err);
  }
);

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

const generateData = () => {
  const timestamp = new Date().toISOString();
  const records: Array<SensorRecord> = [];

  sensorIds.forEach((id) => {
    const value = Math.random();
    records.push({ id, value });
  });

  storedData[timestamp] = records;

  console.log("Added new records:");
};

// Switches the port into "flowing mode"
sPort.on("data", (data) => {
  console.log("Data:", data.toString("utf8"));
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
