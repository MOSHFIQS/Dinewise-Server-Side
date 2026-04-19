// src/app.ts
import express5 from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/config/env.ts
import dotenv from "dotenv";
import status from "http-status";

// src/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/config/env.ts
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "JWT_SECRET",
    "FRONTEND_URL",
    "BACKEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
    }
  };
};
var envVars = loadEnvVariables();

// src/middlewares/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: envVars.NODE_ENV === "development" ? err.stack : void 0
  });
}
var globalErrorHandler_default = errorHandler;

// src/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  });
}

// src/routes/index.ts
import { Router as Router15 } from "express";

// src/modules/auth/auth.route.ts
import express from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Address {\n  id         String  @id @default(uuid())\n  userId     String\n  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  title      String // e.g. "Home", "Office"\n  street     String\n  city       String\n  postalCode String\n  country    String\n  isDefault  Boolean @default(false)\n\n  orders Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("addresses")\n}\n\nmodel AuditLog {\n  id         String   @id @default(uuid())\n  userId     String?\n  user       User?    @relation(fields: [userId], references: [id])\n  action     String // e.g. "UPDATE_USER", "DELETE_MENU_ITEM"\n  entityType String // e.g. "USER", "MENU_ITEM", "ORDER"\n  entityId   String\n  details    Json? // e.g. what changed\n  ipAddress  String?\n  userAgent  String?\n  createdAt  DateTime @default(now())\n\n  @@map("audit_logs")\n}\n\nmodel User {\n  id       String     @id @default(uuid())\n  name     String\n  email    String     @unique\n  password String\n  image    String?\n  phone    String?\n  role     Role       @default(CUSTOMER)\n  status   UserStatus @default(ACTIVE)\n\n  isEmailVerified Boolean   @default(false)\n  emailVerifiedAt DateTime?\n  lastLoginAt     DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  menuItems     MenuItem[]     @relation("ChefMenuItems")\n  orders        Order[]        @relation("CustomerOrders")\n  reviews       Review[]\n  addresses     Address[]\n  notifications Notification[]\n  auditLogs     AuditLog[]\n  refunds       Refund[]\n\n  @@map("users")\n}\n\nmodel Category {\n  id          String     @id @default(uuid())\n  name        String     @unique\n  description String?\n  image       String?\n  menuItems   MenuItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("categories")\n}\n\nmodel Coupon {\n  id            String   @id @default(uuid())\n  code          String   @unique\n  discountType  String // "PERCENTAGE" or "FIXED"\n  discountValue Float\n  minOrderValue Float?\n  validFrom     DateTime\n  validUntil    DateTime\n  isActive      Boolean  @default(true)\n  usageLimit    Int? // Max times it can be used globally\n  usedCount     Int      @default(0)\n\n  orders Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("coupons")\n}\n\nenum Role {\n  CUSTOMER\n  CHEF\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n  SUSPENDED\n}\n\nenum OrderStatus {\n  PLACED\n  CONFIRMED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentStatus {\n  PENDING\n  INITIATED\n  SUCCESS\n  FAILED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentMethod {\n  STRIPE\n  CASH_ON_DELIVERY\n  BANK_TRANSFER\n}\n\nenum NotificationType {\n  ORDER_UPDATE\n  PAYMENT_UPDATE\n  SYSTEM\n  PROMOTION\n  ACCOUNT_STATUS\n  ORDER_PLACED\n  ORDER_STATUS_UPDATED\n  REFUND_REQUESTED\n  REFUND_APPROVED\n  REFUND_REJECTED\n  REFUND_PROCESSED\n}\n\nenum RefundStatus {\n  REQUESTED\n  CHEF_APPROVED\n  CHEF_REJECTED\n  ADMIN_APPROVED\n  ADMIN_REJECTED\n  PROCESSED\n}\n\nmodel MenuItem {\n  id            String   @id @default(uuid())\n  name          String\n  slug          String   @unique\n  description   String\n  price         Float\n  discountPrice Float?\n  stock         Int      @default(0)\n  images        String[]\n  ingredients   String?\n  isVegetarian  Boolean  @default(false)\n  spicyLevel    Int      @default(0) // 0-3 scale\n  isActive      Boolean  @default(true)\n  sku           String?  @unique\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  chefId String\n  chef   User   @relation("ChefMenuItems", fields: [chefId], references: [id])\n\n  reviews    Review[]\n  orderItems OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("menu_items")\n}\n\nmodel Notification {\n  id        String           @id @default(uuid())\n  userId    String           @map("user_id")\n  user      User             @relation(fields: [userId], references: [id])\n  title     String\n  message   String\n  type      NotificationType @default(SYSTEM)\n  isRead    Boolean          @default(false)\n  meta      Json?\n  createdAt DateTime         @default(now())\n\n  @@map("notifications")\n}\n\nmodel Order {\n  id         String @id @default(uuid())\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id])\n\n  addressId String?\n  address   Address? @relation(fields: [addressId], references: [id])\n\n  addressSnapshot Json?\n\n  couponId       String?\n  coupon         Coupon? @relation(fields: [couponId], references: [id])\n  couponDiscount Float   @default(0)\n\n  status      OrderStatus @default(PLACED)\n  subtotal    Float\n  deliveryFee Float       @default(0)\n  tax         Float       @default(0)\n  totalPrice  Float\n  notes       String?\n  tableNumber String?\n\n  items       OrderItem[]\n  payment     Payment?\n  refunds     Refund[]\n  deliveredAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id         String   @id @default(uuid())\n  orderId    String\n  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  menuItemId String\n  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])\n\n  menuItemName  String\n  menuItemImage String?\n  quantity      Int\n  unitPrice     Float\n  totalPrice    Float\n\n  @@map("order_items")\n}\n\nmodel Payment {\n  id            String        @id @default(uuid())\n  orderId       String        @unique\n  order         Order         @relation(fields: [orderId], references: [id])\n  amount        Float\n  paymentMethod PaymentMethod @default(STRIPE)\n  status        PaymentStatus @default(PENDING)\n\n  transactionId String? @unique\n\n  refunds Refund[]\n\n  @@map("payments")\n}\n\nmodel Refund {\n  id             String       @id @default(uuid())\n  orderId        String\n  paymentId      String\n  customerId     String\n  amount         Float\n  reason         String       @db.Text\n  status         RefundStatus @default(REQUESTED)\n  chefNote       String?      @db.Text\n  adminNote      String?      @db.Text\n  stripeRefundId String?\n\n  order    Order   @relation(fields: [orderId], references: [id])\n  payment  Payment @relation(fields: [paymentId], references: [id])\n  customer User    @relation(fields: [customerId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("refunds")\n}\n\nmodel Review {\n  id                 String  @id @default(uuid())\n  rating             Int // 1\u20135\n  title              String?\n  comment            String\n  isVerifiedPurchase Boolean @default(false)\n\n  userId     String\n  user       User     @relation(fields: [userId], references: [id])\n  menuItemId String\n  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"title","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"addresses"},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"action","kind":"scalar","type":"String"},{"name":"entityType","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"audit_logs"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isEmailVerified","kind":"scalar","type":"Boolean"},{"name":"emailVerifiedAt","kind":"scalar","type":"DateTime"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"menuItems","kind":"object","type":"MenuItem","relationName":"ChefMenuItems"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"refunds","kind":"object","type":"Refund","relationName":"RefundToUser"}],"dbName":"users"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"menuItems","kind":"object","type":"MenuItem","relationName":"CategoryToMenuItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"Coupon":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"discountType","kind":"scalar","type":"String"},{"name":"discountValue","kind":"scalar","type":"Float"},{"name":"minOrderValue","kind":"scalar","type":"Float"},{"name":"validFrom","kind":"scalar","type":"DateTime"},{"name":"validUntil","kind":"scalar","type":"DateTime"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"usageLimit","kind":"scalar","type":"Int"},{"name":"usedCount","kind":"scalar","type":"Int"},{"name":"orders","kind":"object","type":"Order","relationName":"CouponToOrder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"coupons"},"MenuItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"discountPrice","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"images","kind":"scalar","type":"String"},{"name":"ingredients","kind":"scalar","type":"String"},{"name":"isVegetarian","kind":"scalar","type":"Boolean"},{"name":"spicyLevel","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sku","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMenuItem"},{"name":"chefId","kind":"scalar","type":"String"},{"name":"chef","kind":"object","type":"User","relationName":"ChefMenuItems"},{"name":"reviews","kind":"object","type":"Review","relationName":"MenuItemToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MenuItemToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"menu_items"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"meta","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notifications"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"addressId","kind":"scalar","type":"String"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"addressSnapshot","kind":"scalar","type":"Json"},{"name":"couponId","kind":"scalar","type":"String"},{"name":"coupon","kind":"object","type":"Coupon","relationName":"CouponToOrder"},{"name":"couponDiscount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"subtotal","kind":"scalar","type":"Float"},{"name":"deliveryFee","kind":"scalar","type":"Float"},{"name":"tax","kind":"scalar","type":"Float"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"notes","kind":"scalar","type":"String"},{"name":"tableNumber","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"refunds","kind":"object","type":"Refund","relationName":"OrderToRefund"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"menuItemId","kind":"scalar","type":"String"},{"name":"menuItem","kind":"object","type":"MenuItem","relationName":"MenuItemToOrderItem"},{"name":"menuItemName","kind":"scalar","type":"String"},{"name":"menuItemImage","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Float"},{"name":"totalPrice","kind":"scalar","type":"Float"}],"dbName":"order_items"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"refunds","kind":"object","type":"Refund","relationName":"PaymentToRefund"}],"dbName":"payments"},"Refund":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"reason","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"RefundStatus"},{"name":"chefNote","kind":"scalar","type":"String"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"stripeRefundId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToRefund"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToRefund"},{"name":"customer","kind":"object","type":"User","relationName":"RefundToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"refunds"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isVerifiedPurchase","kind":"scalar","type":"Boolean"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"menuItemId","kind":"scalar","type":"String"},{"name":"menuItem","kind":"object","type":"MenuItem","relationName":"MenuItemToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","menuItems","_count","category","chef","user","menuItem","reviews","customer","address","orders","coupon","items","order","payment","refunds","orderItems","addresses","notifications","auditLogs","Address.findUnique","Address.findUniqueOrThrow","Address.findFirst","Address.findFirstOrThrow","Address.findMany","data","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","create","update","Address.upsertOne","Address.deleteOne","Address.deleteMany","having","_min","_max","Address.groupBy","Address.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Coupon.findUnique","Coupon.findUniqueOrThrow","Coupon.findFirst","Coupon.findFirstOrThrow","Coupon.findMany","Coupon.createOne","Coupon.createMany","Coupon.createManyAndReturn","Coupon.updateOne","Coupon.updateMany","Coupon.updateManyAndReturn","Coupon.upsertOne","Coupon.deleteOne","Coupon.deleteMany","_avg","_sum","Coupon.groupBy","Coupon.aggregate","MenuItem.findUnique","MenuItem.findUniqueOrThrow","MenuItem.findFirst","MenuItem.findFirstOrThrow","MenuItem.findMany","MenuItem.createOne","MenuItem.createMany","MenuItem.createManyAndReturn","MenuItem.updateOne","MenuItem.updateMany","MenuItem.updateManyAndReturn","MenuItem.upsertOne","MenuItem.deleteOne","MenuItem.deleteMany","MenuItem.groupBy","MenuItem.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Refund.findUnique","Refund.findUniqueOrThrow","Refund.findFirst","Refund.findFirstOrThrow","Refund.findMany","Refund.createOne","Refund.createMany","Refund.createManyAndReturn","Refund.updateOne","Refund.updateMany","Refund.updateManyAndReturn","Refund.upsertOne","Refund.deleteOne","Refund.deleteMany","Refund.groupBy","Refund.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","title","comment","isVerifiedPurchase","userId","menuItemId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","orderId","paymentId","customerId","amount","reason","RefundStatus","status","chefNote","adminNote","stripeRefundId","PaymentMethod","paymentMethod","PaymentStatus","transactionId","every","some","none","menuItemName","menuItemImage","quantity","unitPrice","totalPrice","addressId","addressSnapshot","couponId","couponDiscount","OrderStatus","subtotal","deliveryFee","tax","notes","tableNumber","deliveredAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","message","NotificationType","type","isRead","meta","name","slug","description","price","discountPrice","stock","images","ingredients","isVegetarian","spicyLevel","isActive","sku","categoryId","chefId","has","hasEvery","hasSome","code","discountType","discountValue","minOrderValue","validFrom","validUntil","usageLimit","usedCount","image","email","password","phone","Role","role","UserStatus","isEmailVerified","emailVerifiedAt","lastLoginAt","action","entityType","entityId","details","ipAddress","userAgent","street","city","postalCode","country","isDefault","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "2AZ2wAEPBwAAsgMAIAwAAJcDACDeAQAAvAMAMN8BAAARABDgAQAAvAMAMOEBAQAAAAHjAQEAkQMAIeYBAQCRAwAh6AFAAJMDACHpAUAAkwMAIcoCAQCRAwAhywIBAJEDACHMAgEAkQMAIc0CAQCRAwAhzgIgAJQDACEBAAAAAQAgGAUAAMEDACAGAACyAwAgCQAApwMAIBIAALoDACDeAQAAwAMAMN8BAAADABDgAQAAwAMAMOEBAQCRAwAh6AFAAJMDACHpAUAAkwMAIaECAQCRAwAhogIBAJEDACGjAgEAkQMAIaQCCAD1AgAhpQIIAJIDACGmAgIAlgMAIacCAACKAwAgqAIBAJoDACGpAiAAlAMAIaoCAgCWAwAhqwIgAJQDACGsAgEAmgMAIa0CAQCRAwAhrgIBAJEDACEHBQAA-QUAIAYAAPMFACAJAADlBQAgEgAA9wUAIKUCAADCAwAgqAIAAMIDACCsAgAAwgMAIBgFAADBAwAgBgAAsgMAIAkAAKcDACASAAC6AwAg3gEAAMADADDfAQAAAwAQ4AEAAMADADDhAQEAAAAB6AFAAJMDACHpAUAAkwMAIaECAQCRAwAhogIBAAAAAaMCAQCRAwAhpAIIAPUCACGlAggAkgMAIaYCAgCWAwAhpwIAAIoDACCoAgEAmgMAIakCIACUAwAhqgICAJYDACGrAiAAlAMAIawCAQAAAAGtAgEAkQMAIa4CAQCRAwAhAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACABAAAAAwAgDgcAALIDACAIAAC-AwAg3gEAAL8DADDfAQAACQAQ4AEAAL8DADDhAQEAkQMAIeIBAgCWAwAh4wEBAJoDACHkAQEAkQMAIeUBIACUAwAh5gEBAJEDACHnAQEAkQMAIegBQACTAwAh6QFAAJMDACEDBwAA8wUAIAgAAPgFACDjAQAAwgMAIA4HAACyAwAgCAAAvgMAIN4BAAC_AwAw3wEAAAkAEOABAAC_AwAw4QEBAAAAAeIBAgCWAwAh4wEBAJoDACHkAQEAkQMAIeUBIACUAwAh5gEBAJEDACHnAQEAkQMAIegBQACTAwAh6QFAAJMDACEDAAAACQAgAQAACgAwAgAACwAgDQgAAL4DACAPAAD4AgAg3gEAAL0DADDfAQAADQAQ4AEAAL0DADDhAQEAkQMAIecBAQCRAwAh9QEBAJEDACGGAgEAkQMAIYcCAQCaAwAhiAICAJYDACGJAggA9QIAIYoCCAD1AgAhAwgAAPgFACAPAAD1AwAghwIAAMIDACANCAAAvgMAIA8AAPgCACDeAQAAvQMAMN8BAAANABDgAQAAvQMAMOEBAQAAAAHnAQEAkQMAIfUBAQCRAwAhhgIBAJEDACGHAgEAmgMAIYgCAgCWAwAhiQIIAPUCACGKAggA9QIAIQMAAAANACABAAAOADACAAAPACAPBwAAsgMAIAwAAJcDACDeAQAAvAMAMN8BAAARABDgAQAAvAMAMOEBAQCRAwAh4wEBAJEDACHmAQEAkQMAIegBQACTAwAh6QFAAJMDACHKAgEAkQMAIcsCAQCRAwAhzAIBAJEDACHNAgEAkQMAIc4CIACUAwAhAQAAABEAIBAMAACXAwAg3gEAAJADADDfAQAAEwAQ4AEAAJADADDhAQEAkQMAIegBQACTAwAh6QFAAJMDACGrAiAAlAMAIbICAQCRAwAhswIBAJEDACG0AggA9QIAIbUCCACSAwAhtgJAAJMDACG3AkAAkwMAIbgCAgCVAwAhuQICAJYDACEBAAAAEwAgGQoAALIDACALAAC4AwAgDQAAuQMAIA4AALoDACAQAAC7AwAgEQAA-QIAIN4BAAC2AwAw3wEAABUAEOABAAC2AwAw4QEBAJEDACHoAUAAkwMAIekBQACTAwAh9wEBAJEDACH7AQAAtwOQAiKKAggA9QIAIYsCAQCaAwAhjAIAAK4DACCNAgEAmgMAIY4CCAD1AgAhkAIIAPUCACGRAggA9QIAIZICCAD1AgAhkwIBAJoDACGUAgEAmgMAIZUCQACmAwAhDAoAAPMFACALAAD1BQAgDQAA9gUAIA4AAPcFACAQAAD0BQAgEQAA9gMAIIsCAADCAwAgjAIAAMIDACCNAgAAwgMAIJMCAADCAwAglAIAAMIDACCVAgAAwgMAIBkKAACyAwAgCwAAuAMAIA0AALkDACAOAAC6AwAgEAAAuwMAIBEAAPkCACDeAQAAtgMAMN8BAAAVABDgAQAAtgMAMOEBAQAAAAHoAUAAkwMAIekBQACTAwAh9wEBAJEDACH7AQAAtwOQAiKKAggA9QIAIYsCAQCaAwAhjAIAAK4DACCNAgEAmgMAIY4CCAD1AgAhkAIIAPUCACGRAggA9QIAIZICCAD1AgAhkwIBAJoDACGUAgEAmgMAIZUCQACmAwAhAwAAABUAIAEAABYAMAIAABcAIAEAAAAVACADAAAADQAgAQAADgAwAgAADwAgCw8AAPgCACARAAD5AgAg3gEAAPQCADDfAQAAGwAQ4AEAAPQCADDhAQEAkQMAIfUBAQCRAwAh-AEIAPUCACH7AQAA9wKCAiKAAgAA9gKAAiKCAgEAmgMAIQEAAAAbACASCgAAsgMAIA8AAPgCACAQAAC1AwAg3gEAALMDADDfAQAAHQAQ4AEAALMDADDhAQEAkQMAIegBQACTAwAh6QFAAJMDACH1AQEAkQMAIfYBAQCRAwAh9wEBAJEDACH4AQgA9QIAIfkBAQCRAwAh-wEAALQD-wEi_AEBAJoDACH9AQEAmgMAIf4BAQCaAwAhBgoAAPMFACAPAAD1AwAgEAAA9AUAIPwBAADCAwAg_QEAAMIDACD-AQAAwgMAIBIKAACyAwAgDwAA-AIAIBAAALUDACDeAQAAswMAMN8BAAAdABDgAQAAswMAMOEBAQAAAAHoAUAAkwMAIekBQACTAwAh9QEBAJEDACH2AQEAkQMAIfcBAQCRAwAh-AEIAPUCACH5AQEAkQMAIfsBAAC0A_sBIvwBAQCaAwAh_QEBAJoDACH-AQEAmgMAIQMAAAAdACABAAAeADACAAAfACABAAAAHQAgAwAAAB0AIAEAAB4AMAIAAB8AIAEAAAANACABAAAAHQAgAQAAAAkAIAEAAAANACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAAAkAIAEAAAoAMAIAAAsAIAIHAADzBQAgDAAA7AQAIAMAAAARACABAAApADACAAABACAMBwAAsgMAIN4BAACwAwAw3wEAACsAEOABAACwAwAw4QEBAJEDACHjAQEAkQMAIeYBAQCRAwAh6AFAAJMDACGcAgEAkQMAIZ4CAACxA54CIp8CIACUAwAhoAIAAK4DACACBwAA8wUAIKACAADCAwAgDAcAALIDACDeAQAAsAMAMN8BAAArABDgAQAAsAMAMOEBAQAAAAHjAQEAkQMAIeYBAQCRAwAh6AFAAJMDACGcAgEAkQMAIZ4CAACxA54CIp8CIACUAwAhoAIAAK4DACADAAAAKwAgAQAALAAwAgAALQAgDQcAAK8DACDeAQAArQMAMN8BAAAvABDgAQAArQMAMOEBAQCRAwAh5gEBAJoDACHoAUAAkwMAIcQCAQCRAwAhxQIBAJEDACHGAgEAkQMAIccCAACuAwAgyAIBAJoDACHJAgEAmgMAIQUHAADzBQAg5gEAAMIDACDHAgAAwgMAIMgCAADCAwAgyQIAAMIDACANBwAArwMAIN4BAACtAwAw3wEAAC8AEOABAACtAwAw4QEBAAAAAeYBAQCaAwAh6AFAAJMDACHEAgEAkQMAIcUCAQCRAwAhxgIBAJEDACHHAgAArgMAIMgCAQCaAwAhyQIBAJoDACEDAAAALwAgAQAAMAAwAgAAMQAgFwMAAJsDACAJAACnAwAgDAAAlwMAIBEAAPkCACATAACoAwAgFAAAqQMAIBUAAKoDACDeAQAAowMAMN8BAAAzABDgAQAAowMAMOEBAQCRAwAh6AFAAJMDACHpAUAAkwMAIfsBAAClA8ECIqECAQCRAwAhugIBAJoDACG7AgEAkQMAIbwCAQCRAwAhvQIBAJoDACG_AgAApAO_AiLBAiAAlAMAIcICQACmAwAhwwJAAKYDACEBAAAAMwAgAwAAAB0AIAEAAB4AMAIAAB8AIAEAAAADACABAAAAFQAgAQAAAAkAIAEAAAARACABAAAAKwAgAQAAAC8AIAEAAAAdACADAAAAFQAgAQAAFgAwAgAAFwAgAQAAABUAIAEAAAABACADAAAAEQAgAQAAKQAwAgAAAQAgAwAAABEAIAEAACkAMAIAAAEAIAMAAAARACABAAApADACAAABACAMBwAA8gUAIAwAAMIFACDhAQEAAAAB4wEBAAAAAeYBAQAAAAHoAUAAAAAB6QFAAAAAAcoCAQAAAAHLAgEAAAABzAIBAAAAAc0CAQAAAAHOAiAAAAABARsAAEMAIArhAQEAAAAB4wEBAAAAAeYBAQAAAAHoAUAAAAAB6QFAAAAAAcoCAQAAAAHLAgEAAAABzAIBAAAAAc0CAQAAAAHOAiAAAAABARsAAEUAMAEbAABFADAMBwAA8QUAIAwAALcFACDhAQEAyAMAIeMBAQDIAwAh5gEBAMgDACHoAUAAzAMAIekBQADMAwAhygIBAMgDACHLAgEAyAMAIcwCAQDIAwAhzQIBAMgDACHOAiAAywMAIQIAAAABACAbAABIACAK4QEBAMgDACHjAQEAyAMAIeYBAQDIAwAh6AFAAMwDACHpAUAAzAMAIcoCAQDIAwAhywIBAMgDACHMAgEAyAMAIc0CAQDIAwAhzgIgAMsDACECAAAAEQAgGwAASgAgAgAAABEAIBsAAEoAIAMAAAABACAiAABDACAjAABIACABAAAAAQAgAQAAABEAIAMEAADuBQAgKAAA8AUAICkAAO8FACAN3gEAAKwDADDfAQAAUQAQ4AEAAKwDADDhAQEA1gIAIeMBAQDWAgAh5gEBANYCACHoAUAA2gIAIekBQADaAgAhygIBANYCACHLAgEA1gIAIcwCAQDWAgAhzQIBANYCACHOAiAA2QIAIQMAAAARACABAABQADAnAABRACADAAAAEQAgAQAAKQAwAgAAAQAgAQAAADEAIAEAAAAxACADAAAALwAgAQAAMAAwAgAAMQAgAwAAAC8AIAEAADAAMAIAADEAIAMAAAAvACABAAAwADACAAAxACAKBwAA7QUAIOEBAQAAAAHmAQEAAAAB6AFAAAAAAcQCAQAAAAHFAgEAAAABxgIBAAAAAccCgAAAAAHIAgEAAAAByQIBAAAAAQEbAABZACAJ4QEBAAAAAeYBAQAAAAHoAUAAAAABxAIBAAAAAcUCAQAAAAHGAgEAAAABxwKAAAAAAcgCAQAAAAHJAgEAAAABARsAAFsAMAEbAABbADABAAAAMwAgCgcAAOwFACDhAQEAyAMAIeYBAQDKAwAh6AFAAMwDACHEAgEAyAMAIcUCAQDIAwAhxgIBAMgDACHHAoAAAAAByAIBAMoDACHJAgEAygMAIQIAAAAxACAbAABfACAJ4QEBAMgDACHmAQEAygMAIegBQADMAwAhxAIBAMgDACHFAgEAyAMAIcYCAQDIAwAhxwKAAAAAAcgCAQDKAwAhyQIBAMoDACECAAAALwAgGwAAYQAgAgAAAC8AIBsAAGEAIAEAAAAzACADAAAAMQAgIgAAWQAgIwAAXwAgAQAAADEAIAEAAAAvACAHBAAA6QUAICgAAOsFACApAADqBQAg5gEAAMIDACDHAgAAwgMAIMgCAADCAwAgyQIAAMIDACAM3gEAAKsDADDfAQAAaQAQ4AEAAKsDADDhAQEA1gIAIeYBAQDYAgAh6AFAANoCACHEAgEA1gIAIcUCAQDWAgAhxgIBANYCACHHAgAA_AIAIMgCAQDYAgAhyQIBANgCACEDAAAALwAgAQAAaAAwJwAAaQAgAwAAAC8AIAEAADAAMAIAADEAIBcDAACbAwAgCQAApwMAIAwAAJcDACARAAD5AgAgEwAAqAMAIBQAAKkDACAVAACqAwAg3gEAAKMDADDfAQAAMwAQ4AEAAKMDADDhAQEAAAAB6AFAAJMDACHpAUAAkwMAIfsBAAClA8ECIqECAQCRAwAhugIBAJoDACG7AgEAAAABvAIBAJEDACG9AgEAmgMAIb8CAACkA78CIsECIACUAwAhwgJAAKYDACHDAkAApgMAIQEAAABsACABAAAAbAAgCwMAAP4EACAJAADlBQAgDAAA7AQAIBEAAPYDACATAADmBQAgFAAA5wUAIBUAAOgFACC6AgAAwgMAIL0CAADCAwAgwgIAAMIDACDDAgAAwgMAIAMAAAAzACABAABvADACAABsACADAAAAMwAgAQAAbwAwAgAAbAAgAwAAADMAIAEAAG8AMAIAAGwAIBQDAADeBQAgCQAA4AUAIAwAAN8FACARAADkBQAgEwAA4QUAIBQAAOIFACAVAADjBQAg4QEBAAAAAegBQAAAAAHpAUAAAAAB-wEAAADBAgKhAgEAAAABugIBAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb8CAAAAvwICwQIgAAAAAcICQAAAAAHDAkAAAAABARsAAHMAIA3hAQEAAAAB6AFAAAAAAekBQAAAAAH7AQAAAMECAqECAQAAAAG6AgEAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvwIAAAC_AgLBAiAAAAABwgJAAAAAAcMCQAAAAAEBGwAAdQAwARsAAHUAMBQDAACEBQAgCQAAhgUAIAwAAIUFACARAACKBQAgEwAAhwUAIBQAAIgFACAVAACJBQAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAh-wEAAIMFwQIioQIBAMgDACG6AgEAygMAIbsCAQDIAwAhvAIBAMgDACG9AgEAygMAIb8CAACCBb8CIsECIADLAwAhwgJAAIYEACHDAkAAhgQAIQIAAABsACAbAAB4ACAN4QEBAMgDACHoAUAAzAMAIekBQADMAwAh-wEAAIMFwQIioQIBAMgDACG6AgEAygMAIbsCAQDIAwAhvAIBAMgDACG9AgEAygMAIb8CAACCBb8CIsECIADLAwAhwgJAAIYEACHDAkAAhgQAIQIAAAAzACAbAAB6ACACAAAAMwAgGwAAegAgAwAAAGwAICIAAHMAICMAAHgAIAEAAABsACABAAAAMwAgBwQAAP8EACAoAACBBQAgKQAAgAUAILoCAADCAwAgvQIAAMIDACDCAgAAwgMAIMMCAADCAwAgEN4BAACcAwAw3wEAAIEBABDgAQAAnAMAMOEBAQDWAgAh6AFAANoCACHpAUAA2gIAIfsBAACeA8ECIqECAQDWAgAhugIBANgCACG7AgEA1gIAIbwCAQDWAgAhvQIBANgCACG_AgAAnQO_AiLBAiAA2QIAIcICQAD-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_eAQAAjQMAMN8BAACyAQAQ4AEAAI0DADDhAQEA1gIAIegBQADaAgAh6QFAANoCACGrAiAA2QIAIbICAQDWAgAhswIBANYCACG0AggA6AIAIbUCCACJAwAhtgJAANoCACG3AkAA2gIAIbgCAgCOAwAhuQICANcCACEDAAAAEwAgAQAAsQEAMCcAALIBACADAAAAEwAgAQAAoAEAMAIAAJ0BACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIBUFAADUBAAgBgAA1QQAIAkAANYEACASAADXBAAg4QEBAAAAAegBQAAAAAHpAUAAAAABoQIBAAAAAaICAQAAAAGjAgEAAAABpAIIAAAAAaUCCAAAAAGmAgIAAAABpwIAANMEACCoAgEAAAABqQIgAAAAAaoCAgAAAAGrAiAAAAABrAIBAAAAAa0CAQAAAAGuAgEAAAABARsAALoBACAR4QEBAAAAAegBQAAAAAHpAUAAAAABoQIBAAAAAaICAQAAAAGjAgEAAAABpAIIAAAAAaUCCAAAAAGmAgIAAAABpwIAANMEACCoAgEAAAABqQIgAAAAAaoCAgAAAAGrAiAAAAABrAIBAAAAAa0CAQAAAAGuAgEAAAABARsAALwBADABGwAAvAEAMBUFAAC6BAAgBgAAuwQAIAkAALwEACASAAC9BAAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAhoQIBAMgDACGiAgEAyAMAIaMCAQDIAwAhpAIIANYDACGlAggAuAQAIaYCAgDJAwAhpwIAALkEACCoAgEAygMAIakCIADLAwAhqgICAMkDACGrAiAAywMAIawCAQDKAwAhrQIBAMgDACGuAgEAyAMAIQIAAAAFACAbAAC_AQAgEeEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIaECAQDIAwAhogIBAMgDACGjAgEAyAMAIaQCCADWAwAhpQIIALgEACGmAgIAyQMAIacCAAC5BAAgqAIBAMoDACGpAiAAywMAIaoCAgDJAwAhqwIgAMsDACGsAgEAygMAIa0CAQDIAwAhrgIBAMgDACECAAAAAwAgGwAAwQEAIAIAAAADACAbAADBAQAgAwAAAAUAICIAALoBACAjAAC_AQAgAQAAAAUAIAEAAAADACAIBAAAswQAICgAALYEACApAAC1BAAgagAAtAQAIGsAALcEACClAgAAwgMAIKgCAADCAwAgrAIAAMIDACAU3gEAAIgDADDfAQAAyAEAEOABAACIAwAw4QEBANYCACHoAUAA2gIAIekBQADaAgAhoQIBANYCACGiAgEA1gIAIaMCAQDWAgAhpAIIAOgCACGlAggAiQMAIaYCAgDXAgAhpwIAAIoDACCoAgEA2AIAIakCIADZAgAhqgICANcCACGrAiAA2QIAIawCAQDYAgAhrQIBANYCACGuAgEA1gIAIQMAAAADACABAADHAQAwJwAAyAEAIAMAAAADACABAAAEADACAAAFACABAAAALQAgAQAAAC0AIAMAAAArACABAAAsADACAAAtACADAAAAKwAgAQAALAAwAgAALQAgAwAAACsAIAEAACwAMAIAAC0AIAkHAACyBAAg4QEBAAAAAeMBAQAAAAHmAQEAAAAB6AFAAAAAAZwCAQAAAAGeAgAAAJ4CAp8CIAAAAAGgAoAAAAABARsAANABACAI4QEBAAAAAeMBAQAAAAHmAQEAAAAB6AFAAAAAAZwCAQAAAAGeAgAAAJ4CAp8CIAAAAAGgAoAAAAABARsAANIBADABGwAA0gEAMAkHAACxBAAg4QEBAMgDACHjAQEAyAMAIeYBAQDIAwAh6AFAAMwDACGcAgEAyAMAIZ4CAACwBJ4CIp8CIADLAwAhoAKAAAAAAQIAAAAtACAbAADVAQAgCOEBAQDIAwAh4wEBAMgDACHmAQEAyAMAIegBQADMAwAhnAIBAMgDACGeAgAAsASeAiKfAiAAywMAIaACgAAAAAECAAAAKwAgGwAA1wEAIAIAAAArACAbAADXAQAgAwAAAC0AICIAANABACAjAADVAQAgAQAAAC0AIAEAAAArACAEBAAArQQAICgAAK8EACApAACuBAAgoAIAAMIDACAL3gEAAIQDADDfAQAA3gEAEOABAACEAwAw4QEBANYCACHjAQEA1gIAIeYBAQDWAgAh6AFAANoCACGcAgEA1gIAIZ4CAACFA54CIp8CIADZAgAhoAIAAPwCACADAAAAKwAgAQAA3QEAMCcAAN4BACADAAAAKwAgAQAALAAwAgAALQAgAQAAABcAIAEAAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABUAIAEAABYAMAIAABcAIAMAAAAVACABAAAWADACAAAXACAWCgAApwQAIAsAAKgEACANAACpBAAgDgAAqgQAIBAAAKsEACARAACsBAAg4QEBAAAAAegBQAAAAAHpAUAAAAAB9wEBAAAAAfsBAAAAkAICigIIAAAAAYsCAQAAAAGMAoAAAAABjQIBAAAAAY4CCAAAAAGQAggAAAABkQIIAAAAAZICCAAAAAGTAgEAAAABlAIBAAAAAZUCQAAAAAEBGwAA5gEAIBDhAQEAAAAB6AFAAAAAAekBQAAAAAH3AQEAAAAB-wEAAACQAgKKAggAAAABiwIBAAAAAYwCgAAAAAGNAgEAAAABjgIIAAAAAZACCAAAAAGRAggAAAABkgIIAAAAAZMCAQAAAAGUAgEAAAABlQJAAAAAAQEbAADoAQAwARsAAOgBADABAAAAEQAgAQAAABMAIBYKAACHBAAgCwAAiAQAIA0AAIkEACAOAACKBAAgEAAAiwQAIBEAAIwEACDhAQEAyAMAIegBQADMAwAh6QFAAMwDACH3AQEAyAMAIfsBAACFBJACIooCCADWAwAhiwIBAMoDACGMAoAAAAABjQIBAMoDACGOAggA1gMAIZACCADWAwAhkQIIANYDACGSAggA1gMAIZMCAQDKAwAhlAIBAMoDACGVAkAAhgQAIQIAAAAXACAbAADtAQAgEOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfcBAQDIAwAh-wEAAIUEkAIiigIIANYDACGLAgEAygMAIYwCgAAAAAGNAgEAygMAIY4CCADWAwAhkAIIANYDACGRAggA1gMAIZICCADWAwAhkwIBAMoDACGUAgEAygMAIZUCQACGBAAhAgAAABUAIBsAAO8BACACAAAAFQAgGwAA7wEAIAEAAAARACABAAAAEwAgAwAAABcAICIAAOYBACAjAADtAQAgAQAAABcAIAEAAAAVACALBAAAgAQAICgAAIMEACApAACCBAAgagAAgQQAIGsAAIQEACCLAgAAwgMAIIwCAADCAwAgjQIAAMIDACCTAgAAwgMAIJQCAADCAwAglQIAAMIDACAT3gEAAPsCADDfAQAA-AEAEOABAAD7AgAw4QEBANYCACHoAUAA2gIAIekBQADaAgAh9wEBANYCACH7AQAA_QKQAiKKAggA6AIAIYsCAQDYAgAhjAIAAPwCACCNAgEA2AIAIY4CCADoAgAhkAIIAOgCACGRAggA6AIAIZICCADoAgAhkwIBANgCACGUAgEA2AIAIZUCQAD-AgAhAwAAABUAIAEAAPcBADAnAAD4AQAgAwAAABUAIAEAABYAMAIAABcAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgCggAAP8DACAPAAD-AwAg4QEBAAAAAecBAQAAAAH1AQEAAAABhgIBAAAAAYcCAQAAAAGIAgIAAAABiQIIAAAAAYoCCAAAAAEBGwAAgAIAIAjhAQEAAAAB5wEBAAAAAfUBAQAAAAGGAgEAAAABhwIBAAAAAYgCAgAAAAGJAggAAAABigIIAAAAAQEbAACCAgAwARsAAIICADAKCAAA_QMAIA8AAPwDACDhAQEAyAMAIecBAQDIAwAh9QEBAMgDACGGAgEAyAMAIYcCAQDKAwAhiAICAMkDACGJAggA1gMAIYoCCADWAwAhAgAAAA8AIBsAAIUCACAI4QEBAMgDACHnAQEAyAMAIfUBAQDIAwAhhgIBAMgDACGHAgEAygMAIYgCAgDJAwAhiQIIANYDACGKAggA1gMAIQIAAAANACAbAACHAgAgAgAAAA0AIBsAAIcCACADAAAADwAgIgAAgAIAICMAAIUCACABAAAADwAgAQAAAA0AIAYEAAD3AwAgKAAA-gMAICkAAPkDACBqAAD4AwAgawAA-wMAIIcCAADCAwAgC94BAAD6AgAw3wEAAI4CABDgAQAA-gIAMOEBAQDWAgAh5wEBANYCACH1AQEA1gIAIYYCAQDWAgAhhwIBANgCACGIAgIA1wIAIYkCCADoAgAhigIIAOgCACEDAAAADQAgAQAAjQIAMCcAAI4CACADAAAADQAgAQAADgAwAgAADwAgCw8AAPgCACARAAD5AgAg3gEAAPQCADDfAQAAGwAQ4AEAAPQCADDhAQEAAAAB9QEBAAAAAfgBCAD1AgAh-wEAAPcCggIigAIAAPYCgAIiggIBAAAAAQEAAACRAgAgAQAAAJECACADDwAA9QMAIBEAAPYDACCCAgAAwgMAIAMAAAAbACABAACUAgAwAgAAkQIAIAMAAAAbACABAACUAgAwAgAAkQIAIAMAAAAbACABAACUAgAwAgAAkQIAIAgPAADzAwAgEQAA9AMAIOEBAQAAAAH1AQEAAAAB-AEIAAAAAfsBAAAAggICgAIAAACAAgKCAgEAAAABARsAAJgCACAG4QEBAAAAAfUBAQAAAAH4AQgAAAAB-wEAAACCAgKAAgAAAIACAoICAQAAAAEBGwAAmgIAMAEbAACaAgAwCA8AAOUDACARAADmAwAg4QEBAMgDACH1AQEAyAMAIfgBCADWAwAh-wEAAOQDggIigAIAAOMDgAIiggIBAMoDACECAAAAkQIAIBsAAJ0CACAG4QEBAMgDACH1AQEAyAMAIfgBCADWAwAh-wEAAOQDggIigAIAAOMDgAIiggIBAMoDACECAAAAGwAgGwAAnwIAIAIAAAAbACAbAACfAgAgAwAAAJECACAiAACYAgAgIwAAnQIAIAEAAACRAgAgAQAAABsAIAYEAADeAwAgKAAA4QMAICkAAOADACBqAADfAwAgawAA4gMAIIICAADCAwAgCd4BAADtAgAw3wEAAKYCABDgAQAA7QIAMOEBAQDWAgAh9QEBANYCACH4AQgA6AIAIfsBAADvAoICIoACAADuAoACIoICAQDYAgAhAwAAABsAIAEAAKUCADAnAACmAgAgAwAAABsAIAEAAJQCADACAACRAgAgAQAAAB8AIAEAAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAAAdACABAAAeADACAAAfACAPCgAA3QMAIA8AANsDACAQAADcAwAg4QEBAAAAAegBQAAAAAHpAUAAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AEIAAAAAfkBAQAAAAH7AQAAAPsBAvwBAQAAAAH9AQEAAAAB_gEBAAAAAQEbAACuAgAgDOEBAQAAAAHoAUAAAAAB6QFAAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBCAAAAAH5AQEAAAAB-wEAAAD7AQL8AQEAAAAB_QEBAAAAAf4BAQAAAAEBGwAAsAIAMAEbAACwAgAwDwoAANoDACAPAADYAwAgEAAA2QMAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfUBAQDIAwAh9gEBAMgDACH3AQEAyAMAIfgBCADWAwAh-QEBAMgDACH7AQAA1wP7ASL8AQEAygMAIf0BAQDKAwAh_gEBAMoDACECAAAAHwAgGwAAswIAIAzhAQEAyAMAIegBQADMAwAh6QFAAMwDACH1AQEAyAMAIfYBAQDIAwAh9wEBAMgDACH4AQgA1gMAIfkBAQDIAwAh-wEAANcD-wEi_AEBAMoDACH9AQEAygMAIf4BAQDKAwAhAgAAAB0AIBsAALUCACACAAAAHQAgGwAAtQIAIAMAAAAfACAiAACuAgAgIwAAswIAIAEAAAAfACABAAAAHQAgCAQAANEDACAoAADUAwAgKQAA0wMAIGoAANIDACBrAADVAwAg_AEAAMIDACD9AQAAwgMAIP4BAADCAwAgD94BAADnAgAw3wEAALwCABDgAQAA5wIAMOEBAQDWAgAh6AFAANoCACHpAUAA2gIAIfUBAQDWAgAh9gEBANYCACH3AQEA1gIAIfgBCADoAgAh-QEBANYCACH7AQAA6QL7ASL8AQEA2AIAIf0BAQDYAgAh_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_QEBANgCACH-AQEA2AIAIQ0EAADcAgAgKAAA5AIAICkAAOQCACBqAADkAgAgawAA5AIAIOoBCAAAAAHrAQgAAAAE7AEIAAAABO0BCAAAAAHuAQgAAAAB7wEIAAAAAfABCAAAAAHxAQgA7AIAIQcEAADcAgAgKAAA6wIAICkAAOsCACDqAQAAAPsBAusBAAAA-wEI7AEAAAD7AQjxAQAA6gL7ASIHBAAA3AIAICgAAOsCACApAADrAgAg6gEAAAD7AQLrAQAAAPsBCOwBAAAA-wEI8QEAAOoC-wEiBOoBAAAA-wEC6wEAAAD7AQjsAQAAAPsBCPEBAADrAvsBIg0EAADcAgAgKAAA5AIAICkAAOQCACBqAADkAgAgawAA5AIAIOoBCAAAAAHrAQgAAAAE7AEIAAAABO0BCAAAAAHuAQgAAAAB7wEIAAAAAfABCAAAAAHxAQgA7AIAIQneAQAA7QIAMN8BAACmAgAQ4AEAAO0CADDhAQEA1gIAIfUBAQDWAgAh-AEIAOgCACH7AQAA7wKCAiKAAgAA7gKAAiKCAgEA2AIAIQcEAADcAgAgKAAA8wIAICkAAPMCACDqAQAAAIACAusBAAAAgAII7AEAAACAAgjxAQAA8gKAAiIHBAAA3AIAICgAAPECACApAADxAgAg6gEAAACCAgLrAQAAAIICCOwBAAAAggII8QEAAPACggIiBwQAANwCACAoAADxAgAgKQAA8QIAIOoBAAAAggIC6wEAAACCAgjsAQAAAIICCPEBAADwAoICIgTqAQAAAIICAusBAAAAggII7AEAAACCAgjxAQAA8QKCAiIHBAAA3AIAICgAAPMCACApAADzAgAg6gEAAACAAgLrAQAAAIACCOwBAAAAgAII8QEAAPICgAIiBOoBAAAAgAIC6wEAAACAAgjsAQAAAIACCPEBAADzAoACIgsPAAD4AgAgEQAA-QIAIN4BAAD0AgAw3wEAABsAEOABAAD0AgAw4QEBAJEDACH1AQEAkQMAIfgBCAD1AgAh-wEAAPcCggIigAIAAPYCgAIiggIBAJoDACEI6gEIAAAAAesBCAAAAATsAQgAAAAE7QEIAAAAAe4BCAAAAAHvAQgAAAAB8AEIAAAAAfEBCADkAgAhBOoBAAAAgAIC6wEAAACAAgjsAQAAAIACCPEBAADzAoACIgTqAQAAAIICAusBAAAAggII7AEAAACCAgjxAQAA8QKCAiIbCgAAsgMAIAsAALgDACANAAC5AwAgDgAAugMAIBAAALsDACARAAD5AgAg3gEAALYDADDfAQAAFQAQ4AEAALYDADDhAQEAkQMAIegBQACTAwAh6QFAAJMDACH3AQEAkQMAIfsBAAC3A5ACIooCCAD1AgAhiwIBAJoDACGMAgAArgMAII0CAQCaAwAhjgIIAPUCACGQAggA9QIAIZECCAD1AgAhkgIIAPUCACGTAgEAmgMAIZQCAQCaAwAhlQJAAKYDACHPAgAAFQAg0AIAABUAIAODAgAAHQAghAIAAB0AIIUCAAAdACAL3gEAAPoCADDfAQAAjgIAEOABAAD6AgAw4QEBANYCACHnAQEA1gIAIfUBAQDWAgAhhgIBANYCACGHAgEA2AIAIYgCAgDXAgAhiQIIAOgCACGKAggA6AIAIRPeAQAA-wIAMN8BAAD4AQAQ4AEAAPsCADDhAQEA1gIAIegBQADaAgAh6QFAANoCACH3AQEA1gIAIfsBAAD9ApACIooCCADoAgAhiwIBANgCACGMAgAA_AIAII0CAQDYAgAhjgIIAOgCACGQAggA6AIAIZECCADoAgAhkgIIAOgCACGTAgEA2AIAIZQCAQDYAgAhlQJAAP4CACEPBAAA4QIAICgAAIMDACApAACDAwAg6gGAAAAAAe0BgAAAAAHuAYAAAAAB7wGAAAAAAfABgAAAAAHxAYAAAAABlgIBAAAAAZcCAQAAAAGYAgEAAAABmQKAAAAAAZoCgAAAAAGbAoAAAAABBwQAANwCACAoAACCAwAgKQAAggMAIOoBAAAAkAIC6wEAAACQAgjsAQAAAJACCPEBAACBA5ACIgsEAADhAgAgKAAAgAMAICkAAIADACDqAUAAAAAB6wFAAAAABewBQAAAAAXtAUAAAAAB7gFAAAAAAe8BQAAAAAHwAUAAAAAB8QFAAP8CACELBAAA4QIAICgAAIADACApAACAAwAg6gFAAAAAAesBQAAAAAXsAUAAAAAF7QFAAAAAAe4BQAAAAAHvAUAAAAAB8AFAAAAAAfEBQAD_AgAhCOoBQAAAAAHrAUAAAAAF7AFAAAAABe0BQAAAAAHuAUAAAAAB7wFAAAAAAfABQAAAAAHxAUAAgAMAIQcEAADcAgAgKAAAggMAICkAAIIDACDqAQAAAJACAusBAAAAkAII7AEAAACQAgjxAQAAgQOQAiIE6gEAAACQAgLrAQAAAJACCOwBAAAAkAII8QEAAIIDkAIiDOoBgAAAAAHtAYAAAAAB7gGAAAAAAe8BgAAAAAHwAYAAAAAB8QGAAAAAAZYCAQAAAAGXAgEAAAABmAIBAAAAAZkCgAAAAAGaAoAAAAABmwKAAAAAAQveAQAAhAMAMN8BAADeAQAQ4AEAAIQDADDhAQEA1gIAIeMBAQDWAgAh5gEBANYCACHoAUAA2gIAIZwCAQDWAgAhngIAAIUDngIinwIgANkCACGgAgAA_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_gIAIQcEAADcAgAgKAAAogMAICkAAKIDACDqAQAAAL8CAusBAAAAvwII7AEAAAC_AgjxAQAAoQO_AiIHBAAA3AIAICgAAKADACApAACgAwAg6gEAAADBAgLrAQAAAMECCOwBAAAAwQII8QEAAJ8DwQIiBwQAANwCACAoAACgAwAgKQAAoAMAIOoBAAAAwQIC6wEAAADBAgjsAQAAAMECCPEBAACfA8ECIgTqAQAAAMECAusBAAAAwQII7AEAAADBAgjxAQAAoAPBAiIHBAAA3AIAICgAAKIDACApAACiAwAg6gEAAAC_AgLrAQAAAL8CCOwBAAAAvwII8QEAAKEDvwIiBOoBAAAAvwIC6wEAAAC_AgjsAQAAAL8CCPEBAACiA78CIhcDAACbAwAgCQAApwMAIAwAAJcDACARAAD5AgAgEwAAqAMAIBQAAKkDACAVAACqAwAg3gEAAKMDADDfAQAAMwAQ4AEAAKMDADDhAQEAkQMAIegBQACTAwAh6QFAAJMDACH7AQAApQPBAiKhAgEAkQMAIboCAQCaAwAhuwIBAJEDACG8AgEAkQMAIb0CAQCaAwAhvwIAAKQDvwIiwQIgAJQDACHCAkAApgMAIcMCQACmAwAhBOoBAAAAvwIC6wEAAAC_AgjsAQAAAL8CCPEBAACiA78CIgTqAQAAAMECAusBAAAAwQII7AEAAADBAgjxAQAAoAPBAiII6gFAAAAAAesBQAAAAAXsAUAAAAAF7QFAAAAAAe4BQAAAAAHvAUAAAAAB8AFAAAAAAfEBQACAAwAhA4MCAAAJACCEAgAACQAghQIAAAkAIAODAgAAEQAghAIAABEAIIUCAAARACADgwIAACsAIIQCAAArACCFAgAAKwAgA4MCAAAvACCEAgAALwAghQIAAC8AIAzeAQAAqwMAMN8BAABpABDgAQAAqwMAMOEBAQDWAgAh5gEBANgCACHoAUAA2gIAIcQCAQDWAgAhxQIBANYCACHGAgEA1gIAIccCAAD8AgAgyAIBANgCACHJAgEA2AIAIQ3eAQAArAMAMN8BAABRABDgAQAArAMAMOEBAQDWAgAh4wEBANYCACHmAQEA1gIAIegBQADaAgAh6QFAANoCACHKAgEA1gIAIcsCAQDWAgAhzAIBANYCACHNAgEA1gIAIc4CIADZAgAhDQcAAK8DACDeAQAArQMAMN8BAAAvABDgAQAArQMAMOEBAQCRAwAh5gEBAJoDACHoAUAAkwMAIcQCAQCRAwAhxQIBAJEDACHGAgEAkQMAIccCAACuAwAgyAIBAJoDACHJAgEAmgMAIQzqAYAAAAAB7QGAAAAAAe4BgAAAAAHvAYAAAAAB8AGAAAAAAfEBgAAAAAGWAgEAAAABlwIBAAAAAZgCAQAAAAGZAoAAAAABmgKAAAAAAZsCgAAAAAEZAwAAmwMAIAkAAKcDACAMAACXAwAgEQAA-QIAIBMAAKgDACAUAACpAwAgFQAAqgMAIN4BAACjAwAw3wEAADMAEOABAACjAwAw4QEBAJEDACHoAUAAkwMAIekBQACTAwAh-wEAAKUDwQIioQIBAJEDACG6AgEAmgMAIbsCAQCRAwAhvAIBAJEDACG9AgEAmgMAIb8CAACkA78CIsECIACUAwAhwgJAAKYDACHDAkAApgMAIc8CAAAzACDQAgAAMwAgDAcAALIDACDeAQAAsAMAMN8BAAArABDgAQAAsAMAMOEBAQCRAwAh4wEBAJEDACHmAQEAkQMAIegBQACTAwAhnAIBAJEDACGeAgAAsQOeAiKfAiAAlAMAIaACAACuAwAgBOoBAAAAngIC6wEAAACeAgjsAQAAAJ4CCPEBAACHA54CIhkDAACbAwAgCQAApwMAIAwAAJcDACARAAD5AgAgEwAAqAMAIBQAAKkDACAVAACqAwAg3gEAAKMDADDfAQAAMwAQ4AEAAKMDADDhAQEAkQMAIegBQACTAwAh6QFAAJMDACH7AQAApQPBAiKhAgEAkQMAIboCAQCaAwAhuwIBAJEDACG8AgEAkQMAIb0CAQCaAwAhvwIAAKQDvwIiwQIgAJQDACHCAkAApgMAIcMCQACmAwAhzwIAADMAINACAAAzACASCgAAsgMAIA8AAPgCACAQAAC1AwAg3gEAALMDADDfAQAAHQAQ4AEAALMDADDhAQEAkQMAIegBQACTAwAh6QFAAJMDACH1AQEAkQMAIfYBAQCRAwAh9wEBAJEDACH4AQgA9QIAIfkBAQCRAwAh-wEAALQD-wEi_AEBAJoDACH9AQEAmgMAIf4BAQCaAwAhBOoBAAAA-wEC6wEAAAD7AQjsAQAAAPsBCPEBAADrAvsBIg0PAAD4AgAgEQAA-QIAIN4BAAD0AgAw3wEAABsAEOABAAD0AgAw4QEBAJEDACH1AQEAkQMAIfgBCAD1AgAh-wEAAPcCggIigAIAAPYCgAIiggIBAJoDACHPAgAAGwAg0AIAABsAIBkKAACyAwAgCwAAuAMAIA0AALkDACAOAAC6AwAgEAAAuwMAIBEAAPkCACDeAQAAtgMAMN8BAAAVABDgAQAAtgMAMOEBAQCRAwAh6AFAAJMDACHpAUAAkwMAIfcBAQCRAwAh-wEAALcDkAIiigIIAPUCACGLAgEAmgMAIYwCAACuAwAgjQIBAJoDACGOAggA9QIAIZACCAD1AgAhkQIIAPUCACGSAggA9QIAIZMCAQCaAwAhlAIBAJoDACGVAkAApgMAIQTqAQAAAJACAusBAAAAkAII7AEAAACQAgjxAQAAggOQAiIRBwAAsgMAIAwAAJcDACDeAQAAvAMAMN8BAAARABDgAQAAvAMAMOEBAQCRAwAh4wEBAJEDACHmAQEAkQMAIegBQACTAwAh6QFAAJMDACHKAgEAkQMAIcsCAQCRAwAhzAIBAJEDACHNAgEAkQMAIc4CIACUAwAhzwIAABEAINACAAARACASDAAAlwMAIN4BAACQAwAw3wEAABMAEOABAACQAwAw4QEBAJEDACHoAUAAkwMAIekBQACTAwAhqwIgAJQDACGyAgEAkQMAIbMCAQCRAwAhtAIIAPUCACG1AggAkgMAIbYCQACTAwAhtwJAAJMDACG4AgIAlQMAIbkCAgCWAwAhzwIAABMAINACAAATACADgwIAAA0AIIQCAAANACCFAgAADQAgDQ8AAPgCACARAAD5AgAg3gEAAPQCADDfAQAAGwAQ4AEAAPQCADDhAQEAkQMAIfUBAQCRAwAh-AEIAPUCACH7AQAA9wKCAiKAAgAA9gKAAiKCAgEAmgMAIc8CAAAbACDQAgAAGwAgDwcAALIDACAMAACXAwAg3gEAALwDADDfAQAAEQAQ4AEAALwDADDhAQEAkQMAIeMBAQCRAwAh5gEBAJEDACHoAUAAkwMAIekBQACTAwAhygIBAJEDACHLAgEAkQMAIcwCAQCRAwAhzQIBAJEDACHOAiAAlAMAIQ0IAAC-AwAgDwAA-AIAIN4BAAC9AwAw3wEAAA0AEOABAAC9AwAw4QEBAJEDACHnAQEAkQMAIfUBAQCRAwAhhgIBAJEDACGHAgEAmgMAIYgCAgCWAwAhiQIIAPUCACGKAggA9QIAIRoFAADBAwAgBgAAsgMAIAkAAKcDACASAAC6AwAg3gEAAMADADDfAQAAAwAQ4AEAAMADADDhAQEAkQMAIegBQACTAwAh6QFAAJMDACGhAgEAkQMAIaICAQCRAwAhowIBAJEDACGkAggA9QIAIaUCCACSAwAhpgICAJYDACGnAgAAigMAIKgCAQCaAwAhqQIgAJQDACGqAgIAlgMAIasCIACUAwAhrAIBAJoDACGtAgEAkQMAIa4CAQCRAwAhzwIAAAMAINACAAADACAOBwAAsgMAIAgAAL4DACDeAQAAvwMAMN8BAAAJABDgAQAAvwMAMOEBAQCRAwAh4gECAJYDACHjAQEAmgMAIeQBAQCRAwAh5QEgAJQDACHmAQEAkQMAIecBAQCRAwAh6AFAAJMDACHpAUAAkwMAIRgFAADBAwAgBgAAsgMAIAkAAKcDACASAAC6AwAg3gEAAMADADDfAQAAAwAQ4AEAAMADADDhAQEAkQMAIegBQACTAwAh6QFAAJMDACGhAgEAkQMAIaICAQCRAwAhowIBAJEDACGkAggA9QIAIaUCCACSAwAhpgICAJYDACGnAgAAigMAIKgCAQCaAwAhqQIgAJQDACGqAgIAlgMAIasCIACUAwAhrAIBAJoDACGtAgEAkQMAIa4CAQCRAwAhDAMAAJsDACDeAQAAmQMAMN8BAACHAQAQ4AEAAJkDADDhAQEAkQMAIegBQACTAwAh6QFAAJMDACGhAgEAkQMAIaMCAQCaAwAhugIBAJoDACHPAgAAhwEAINACAACHAQAgAAAAAAAAAdQCAQAAAAEF1AICAAAAAdoCAgAAAAHbAgIAAAAB3AICAAAAAd0CAgAAAAEB1AIBAAAAAQHUAiAAAAABAdQCQAAAAAEFIgAA0QYAICMAANcGACDRAgAA0gYAINICAADWBgAg1wIAAGwAIAUiAADPBgAgIwAA1AYAINECAADQBgAg0gIAANMGACDXAgAABQAgAyIAANEGACDRAgAA0gYAINcCAABsACADIgAAzwYAINECAADQBgAg1wIAAAUAIAAAAAAABdQCCAAAAAHaAggAAAAB2wIIAAAAAdwCCAAAAAHdAggAAAABAdQCAAAA-wECBSIAAMQGACAjAADNBgAg0QIAAMUGACDSAgAAzAYAINcCAAAXACAFIgAAwgYAICMAAMoGACDRAgAAwwYAINICAADJBgAg1wIAAJECACAFIgAAwAYAICMAAMcGACDRAgAAwQYAINICAADGBgAg1wIAAGwAIAMiAADEBgAg0QIAAMUGACDXAgAAFwAgAyIAAMIGACDRAgAAwwYAINcCAACRAgAgAyIAAMAGACDRAgAAwQYAINcCAABsACAAAAAAAAHUAgAAAIACAgHUAgAAAIICAgUiAAC6BgAgIwAAvgYAINECAAC7BgAg0gIAAL0GACDXAgAAFwAgCyIAAOcDADAjAADsAwAw0QIAAOgDADDSAgAA6QMAMNMCAADqAwAg1AIAAOsDADDVAgAA6wMAMNYCAADrAwAw1wIAAOsDADDYAgAA7QMAMNkCAADuAwAwDQoAAN0DACAPAADbAwAg4QEBAAAAAegBQAAAAAHpAUAAAAAB9QEBAAAAAfcBAQAAAAH4AQgAAAAB-QEBAAAAAfsBAAAA-wEC_AEBAAAAAf0BAQAAAAH-AQEAAAABAgAAAB8AICIAAPIDACADAAAAHwAgIgAA8gMAICMAAPEDACABGwAAvAYAMBIKAACyAwAgDwAA-AIAIBAAALUDACDeAQAAswMAMN8BAAAdABDgAQAAswMAMOEBAQAAAAHoAUAAkwMAIekBQACTAwAh9QEBAJEDACH2AQEAkQMAIfcBAQCRAwAh-AEIAPUCACH5AQEAkQMAIfsBAAC0A_sBIvwBAQCaAwAh_QEBAJoDACH-AQEAmgMAIQIAAAAfACAbAADxAwAgAgAAAO8DACAbAADwAwAgD94BAADuAwAw3wEAAO8DABDgAQAA7gMAMOEBAQCRAwAh6AFAAJMDACHpAUAAkwMAIfUBAQCRAwAh9gEBAJEDACH3AQEAkQMAIfgBCAD1AgAh-QEBAJEDACH7AQAAtAP7ASL8AQEAmgMAIf0BAQCaAwAh_gEBAJoDACEP3gEAAO4DADDfAQAA7wMAEOABAADuAwAw4QEBAJEDACHoAUAAkwMAIekBQACTAwAh9QEBAJEDACH2AQEAkQMAIfcBAQCRAwAh-AEIAPUCACH5AQEAkQMAIfsBAAC0A_sBIvwBAQCaAwAh_QEBAJoDACH-AQEAmgMAIQvhAQEAyAMAIegBQADMAwAh6QFAAMwDACH1AQEAyAMAIfcBAQDIAwAh-AEIANYDACH5AQEAyAMAIfsBAADXA_sBIvwBAQDKAwAh_QEBAMoDACH-AQEAygMAIQ0KAADaAwAgDwAA2AMAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfUBAQDIAwAh9wEBAMgDACH4AQgA1gMAIfkBAQDIAwAh-wEAANcD-wEi_AEBAMoDACH9AQEAygMAIf4BAQDKAwAhDQoAAN0DACAPAADbAwAg4QEBAAAAAegBQAAAAAHpAUAAAAAB9QEBAAAAAfcBAQAAAAH4AQgAAAAB-QEBAAAAAfsBAAAA-wEC_AEBAAAAAf0BAQAAAAH-AQEAAAABAyIAALoGACDRAgAAuwYAINcCAAAXACAEIgAA5wMAMNECAADoAwAw0wIAAOoDACDXAgAA6wMAMAwKAADzBQAgCwAA9QUAIA0AAPYFACAOAAD3BQAgEAAA9AUAIBEAAPYDACCLAgAAwgMAIIwCAADCAwAgjQIAAMIDACCTAgAAwgMAIJQCAADCAwAglQIAAMIDACAAAAAAAAAFIgAAsgYAICMAALgGACDRAgAAswYAINICAAC3BgAg1wIAABcAIAUiAACwBgAgIwAAtQYAINECAACxBgAg0gIAALQGACDXAgAABQAgAyIAALIGACDRAgAAswYAINcCAAAXACADIgAAsAYAINECAACxBgAg1wIAAAUAIAAAAAAAAdQCAAAAkAICAdQCQAAAAAEFIgAAowYAICMAAK4GACDRAgAApAYAINICAACtBgAg1wIAAGwAIAciAAChBgAgIwAAqwYAINECAACiBgAg0gIAAKoGACDVAgAAEQAg1gIAABEAINcCAAABACAHIgAAnwYAICMAAKgGACDRAgAAoAYAINICAACnBgAg1QIAABMAINYCAAATACDXAgAAnQEAIAsiAACbBAAwIwAAoAQAMNECAACcBAAw0gIAAJ0EADDTAgAAngQAINQCAACfBAAw1QIAAJ8EADDWAgAAnwQAMNcCAACfBAAw2AIAAKEEADDZAgAAogQAMAciAACWBAAgIwAAmQQAINECAACXBAAg0gIAAJgEACDVAgAAGwAg1gIAABsAINcCAACRAgAgCyIAAI0EADAjAACRBAAw0QIAAI4EADDSAgAAjwQAMNMCAACQBAAg1AIAAOsDADDVAgAA6wMAMNYCAADrAwAw1wIAAOsDADDYAgAAkgQAMNkCAADuAwAwDQoAAN0DACAQAADcAwAg4QEBAAAAAegBQAAAAAHpAUAAAAAB9gEBAAAAAfcBAQAAAAH4AQgAAAAB-QEBAAAAAfsBAAAA-wEC_AEBAAAAAf0BAQAAAAH-AQEAAAABAgAAAB8AICIAAJUEACADAAAAHwAgIgAAlQQAICMAAJQEACABGwAApgYAMAIAAAAfACAbAACUBAAgAgAAAO8DACAbAACTBAAgC-EBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfYBAQDIAwAh9wEBAMgDACH4AQgA1gMAIfkBAQDIAwAh-wEAANcD-wEi_AEBAMoDACH9AQEAygMAIf4BAQDKAwAhDQoAANoDACAQAADZAwAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAh9gEBAMgDACH3AQEAyAMAIfgBCADWAwAh-QEBAMgDACH7AQAA1wP7ASL8AQEAygMAIf0BAQDKAwAh_gEBAMoDACENCgAA3QMAIBAAANwDACDhAQEAAAAB6AFAAAAAAekBQAAAAAH2AQEAAAAB9wEBAAAAAfgBCAAAAAH5AQEAAAAB-wEAAAD7AQL8AQEAAAAB_QEBAAAAAf4BAQAAAAEGEQAA9AMAIOEBAQAAAAH4AQgAAAAB-wEAAACCAgKAAgAAAIACAoICAQAAAAECAAAAkQIAICIAAJYEACADAAAAGwAgIgAAlgQAICMAAJoEACAIAAAAGwAgEQAA5gMAIBsAAJoEACDhAQEAyAMAIfgBCADWAwAh-wEAAOQDggIigAIAAOMDgAIiggIBAMoDACEGEQAA5gMAIOEBAQDIAwAh-AEIANYDACH7AQAA5AOCAiKAAgAA4wOAAiKCAgEAygMAIQgIAAD_AwAg4QEBAAAAAecBAQAAAAGGAgEAAAABhwIBAAAAAYgCAgAAAAGJAggAAAABigIIAAAAAQIAAAAPACAiAACmBAAgAwAAAA8AICIAAKYEACAjAAClBAAgARsAAKUGADANCAAAvgMAIA8AAPgCACDeAQAAvQMAMN8BAAANABDgAQAAvQMAMOEBAQAAAAHnAQEAkQMAIfUBAQCRAwAhhgIBAJEDACGHAgEAmgMAIYgCAgCWAwAhiQIIAPUCACGKAggA9QIAIQIAAAAPACAbAAClBAAgAgAAAKMEACAbAACkBAAgC94BAACiBAAw3wEAAKMEABDgAQAAogQAMOEBAQCRAwAh5wEBAJEDACH1AQEAkQMAIYYCAQCRAwAhhwIBAJoDACGIAgIAlgMAIYkCCAD1AgAhigIIAPUCACEL3gEAAKIEADDfAQAAowQAEOABAACiBAAw4QEBAJEDACHnAQEAkQMAIfUBAQCRAwAhhgIBAJEDACGHAgEAmgMAIYgCAgCWAwAhiQIIAPUCACGKAggA9QIAIQfhAQEAyAMAIecBAQDIAwAhhgIBAMgDACGHAgEAygMAIYgCAgDJAwAhiQIIANYDACGKAggA1gMAIQgIAAD9AwAg4QEBAMgDACHnAQEAyAMAIYYCAQDIAwAhhwIBAMoDACGIAgIAyQMAIYkCCADWAwAhigIIANYDACEICAAA_wMAIOEBAQAAAAHnAQEAAAABhgIBAAAAAYcCAQAAAAGIAgIAAAABiQIIAAAAAYoCCAAAAAEDIgAAowYAINECAACkBgAg1wIAAGwAIAMiAAChBgAg0QIAAKIGACDXAgAAAQAgAyIAAJ8GACDRAgAAoAYAINcCAACdAQAgBCIAAJsEADDRAgAAnAQAMNMCAACeBAAg1wIAAJ8EADADIgAAlgQAINECAACXBAAg1wIAAJECACAEIgAAjQQAMNECAACOBAAw0wIAAJAEACDXAgAA6wMAMAAAAAHUAgAAAJ4CAgUiAACaBgAgIwAAnQYAINECAACbBgAg0gIAAJwGACDXAgAAbAAgAyIAAJoGACDRAgAAmwYAINcCAABsACAAAAAAAAXUAggAAAAB2gIIAAAAAdsCCAAAAAHcAggAAAAB3QIIAAAAAQLUAgEAAAAE3gIBAAAABQUiAACQBgAgIwAAmAYAINECAACRBgAg0gIAAJcGACDXAgAAhAEAIAUiAACOBgAgIwAAlQYAINECAACPBgAg0gIAAJQGACDXAgAAbAAgCyIAAMcEADAjAADMBAAw0QIAAMgEADDSAgAAyQQAMNMCAADKBAAg1AIAAMsEADDVAgAAywQAMNYCAADLBAAw1wIAAMsEADDYAgAAzQQAMNkCAADOBAAwCyIAAL4EADAjAADCBAAw0QIAAL8EADDSAgAAwAQAMNMCAADBBAAg1AIAAJ8EADDVAgAAnwQAMNYCAACfBAAw1wIAAJ8EADDYAgAAwwQAMNkCAACiBAAwCA8AAP4DACDhAQEAAAAB9QEBAAAAAYYCAQAAAAGHAgEAAAABiAICAAAAAYkCCAAAAAGKAggAAAABAgAAAA8AICIAAMYEACADAAAADwAgIgAAxgQAICMAAMUEACABGwAAkwYAMAIAAAAPACAbAADFBAAgAgAAAKMEACAbAADEBAAgB-EBAQDIAwAh9QEBAMgDACGGAgEAyAMAIYcCAQDKAwAhiAICAMkDACGJAggA1gMAIYoCCADWAwAhCA8AAPwDACDhAQEAyAMAIfUBAQDIAwAhhgIBAMgDACGHAgEAygMAIYgCAgDJAwAhiQIIANYDACGKAggA1gMAIQgPAAD-AwAg4QEBAAAAAfUBAQAAAAGGAgEAAAABhwIBAAAAAYgCAgAAAAGJAggAAAABigIIAAAAAQkHAADPAwAg4QEBAAAAAeIBAgAAAAHjAQEAAAAB5AEBAAAAAeUBIAAAAAHmAQEAAAAB6AFAAAAAAekBQAAAAAECAAAACwAgIgAA0gQAIAMAAAALACAiAADSBAAgIwAA0QQAIAEbAACSBgAwDgcAALIDACAIAAC-AwAg3gEAAL8DADDfAQAACQAQ4AEAAL8DADDhAQEAAAAB4gECAJYDACHjAQEAmgMAIeQBAQCRAwAh5QEgAJQDACHmAQEAkQMAIecBAQCRAwAh6AFAAJMDACHpAUAAkwMAIQIAAAALACAbAADRBAAgAgAAAM8EACAbAADQBAAgDN4BAADOBAAw3wEAAM8EABDgAQAAzgQAMOEBAQCRAwAh4gECAJYDACHjAQEAmgMAIeQBAQCRAwAh5QEgAJQDACHmAQEAkQMAIecBAQCRAwAh6AFAAJMDACHpAUAAkwMAIQzeAQAAzgQAMN8BAADPBAAQ4AEAAM4EADDhAQEAkQMAIeIBAgCWAwAh4wEBAJoDACHkAQEAkQMAIeUBIACUAwAh5gEBAJEDACHnAQEAkQMAIegBQACTAwAh6QFAAJMDACEI4QEBAMgDACHiAQIAyQMAIeMBAQDKAwAh5AEBAMgDACHlASAAywMAIeYBAQDIAwAh6AFAAMwDACHpAUAAzAMAIQkHAADNAwAg4QEBAMgDACHiAQIAyQMAIeMBAQDKAwAh5AEBAMgDACHlASAAywMAIeYBAQDIAwAh6AFAAMwDACHpAUAAzAMAIQkHAADPAwAg4QEBAAAAAeIBAgAAAAHjAQEAAAAB5AEBAAAAAeUBIAAAAAHmAQEAAAAB6AFAAAAAAekBQAAAAAEB1AIBAAAABAMiAACQBgAg0QIAAJEGACDXAgAAhAEAIAMiAACOBgAg0QIAAI8GACDXAgAAbAAgBCIAAMcEADDRAgAAyAQAMNMCAADKBAAg1wIAAMsEADAEIgAAvgQAMNECAAC_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_gEBAAAAAQIAAAAfACAiAACTBQAgAwAAAB8AICIAAJMFACAjAACSBQAgARsAAIsGADACAAAAHwAgGwAAkgUAIAIAAADvAwAgGwAAkQUAIAvhAQEAyAMAIegBQADMAwAh6QFAAMwDACH1AQEAyAMAIfYBAQDIAwAh-AEIANYDACH5AQEAyAMAIfsBAADXA_sBIvwBAQDKAwAh_QEBAMoDACH-AQEAygMAIQ0PAADYAwAgEAAA2QMAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfUBAQDIAwAh9gEBAMgDACH4AQgA1gMAIfkBAQDIAwAh-wEAANcD-wEi_AEBAMoDACH9AQEAygMAIf4BAQDKAwAhDQ8AANsDACAQAADcAwAg4QEBAAAAAegBQAAAAAHpAUAAAAAB9QEBAAAAAfYBAQAAAAH4AQgAAAAB-QEBAAAAAfsBAAAA-wEC_AEBAAAAAf0BAQAAAAH-AQEAAAABCOEBAQAAAAHoAUAAAAABxAIBAAAAAcUCAQAAAAHGAgEAAAABxwKAAAAAAcgCAQAAAAHJAgEAAAABAgAAADEAICIAAJ8FACADAAAAMQAgIgAAnwUAICMAAJ4FACABGwAAigYAMA0HAACvAwAg3gEAAK0DADDfAQAALwAQ4AEAAK0DADDhAQEAAAAB5gEBAJoDACHoAUAAkwMAIcQCAQCRAwAhxQIBAJEDACHGAgEAkQMAIccCAACuAwAgyAIBAJoDACHJAgEAmgMAIQIAAAAxACAbAACeBQAgAgAAAJwFACAbAACdBQAgDN4BAACbBQAw3wEAAJwFABDgAQAAmwUAMOEBAQCRAwAh5gEBAJoDACHoAUAAkwMAIcQCAQCRAwAhxQIBAJEDACHGAgEAkQMAIccCAACuAwAgyAIBAJoDACHJAgEAmgMAIQzeAQAAmwUAMN8BAACcBQAQ4AEAAJsFADDhAQEAkQMAIeYBAQCaAwAh6AFAAJMDACHEAgEAkQMAIcUCAQCRAwAhxgIBAJEDACHHAgAArgMAIMgCAQCaAwAhyQIBAJoDACEI4QEBAMgDACHoAUAAzAMAIcQCAQDIAwAhxQIBAMgDACHGAgEAyAMAIccCgAAAAAHIAgEAygMAIckCAQDKAwAhCOEBAQDIAwAh6AFAAMwDACHEAgEAyAMAIcUCAQDIAwAhxgIBAMgDACHHAoAAAAAByAIBAMoDACHJAgEAygMAIQjhAQEAAAAB6AFAAAAAAcQCAQAAAAHFAgEAAAABxgIBAAAAAccCgAAAAAHIAgEAAAAByQIBAAAAAQfhAQEAAAAB4wEBAAAAAegBQAAAAAGcAgEAAAABngIAAACeAgKfAiAAAAABoAKAAAAAAQIAAAAtACAiAACrBQAgAwAAAC0AICIAAKsFACAjAACqBQAgARsAAIkGADAMBwAAsgMAIN4BAACwAwAw3wEAACsAEOABAACwAwAw4QEBAAAAAeMBAQCRAwAh5gEBAJEDACHoAUAAkwMAIZwCAQCRAwAhngIAALEDngIinwIgAJQDACGgAgAArgMAIAIAAAAtACAbAACqBQAgAgAAAKgFACAbAACpBQAgC94BAACnBQAw3wEAAKgFABDgAQAApwUAMOEBAQCRAwAh4wEBAJEDACHmAQEAkQMAIegBQACTAwAhnAIBAJEDACGeAgAAsQOeAiKfAiAAlAMAIaACAACuAwAgC94BAACnBQAw3wEAAKgFABDgAQAApwUAMOEBAQCRAwAh4wEBAJEDACHmAQEAkQMAIegBQACTAwAhnAIBAJEDACGeAgAAsQOeAiKfAiAAlAMAIaACAACuAwAgB-EBAQDIAwAh4wEBAMgDACHoAUAAzAMAIZwCAQDIAwAhngIAALAEngIinwIgAMsDACGgAoAAAAABB-EBAQDIAwAh4wEBAMgDACHoAUAAzAMAIZwCAQDIAwAhngIAALAEngIinwIgAMsDACGgAoAAAAABB-EBAQAAAAHjAQEAAAAB6AFAAAAAAZwCAQAAAAGeAgAAAJ4CAp8CIAAAAAGgAoAAAAABCgwAAMIFACDhAQEAAAAB4wEBAAAAAegBQAAAAAHpAUAAAAABygIBAAAAAcsCAQAAAAHMAgEAAAABzQIBAAAAAc4CIAAAAAECAAAAAQAgIgAAwQUAIAMAAAABACAiAADBBQAgIwAAtgUAIAEbAACIBgAwDwcAALIDACAMAACXAwAg3gEAALwDADDfAQAAEQAQ4AEAALwDADDhAQEAAAAB4wEBAJEDACHmAQEAkQMAIegBQACTAwAh6QFAAJMDACHKAgEAkQMAIcsCAQCRAwAhzAIBAJEDACHNAgEAkQMAIc4CIACUAwAhAgAAAAEAIBsAALYFACACAAAAtAUAIBsAALUFACAN3gEAALMFADDfAQAAtAUAEOABAACzBQAw4QEBAJEDACHjAQEAkQMAIeYBAQCRAwAh6AFAAJMDACHpAUAAkwMAIcoCAQCRAwAhywIBAJEDACHMAgEAkQMAIc0CAQCRAwAhzgIgAJQDACEN3gEAALMFADDfAQAAtAUAEOABAACzBQAw4QEBAJEDACHjAQEAkQMAIeYBAQCRAwAh6AFAAJMDACHpAUAAkwMAIcoCAQCRAwAhywIBAJEDACHMAgEAkQMAIc0CAQCRAwAhzgIgAJQDACEJ4QEBAMgDACHjAQEAyAMAIegBQADMAwAh6QFAAMwDACHKAgEAyAMAIcsCAQDIAwAhzAIBAMgDACHNAgEAyAMAIc4CIADLAwAhCgwAALcFACDhAQEAyAMAIeMBAQDIAwAh6AFAAMwDACHpAUAAzAMAIcoCAQDIAwAhywIBAMgDACHMAgEAyAMAIc0CAQDIAwAhzgIgAMsDACELIgAAuAUAMCMAALwFADDRAgAAuQUAMNICAAC6BQAw0wIAALsFACDUAgAA4wQAMNUCAADjBAAw1gIAAOMEADDXAgAA4wQAMNgCAAC9BQAw2QIAAOYEADAUCgAApwQAIA0AAKkEACAOAACqBAAgEAAAqwQAIBEAAKwEACDhAQEAAAAB6AFAAAAAAekBQAAAAAH3AQEAAAAB-wEAAACQAgKKAggAAAABjAKAAAAAAY0CAQAAAAGOAggAAAABkAIIAAAAAZECCAAAAAGSAggAAAABkwIBAAAAAZQCAQAAAAGVAkAAAAABAgAAABcAICIAAMAFACADAAAAFwAgIgAAwAUAICMAAL8FACABGwAAhwYAMAIAAAAXACAbAAC_BQAgAgAAAOcEACAbAAC-BQAgD-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_BQAgIwAAggYAINECAACABgAg0gIAAIEGACDVAgAAMwAg1gIAADMAINcCAABsACADIgAA_wUAINECAACABgAg1wIAAGwAIAAAAAUiAAD6BQAgIwAA_QUAINECAAD7BQAg0gIAAPwFACDXAgAAbAAgAyIAAPoFACDRAgAA-wUAINcCAABsACALAwAA_gQAIAkAAOUFACAMAADsBAAgEQAA9gMAIBMAAOYFACAUAADnBQAgFQAA6AUAILoCAADCAwAgvQIAAMIDACDCAgAAwgMAIMMCAADCAwAgAw8AAPUDACARAAD2AwAgggIAAMIDACACBwAA8wUAIAwAAOwEACADDAAA7AQAILUCAADCAwAguAIAAMIDACAABwUAAPkFACAGAADzBQAgCQAA5QUAIBIAAPcFACClAgAAwgMAIKgCAADCAwAgrAIAAMIDACADAwAA_gQAIKMCAADCAwAgugIAAMIDACATAwAA3gUAIAkAAOAFACAMAADfBQAgEQAA5AUAIBQAAOIFACAVAADjBQAg4QEBAAAAAegBQAAAAAHpAUAAAAAB-wEAAADBAgKhAgEAAAABugIBAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb8CAAAAvwICwQIgAAAAAcICQAAAAAHDAkAAAAABAgAAAGwAICIAAPoFACADAAAAMwAgIgAA-gUAICMAAP4FACAVAAAAMwAgAwAAhAUAIAkAAIYFACAMAACFBQAgEQAAigUAIBQAAIgFACAVAACJBQAgGwAA_gUAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfsBAACDBcECIqECAQDIAwAhugIBAMoDACG7AgEAyAMAIbwCAQDIAwAhvQIBAMoDACG_AgAAggW_AiLBAiAAywMAIcICQACGBAAhwwJAAIYEACETAwAAhAUAIAkAAIYFACAMAACFBQAgEQAAigUAIBQAAIgFACAVAACJBQAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAh-wEAAIMFwQIioQIBAMgDACG6AgEAygMAIbsCAQDIAwAhvAIBAMgDACG9AgEAygMAIb8CAACCBb8CIsECIADLAwAhwgJAAIYEACHDAkAAhgQAIRMDAADeBQAgCQAA4AUAIAwAAN8FACARAADkBQAgEwAA4QUAIBQAAOIFACDhAQEAAAAB6AFAAAAAAekBQAAAAAH7AQAAAMECAqECAQAAAAG6AgEAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvwIAAAC_AgLBAiAAAAABwgJAAAAAAcMCQAAAAAECAAAAbAAgIgAA_wUAIAMAAAAzACAiAAD_BQAgIwAAgwYAIBUAAAAzACADAACEBQAgCQAAhgUAIAwAAIUFACARAACKBQAgEwAAhwUAIBQAAIgFACAbAACDBgAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAh-wEAAIMFwQIioQIBAMgDACG6AgEAygMAIbsCAQDIAwAhvAIBAMgDACG9AgEAygMAIb8CAACCBb8CIsECIADLAwAhwgJAAIYEACHDAkAAhgQAIRMDAACEBQAgCQAAhgUAIAwAAIUFACARAACKBQAgEwAAhwUAIBQAAIgFACDhAQEAyAMAIegBQADMAwAh6QFAAMwDACH7AQAAgwXBAiKhAgEAyAMAIboCAQDKAwAhuwIBAMgDACG8AgEAyAMAIb0CAQDKAwAhvwIAAIIFvwIiwQIgAMsDACHCAkAAhgQAIcMCQACGBAAhEOEBAQAAAAHoAUAAAAAB6QFAAAAAAaECAQAAAAGiAgEAAAABowIBAAAAAaQCCAAAAAGlAggAAAABpgICAAAAAacCAADTBAAgqAIBAAAAAakCIAAAAAGqAgIAAAABqwIgAAAAAawCAQAAAAGtAgEAAAABD-EBAQAAAAHoAUAAAAAB6QFAAAAAAfsBAAAAkAICigIIAAAAAYsCAQAAAAGMAoAAAAABjQIBAAAAAY4CCAAAAAGQAggAAAABkQIIAAAAAZICCAAAAAGTAgEAAAABlAIBAAAAAZUCQAAAAAEI4QEBAAAAAeIBAgAAAAHjAQEAAAAB5AEBAAAAAeUBIAAAAAHnAQEAAAAB6AFAAAAAAekBQAAAAAEP4QEBAAAAAegBQAAAAAHpAUAAAAAB9wEBAAAAAfsBAAAAkAICigIIAAAAAYwCgAAAAAGNAgEAAAABjgIIAAAAAZACCAAAAAGRAggAAAABkgIIAAAAAZMCAQAAAAGUAgEAAAABlQJAAAAAAQnhAQEAAAAB4wEBAAAAAegBQAAAAAHpAUAAAAABygIBAAAAAcsCAQAAAAHMAgEAAAABzQIBAAAAAc4CIAAAAAEH4QEBAAAAAeMBAQAAAAHoAUAAAAABnAIBAAAAAZ4CAAAAngICnwIgAAAAAaACgAAAAAEI4QEBAAAAAegBQAAAAAHEAgEAAAABxQIBAAAAAcYCAQAAAAHHAoAAAAAByAIBAAAAAckCAQAAAAEL4QEBAAAAAegBQAAAAAHpAUAAAAAB9QEBAAAAAfYBAQAAAAH4AQgAAAAB-QEBAAAAAfsBAAAA-wEC_AEBAAAAAf0BAQAAAAH-AQEAAAABEOEBAQAAAAHoAUAAAAAB6QFAAAAAAaECAQAAAAGiAgEAAAABowIBAAAAAaQCCAAAAAGlAggAAAABpgICAAAAAacCAADTBAAgqAIBAAAAAakCIAAAAAGqAgIAAAABqwIgAAAAAawCAQAAAAGuAgEAAAABD-EBAQAAAAHoAUAAAAAB6QFAAAAAAfcBAQAAAAH7AQAAAJACAooCCAAAAAGLAgEAAAABjAKAAAAAAY4CCAAAAAGQAggAAAABkQIIAAAAAZICCAAAAAGTAgEAAAABlAIBAAAAAZUCQAAAAAETCQAA4AUAIAwAAN8FACARAADkBQAgEwAA4QUAIBQAAOIFACAVAADjBQAg4QEBAAAAAegBQAAAAAHpAUAAAAAB-wEAAADBAgKhAgEAAAABugIBAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb8CAAAAvwICwQIgAAAAAcICQAAAAAHDAkAAAAABAgAAAGwAICIAAI4GACAG4QEBAAAAAegBQAAAAAHpAUAAAAABoQIBAAAAAaMCAQAAAAG6AgEAAAABAgAAAIQBACAiAACQBgAgCOEBAQAAAAHiAQIAAAAB4wEBAAAAAeQBAQAAAAHlASAAAAAB5gEBAAAAAegBQAAAAAHpAUAAAAABB-EBAQAAAAH1AQEAAAABhgIBAAAAAYcCAQAAAAGIAgIAAAABiQIIAAAAAYoCCAAAAAEDAAAAMwAgIgAAjgYAICMAAJYGACAVAAAAMwAgCQAAhgUAIAwAAIUFACARAACKBQAgEwAAhwUAIBQAAIgFACAVAACJBQAgGwAAlgYAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfsBAACDBcECIqECAQDIAwAhugIBAMoDACG7AgEAyAMAIbwCAQDIAwAhvQIBAMoDACG_AgAAggW_AiLBAiAAywMAIcICQACGBAAhwwJAAIYEACETCQAAhgUAIAwAAIUFACARAACKBQAgEwAAhwUAIBQAAIgFACAVAACJBQAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAh-wEAAIMFwQIioQIBAMgDACG6AgEAygMAIbsCAQDIAwAhvAIBAMgDACG9AgEAygMAIb8CAACCBb8CIsECIADLAwAhwgJAAIYEACHDAkAAhgQAIQMAAACHAQAgIgAAkAYAICMAAJkGACAIAAAAhwEAIBsAAJkGACDhAQEAyAMAIegBQADMAwAh6QFAAMwDACGhAgEAyAMAIaMCAQDKAwAhugIBAMoDACEG4QEBAMgDACHoAUAAzAMAIekBQADMAwAhoQIBAMgDACGjAgEAygMAIboCAQDKAwAhEwMAAN4FACAJAADgBQAgDAAA3wUAIBEAAOQFACATAADhBQAgFQAA4wUAIOEBAQAAAAHoAUAAAAAB6QFAAAAAAfsBAAAAwQICoQIBAAAAAboCAQAAAAG7AgEAAAABvAIBAAAAAb0CAQAAAAG_AgAAAL8CAsECIAAAAAHCAkAAAAABwwJAAAAAAQIAAABsACAiAACaBgAgAwAAADMAICIAAJoGACAjAACeBgAgFQAAADMAIAMAAIQFACAJAACGBQAgDAAAhQUAIBEAAIoFACATAACHBQAgFQAAiQUAIBsAAJ4GACDhAQEAyAMAIegBQADMAwAh6QFAAMwDACH7AQAAgwXBAiKhAgEAyAMAIboCAQDKAwAhuwIBAMgDACG8AgEAyAMAIb0CAQDKAwAhvwIAAIIFvwIiwQIgAMsDACHCAkAAhgQAIcMCQACGBAAhEwMAAIQFACAJAACGBQAgDAAAhQUAIBEAAIoFACATAACHBQAgFQAAiQUAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfsBAACDBcECIqECAQDIAwAhugIBAMoDACG7AgEAyAMAIbwCAQDIAwAhvQIBAMoDACG_AgAAggW_AiLBAiAAywMAIcICQACGBAAhwwJAAIYEACEM4QEBAAAAAegBQAAAAAHpAUAAAAABqwIgAAAAAbICAQAAAAGzAgEAAAABtAIIAAAAAbUCCAAAAAG2AkAAAAABtwJAAAAAAbgCAgAAAAG5AgIAAAABAgAAAJ0BACAiAACfBgAgCwcAAPIFACDhAQEAAAAB4wEBAAAAAeYBAQAAAAHoAUAAAAAB6QFAAAAAAcoCAQAAAAHLAgEAAAABzAIBAAAAAc0CAQAAAAHOAiAAAAABAgAAAAEAICIAAKEGACATAwAA3gUAIAkAAOAFACARAADkBQAgEwAA4QUAIBQAAOIFACAVAADjBQAg4QEBAAAAAegBQAAAAAHpAUAAAAAB-wEAAADBAgKhAgEAAAABugIBAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb8CAAAAvwICwQIgAAAAAcICQAAAAAHDAkAAAAABAgAAAGwAICIAAKMGACAH4QEBAAAAAecBAQAAAAGGAgEAAAABhwIBAAAAAYgCAgAAAAGJAggAAAABigIIAAAAAQvhAQEAAAAB6AFAAAAAAekBQAAAAAH2AQEAAAAB9wEBAAAAAfgBCAAAAAH5AQEAAAAB-wEAAAD7AQL8AQEAAAAB_QEBAAAAAf4BAQAAAAEDAAAAEwAgIgAAnwYAICMAAKkGACAOAAAAEwAgGwAAqQYAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIasCIADLAwAhsgIBAMgDACGzAgEAyAMAIbQCCADWAwAhtQIIALgEACG2AkAAzAMAIbcCQADMAwAhuAICAN0EACG5AgIAyQMAIQzhAQEAyAMAIegBQADMAwAh6QFAAMwDACGrAiAAywMAIbICAQDIAwAhswIBAMgDACG0AggA1gMAIbUCCAC4BAAhtgJAAMwDACG3AkAAzAMAIbgCAgDdBAAhuQICAMkDACEDAAAAEQAgIgAAoQYAICMAAKwGACANAAAAEQAgBwAA8QUAIBsAAKwGACDhAQEAyAMAIeMBAQDIAwAh5gEBAMgDACHoAUAAzAMAIekBQADMAwAhygIBAMgDACHLAgEAyAMAIcwCAQDIAwAhzQIBAMgDACHOAiAAywMAIQsHAADxBQAg4QEBAMgDACHjAQEAyAMAIeYBAQDIAwAh6AFAAMwDACHpAUAAzAMAIcoCAQDIAwAhywIBAMgDACHMAgEAyAMAIc0CAQDIAwAhzgIgAMsDACEDAAAAMwAgIgAAowYAICMAAK8GACAVAAAAMwAgAwAAhAUAIAkAAIYFACARAACKBQAgEwAAhwUAIBQAAIgFACAVAACJBQAgGwAArwYAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfsBAACDBcECIqECAQDIAwAhugIBAMoDACG7AgEAyAMAIbwCAQDIAwAhvQIBAMoDACG_AgAAggW_AiLBAiAAywMAIcICQACGBAAhwwJAAIYEACETAwAAhAUAIAkAAIYFACARAACKBQAgEwAAhwUAIBQAAIgFACAVAACJBQAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAh-wEAAIMFwQIioQIBAMgDACG6AgEAygMAIbsCAQDIAwAhvAIBAMgDACG9AgEAygMAIb8CAACCBb8CIsECIADLAwAhwgJAAIYEACHDAkAAhgQAIRQFAADUBAAgBgAA1QQAIAkAANYEACDhAQEAAAAB6AFAAAAAAekBQAAAAAGhAgEAAAABogIBAAAAAaMCAQAAAAGkAggAAAABpQIIAAAAAaYCAgAAAAGnAgAA0wQAIKgCAQAAAAGpAiAAAAABqgICAAAAAasCIAAAAAGsAgEAAAABrQIBAAAAAa4CAQAAAAECAAAABQAgIgAAsAYAIBUKAACnBAAgCwAAqAQAIA0AAKkEACAQAACrBAAgEQAArAQAIOEBAQAAAAHoAUAAAAAB6QFAAAAAAfcBAQAAAAH7AQAAAJACAooCCAAAAAGLAgEAAAABjAKAAAAAAY0CAQAAAAGOAggAAAABkAIIAAAAAZECCAAAAAGSAggAAAABkwIBAAAAAZQCAQAAAAGVAkAAAAABAgAAABcAICIAALIGACADAAAAAwAgIgAAsAYAICMAALYGACAWAAAAAwAgBQAAugQAIAYAALsEACAJAAC8BAAgGwAAtgYAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIaECAQDIAwAhogIBAMgDACGjAgEAyAMAIaQCCADWAwAhpQIIALgEACGmAgIAyQMAIacCAAC5BAAgqAIBAMoDACGpAiAAywMAIaoCAgDJAwAhqwIgAMsDACGsAgEAygMAIa0CAQDIAwAhrgIBAMgDACEUBQAAugQAIAYAALsEACAJAAC8BAAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAhoQIBAMgDACGiAgEAyAMAIaMCAQDIAwAhpAIIANYDACGlAggAuAQAIaYCAgDJAwAhpwIAALkEACCoAgEAygMAIakCIADLAwAhqgICAMkDACGrAiAAywMAIawCAQDKAwAhrQIBAMgDACGuAgEAyAMAIQMAAAAVACAiAACyBgAgIwAAuQYAIBcAAAAVACAKAACHBAAgCwAAiAQAIA0AAIkEACAQAACLBAAgEQAAjAQAIBsAALkGACDhAQEAyAMAIegBQADMAwAh6QFAAMwDACH3AQEAyAMAIfsBAACFBJACIooCCADWAwAhiwIBAMoDACGMAoAAAAABjQIBAMoDACGOAggA1gMAIZACCADWAwAhkQIIANYDACGSAggA1gMAIZMCAQDKAwAhlAIBAMoDACGVAkAAhgQAIRUKAACHBAAgCwAAiAQAIA0AAIkEACAQAACLBAAgEQAAjAQAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfcBAQDIAwAh-wEAAIUEkAIiigIIANYDACGLAgEAygMAIYwCgAAAAAGNAgEAygMAIY4CCADWAwAhkAIIANYDACGRAggA1gMAIZICCADWAwAhkwIBAMoDACGUAgEAygMAIZUCQACGBAAhFQoAAKcEACALAACoBAAgDQAAqQQAIA4AAKoEACARAACsBAAg4QEBAAAAAegBQAAAAAHpAUAAAAAB9wEBAAAAAfsBAAAAkAICigIIAAAAAYsCAQAAAAGMAoAAAAABjQIBAAAAAY4CCAAAAAGQAggAAAABkQIIAAAAAZICCAAAAAGTAgEAAAABlAIBAAAAAZUCQAAAAAECAAAAFwAgIgAAugYAIAvhAQEAAAAB6AFAAAAAAekBQAAAAAH1AQEAAAAB9wEBAAAAAfgBCAAAAAH5AQEAAAAB-wEAAAD7AQL8AQEAAAAB_QEBAAAAAf4BAQAAAAEDAAAAFQAgIgAAugYAICMAAL8GACAXAAAAFQAgCgAAhwQAIAsAAIgEACANAACJBAAgDgAAigQAIBEAAIwEACAbAAC_BgAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAh9wEBAMgDACH7AQAAhQSQAiKKAggA1gMAIYsCAQDKAwAhjAKAAAAAAY0CAQDKAwAhjgIIANYDACGQAggA1gMAIZECCADWAwAhkgIIANYDACGTAgEAygMAIZQCAQDKAwAhlQJAAIYEACEVCgAAhwQAIAsAAIgEACANAACJBAAgDgAAigQAIBEAAIwEACDhAQEAyAMAIegBQADMAwAh6QFAAMwDACH3AQEAyAMAIfsBAACFBJACIooCCADWAwAhiwIBAMoDACGMAoAAAAABjQIBAMoDACGOAggA1gMAIZACCADWAwAhkQIIANYDACGSAggA1gMAIZMCAQDKAwAhlAIBAMoDACGVAkAAhgQAIRMDAADeBQAgCQAA4AUAIAwAAN8FACATAADhBQAgFAAA4gUAIBUAAOMFACDhAQEAAAAB6AFAAAAAAekBQAAAAAH7AQAAAMECAqECAQAAAAG6AgEAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvwIAAAC_AgLBAiAAAAABwgJAAAAAAcMCQAAAAAECAAAAbAAgIgAAwAYAIAcPAADzAwAg4QEBAAAAAfUBAQAAAAH4AQgAAAAB-wEAAACCAgKAAgAAAIACAoICAQAAAAECAAAAkQIAICIAAMIGACAVCgAApwQAIAsAAKgEACANAACpBAAgDgAAqgQAIBAAAKsEACDhAQEAAAAB6AFAAAAAAekBQAAAAAH3AQEAAAAB-wEAAACQAgKKAggAAAABiwIBAAAAAYwCgAAAAAGNAgEAAAABjgIIAAAAAZACCAAAAAGRAggAAAABkgIIAAAAAZMCAQAAAAGUAgEAAAABlQJAAAAAAQIAAAAXACAiAADEBgAgAwAAADMAICIAAMAGACAjAADIBgAgFQAAADMAIAMAAIQFACAJAACGBQAgDAAAhQUAIBMAAIcFACAUAACIBQAgFQAAiQUAIBsAAMgGACDhAQEAyAMAIegBQADMAwAh6QFAAMwDACH7AQAAgwXBAiKhAgEAyAMAIboCAQDKAwAhuwIBAMgDACG8AgEAyAMAIb0CAQDKAwAhvwIAAIIFvwIiwQIgAMsDACHCAkAAhgQAIcMCQACGBAAhEwMAAIQFACAJAACGBQAgDAAAhQUAIBMAAIcFACAUAACIBQAgFQAAiQUAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfsBAACDBcECIqECAQDIAwAhugIBAMoDACG7AgEAyAMAIbwCAQDIAwAhvQIBAMoDACG_AgAAggW_AiLBAiAAywMAIcICQACGBAAhwwJAAIYEACEDAAAAGwAgIgAAwgYAICMAAMsGACAJAAAAGwAgDwAA5QMAIBsAAMsGACDhAQEAyAMAIfUBAQDIAwAh-AEIANYDACH7AQAA5AOCAiKAAgAA4wOAAiKCAgEAygMAIQcPAADlAwAg4QEBAMgDACH1AQEAyAMAIfgBCADWAwAh-wEAAOQDggIigAIAAOMDgAIiggIBAMoDACEDAAAAFQAgIgAAxAYAICMAAM4GACAXAAAAFQAgCgAAhwQAIAsAAIgEACANAACJBAAgDgAAigQAIBAAAIsEACAbAADOBgAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAh9wEBAMgDACH7AQAAhQSQAiKKAggA1gMAIYsCAQDKAwAhjAKAAAAAAY0CAQDKAwAhjgIIANYDACGQAggA1gMAIZECCADWAwAhkgIIANYDACGTAgEAygMAIZQCAQDKAwAhlQJAAIYEACEVCgAAhwQAIAsAAIgEACANAACJBAAgDgAAigQAIBAAAIsEACDhAQEAyAMAIegBQADMAwAh6QFAAMwDACH3AQEAyAMAIfsBAACFBJACIooCCADWAwAhiwIBAMoDACGMAoAAAAABjQIBAMoDACGOAggA1gMAIZACCADWAwAhkQIIANYDACGSAggA1gMAIZMCAQDKAwAhlAIBAMoDACGVAkAAhgQAIRQFAADUBAAgBgAA1QQAIBIAANcEACDhAQEAAAAB6AFAAAAAAekBQAAAAAGhAgEAAAABogIBAAAAAaMCAQAAAAGkAggAAAABpQIIAAAAAaYCAgAAAAGnAgAA0wQAIKgCAQAAAAGpAiAAAAABqgICAAAAAasCIAAAAAGsAgEAAAABrQIBAAAAAa4CAQAAAAECAAAABQAgIgAAzwYAIBMDAADeBQAgDAAA3wUAIBEAAOQFACATAADhBQAgFAAA4gUAIBUAAOMFACDhAQEAAAAB6AFAAAAAAekBQAAAAAH7AQAAAMECAqECAQAAAAG6AgEAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvwIAAAC_AgLBAiAAAAABwgJAAAAAAcMCQAAAAAECAAAAbAAgIgAA0QYAIAMAAAADACAiAADPBgAgIwAA1QYAIBYAAAADACAFAAC6BAAgBgAAuwQAIBIAAL0EACAbAADVBgAg4QEBAMgDACHoAUAAzAMAIekBQADMAwAhoQIBAMgDACGiAgEAyAMAIaMCAQDIAwAhpAIIANYDACGlAggAuAQAIaYCAgDJAwAhpwIAALkEACCoAgEAygMAIakCIADLAwAhqgICAMkDACGrAiAAywMAIawCAQDKAwAhrQIBAMgDACGuAgEAyAMAIRQFAAC6BAAgBgAAuwQAIBIAAL0EACDhAQEAyAMAIegBQADMAwAh6QFAAMwDACGhAgEAyAMAIaICAQDIAwAhowIBAMgDACGkAggA1gMAIaUCCAC4BAAhpgICAMkDACGnAgAAuQQAIKgCAQDKAwAhqQIgAMsDACGqAgIAyQMAIasCIADLAwAhrAIBAMoDACGtAgEAyAMAIa4CAQDIAwAhAwAAADMAICIAANEGACAjAADYBgAgFQAAADMAIAMAAIQFACAMAACFBQAgEQAAigUAIBMAAIcFACAUAACIBQAgFQAAiQUAIBsAANgGACDhAQEAyAMAIegBQADMAwAh6QFAAMwDACH7AQAAgwXBAiKhAgEAyAMAIboCAQDKAwAhuwIBAMgDACG8AgEAyAMAIb0CAQDKAwAhvwIAAIIFvwIiwQIgAMsDACHCAkAAhgQAIcMCQACGBAAhEwMAAIQFACAMAACFBQAgEQAAigUAIBMAAIcFACAUAACIBQAgFQAAiQUAIOEBAQDIAwAh6AFAAMwDACHpAUAAzAMAIfsBAACDBcECIqECAQDIAwAhugIBAMoDACG7AgEAyAMAIbwCAQDIAwAhvQIBAMoDACG_AgAAggW_AiLBAiAAywMAIcICQACGBAAhwwJAAIYEACEDBAATBwACDD0ICAMGAwQAEgkoBgwnCBE1DBMqARQuEBUyEQUEAA8FAAQGAAIJDAYSEAcCAwcDBAAFAQMIAAIHAAIIAAMCCAADDwAIBwQADgoAAgsSAQ0UCQ4aBxAcCxEiDAIEAAoMGAgBDBkAAwQADQ8ACBEgDAMKAAIPAAgQAAsBESEAAg4jABEkAAIJJQASJgABBwACAQc0AgcDNgAJOAAMNwARPAATOQAUOgAVOwABDD4AAAEHAAIBBwACAwQAGCgAGSkAGgAAAAMEABgoABkpABoBB14CAQdkAgMEAB8oACApACEAAAADBAAfKAAgKQAhAAADBAAmKAAnKQAoAAAAAwQAJigAJykAKAAAAwQALSgALikALwAAAAMEAC0oAC4pAC8AAAUEADQoADcpADhqADVrADYAAAAAAAUEADQoADcpADhqADVrADYCBQAEBgACAgUABAYAAgUEAD0oAEApAEFqAD5rAD8AAAAAAAUEAD0oAEApAEFqAD5rAD8BBwACAQcAAgMEAEYoAEcpAEgAAAADBABGKABHKQBIAwoAAgvrAQEN7AEJAwoAAgvyAQEN8wEJBQQATSgAUCkAUWoATmsATwAAAAAABQQATSgAUCkAUWoATmsATwIIAAMPAAgCCAADDwAIBQQAVigAWSkAWmoAV2sAWAAAAAAABQQAVigAWSkAWmoAV2sAWAEPAAgBDwAIBQQAXygAYikAY2oAYGsAYQAAAAAABQQAXygAYikAY2oAYGsAYQMKAAIPAAgQAAsDCgACDwAIEAALBQQAaCgAaykAbGoAaWsAagAAAAAABQQAaCgAaykAbGoAaWsAagIHAAIIAAMCBwACCAADBQQAcSgAdCkAdWoAcmsAcwAAAAAABQQAcSgAdCkAdWoAcmsAcxYCARc_ARhAARlBARpCARxEAR1GFB5HFR9JASBLFCFMFiRNASVOASZPFCpSFytTGyxUES1VES5WES9XETBYETFaETJcFDNdHDRgETViFDZjHTdlEThmETlnFDpqHjtrIjxtAj1uAj5wAj9xAkByAkF0AkJ2FEN3I0R5AkV7FEZ8JEd9Akh-Akl_FEqCASVLgwEpTIUBBE2GAQROiQEET4oBBFCLAQRRjQEEUo8BFFOQASpUkgEEVZQBFFaVAStXlgEEWJcBBFmYARRamwEsW5wBMFyeAQldnwEJXqEBCV-iAQlgowEJYaUBCWKnARRjqAExZKoBCWWsARRmrQEyZ64BCWivAQlpsAEUbLMBM220ATlutQEDb7YBA3C3AQNxuAEDcrkBA3O7AQN0vQEUdb4BOnbAAQN3wgEUeMMBO3nEAQN6xQEDe8YBFHzJATx9ygFCfssBEH_MARCAAc0BEIEBzgEQggHPARCDAdEBEIQB0wEUhQHUAUOGAdYBEIcB2AEUiAHZAUSJAdoBEIoB2wEQiwHcARSMAd8BRY0B4AFJjgHhAQiPAeIBCJAB4wEIkQHkAQiSAeUBCJMB5wEIlAHpARSVAeoBSpYB7gEIlwHwARSYAfEBS5kB9AEImgH1AQibAfYBFJwB-QFMnQH6AVKeAfsBB58B_AEHoAH9AQehAf4BB6IB_wEHowGBAgekAYMCFKUBhAJTpgGGAgenAYgCFKgBiQJUqQGKAgeqAYsCB6sBjAIUrAGPAlWtAZACW64BkgILrwGTAguwAZUCC7EBlgILsgGXAguzAZkCC7QBmwIUtQGcAly2AZ4CC7cBoAIUuAGhAl25AaICC7oBowILuwGkAhS8AacCXr0BqAJkvgGpAgy_AaoCDMABqwIMwQGsAgzCAa0CDMMBrwIMxAGxAhTFAbICZcYBtAIMxwG2AhTIAbcCZskBuAIMygG5AgzLAboCFMwBvQJnzQG-Am3OAb8CBs8BwAIG0AHBAgbRAcICBtIBwwIG0wHFAgbUAccCFNUByAJu1gHKAgbXAcwCFNgBzQJv2QHOAgbaAc8CBtsB0AIU3AHTAnDdAdQCdg"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  CHEF: "CHEF",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED",
  SUSPENDED: "SUSPENDED"
};
var OrderStatus = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  INITIATED: "INITIATED",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED"
};
var PaymentMethod = {
  STRIPE: "STRIPE",
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
  BANK_TRANSFER: "BANK_TRANSFER"
};
var NotificationType = {
  ORDER_UPDATE: "ORDER_UPDATE",
  PAYMENT_UPDATE: "PAYMENT_UPDATE",
  SYSTEM: "SYSTEM",
  PROMOTION: "PROMOTION",
  ACCOUNT_STATUS: "ACCOUNT_STATUS",
  ORDER_PLACED: "ORDER_PLACED",
  ORDER_STATUS_UPDATED: "ORDER_STATUS_UPDATED",
  REFUND_REQUESTED: "REFUND_REQUESTED",
  REFUND_APPROVED: "REFUND_APPROVED",
  REFUND_REJECTED: "REFUND_REJECTED",
  REFUND_PROCESSED: "REFUND_PROCESSED"
};
var RefundStatus = {
  REQUESTED: "REQUESTED",
  CHEF_APPROVED: "CHEF_APPROVED",
  CHEF_REJECTED: "CHEF_REJECTED",
  ADMIN_APPROVED: "ADMIN_APPROVED",
  ADMIN_REJECTED: "ADMIN_REJECTED",
  PROCESSED: "PROCESSED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var globalForPrisma = global;
var connectionString = `${envVars.DATABASE_URL}`;
var pool = globalForPrisma.pool || new Pool({
  connectionString,
  max: 10,
  // Stay within Neon's limits
  idleTimeoutMillis: 3e4
});
var adapter = new PrismaPg(pool);
var prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var JWT_SECRET = envVars.JWT_SECRET || "supersecret";
var signUpUser = async (payload) => {
  const { name, email, password, role, image } = payload;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already exists");
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role === "CHEF" ? "CHEF" : "CUSTOMER",
      image
    }
  });
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email, status: user.status },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};
var signInUser = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  if (user.status === "BANNED") {
    throw new Error("Your account has been banned");
  }
  if (user.status === "SUSPENDED") {
    throw new Error("Your account is suspended. Contact support");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: /* @__PURE__ */ new Date() }
  });
  const token = jwt.sign(
    { id: updatedUser.id, role: updatedUser.role, email: updatedUser.email, status: updatedUser.status },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  const { password: _, ...safeUser } = updatedUser;
  return { user: safeUser, token };
};
var authService = { signUpUser, signInUser };

