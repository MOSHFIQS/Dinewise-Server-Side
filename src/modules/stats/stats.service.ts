import { prisma } from "../../lib/prisma";

const getAdminStats = async () => {
     const now = new Date();
     const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

     const [
          totalUsers,
          userRoles,
          totalOrders,
          orderStatus,
          totalMenuItems,
          totalRevenue,
          recentOrders,
          topSellingItems,
          totalCategories,
          totalCoupons,
          totalReviews,
          newUsers24h,
          newOrders24h,
          revenue24h,
     ] = await Promise.all([
          prisma.user.count(),
          prisma.user.groupBy({
               by: ["role"],
               _count: true
          }),
          prisma.order.count(),
          prisma.order.groupBy({
               by: ["status"],
               _count: true
          }),
          prisma.menuItem.count(),
          prisma.payment.aggregate({
               _sum: { amount: true },
               where: { status: "SUCCESS" }
          }),
          prisma.order.findMany({
               take: 5,
               orderBy: { createdAt: "desc" },
               include: { customer: { select: { name: true, email: true } } }
          }),
          prisma.orderItem.groupBy({
               by: ["menuItemId", "menuItemName"],
               _sum: { quantity: true, totalPrice: true },
               orderBy: { _sum: { quantity: "desc" } },
               take: 5
          }),
          prisma.category.count(),
          prisma.coupon.count(),
          prisma.review.count(),
          prisma.user.count({ where: { createdAt: { gte: oneDayAgo } } }),
          prisma.order.count({ where: { createdAt: { gte: oneDayAgo } } }),
          prisma.payment.aggregate({
               _sum: { amount: true },
               where: {
                    status: "SUCCESS",
                    order: {
                         createdAt: { gte: oneDayAgo }
                    }
               }
          }),
     ]);

     // Get weekly revenue (last 7 days)
     const sevenDaysAgo = new Date();
     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

     const weeklyRevenue = await prisma.payment.findMany({
          where: {
               status: "SUCCESS",
               order: {
                    createdAt: { gte: sevenDaysAgo }
               }
          },
          select: {
               amount: true,
               order: {
                    select: {
                         createdAt: true
                    }
               }
          }
     });

     // Process weekly revenue for chart
     const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          const amount = weeklyRevenue
               .filter(p => p.order.createdAt.toISOString().split("T")[0] === dateStr)
               .reduce((sum, p) => sum + p.amount, 0);
          return { date: dateStr, amount };
     }).reverse();

     return {
          totalUsers,
          userBreakdown: userRoles.reduce((acc: any, curr) => {
               acc[curr.role.toLowerCase()] = curr._count;
               return acc;
          }, {}),
          totalOrders,
          orderBreakdown: orderStatus.reduce((acc: any, curr) => {
               acc[curr.status.toLowerCase()] = curr._count;
               return acc;
          }, {}),
          totalMenuItems,
          totalRevenue: totalRevenue._sum?.amount || 0,
          totalCategories,
          totalCoupons,
          totalReviews,
          newUsers24h,
          newOrders24h,
          revenue24h: revenue24h._sum?.amount || 0,
          avgOrderValue: totalOrders > 0 ? (totalRevenue._sum?.amount || 0) / totalOrders : 0,
          recentOrders,
          topSellingItems,
          dailyRevenue
     };
};

const getChefStats = async (chefId: string) => {
     // Chef total menu items
     const totalMenuItems = await prisma.menuItem.count({
          where: { chefId }
     });

     // Chef's items in orders
     const chefOrderItems = await prisma.orderItem.findMany({
          where: {
               menuItem: { chefId }
          },
          include: {
               order: {
                    include: {
                         payment: true
                    }
               }
          }
     });

     // Total Revenue for Chef (only successful payments)
     const totalRevenue = chefOrderItems
          .filter(item => item.order.payment?.status === "SUCCESS")
          .reduce((sum, item) => sum + item.totalPrice, 0);

     // Unique Orders for Chef
     const uniqueOrderIds = new Set(chefOrderItems.map(item => item.orderId));
     const totalOrders = uniqueOrderIds.size;

     // Top selling items for this chef
     const topSellingItems = await prisma.orderItem.groupBy({
          by: ["menuItemId", "menuItemName"],
          where: {
               menuItem: { chefId }
          },
          _sum: { quantity: true, totalPrice: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5
     });

     // Recent orders for this chef's items
     const recentOrders = await prisma.order.findMany({
          where: {
               items: {
                    some: {
                         menuItem: { chefId }
                    }
               }
          },
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
               customer: { select: { name: true } }
          }
     });

     // Order Breakdown for Chef
     const orderBreakdown = chefOrderItems.reduce((acc: any, item) => {
          const status = item.order.status.toLowerCase();
          acc[status] = (acc[status] || 0) + 1;
          return acc;
     }, {});

     // Daily Revenue for Chef (Last 7 Days)
     const sevenDaysAgo = new Date();
     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

     const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          const amount = chefOrderItems
               .filter(item => 
                    item.order.payment?.status === "SUCCESS" && 
                    item.order.createdAt.toISOString().split("T")[0] === dateStr
               )
               .reduce((sum, item) => sum + item.totalPrice, 0);
          return { date: dateStr, amount };
     }).reverse();

     return {
          totalMenuItems,
          totalRevenue,
          totalOrders,
          topSellingItems,
          recentOrders,
          orderBreakdown,
          dailyRevenue
     };
};

const getCustomerStats = async (customerId: string) => {
     const [totalOrders, totalSpent, recentOrders, orderStatus] = await Promise.all([
          prisma.order.count({ where: { customerId } }),
          prisma.payment.aggregate({
               _sum: { amount: true },
               where: {
                    order: { customerId },
                    status: "SUCCESS"
               }
          }),
          prisma.order.findMany({
               where: { customerId },
               take: 5,
               orderBy: { createdAt: "desc" }
          }),
          prisma.order.groupBy({
               by: ["status"],
               where: { customerId },
               _count: true
          })
     ]);

     return {
          totalOrders,
          totalSpent: totalSpent._sum?.amount || 0,
          recentOrders,
          orderBreakdown: orderStatus.reduce((acc: any, curr) => {
               acc[curr.status.toLowerCase()] = curr._count;
               return acc;
          }, {})
     };
};

export const statsService = {
     getAdminStats,
     getChefStats,
     getCustomerStats
};
