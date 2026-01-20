import { diskStorage } from "multer";

export const audioStorage = diskStorage({
  destination: './generated/uploads',
  filename: (req, file, callback) => {
    const extension = file.originalname.split('.').pop();
    const fileName = `${Date.now()}.${extension}`;
    callback(null, fileName);
  },
});