// src/utils/sendResponse.ts
var sendResponse = (res, payload) => {
  const { statusCode, success, message, meta, data } = payload;
  return res.status(statusCode).json({
    success,
    message,
    meta: meta || data?.meta || null,
    data: data?.data || data || null
  });
};
var sendResponse_default = sendResponse;

// src/modules/auth/auth.controller.ts
import status2 from "http-status";
var signUpUser2 = async (req, res, next) => {
  try {
    const result = await authService.signUpUser(req.body);
    sendResponse_default(res, {
      statusCode: status2.CREATED,
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var signInUser2 = async (req, res, next) => {
  try {
    const result = await authService.signInUser(req.body);
    sendResponse_default(res, {
      statusCode: status2.OK,
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var authController = { signUpUser: signUpUser2, signInUser: signInUser2 };

// src/modules/auth/auth.route.ts
var router = express.Router();
router.post("/register", authController.signUpUser);
router.post("/login", authController.signInUser);
var authRouter = router;

// src/modules/menuItem/menuItem.route.ts
import { Router as Router2 } from "express";

// src/modules/menuItem/menuItem.controller.ts
import status3 from "http-status";

// src/utils/QueryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10
    };
    this.countQuery = {
      where: {}
    };
  }
  model;
  queryParams;
  config;
  query;
  countQuery;
  page = 1;
  limit = 10;
  skip = 0;
  sortBy = "createdAt";
  sortOrder = "desc";
  selectFields;
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  [nestedField]: stringFilter2
                }
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  some: {
                    [nestedRelation]: {
                      [nestedField]: stringFilter2
                    }
                  }
                }
              };
            }
          }
          const stringFilter = {
            contains: searchTerm,
            mode: "insensitive"
          };
          return {
            [field]: stringFilter
          };
        }
      );
      const whereConditions = this.query.where;
      whereConditions.OR = searchConditions;
      const countWhereConditions = this.countQuery.where;
      countWhereConditions.OR = searchConditions;
    }
    return this;
  }
  // /doctors?searchTerm=john&page=1&sortBy=name&specialty=cardiology&appointmentFee[lt]=100 => {}
  // { specialty: 'cardiology', appointmentFee: { lt: '100' } }
  filter() {
    const { filterableFields } = this.config;
    const excludedField = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "include"];
    const filterParams = {};
    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where;
    const countQueryWhere = this.countQuery.where;
    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (value === void 0 || value === "") {
        return;
      }
      const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (key.includes(".")) {
        const parts = key.split(".");
        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }
        if (parts.length === 2) {
          const [relation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {
              some: {}
            };
            countQueryWhere[relation] = {
              some: {}
            };
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          if (!queryRelation.some) {
            queryRelation.some = {};
          }
          if (!countRelation.some) {
            countRelation.some = {};
          }
          const querySome = queryRelation.some;
          const countSome = countRelation.some;
          if (!querySome[nestedRelation]) {
            querySome[nestedRelation] = {};
          }
          if (!countSome[nestedRelation]) {
            countSome[nestedRelation] = {};
          }
          const queryNestedRelation = querySome[nestedRelation];
          const countNestedRelation = countSome[nestedRelation];
          queryNestedRelation[nestedField] = this.parseFilterValue(value);
          countNestedRelation[nestedField] = this.parseFilterValue(value);
          return;
        }
      }
      if (!isAllowedField) {
        return;
      }
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        queryWhere[key] = this.parseRangeFilter(value);
        countQueryWhere[key] = this.parseRangeFilter(value);
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });
    return this;
  }
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        const [relation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedField]: sortOrder
          }
        };
      } else if (parts.length === 3) {
        const [relation, nestedRelation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedRelation]: {
              [nestedField]: sortOrder
            }
          }
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder
        };
      }
    } else {
      this.query.orderBy = {
        [sortBy]: sortOrder
      };
    }
    return this;
  }
  fields() {
    const fieldsParam = this.queryParams.fields;
    if (fieldsParam && typeof fieldsParam === "string") {
      const fieldsArray = fieldsParam?.split(",").map((field) => field.trim());
      this.selectFields = {};
      fieldsArray?.forEach((field) => {
        if (this.selectFields) {
          this.selectFields[field] = true;
        }
      });
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }
  include(relation) {
    if (this.selectFields) {
      return this;
    }
    this.query.include = { ...this.query.include, ...relation };
    return this;
  }
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields) {
      return this;
    }
    const result = {};
    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });
    const includeParam = this.queryParams.include;
    if (includeParam && typeof includeParam === "string") {
      const requestedRelations = includeParam.split(",").map((relation) => relation.trim());
      requestedRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }
    this.query.include = { ...this.query.include, ...result };
    return this;
  }
  selectFixed(select) {
    this.selectFields = select;
    this.query.select = select;
    delete this.query.include;
    return this;
  }
  where(condition) {
    this.query.where = this.deepMerge(this.query.where, condition);
    this.countQuery.where = this.deepMerge(this.countQuery.where, condition);
    return this;
  }
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(this.countQuery),
      this.model.findMany(this.query)
    ]);
    const totalPages = Math.ceil(total / this.limit);
    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages
      }
    };
  }
  async count() {
    return await this.model.count(this.countQuery);
  }
  getQuery() {
    return this.query;
  }
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }
    return value;
  }
  parseRangeFilter(value) {
    const rangeQuery = {};
    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];
      const parsedValue = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
};

