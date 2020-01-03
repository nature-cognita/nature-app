import { QueryResolvers, Device, SensorRecord } from "generated/types";

export const devicesQueries: QueryResolvers = {
  devices: async (_parent, _args, { prisma }) => {
    const devices = (await prisma.devices()) as Array<Device>;

    return devices;
  },

  recordsFromDevice: async (
    _parent,
    { input: { deviceId, fromDate, toDate } },
    { prisma }
  ) => {
    const records = (await prisma.sensorRecords({
      where: {
        device: { id: deviceId },
        timestamp_gte: fromDate,
        timestamp_lte: toDate
      }
    })) as Array<SensorRecord>;

    return records;
  }
};
