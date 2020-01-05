import { QueryResolvers, Device } from "generated/types";

export const deviceQueries: QueryResolvers = {
  devices: async (_parent, _args, { prisma }) => {
    const devices = (await prisma.devices()) as Array<Device>;

    return devices;
  }
};
