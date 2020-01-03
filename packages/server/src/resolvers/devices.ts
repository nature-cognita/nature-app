import { QueryResolvers, Device } from "generated/types";

const devicesQueries: QueryResolvers = {
  devices: async (_parent, _args, ctx) => {
    const devices = (await ctx.prisma.devices()) as Array<Device>;

    return devices;
  }
};