// src/modules/menuItem/menuItem.service.ts
var ACTIVE_ORDER_STATUSES = [
  OrderStatus.PLACED,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED
];
var createMenuItem = async (chefId, payload) => {
  const slug = payload.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  return prisma.menuItem.create({
    data: { ...payload, chefId, slug }
  });
};
var updateMenuItem = async (id, chefId, payload) => {
  const menuItem = await prisma.menuItem.findFirst({ where: { id, chefId } });
  if (!menuItem) throw new Error("Menu item not found or unauthorized");
  return prisma.menuItem.update({ where: { id }, data: payload });
};
var deleteMenuItem = async (id, chefId) => {
  const menuItem = await prisma.menuItem.findFirst({
    where: { id, chefId },
    select: { id: true, name: true, isActive: true, stock: true }
  });
  if (!menuItem) throw new Error("Menu item not found or unauthorized");
  if (!menuItem.isActive) throw new Error("Menu item is already inactive");
  const activeOrderItem = await prisma.orderItem.findFirst({
    where: {
      menuItemId: id,
      order: {
        status: { in: ACTIVE_ORDER_STATUSES }
      }
    },
    select: {
      orderId: true,
      order: { select: { status: true } }
    }
  });
  if (activeOrderItem) {
    throw new Error(
      `Cannot delete "${menuItem.name}" \u2014 it is part of an active order (status: ${activeOrderItem.order.status}). Wait until all orders are delivered or cancelled.`
    );
  }
  return prisma.menuItem.update({
    where: { id },
    data: { isActive: false, stock: 0 }
  });
};
var getChefMenuItems = async (chefId, query = {}) => {
  const qb = new QueryBuilder(prisma.menuItem, query, {
    searchableFields: ["name", "description", "ingredients"],
    filterableFields: ["categoryId", "price", "stock", "isVegetarian", "spicyLevel"]
  });
  return qb.where({ chefId }).include({ category: true }).sort().paginate().execute();
};
var getAllMenuItems = async (query = {}) => {
  const qb = new QueryBuilder(prisma.menuItem, query, {
    searchableFields: ["name", "description", "ingredients"],
    filterableFields: ["categoryId", "isVegetarian", "spicyLevel"]
  });
  const result = await qb.search().filter().where({ isActive: true }).include({
    category: true,
    chef: { select: { id: true, name: true } }
  }).sort().paginate().execute();
  return result;
};
var getMenuItemById = async (id) => {
  const menuItem = await prisma.menuItem.findFirst({
    where: { id, isActive: true },
    include: {
      category: true,
      chef: { select: { id: true, name: true, phone: true } },
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10
      }
    }
  });
  if (!menuItem) throw new Error("Menu item not found");
  return menuItem;
};
var menuItemService = {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getChefMenuItems,
  getAllMenuItems,
  getMenuItemById
};

