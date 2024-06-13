import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + " " + file.originalname);
  },
});

export const uploadImage = multer({ storage });
