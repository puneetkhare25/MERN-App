import { Request, Response } from "express";

const productModel = require("../models/productModel");
const jwt = require("jsonwebtoken");

const getViewerId = (req: Request) => {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.token;

    if (!token || Array.isArray(token)) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
        return decoded.id;
    } catch (error) {
        return null;
    }
};

const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productModel
            .find({})
            .populate("uploadedBy", "name")
            .sort({ createdAt: -1 });

        const viewerId = getViewerId(req);

        const formattedProducts = products.map((product: any) => {
            const uploaderId = product.uploadedBy?._id?.toString();

            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
                uploadedBy: viewerId && product.uploadedBy
                    ? { _id: product.uploadedBy._id, name: product.uploadedBy.name }
                    : null,
                canManage: Boolean(viewerId && uploaderId === viewerId),
            };
        });

        return res.json({
            success: true,
            products: formattedProducts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching products",
        });
    }
};

const addProduct = async (req: Request, res: Response) => {
    const { name, price, description } = req.body;
    const user = (req as any).user;
    const file = (req as any).file;

    if (!file) {
        return res.status(400).json({
            success: false,
            message: "Product image is required",
        });
    }

    if (!name || !price || !description) {
        return res.status(400).json({
            success: false,
            message: "Name, price and description are required",
        });
    }

    try {
        const product = await productModel.create({
            name,
            price: Number(price),
            description,
            image: `/images/${file.filename}`,
            uploadedBy: user._id,
        });

        await product.populate("uploadedBy", "name");

        return res.status(201).json({
            success: true,
            product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
                uploadedBy: {
                    _id: product.uploadedBy._id,
                    name: product.uploadedBy.name,
                },
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while adding product",
        });
    }
};

const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const user = (req as any).user;
    const file = (req as any).file;

    try {
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.uploadedBy.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own products",
            });
        }

        product.name = name || product.name;
        product.price = price ? Number(price) : product.price;
        product.description = description || product.description;

        if (file) {
            product.image = `/images/${file.filename}`;
        }

        await product.save();
        await product.populate("uploadedBy", "name");

        return res.json({
            success: true,
            product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
                uploadedBy: {
                    _id: product.uploadedBy._id,
                    name: product.uploadedBy.name,
                },
                canManage: true,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating product",
        });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user;

    try {
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.uploadedBy.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own products",
            });
        }

        await productModel.findByIdAndDelete(id);

        return res.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while deleting product",
        });
    }
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };