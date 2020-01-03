import { MutationResolvers } from "generated/types";

const recordsMutations: MutationResolvers = {
  storeRecords: (_parent, { input: { records } }, { prisma }) => {
    const status = "Records stored sucessfully";
    records.forEach(record => {
      prisma.createSensorRecord({
        value: record.value,
        timestamp: record.timestamp,
        sensor: { connect: { id: record.sensorId } }
      });
    });
    return { status };
  }
};
