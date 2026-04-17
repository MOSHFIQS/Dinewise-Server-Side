import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const log = async (payload: {
     userId?: string;
     action: string;
     entityType: string;
     entityId: string;
     details?: object | null;
     ipAddress?: string;
     userAgent?: string;
}) => {
     return prisma.auditLog.create({
          data: {
               action: payload.action,
               entityType: payload.entityType,
               entityId: payload.entityId,
               userId: payload.userId ?? null,
               details: (payload.details as any) ?? null,
               ipAddress: payload.ipAddress ?? null,
               userAgent: payload.userAgent ?? null,
          },
     });
};

const getAuditLogs = async (query: IQueryParams) => {
     const qb = new QueryBuilder(prisma.auditLog, query, {
          searchableFields: ["action", "entityType", "entityId"],
          filterableFields: ["userId", "entityType", "action"],
     });
     return qb
          .search()
          .filter()
          .include({
               user: {
                    select: { id: true, name: true, email: true, role: true },
               },
          })
          .sort()
          .paginate()
          .execute();
};

export const auditService = { log, getAuditLogs };
