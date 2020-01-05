import {
  QueryResolvers,
  Device,
  DeviceResolvers,
  Sensor
} from "generated/types";

export const deviceQueries: QueryResolvers = {
  devices: async (_parent, _args, { prisma }) => {
    const devices = (await prisma.devices()) as Array<Device>;

    return devices;
  }
};

export const deviceResolvers: DeviceResolvers = {
  location(parent, _args, { prisma }) {
    return prisma.device({ id: parent.id }).location();
  },

  sensors(parent, _args, { prisma }) {
    return (prisma.sensors({
      where: { device: { id: parent.id } }
    }) as unknown) as Array<Sensor>; //TODO: This typecasting looks strange (prisma vs gqlgen)
  }
};
