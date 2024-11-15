// src/types/multer.d.ts
import { File } from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: File;
    }
  }
}
