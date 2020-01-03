import { MutationResolvers } from "generated/types";

const recordsMutations: MutationResolvers = {
  storeRecords: (_parent, { input: { records } }, { prisma }) => {
    const status = "Records stored sucessfully";
    records.forEach(record => {
      prisma.createSensorRecord({
        value: record.value,
        timestamp: record.timestamp,
        device: { connect: { id: record.deviceId } },
        sensor: { connect: { id: record.sensorId } },
        location: { connect: { id: record.locationId } }
      });
    });
    return { status };
  }
};
