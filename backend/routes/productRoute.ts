const express = require("express");
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../middleware/auth");
const { getProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");

const productRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (_req: any, file: any, cb: any) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (_req: any, file: any, cb: any) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }

        cb(new Error("Only image files are allowed"));
    },
});

productRouter.get("/", getProducts);
productRouter.post("/", authMiddleware, upload.single("image"), addProduct);
productRouter.put("/:id", authMiddleware, upload.single("image"), updateProduct);
productRouter.delete("/:id", authMiddleware, deleteProduct);

module.exports = productRouter;