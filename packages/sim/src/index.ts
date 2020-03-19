import express from "express";

const app = express();
const port = 3000;

app.get("/", (_req, res) => res.send({ a: 1, b: "String" }));

app.listen(port, () => console.log(`App is listening on port ${port}!`));
