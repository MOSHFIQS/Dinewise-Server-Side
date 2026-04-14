import { prisma } from "../../lib/prisma";

const createAddress = async (userId: string, payload: any) => {
     return prisma.address.create({ data: { ...payload, userId } });
};

const getAddresses = async (userId: string) => {
     return prisma.address.findMany({ where: { userId } });
};

const updateAddress = async (id: string, userId: string, payload: any) => {
     return prisma.address.update({ where: { id, userId }, data: payload });
};

const deleteAddress = async (id: string, userId: string) => {
     return prisma.address.delete({ where: { id, userId } });
};

export const addressService = { createAddress, getAddresses, updateAddress, deleteAddress };
