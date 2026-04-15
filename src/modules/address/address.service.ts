import { prisma } from "../../lib/prisma";

const createAddress = async (userId: string, payload: any) => {
     const { zipCode, postalCode, title, ...rest } = payload;
     return prisma.address.create({ 
          data: { 
               ...rest, 
               userId,
               title: title || "Home",
               postalCode: postalCode || zipCode,
          } 
     });
};

const getAddresses = async (userId: string) => {
     return prisma.address.findMany({ where: { userId } });
};

const updateAddress = async (id: string, userId: string, payload: any) => {
     const { zipCode, postalCode, ...rest } = payload;
     const dataToUpdate = { ...rest };
     if (postalCode || zipCode) {
          dataToUpdate.postalCode = postalCode || zipCode;
     }
     return prisma.address.update({ where: { id, userId }, data: dataToUpdate });
};

const deleteAddress = async (id: string, userId: string) => {
     return prisma.address.delete({ where: { id, userId } });
};

export const addressService = { createAddress, getAddresses, updateAddress, deleteAddress };
