import express, { Router, Request, Response, NextFunction } from "express";
import { upload } from "../../config/multer.config";
import { uploadFileToCloudinary, deleteFileFromCloudinary } from "../../config/cloudinary.config";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";

const router = Router();

router.post("/upload", upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
     try {
          if (!req.file) throw new Error("No file uploaded");
          const result = await uploadFileToCloudinary(req.file.buffer, req.file.originalname);
          sendResponse(res, { statusCode: status.OK, success: true, message: "File uploaded", data: { url: result.secure_url } });
     } catch (e) {
          next(e);
     }
});

router.delete("/delete", async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { url } = req.body;
          if (!url) throw new Error("File URL required");
          await deleteFileFromCloudinary(url);
          sendResponse(res, { statusCode: status.OK, success: true, message: "File deleted", data: null });
     } catch (e) {
          next(e);
     }
});

export const FileRoutes = router;