// src/modules/menuItem/menuItem.controller.ts
var createMenuItem2 = async (req, res, next) => {
  try {
    const result = await menuItemService.createMenuItem(req.user.id, req.body);
    sendResponse_default(res, { statusCode: status3.CREATED, success: true, message: "Menu item created", data: result });
  } catch (e) {
    next(e);
  }
};
var updateMenuItem2 = async (req, res, next) => {
  try {
    const result = await menuItemService.updateMenuItem(req.params.id, req.user.id, req.body);
    sendResponse_default(res, { statusCode: status3.OK, success: true, message: "Menu item updated", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteMenuItem2 = async (req, res, next) => {
  try {
    await menuItemService.deleteMenuItem(req.params.id, req.user.id);
    sendResponse_default(res, { statusCode: status3.OK, success: true, message: "Menu item deleted", data: null });
  } catch (e) {
    next(e);
  }
};
var getChefMenuItems2 = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await menuItemService.getChefMenuItems(req.user.id, query);
    sendResponse_default(res, { statusCode: status3.OK, success: true, message: "Chef menu items fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllMenuItems2 = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await menuItemService.getAllMenuItems(query);
    sendResponse_default(res, { statusCode: status3.OK, success: true, message: "Menu items fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getMenuItemById2 = async (req, res, next) => {
  try {
    const result = await menuItemService.getMenuItemById(req.params.id);
    sendResponse_default(res, { statusCode: status3.OK, success: true, message: "Menu item fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var menuItemController = {
  createMenuItem: createMenuItem2,
  updateMenuItem: updateMenuItem2,
  deleteMenuItem: deleteMenuItem2,
  getChefMenuItems: getChefMenuItems2,
  getAllMenuItems: getAllMenuItems2,
  getMenuItemById: getMenuItemById2
};

// src/middlewares/auth.ts
import jwt2 from "jsonwebtoken";
import status4 from "http-status";
var auth = (...allowedRoles) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(status4.UNAUTHORIZED).json({
        success: false,
        message: "Not logged in"
      });
    }
    try {
      const decoded = jwt2.verify(token, envVars.JWT_SECRET);
      if (decoded.status === UserStatus.BANNED) {
        return res.status(status4.FORBIDDEN).json({
          success: false,
          message: "Your account has been banned"
        });
      }
      req.user = decoded;
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(status4.FORBIDDEN).json({
          success: false,
          message: "You are not authorized"
        });
      }
      next();
    } catch {
      return res.status(status4.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token"
      });
    }
  };
};

// src/modules/menuItem/menuItem.route.ts
var router2 = Router2();
router2.post("/chef", auth(Role.CHEF), menuItemController.createMenuItem);
router2.put("/chef/:id", auth(Role.CHEF), menuItemController.updateMenuItem);
router2.delete("/chef/:id", auth(Role.CHEF), menuItemController.deleteMenuItem);
router2.get("/chef", auth(Role.CHEF), menuItemController.getChefMenuItems);
router2.get("/", menuItemController.getAllMenuItems);
router2.get("/:id", menuItemController.getMenuItemById);
var menuItemRouter = router2;

// src/modules/category/category.route.ts
import { Router as Router3 } from "express";

// src/modules/category/category.controller.ts
import status5 from "http-status";

// src/modules/category/category.service.ts
var createCategory = async (payload) => {
  return prisma.category.create({
    data: payload
  });
};
var getAllCategories = async (query) => {
  const categoryQuery = new QueryBuilder(prisma.category, query).search().filter().sort().paginate();
  const result = await categoryQuery.execute();
  return result;
};
var getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });
  if (!category) throw new Error("Category not found");
  return category;
};
var updateCategory = async (id, payload) => {
  return prisma.category.update({
    where: { id },
    data: payload
  });
};
var deleteCategory = async (id) => {
  const hasItems = await prisma.menuItem.findFirst({
    where: { categoryId: id }
  });
  if (hasItems) throw new Error("Cannot delete category with associated menu items");
  return prisma.category.delete({
    where: { id }
  });
};
var categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body);
    sendResponse_default(res, { statusCode: status5.CREATED, success: true, message: "Category created", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const result = await categoryService.getAllCategories(req.query);
    sendResponse_default(res, { statusCode: status5.OK, success: true, message: "Categories fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getCategoryById2 = async (req, res, next) => {
  try {
    const result = await categoryService.getCategoryById(req.params.id);
    sendResponse_default(res, { statusCode: status5.OK, success: true, message: "Category fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.updateCategory(req.params.id, req.body);
    sendResponse_default(res, { statusCode: status5.OK, success: true, message: "Category updated", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    sendResponse_default(res, { statusCode: status5.OK, success: true, message: "Category deleted", data: null });
  } catch (e) {
    next(e);
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.route.ts
var router3 = Router3();
router3.get("/", categoryController.getAllCategories);
router3.get("/:id", categoryController.getCategoryById);
router3.post("/", auth(Role.ADMIN), categoryController.createCategory);
router3.put("/:id", auth(Role.ADMIN), categoryController.updateCategory);
router3.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);
var categoryRouter = router3;

// src/modules/order/order.route.ts
import { Router as Router4 } from "express";

// src/modules/order/order.controller.ts
import status6 from "http-status";

// src/modules/audit/audit.service.ts
var log = async (payload) => {
  return prisma.auditLog.create({
    data: {
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      userId: payload.userId ?? null,
      details: payload.details ?? null,
      ipAddress: payload.ipAddress ?? null,
      userAgent: payload.userAgent ?? null
    }
  });
};
var getAuditLogs = async (query) => {
  const qb = new QueryBuilder(prisma.auditLog, query, {
    searchableFields: ["action", "entityType", "entityId"],
    filterableFields: ["userId", "entityType", "action"]
  });
  return qb.search().filter().include({
    user: {
      select: { id: true, name: true, email: true, role: true }
    }
  }).sort().paginate().execute();
};
var auditService = { log, getAuditLogs };

// src/modules/notification/notification.service.ts
var getMyNotifications = async (userId, query) => {
  const notificationQuery = new QueryBuilder(prisma.notification, query).search().filter().sort().paginate();
  return notificationQuery.where({ userId }).execute();
};
var markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
};
var getUnreadCount = async (userId) => {
  return prisma.notification.count({
    where: { userId, isRead: false }
  });
};
var createNotification = async (payload) => {
  return prisma.notification.create({
    data: {
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      meta: payload.meta ?? null
    }
  });
};
var markAsRead = async (id, userId) => {
  return prisma.notification.update({ where: { id, userId }, data: { isRead: true } });
};
var notificationService = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createNotification
};

// src/modules/order/order.service.ts
var placeOrder = async (customerId, payload, auditMeta) => {
  const order = await prisma.$transaction(
    async (tx) => {
      let subtotal = 0;
      let deliveryFee = 5;
      let couponDiscount = 0;
      const orderItems = [];
      const itemIds = payload.items.map((i) => i.menuItemId);
      const menuItems = await tx.menuItem.findMany({
        where: { id: { in: itemIds } }
      });
      const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));
      for (const item of payload.items) {
        const menuItem = menuItemMap.get(item.menuItemId);
        if (!menuItem || !menuItem.isActive) {
          throw new Error(`Menu item ${item.menuItemId} is unavailable`);
        }
        if (menuItem.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${menuItem.name}`);
        }
        const unitPrice = menuItem.discountPrice || menuItem.price;
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;
        await tx.menuItem.update({
          where: { id: item.menuItemId },
          data: { stock: { decrement: item.quantity } }
        });
        orderItems.push({
          menuItemId: item.menuItemId,
          menuItemName: menuItem.name,
          menuItemImage: menuItem.images[0] || null,
          quantity: item.quantity,
          unitPrice,
          totalPrice
        });
      }
      if (payload.couponId) {
        const coupon = await tx.coupon.findUnique({ where: { id: payload.couponId } });
        if (!coupon || !coupon.isActive || coupon.validUntil < /* @__PURE__ */ new Date()) {
          throw new Error("Invalid or expired coupon");
        }
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          throw new Error(`Minimum order value to use this coupon is $${coupon.minOrderValue}`);
        }
        if (coupon.discountType === "FIXED") {
          couponDiscount = coupon.discountValue;
        } else if (coupon.discountType === "PERCENTAGE") {
          couponDiscount = subtotal * coupon.discountValue / 100;
        }
        await tx.coupon.update({
          where: { id: payload.couponId },
          data: { usedCount: { increment: 1 } }
        });
      }
      const tax = (subtotal - couponDiscount) * 0.1;
      const finalTotal = subtotal - couponDiscount + deliveryFee + tax;
      const newOrder = await tx.order.create({
        data: {
          customerId,
          addressId: payload.addressId,
          addressSnapshot: payload.addressSnapshot,
          couponId: payload.couponId,
          couponDiscount,
          subtotal,
          deliveryFee,
          tax,
          totalPrice: finalTotal,
          notes: payload.notes,
          tableNumber: payload.tableNumber,
          items: {
            create: orderItems
          }
        },
        include: { items: true }
      });
      return newOrder;
    },
    {
      maxWait: 2e4,
      // 20 seconds to acquire a connection
      timeout: 3e4
      // 30 seconds total execution time
    }
  );
  Promise.all([
    auditService.log({
      userId: customerId,
      action: "ORDER_PLACED",
      entityType: "ORDER",
      entityId: order.id,
      details: { totalPrice: order.totalPrice },
      ipAddress: auditMeta?.ipAddress,
      userAgent: auditMeta?.userAgent
    }),
    notificationService.createNotification({
      userId: customerId,
      type: "ORDER_PLACED",
      title: "Order Placed Successfully",
      message: `Your order #${order.id.slice(0, 8).toUpperCase()} has been placed.`,
      meta: { orderId: order.id }
    })
  ]).catch((err) => console.error("Order side effects failed:", err));
  return order;
};
var getCustomerOrders = async (customerId, query = {}) => {
  const qb = new QueryBuilder(prisma.order, query, {
    filterableFields: ["status"]
  });
  return qb.where({ customerId }).include({ items: true, payment: true, refunds: true }).sort().paginate().execute();
};
var updateOrderStatus = async (id, status17, auditMeta) => {
  const oldOrder = await prisma.order.findUnique({
    where: { id },
    include: { payment: true, items: true }
  });
  if (!oldOrder) throw new Error("Order not found");
  const validTransitions = {
    [OrderStatus.PLACED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.REFUNDED]: []
  };
  if (oldOrder.status !== status17) {
    if (!validTransitions[oldOrder.status].includes(status17)) {
      throw new Error(`Invalid transition from ${oldOrder.status} to ${status17}`);
    }
  }
  if (oldOrder.payment?.status === "SUCCESS" && status17 === OrderStatus.PLACED) {
    throw new Error("Cannot move a paid order back to PLACED status");
  }
  const updatedOrder = await prisma.$transaction(async (tx) => {
    if (status17 === OrderStatus.CANCELLED && oldOrder.status !== OrderStatus.CANCELLED) {
      for (const item of oldOrder.items) {
        await tx.menuItem.update({
          where: { id: item.menuItemId },
          data: { stock: { increment: item.quantity } }
        });
      }
    }
    return await tx.order.update({
      where: { id },
      data: {
        status: status17,
        deliveredAt: status17 === OrderStatus.DELIVERED ? /* @__PURE__ */ new Date() : oldOrder.deliveredAt
      }
    });
  });
  Promise.all([
    auditService.log({
      action: "ORDER_STATUS_UPDATED",
      entityType: "ORDER",
      entityId: id,
      details: { oldStatus: oldOrder.status, newStatus: status17 },
      userId: auditMeta?.userId,
      ipAddress: auditMeta?.ipAddress,
      userAgent: auditMeta?.userAgent
    }),
    notificationService.createNotification({
      userId: oldOrder.customerId,
      type: "ORDER_STATUS_UPDATED",
      title: "Order Status Updated",
      message: `Your order #${id.slice(0, 8).toUpperCase()} is now ${status17.toLowerCase()}.`,
      meta: { orderId: id, status: status17 }
    })
  ]).catch((err) => console.error("Status update side effects failed:", err));
  return updatedOrder;
};
var getOrderById = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, customer: { select: { id: true, name: true, email: true, phone: true } } }
  });
  if (!order) throw new Error("Order not found");
  return order;
};
var getAllOrders = async (query = {}) => {
  const qb = new QueryBuilder(prisma.order, query, {
    filterableFields: ["status", "customerId"]
  });
  const result = await qb.include({
    customer: { select: { id: true, name: true, phone: true } },
    items: true,
    payment: true,
    refunds: true
  }).sort().paginate().execute();
  return result;
};
var getChefOrders = async (chefId, query = {}) => {
  return getAllOrders(query);
};
var orderService = {
  placeOrder,
  getCustomerOrders,
  updateOrderStatus,
  getOrderById,
  getAllOrders,
  getChefOrders
};

// src/modules/order/order.controller.ts
var placeOrder2 = async (req, res, next) => {
  try {
    const result = await orderService.placeOrder(req.user.id, req.body, {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    sendResponse_default(res, { statusCode: status6.CREATED, success: true, message: "Order placed", data: result });
  } catch (e) {
    next(e);
  }
};
var getCustomerOrders2 = async (req, res, next) => {
  try {
    const result = await orderService.getCustomerOrders(req.user.id, req.query);
    sendResponse_default(res, { statusCode: status6.OK, success: true, message: "Orders fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getOrderById2 = async (req, res, next) => {
  try {
    const result = await orderService.getOrderById(req.params.id);
    sendResponse_default(res, { statusCode: status6.OK, success: true, message: "Order fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var updateOrderStatus2 = async (req, res, next) => {
  try {
    const { action } = req.body;
    const statusMap = {
      placed: OrderStatus.PLACED,
      confirm: OrderStatus.CONFIRMED,
      process: OrderStatus.PROCESSING,
      ship: OrderStatus.SHIPPED,
      deliver: OrderStatus.DELIVERED,
      cancel: OrderStatus.CANCELLED
    };
    let newStatus = statusMap[action];
    if (!newStatus && Object.values(OrderStatus).includes(action)) {
      newStatus = action;
    }
    if (!newStatus) throw new Error("Invalid status action");
    const result = await orderService.updateOrderStatus(req.params.id, newStatus, {
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    sendResponse_default(res, { statusCode: status6.OK, success: true, message: "Order updated", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllOrders2 = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    sendResponse_default(res, { statusCode: status6.OK, success: true, message: "Orders fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var orderController = {
  placeOrder: placeOrder2,
  getCustomerOrders: getCustomerOrders2,
  getOrderById: getOrderById2,
  updateOrderStatus: updateOrderStatus2,
  getAllOrders: getAllOrders2
};

// src/modules/order/order.route.ts
var router4 = Router4();
router4.post("/", auth(Role.CUSTOMER), orderController.placeOrder);
router4.get("/my-orders", auth(Role.CUSTOMER), orderController.getCustomerOrders);
router4.get("/all", auth(Role.ADMIN, Role.CHEF), orderController.getAllOrders);
router4.get("/:id", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), orderController.getOrderById);
router4.patch("/:id/status", auth(Role.CHEF, Role.ADMIN), orderController.updateOrderStatus);
var orderRouter = router4;

// src/modules/coupon/coupon.route.ts
import { Router as Router5 } from "express";

// src/modules/coupon/coupon.controller.ts
import status7 from "http-status";

// src/modules/coupon/coupon.service.ts
var createCoupon = async (payload) => {
  const coupon = await prisma.coupon.create({ data: payload });
  auditService.log({
    action: "COUPON_CREATED",
    entityType: "COUPON",
    entityId: coupon.id,
    details: { code: coupon.code, discount: coupon.discountValue }
  }).catch((err) => console.error("Coupon create audit failed:", err));
  return coupon;
};
var getAllCoupons = async (query) => {
  const couponQuery = new QueryBuilder(prisma.coupon, query).search().filter().sort().paginate();
  return couponQuery.execute();
};
var applyCoupon = async (code, cartTotal) => {
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) throw new Error("This coupon code does not exist.");
  if (!coupon.isActive) {
    throw new Error("This coupon is currently deactivated by the administrator.");
  }
  const now = /* @__PURE__ */ new Date();
  if (now < new Date(coupon.validFrom)) {
    throw new Error(`This coupon will be active starting from ${new Date(coupon.validFrom).toLocaleDateString()}.`);
  }
  if (now > new Date(coupon.validUntil)) {
    throw new Error(`This coupon has expired on ${new Date(coupon.validUntil).toLocaleDateString()}.`);
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }
  if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
    throw new Error(`Minimum order value is $${coupon.minOrderValue} to use this coupon`);
  }
  let discount = 0;
  if (coupon.discountType === "FIXED") {
    discount = coupon.discountValue;
  } else {
    discount = cartTotal * coupon.discountValue / 100;
  }
  return { id: coupon.id, code: coupon.code, discountValue: discount };
};
var deleteCoupon = async (id) => {
  const coupon = await prisma.coupon.delete({ where: { id } });
  auditService.log({
    action: "COUPON_DELETED",
    entityType: "COUPON",
    entityId: id,
    details: { code: coupon.code }
  }).catch((err) => console.error("Coupon delete audit failed:", err));
  return coupon;
};
var couponService = { createCoupon, getAllCoupons, applyCoupon, deleteCoupon };

// src/modules/coupon/coupon.controller.ts
var createCoupon2 = async (req, res, next) => {
  try {
    const result = await couponService.createCoupon(req.body);
    sendResponse_default(res, { statusCode: status7.CREATED, success: true, message: "Coupon created", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllCoupons2 = async (req, res, next) => {
  try {
    const result = await couponService.getAllCoupons(req.query);
    sendResponse_default(res, { statusCode: status7.OK, success: true, message: "Coupons fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;
    const result = await couponService.applyCoupon(code, Number(cartTotal));
    sendResponse_default(res, { statusCode: status7.OK, success: true, message: "Coupon is valid", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteCoupon2 = async (req, res, next) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    sendResponse_default(res, { statusCode: status7.OK, success: true, message: "Coupon deleted", data: null });
  } catch (e) {
    next(e);
  }
};
var couponController = { createCoupon: createCoupon2, getAllCoupons: getAllCoupons2, validateCoupon, deleteCoupon: deleteCoupon2 };

// src/modules/coupon/coupon.route.ts
var router5 = Router5();
router5.post("/", auth(Role.ADMIN), couponController.createCoupon);
router5.get("/", auth(Role.ADMIN), couponController.getAllCoupons);
router5.post("/validate", auth(Role.CUSTOMER), couponController.validateCoupon);
router5.delete("/:id", auth(Role.ADMIN), couponController.deleteCoupon);
var couponRouter = router5;

// src/modules/address/address.route.ts
import { Router as Router6 } from "express";

// src/modules/address/address.controller.ts
import status8 from "http-status";

// src/modules/address/address.service.ts
var createAddress = async (userId, payload) => {
  const { zipCode, postalCode, title, ...rest } = payload;
  const address = await prisma.address.create({
    data: {
      ...rest,
      userId,
      title: title || "Home",
      postalCode: postalCode || zipCode
    }
  });
  auditService.log({
    userId,
    action: "ADDRESS_CREATED",
    entityType: "ADDRESS",
    entityId: address.id,
    details: { title: address.title }
  }).catch((err) => console.error("Address create audit failed:", err));
  return address;
};
var getAddresses = async (userId) => {
  return prisma.address.findMany({ where: { userId } });
};
var updateAddress = async (id, userId, payload) => {
  const { zipCode, postalCode, ...rest } = payload;
  const dataToUpdate = { ...rest };
  if (postalCode || zipCode) {
    dataToUpdate.postalCode = postalCode || zipCode;
  }
  const address = await prisma.address.update({ where: { id, userId }, data: dataToUpdate });
  auditService.log({
    userId,
    action: "ADDRESS_UPDATED",
    entityType: "ADDRESS",
    entityId: id,
    details: payload
  }).catch((err) => console.error("Address update audit failed:", err));
  return address;
};
var deleteAddress = async (id, userId) => {
  const address = await prisma.address.delete({ where: { id, userId } });
  auditService.log({
    userId,
    action: "ADDRESS_DELETED",
    entityType: "ADDRESS",
    entityId: id
  }).catch((err) => console.error("Address delete audit failed:", err));
  return address;
};
var addressService = { createAddress, getAddresses, updateAddress, deleteAddress };

// src/modules/address/address.controller.ts
var createAddress2 = async (req, res, next) => {
  try {
    const result = await addressService.createAddress(req.user.id, req.body);
    sendResponse_default(res, { statusCode: status8.CREATED, success: true, message: "Address created", data: result });
  } catch (e) {
    next(e);
  }
};
var getAddresses2 = async (req, res, next) => {
  try {
    const result = await addressService.getAddresses(req.user.id);
    sendResponse_default(res, { statusCode: status8.OK, success: true, message: "Addresses fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var updateAddress2 = async (req, res, next) => {
  try {
    const result = await addressService.updateAddress(req.params.id, req.user.id, req.body);
    sendResponse_default(res, { statusCode: status8.OK, success: true, message: "Address updated", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteAddress2 = async (req, res, next) => {
  try {
    await addressService.deleteAddress(req.params.id, req.user.id);
    sendResponse_default(res, { statusCode: status8.OK, success: true, message: "Address deleted", data: null });
  } catch (e) {
    next(e);
  }
};
var addressController = { createAddress: createAddress2, getAddresses: getAddresses2, updateAddress: updateAddress2, deleteAddress: deleteAddress2 };

// src/modules/address/address.route.ts
var router6 = Router6();
router6.post("/", auth(Role.CUSTOMER), addressController.createAddress);
router6.get("/", auth(Role.CUSTOMER), addressController.getAddresses);
router6.put("/:id", auth(Role.CUSTOMER), addressController.updateAddress);
router6.delete("/:id", auth(Role.CUSTOMER), addressController.deleteAddress);
var addressRouter = router6;

// src/modules/notification/notification.route.ts
import { Router as Router7 } from "express";

// src/modules/notification/notification.controller.ts
import status9 from "http-status";
var getMyNotifications2 = async (req, res, next) => {
  try {
    const result = await notificationService.getMyNotifications(req.user.id, req.query);
    sendResponse_default(res, { statusCode: status9.OK, success: true, message: "Notifications fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var markAllAsRead2 = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    sendResponse_default(res, {
      statusCode: status9.OK,
      success: true,
      message: "All notifications marked as read",
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var getUnreadCount2 = async (req, res, next) => {
  try {
    const result = await notificationService.getUnreadCount(req.user.id);
    sendResponse_default(res, {
      statusCode: status9.OK,
      success: true,
      message: "Unread notifications count fetched",
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var markAsRead2 = async (req, res, next) => {
  try {
    const result = await notificationService.markAsRead(req.params.id, req.user.id);
    sendResponse_default(res, { statusCode: status9.OK, success: true, message: "Marked as read", data: result });
  } catch (e) {
    next(e);
  }
};
var notificationController = {
  getMyNotifications: getMyNotifications2,
  markAsRead: markAsRead2,
  markAllAsRead: markAllAsRead2,
  getUnreadCount: getUnreadCount2
};

// src/modules/notification/notification.route.ts
var router7 = Router7();
router7.get("/me", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), notificationController.getMyNotifications);
router7.patch("/:id/read", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), notificationController.markAsRead);
router7.patch("/mark-all-read", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), notificationController.markAllAsRead);
router7.get("/unread-count", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), notificationController.getUnreadCount);
var notificationRouter = router7;

// src/modules/payment/payment.route.ts
import { Router as Router8 } from "express";

// src/modules/payment/payment.controller.ts
import status10 from "http-status";

// src/modules/payment/payment.service.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);
var createPaymentIntent = async (orderId, userId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });
  if (!order) throw new Error("Order not found");
  if (order.customerId !== userId) throw new Error("Unauthorized");
  if (order.status !== OrderStatus.PLACED) throw new Error("Order already processed");
  const amount = Math.round(order.totalPrice * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: { orderId }
  });
  await prisma.payment.upsert({
    where: { orderId },
    update: { amount: order.totalPrice, status: PaymentStatus.INITIATED },
    create: {
      orderId,
      amount: order.totalPrice,
      status: PaymentStatus.INITIATED
    }
  });
  return { clientSecret: paymentIntent.client_secret, orderId };
};
var handleWebhook = async (event) => {
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId },
        data: { status: PaymentStatus.SUCCESS, transactionId: paymentIntent.id }
      });
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CONFIRMED }
      });
    }, {
      timeout: 1e4,
      maxWait: 5e3
    });
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    await prisma.payment.update({
      where: { orderId },
      data: { status: PaymentStatus.FAILED }
    });
  }
};
var verifyPayment = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status === "succeeded") {
    const orderId = paymentIntent.metadata.orderId;
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.upsert({
        where: { orderId },
        update: { status: PaymentStatus.SUCCESS, transactionId: paymentIntent.id },
        create: { orderId, amount: paymentIntent.amount / 100, status: PaymentStatus.SUCCESS, transactionId: paymentIntent.id }
      });
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CONFIRMED }
      });
      return { payment, order };
    }, {
      timeout: 1e4,
      // 10 seconds for resilience
      maxWait: 5e3
      // Wait up to 5s to acquire a connection
    });
    return result;
  } else {
    throw new Error("Payment not succeeded yet");
  }
};
var getAllPayments = async (query) => {
  const paymentQuery = new QueryBuilder(prisma.payment, query).search().filter().sort().paginate();
  return paymentQuery.include({ order: { select: { customer: { select: { name: true, email: true } } } } }).execute();
};
var paymentService = { createPaymentIntent, handleWebhook, getAllPayments, verifyPayment };

// src/modules/payment/payment.controller.ts
var createPaymentIntent2 = async (req, res, next) => {
  try {
    const result = await paymentService.createPaymentIntent(req.params.orderId, req.user.id);
    sendResponse_default(res, { statusCode: status10.OK, success: true, message: "Payment intent created", data: result });
  } catch (e) {
    next(e);
  }
};
var handleWebhook2 = async (req, res, next) => {
  try {
    await paymentService.handleWebhook(req.body);
    res.json({ received: true });
  } catch (e) {
    next(e);
  }
};
var verifyPayment2 = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;
    const result = await paymentService.verifyPayment(paymentIntentId);
    sendResponse_default(res, { statusCode: status10.OK, success: true, message: "Payment verified", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllPayments2 = async (req, res, next) => {
  try {
    const result = await paymentService.getAllPayments(req.query);
    sendResponse_default(res, { statusCode: status10.OK, success: true, message: "Payments fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var paymentController = { createPaymentIntent: createPaymentIntent2, handleWebhook: handleWebhook2, getAllPayments: getAllPayments2, verifyPayment: verifyPayment2 };

// src/modules/payment/payment.route.ts
var router8 = Router8();
router8.post("/create-intent/:orderId", auth(Role.CUSTOMER), paymentController.createPaymentIntent);
router8.post("/verify", auth(Role.CUSTOMER), paymentController.verifyPayment);
router8.post("/webhook", paymentController.handleWebhook);
router8.get("/all", auth(Role.ADMIN), paymentController.getAllPayments);
var paymentRouter = router8;

// src/modules/user/user.route.ts
import express2 from "express";

// src/modules/user/user.service.ts
var getProfile = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      status: true,
      isEmailVerified: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) throw new Error("User not found");
  return user;
};
var updateProfile = async (id, payload) => {
  const user = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      status: true,
      isEmailVerified: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true
    }
  });
  auditService.log({
    userId: id,
    action: "PROFILE_UPDATED",
    entityType: "USER",
    entityId: id,
    details: payload
  }).catch((err) => console.error("Profile update audit log failed:", err));
  return user;
};
var userService = { getProfile, updateProfile };

// src/modules/user/user.controller.ts
import status11 from "http-status";
var getMyProfile = async (req, res, next) => {
  try {
    const result = await userService.getProfile(req.user.id);
    sendResponse_default(res, {
      statusCode: status11.OK,
      success: true,
      message: "Profile fetched successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var updateMyProfile = async (req, res, next) => {
  try {
    const result = await userService.updateProfile(req.user.id, req.body);
    sendResponse_default(res, {
      statusCode: status11.OK,
      success: true,
      message: "Profile updated successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};
var userController = { getMyProfile, updateMyProfile };

// src/modules/user/user.route.ts
var router9 = express2.Router();
router9.get("/me", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), userController.getMyProfile);
router9.put("/me", auth(Role.CUSTOMER, Role.CHEF, Role.ADMIN), userController.updateMyProfile);
var userRouter = router9;

// src/modules/admin/admin.route.ts
import { Router as Router10 } from "express";

// src/modules/admin/admin.controller.ts
import status12 from "http-status";

// src/modules/admin/admin.service.ts
var getAllUsers = async (query) => {
  const qb = new QueryBuilder(prisma.user, query, {
    searchableFields: ["name", "email", "phone"],
    filterableFields: ["role", "status"]
  });
  return qb.search().filter().sort().paginate().execute();
};
var updateUserStatus = async (id, status17, auditMeta) => {
  const oldUser = await prisma.user.findUnique({ where: { id } });
  if (!oldUser) throw new Error("User not found");
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status: status17 }
  });
  Promise.all([
    auditService.log({
      action: "USER_STATUS_UPDATED",
      entityType: "USER",
      entityId: id,
      details: { oldStatus: oldUser.status, newStatus: status17 },
      userId: auditMeta?.userId,
      ipAddress: auditMeta?.ipAddress,
      userAgent: auditMeta?.userAgent
    }),
    notificationService.createNotification({
      userId: id,
      type: "ACCOUNT_STATUS",
      title: "Account Status Updated",
      message: `Your account status has been updated to ${status17.toLowerCase()}.`,
      meta: { status: status17 }
    })
  ]).catch((err) => console.error("Admin status update side effects failed:", err));
  return updatedUser;
};
var updateUserRole = async (id, role, auditMeta) => {
  const oldUser = await prisma.user.findUnique({ where: { id } });
  if (!oldUser) throw new Error("User not found");
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role }
  });
  Promise.all([
    auditService.log({
      action: "USER_ROLE_UPDATED",
      entityType: "USER",
      entityId: id,
      details: { oldRole: oldUser.role, newRole: role },
      userId: auditMeta?.userId,
      ipAddress: auditMeta?.ipAddress,
      userAgent: auditMeta?.userAgent
    }),
    notificationService.createNotification({
      userId: id,
      type: "ACCOUNT_STATUS",
      title: "Account Role Updated",
      message: `Your account role has been updated to ${role.toLowerCase()}.`,
      meta: { role }
    })
  ]).catch((err) => console.error("Admin role update side effects failed:", err));
  return updatedUser;
};
var getDashboardStats = async () => {
  const [totalUsers, totalOrders, totalMenuItems, revenueModel] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.menuItem.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" }
    })
  ]);
  return {
    totalUsers,
    totalOrders,
    totalMenuItems,
    totalRevenue: revenueModel._sum.amount || 0
  };
};
var adminService = { getAllUsers, updateUserStatus, updateUserRole, getDashboardStats };

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res, next) => {
  try {
    const result = await adminService.getAllUsers(req.query);
    sendResponse_default(res, { statusCode: status12.OK, success: true, message: "Users fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    const { status: userStatus } = req.body;
    const result = await adminService.updateUserStatus(req.params.id, userStatus, {
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    sendResponse_default(res, { statusCode: status12.OK, success: true, message: "User status updated", data: result });
  } catch (e) {
    next(e);
  }
};
var updateUserRole2 = async (req, res, next) => {
  try {
    const { role: userRole } = req.body;
    const result = await adminService.updateUserRole(req.params.id, userRole, {
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    sendResponse_default(res, { statusCode: status12.OK, success: true, message: "User role updated", data: result });
  } catch (e) {
    next(e);
  }
};
var getDashboardStats2 = async (req, res, next) => {
  try {
    const result = await adminService.getDashboardStats();
    sendResponse_default(res, { statusCode: status12.OK, success: true, message: "Stats fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var adminController = { getAllUsers: getAllUsers2, updateUserStatus: updateUserStatus2, updateUserRole: updateUserRole2, getDashboardStats: getDashboardStats2 };

// src/modules/admin/admin.route.ts
var router10 = Router10();
router10.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router10.patch("/users/:id/status", auth(Role.ADMIN), adminController.updateUserStatus);
router10.patch("/users/:id/role", auth(Role.ADMIN), adminController.updateUserRole);
router10.get("/stats", auth(Role.ADMIN), adminController.getDashboardStats);
var adminRouter = router10;

// src/modules/file/file.route.ts
import { Router as Router11 } from "express";

// src/config/multer.config.ts
import multer from "multer";
var storage = multer.memoryStorage();
var fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};
var upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB default
  }
});
var uploadPdf = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB
  }
});

// src/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status13 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var uploadFileToCloudinary = async (buffer, fileName) => {
  if (!buffer || !fileName) {
    throw new AppError_default(status13.BAD_REQUEST, "File buffer and file name are required for upload");
  }
  const extension = fileName.split(".").pop()?.toLocaleLowerCase();
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
  const folder = extension === "pdf" ? "pdfs" : "images";
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `dinewise/${folder}/${uniqueName}`,
        folder: `dinewise/${folder}`
      },
      (error, result) => {
        if (error) {
          return reject(new AppError_default(status13.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"));
        }
        resolve(result);
      }
    ).end(buffer);
  });
};
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(status13.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};

// src/modules/file/file.route.ts
import status14 from "http-status";
var router11 = Router11();
router11.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) throw new Error("No file uploaded");
    const result = await uploadFileToCloudinary(req.file.buffer, req.file.originalname);
    sendResponse_default(res, { statusCode: status14.OK, success: true, message: "File uploaded", data: { url: result.secure_url } });
  } catch (e) {
    next(e);
  }
});
router11.delete("/delete", async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) throw new Error("File URL required");
    await deleteFileFromCloudinary(url);
    sendResponse_default(res, { statusCode: status14.OK, success: true, message: "File deleted", data: null });
  } catch (e) {
    next(e);
  }
});
var FileRoutes = router11;

// src/modules/audit/audit.route.ts
import { Router as Router12 } from "express";

// src/modules/audit/audit.controller.ts
import status15 from "http-status";
var getAuditLogs2 = async (req, res, next) => {
  try {
    const result = await auditService.getAuditLogs(req.query);
    sendResponse_default(res, { statusCode: status15.OK, success: true, message: "Audit logs fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var auditController = { getAuditLogs: getAuditLogs2 };

// src/modules/audit/audit.route.ts
var router12 = Router12();
router12.get("/", auth(Role.ADMIN), auditController.getAuditLogs);
var auditRouter = router12;

// src/modules/refund/refund.route.ts
import { Router as Router13 } from "express";

// src/modules/refund/refund.service.ts
import Stripe2 from "stripe";
var stripe2 = new Stripe2(envVars.STRIPE.STRIPE_SECRET_KEY);
var requestRefund = async (userId, payload, auditMeta) => {
  const order = await prisma.order.findUnique({
    where: { id: payload.orderId },
    include: { payment: true }
  });
  if (!order) throw new Error("Order not found");
  if (order.customerId !== userId) throw new Error("Unauthorized");
  if (order.status !== OrderStatus.DELIVERED) throw new Error("Refund only allowed for delivered orders");
  if (payload.amount > order.totalPrice) throw new Error("Refund amount cannot exceed order total");
  const existingRefund = await prisma.refund.findFirst({
    where: { orderId: payload.orderId, status: { notIn: [RefundStatus.CHEF_REJECTED, RefundStatus.ADMIN_REJECTED] } }
  });
  if (existingRefund) throw new Error("An active refund request already exists for this order");
  if (order.deliveredAt) {
    const hoursSinceDelivery = (Date.now() - new Date(order.deliveredAt).getTime()) / (1e3 * 60 * 60);
    if (hoursSinceDelivery > 24) throw new Error("Refund request window (24h after delivery) has expired");
  }
  const refund = await prisma.refund.create({
    data: {
      orderId: payload.orderId,
      paymentId: order.payment?.id,
      customerId: userId,
      amount: payload.amount,
      reason: payload.reason,
      status: RefundStatus.REQUESTED
    }
  });
  const chefs = await prisma.orderItem.findMany({
    where: { orderId: payload.orderId },
    include: { menuItem: { select: { chefId: true } } }
  });
  const uniqueChefIds = [...new Set(chefs.map((c) => c.menuItem.chefId))];
  for (const chefId of uniqueChefIds) {
    await notificationService.createNotification({
      userId: chefId,
      type: NotificationType.REFUND_REQUESTED,
      title: "New Refund Request",
      message: `A client requested a refund for order #${order.id.slice(0, 8).toUpperCase()}`,
      meta: { refundId: refund.id, orderId: order.id }
    });
  }
  await auditService.log({
    userId,
    action: "REFUND_REQUESTED",
    entityType: "REFUND",
    entityId: refund.id,
    details: { orderId: order.id, amount: payload.amount },
    ipAddress: auditMeta?.ipAddress,
    userAgent: auditMeta?.userAgent
  });
  return refund;
};
var chefReviewRefund = async (chefId, refundId, action, note) => {
  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
    include: { order: { include: { items: { include: { menuItem: true } } } } }
  });
  if (!refund) throw new Error("Refund request not found");
  if (refund.status !== RefundStatus.REQUESTED) throw new Error("Refund request already processed");
  const isRelatedChef = refund.order.items.some((item) => item.menuItem.chefId === chefId);
  if (!isRelatedChef) throw new Error("You are not authorized to review this refund");
  const status17 = action === "APPROVE" ? RefundStatus.CHEF_APPROVED : RefundStatus.CHEF_REJECTED;
  const updatedRefund = await prisma.refund.update({
    where: { id: refundId },
    data: { status: status17, chefNote: note }
  });
  if (action === "APPROVE") {
    const admins = await prisma.user.findMany({ where: { role: Role.ADMIN } });
    for (const admin of admins) {
      await notificationService.createNotification({
        userId: admin.id,
        type: NotificationType.REFUND_APPROVED,
        title: "Chef Approved Refund",
        message: `Chef approved refund request for order #${refund.orderId.slice(0, 8).toUpperCase()}`,
        meta: { refundId: refund.id, orderId: refund.orderId }
      });
    }
  } else {
    await notificationService.createNotification({
      userId: refund.customerId,
      type: NotificationType.REFUND_REJECTED,
      title: "Refund Request Rejected",
      message: `Your refund request for order #${refund.orderId.slice(0, 8).toUpperCase()} was rejected by the chef.`,
      meta: { refundId: refund.id, orderId: refund.orderId, note }
    });
  }
  return updatedRefund;
};
var adminReviewRefund = async (adminId, refundId, action, note, auditMeta) => {
  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
    include: { order: true, payment: true }
  });
  if (!refund) throw new Error("Refund request not found");
  if (refund.status !== RefundStatus.CHEF_APPROVED) throw new Error("Refund must be approved by chef first");
  if (action === "REJECT") {
    const updatedRefund = await prisma.refund.update({
      where: { id: refundId },
      data: { status: RefundStatus.ADMIN_REJECTED, adminNote: note }
    });
    await notificationService.createNotification({
      userId: refund.customerId,
      type: NotificationType.REFUND_REJECTED,
      title: "Refund Request Rejected by Admin",
      message: `Your refund request for order #${refund.orderId.slice(0, 8).toUpperCase()} was rejected by administration.`,
      meta: { refundId: refund.id, orderId: refund.orderId, note }
    });
    return updatedRefund;
  }
  let stripeRefundId = null;
  return await prisma.$transaction(async (tx) => {
    if (refund.payment.paymentMethod === PaymentMethod.STRIPE) {
      if (!refund.payment.transactionId) throw new Error("Stripe transaction ID missing");
      const stripeRefund = await stripe2.refunds.create({
        payment_intent: refund.payment.transactionId,
        amount: Math.round(refund.amount * 100)
      });
      stripeRefundId = stripeRefund.id;
    }
    const processedRefund = await tx.refund.update({
      where: { id: refundId },
      data: {
        status: RefundStatus.PROCESSED,
        adminNote: note,
        stripeRefundId
      }
    });
    if (refund.amount >= refund.order.totalPrice) {
      await tx.order.update({
        where: { id: refund.orderId },
        data: { status: OrderStatus.REFUNDED }
      });
      await tx.payment.update({
        where: { id: refund.paymentId },
        data: { status: PaymentStatus.REFUNDED }
      });
    }
    await notificationService.createNotification({
      userId: refund.customerId,
      type: NotificationType.REFUND_PROCESSED,
      title: "Refund Processed",
      message: `Your refund of $${refund.amount} for order #${refund.orderId.slice(0, 8).toUpperCase()} has been processed.`,
      meta: { refundId: refund.id, orderId: refund.orderId, amount: refund.amount }
    });
    await auditService.log({
      userId: adminId,
      action: "REFUND_PROCESSED",
      entityType: "REFUND",
      entityId: refund.id,
      details: { orderId: refund.orderId, amount: refund.amount, stripeRefundId },
      ipAddress: auditMeta?.ipAddress,
      userAgent: auditMeta?.userAgent
    });
    return processedRefund;
  });
};
var getRefunds = async (userId, role, query) => {
  const qb = new QueryBuilder(prisma.refund, query).search().filter().sort().paginate();
  if (role === Role.ADMIN) {
    return qb.include({ order: true, customer: true }).execute();
  } else if (role === Role.CHEF) {
    return qb.where({ order: { items: { some: { menuItem: { chefId: userId } } } } }).include({ order: true, customer: true }).execute();
  } else {
    return qb.where({ customerId: userId }).include({ order: true }).execute();
  }
};
var refundService = { requestRefund, chefReviewRefund, adminReviewRefund, getRefunds };

// src/modules/refund/refund.controller.ts
import httpStatus from "http-status";
var requestRefund2 = async (req, res, next) => {
  try {
    const result = await refundService.requestRefund(req.user.id, req.body, {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    sendResponse_default(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Refund requested successfully",
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var chefReviewRefund2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body;
    const result = await refundService.chefReviewRefund(req.user.id, id, action, note);
    sendResponse_default(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Refund ${action.toLowerCase()}ed by chef`,
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var adminReviewRefund2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body;
    const result = await refundService.adminReviewRefund(req.user.id, id, action, note, {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
    sendResponse_default(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: action === "APPROVE" ? "Refund processed successfully" : "Refund rejected by admin",
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var getRefunds2 = async (req, res, next) => {
  try {
    const result = await refundService.getRefunds(req.user.id, req.user.role, req.query);
    sendResponse_default(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Refunds fetched successfully",
      meta: result.meta,
      data: result.data
    });
  } catch (e) {
    next(e);
  }
};
var refundController = { requestRefund: requestRefund2, chefReviewRefund: chefReviewRefund2, adminReviewRefund: adminReviewRefund2, getRefunds: getRefunds2 };

// src/modules/refund/refund.route.ts
var router13 = Router13();
router13.post("/", auth(Role.CUSTOMER), refundController.requestRefund);
router13.get("/", auth(Role.ADMIN, Role.CHEF, Role.CUSTOMER), refundController.getRefunds);
router13.patch("/:id/chef", auth(Role.CHEF), refundController.chefReviewRefund);
router13.patch("/:id/admin", auth(Role.ADMIN), refundController.adminReviewRefund);
var refundRouter = router13;

// src/modules/stats/stats.route.ts
import express4 from "express";

// src/modules/stats/stats.controller.ts
import httpStatus2 from "http-status";

// src/modules/stats/stats.service.ts
var getAdminStats = async () => {
  const now = /* @__PURE__ */ new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
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
    revenue24h
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
    })
  ]);
  const sevenDaysAgo = /* @__PURE__ */ new Date();
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
  const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const amount = weeklyRevenue.filter((p) => p.order.createdAt.toISOString().split("T")[0] === dateStr).reduce((sum, p) => sum + p.amount, 0);
    return { date: dateStr, amount };
  }).reverse();
  return {
    totalUsers,
    userBreakdown: userRoles.reduce((acc, curr) => {
      acc[curr.role.toLowerCase()] = curr._count;
      return acc;
    }, {}),
    totalOrders,
    orderBreakdown: orderStatus.reduce((acc, curr) => {
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
var getChefStats = async (chefId) => {
  const totalMenuItems = await prisma.menuItem.count({
    where: { chefId }
  });
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
  const totalRevenue = chefOrderItems.filter((item) => item.order.payment?.status === "SUCCESS").reduce((sum, item) => sum + item.totalPrice, 0);
  const uniqueOrderIds = new Set(chefOrderItems.map((item) => item.orderId));
  const totalOrders = uniqueOrderIds.size;
  const topSellingItems = await prisma.orderItem.groupBy({
    by: ["menuItemId", "menuItemName"],
    where: {
      menuItem: { chefId }
    },
    _sum: { quantity: true, totalPrice: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5
  });
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
  const orderBreakdown = chefOrderItems.reduce((acc, item) => {
    const status17 = item.order.status.toLowerCase();
    acc[status17] = (acc[status17] || 0) + 1;
    return acc;
  }, {});
  const sevenDaysAgo = /* @__PURE__ */ new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const amount = chefOrderItems.filter(
      (item) => item.order.payment?.status === "SUCCESS" && item.order.createdAt.toISOString().split("T")[0] === dateStr
    ).reduce((sum, item) => sum + item.totalPrice, 0);
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
var getCustomerStats = async (customerId) => {
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
    orderBreakdown: orderStatus.reduce((acc, curr) => {
      acc[curr.status.toLowerCase()] = curr._count;
      return acc;
    }, {})
  };
};
var statsService = {
  getAdminStats,
  getChefStats,
  getCustomerStats
};

// src/modules/stats/stats.controller.ts
var getAdminStats2 = async (req, res, next) => {
  try {
    const result = await statsService.getAdminStats();
    sendResponse_default(res, {
      statusCode: httpStatus2.OK,
      success: true,
      message: "Admin statistics fetched successfully",
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var getChefStats2 = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await statsService.getChefStats(user?.id);
    sendResponse_default(res, {
      statusCode: httpStatus2.OK,
      success: true,
      message: "Chef statistics fetched successfully",
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var getCustomerStats2 = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await statsService.getCustomerStats(user?.id);
    sendResponse_default(res, {
      statusCode: httpStatus2.OK,
      success: true,
      message: "Customer statistics fetched successfully",
      data: result
    });
  } catch (e) {
    next(e);
  }
};
var statsController = {
  getAdminStats: getAdminStats2,
  getChefStats: getChefStats2,
  getCustomerStats: getCustomerStats2
};

// src/modules/stats/stats.route.ts
var router14 = express4.Router();
router14.get("/admin", auth(Role.ADMIN), statsController.getAdminStats);
router14.get("/chef", auth(Role.CHEF), statsController.getChefStats);
router14.get("/customer", auth(Role.CUSTOMER), statsController.getCustomerStats);
var StatsRoutes = router14;

// src/modules/review/review.route.ts
import { Router as Router14 } from "express";

// src/modules/review/review.controller.ts
import status16 from "http-status";

// src/modules/review/review.service.ts
var createReview = async (userId, menuItemId, payload) => {
  const existing = await prisma.review.findFirst({
    where: { userId, menuItemId }
  });
  if (existing) throw new Error("You have already reviewed this item");
  const hasOrdered = await prisma.orderItem.findFirst({
    where: {
      menuItemId,
      order: { customerId: userId, status: "DELIVERED" }
    }
  });
  if (!hasOrdered) throw new Error("You can only review items that have been delivered to you.");
  return prisma.review.create({
    data: {
      ...payload,
      userId,
      menuItemId,
      isVerifiedPurchase: true
    }
  });
};
var getReviewsForMenu = async (menuItemId, query = {}) => {
  const qb = new QueryBuilder(prisma.review, query, {
    filterableFields: ["rating", "isVerifiedPurchase"]
  });
  return qb.where({ menuItemId }).include({ user: { select: { id: true, name: true, image: true } } }).sort().paginate().execute();
};
var getMyReviews = async (userId, query = {}) => {
  const qb = new QueryBuilder(prisma.review, query, {
    searchableFields: ["comment", "title"],
    filterableFields: ["rating", "isVerifiedPurchase"]
  });
  return qb.where({ userId }).include({ menuItem: { select: { id: true, name: true, images: true } } }).sort().paginate().execute();
};
var getAllReviews = async (query = {}) => {
  const qb = new QueryBuilder(prisma.review, query, {
    searchableFields: ["comment", "title"],
    filterableFields: ["rating", "isVerifiedPurchase", "userId", "menuItemId"]
  });
  return qb.include({
    user: { select: { id: true, name: true, image: true } },
    menuItem: { select: { id: true, name: true, images: true } }
  }).sort().paginate().execute();
};
var getChefReviews = async (chefId, query = {}) => {
  const qb = new QueryBuilder(prisma.review, query, {
    searchableFields: ["comment", "title"],
    filterableFields: ["rating", "isVerifiedPurchase"]
  });
  return qb.where({ menuItem: { chefId } }).include({
    user: { select: { id: true, name: true, image: true } },
    menuItem: { select: { id: true, name: true, images: true } }
  }).sort().paginate().execute();
};
var canReview = async (userId, menuItemId) => {
  const hasOrdered = await prisma.orderItem.findFirst({
    where: {
      menuItemId,
      order: { customerId: userId, status: "DELIVERED" }
    }
  });
  const existing = await prisma.review.findFirst({
    where: { userId, menuItemId }
  });
  return {
    canReview: !!hasOrdered && !existing,
    reason: !hasOrdered ? "You haven't ordered this item yet or it hasn't been delivered." : existing ? "You have already reviewed this item." : null
  };
};
var updateReview = async (id, userId, payload) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (review.userId !== userId) throw new Error("Unauthorized to edit this review");
  return prisma.review.update({
    where: { id },
    data: payload
  });
};
var deleteReview = async (id, userId, role) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (review.userId !== userId && role !== "ADMIN") {
    throw new Error("Unauthorized to delete this review");
  }
  return prisma.review.delete({ where: { id } });
};
var reviewService = {
  createReview,
  getReviewsForMenu,
  getMenuItemReviews: getReviewsForMenu,
  getMyReviews,
  getAllReviews,
  getChefReviews,
  canReview,
  updateReview,
  deleteReview
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;
    const result = await reviewService.createReview(req.user.id, menuItemId, req.body);
    sendResponse_default(res, { statusCode: status16.CREATED, success: true, message: "Review added", data: result });
  } catch (e) {
    next(e);
  }
};
var getMenuItemReviews = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;
    const result = await reviewService.getReviewsForMenu(menuItemId, req.query);
    sendResponse_default(res, { statusCode: status16.OK, success: true, message: "Reviews fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getMyReviews2 = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await reviewService.getMyReviews(user.id, req.query);
    sendResponse_default(res, { statusCode: status16.OK, success: true, message: "My reviews fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getAllReviews2 = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews(req.query);
    sendResponse_default(res, { statusCode: status16.OK, success: true, message: "All reviews fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var getChefReviews2 = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await reviewService.getChefReviews(user.id, req.query);
    sendResponse_default(res, { statusCode: status16.OK, success: true, message: "Chef reviews fetched", data: result });
  } catch (e) {
    next(e);
  }
};
var updateReview2 = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await reviewService.updateReview(req.params.id, user.id, req.body);
    sendResponse_default(res, { statusCode: status16.OK, success: true, message: "Review updated", data: result });
  } catch (e) {
    next(e);
  }
};
var deleteReview2 = async (req, res, next) => {
  try {
    const user = req.user;
    await reviewService.deleteReview(req.params.id, user.id, user.role);
    sendResponse_default(res, { statusCode: status16.OK, success: true, message: "Review deleted", data: null });
  } catch (e) {
    next(e);
  }
};
var canReview2 = async (req, res, next) => {
  try {
    const user = req.user;
    const { menuItemId } = req.params;
    const result = await reviewService.canReview(user.id, menuItemId);
    sendResponse_default(res, { statusCode: status16.OK, success: true, message: "Review eligibility checked", data: result });
  } catch (e) {
    next(e);
  }
};
var reviewController = {
  createReview: createReview2,
  getMenuItemReviews,
  getMyReviews: getMyReviews2,
  getAllReviews: getAllReviews2,
  getChefReviews: getChefReviews2,
  canReview: canReview2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/modules/review/review.route.ts
var router15 = Router14();
router15.get("/menu/:menuItemId", reviewController.getMenuItemReviews);
router15.post("/:menuItemId", auth("CUSTOMER"), reviewController.createReview);
router15.get("/me", auth("CUSTOMER"), reviewController.getMyReviews);
router15.patch("/:id", auth("CUSTOMER"), reviewController.updateReview);
router15.get("/can-review/:menuItemId", auth("CUSTOMER"), reviewController.canReview);
router15.delete("/:id", auth("CUSTOMER", "ADMIN"), reviewController.deleteReview);
router15.get("/all", auth("ADMIN"), reviewController.getAllReviews);
router15.get("/chef", auth("CHEF"), reviewController.getChefReviews);
var reviewRouter = router15;

// src/routes/index.ts
var router16 = Router15();
var moduleRoutes = [
  { path: "/auth", route: authRouter },
  { path: "/user", route: userRouter },
  { path: "/menu-item", route: menuItemRouter },
  { path: "/category", route: categoryRouter },
  { path: "/order", route: orderRouter },
  { path: "/review", route: reviewRouter },
  { path: "/coupon", route: couponRouter },
  { path: "/address", route: addressRouter },
  { path: "/notification", route: notificationRouter },
  { path: "/payment", route: paymentRouter },
  { path: "/admin", route: adminRouter },
  { path: "/file", route: FileRoutes },
  { path: "/audit", route: auditRouter },
  { path: "/refund", route: refundRouter },
  { path: "/stats", route: StatsRoutes }
];
moduleRoutes.forEach((route) => router16.use(route.path, route.route));
var routes_default = router16;

// src/app.ts
var app = express5();
app.use(express5.json({ limit: "10mb" }));
app.use(express5.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: function(origin, callback) {
      const allowedOrigins = [
        envVars.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:3001"
      ];
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true
  })
);
app.use(cookieParser());
app.use("/api", routes_default);
app.get("/", (req, res) => {
  res.send("\u{1F37D}\uFE0F DineWise API is running!");
});
app.use(notFound);
app.use(globalErrorHandler_default);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
