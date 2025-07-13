import multer from "multer";

const upload = multer({ dest: "./uploads/" });

export const uploadDocs = upload.array("docs");
