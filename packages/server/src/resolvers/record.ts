import {
  MutationResolvers,
  QueryResolvers,
  SensorRecord,
} from "generated/types";

export const recordQueries: QueryResolvers = {
  recordsFromSensor: async (
    _parent,
    { input: { sensorId, fromDate, toDate } },
    { prisma }
  ) => {
    const records = (await prisma.sensorRecords({
      where: {
        sensor: { id: sensorId },
        timestamp_gte: fromDate,
        timestamp_lte: toDate,
      },
    })) as Array<SensorRecord>;

    return records;
  },
};

export const recordsMutations: MutationResolvers = {
  storeRecords: (_parent, { input: { records } }, { prisma }) => {
    const status = "Records stored sucessfully";
    records.forEach(async (record) => {
      const result = await prisma.createSensorRecord({
        value: record.value,
        timestamp: record.timestamp,
        sensor: { connect: { id: record.sensorId } },
      });

      console.log("Object stored: ");
      console.log(result);
    });

    return { status };
  },
};
