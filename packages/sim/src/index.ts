import express from "express";

const app = express();
const port = 3000;

type SensorRecord = {
  id: string;
  value: Number;
};

let storedData: { [id: string]: Array<SensorRecord> } = {};

const sensorIds = [
  "cad89ca1-e18c-43c6-a132-f8c29643fc02",
  "df0daa5e-7f63-4e78-a681-7c2d658824a6",
  "ecc56f2b-6073-4cda-9351-8aa4ffe59d61"
];

const PLANT_ID = "03b51819-978d-4b85-a5bf-1882168a4569";

const generateData = () => {
  const timestamp = new Date().toISOString();
  const records: Array<SensorRecord> = [];

  sensorIds.forEach(id => {
    const value = Math.random();
    records.push({ id, value });
  });

  storedData[timestamp] = records;

  console.log("Added new records:");
  console.log(records);
};

const returnData = () => {
  const data = { ...storedData };
  storedData = {};

  return { id: PLANT_ID, data };
};

setInterval(generateData, 5000);

app.get("/", (_req, res) => res.send(returnData()));

app.listen(port, () => console.log(`App is listening on port ${port}!`));
