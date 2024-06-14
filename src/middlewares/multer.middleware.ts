import multer from "multer";

const storage = multer.diskStorage({
  filename: (_, file, cb) => {
    cb(null, Date.now() + " " + file.originalname);
  },
});

export const uploadImage = multer({ storage });
