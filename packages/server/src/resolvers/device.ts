import { QueryResolvers, Device, DeviceResolvers } from "generated/types";

export const deviceQueries: QueryResolvers = {
  devices: async (_parent, _args, { prisma }) => {
    const devices = (await prisma.devices()) as Array<Device>;

    console.log(devices);

    return devices;
  }
};

export const deviceResolvers: DeviceResolvers = {
  location(parent, _args, { prisma }) {
    return prisma.device({ id: parent.id }).location();
  }
};
