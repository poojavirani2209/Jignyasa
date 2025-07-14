import multer from "multer";

const docUpload = multer({
  storage: multer.diskStorage({
    destination: "uploads/docs/",
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  }),
});

const ssUpload = multer({
  storage: multer.diskStorage({
    destination: "uploads/screenshots/",
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  }),
});

export const uploadDocs = docUpload.array("docs");
export const uploadScreenshots = ssUpload.single("screenshot");
