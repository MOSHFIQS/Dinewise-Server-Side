import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAuditLogs = async (query: IQueryParams) => {
     const qb = new QueryBuilder(prisma.auditLog, query, {
          searchableFields: ["action", "entityType"],
          filterableFields: ["userId", "entityType"],
     });
     return qb.search().filter().sort().paginate().execute();
};

export const auditService = { getAuditLogs };
