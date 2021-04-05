import express from "express";
import SerialPort from "serialport";

const PLANT_ID = "ckmux79e7002s0961irqmfzhq";

const sensorIds = [
  "ckmux7l0b00390961jfgw9im1",
  "ckmux8cnr003y096102a48kzh",
  "ckmux8l6d004c0961fma03b1q",
];

type SensorRecord = {
  id: string;
  value: Number;
};

let storedData: { [id: string]: Array<SensorRecord> } = {};

const app = express();
const port = 4000;

if (process.env.NODE_ENV == "production") {
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

  // Switches the port into "flowing mode"
  parser.on("data", (rawData) => {
    const data = rawData.toString("utf8");
    console.log("Received data:", data);

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
} else {
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

  setInterval(generateData, 5000);
}

const returnData = () => {
  const data = { ...storedData };
  storedData = {};

  console.log("Returned data: ");
  console.log(data);
  return { id: PLANT_ID, data };
};

app.get("/", (_req, res) => res.send(returnData()));

app.listen(port, () => console.log(`App is listening on port ${port}!`));
