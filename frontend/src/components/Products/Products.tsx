import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";

type ProductsProps = {
    url: string;
    token: string;
};

type Product = {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    uploadedBy: {
        _id: string;
        name: string;
    } | null;
    canManage: boolean;
};

export default function Products({ url, token }: ProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState("");
    const [editImage, setEditImage] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
    });
    const [image, setImage] = useState<File | null>(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${url}/api/products`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setProducts(response.data.products || []);
        } catch (err: unknown) {
            console.error((err as Error).message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [token]);

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        if (!image) {
            setMessage("Please choose a product image");
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("description", formData.description);
        data.append("image", image);

        try {
            const response = await axios.post(`${url}/api/products`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                setFormData({ name: "", price: "", description: "" });
                setImage(null);
                setMessage("Product uploaded successfully");
                fetchProducts();
            } else {
                setMessage(response.data.message || "Upload failed");
            }
        } catch (error) {
            setMessage("Upload failed. Please try again.");
        }
    };

    const startEditing = (product: Product) => {
        setEditingId(product._id);
        setEditImage(null);
        setFormData({
            name: product.name,
            price: String(product.price),
            description: product.description,
        });
        setMessage("");
    };

    const stopEditing = () => {
        setEditingId("");
        setEditImage(null);
        setFormData({ name: "", price: "", description: "" });
    };

    const updateProduct = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("description", formData.description);

        if (editImage) {
            data.append("image", editImage);
        }

        try {
            const response = await axios.put(`${url}/api/products/${editingId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                stopEditing();
                setMessage("Product updated successfully");
                fetchProducts();
            } else {
                setMessage(response.data.message || "Update failed");
            }
        } catch (error) {
            setMessage("Update failed. You can only update your own product.");
        }
    };

    const deleteProduct = async (productId: string) => {
        const confirmDelete = window.confirm("Delete this product?");

        if (!confirmDelete) {
            return;
        }

        setMessage("");

        try {
            const response = await axios.delete(`${url}/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setMessage("Product deleted successfully");
                fetchProducts();
            } else {
                setMessage(response.data.message || "Delete failed");
            }
        } catch (error) {
            setMessage("Delete failed. You can only delete your own product.");
        }
    };

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
            {token && (
                <form onSubmit={editingId ? updateProduct : onSubmitHandler} className="grid gap-4 rounded-lg bg-white p-5 shadow-sm md:grid-cols-[1fr_160px_1fr_auto] md:items-end">
                    <label className="flex flex-col gap-2 text-sm font-semibold">
                        Name
                        <input name="name" value={formData.name} onChange={onChangeHandler} required className="rounded border border-slate-300 p-3 font-normal outline-none focus:border-slate-950" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold">
                        Price
                        <input name="price" value={formData.price} onChange={onChangeHandler} type="number" min="0" required className="rounded border border-slate-300 p-3 font-normal outline-none focus:border-slate-950" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold">
                        Image
                        <input type="file" accept="image/*" onChange={(event) => editingId ? setEditImage(event.target.files?.[0] || null) : setImage(event.target.files?.[0] || null)} required={!editingId} className="rounded border border-slate-300 p-2 font-normal" />
                    </label>
                    <div className="flex gap-2">
                        <button type="submit" className="rounded bg-slate-950 px-6 py-3 font-bold text-white cursor-pointer">
                            {editingId ? "Update" : "Upload"}
                        </button>
                        {editingId && (
                            <button type="button" onClick={stopEditing} className="rounded border border-slate-300 px-5 py-3 font-bold text-slate-700 cursor-pointer">
                                Cancel
                            </button>
                        )}
                    </div>
                    <label className="flex flex-col gap-2 text-sm font-semibold md:col-span-4">
                        Description
                        <textarea name="description" value={formData.description} onChange={onChangeHandler} required rows={3} className="resize-none rounded border border-slate-300 p-3 font-normal outline-none focus:border-slate-950" />
                    </label>
                    {message && <p className="text-sm font-semibold text-slate-700 md:col-span-4">{message}</p>}
                </form>
            )}

            {!token && (
                <p className="rounded-lg bg-white p-4 text-center text-sm font-medium text-slate-600">
                    Login or sign up to upload products. You can still view products as a guest.
                </p>
            )}

            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
                {products.map((product) => (
                    <article key={product._id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-black/10">
                        <div className="border-b border-slate-200 bg-slate-100 p-2">
                            <div className="overflow-hidden rounded-md border border-slate-300 bg-white">
                                <img src={`${url}${product.image}`} alt={product.name} className="h-44 w-full object-cover" />
                            </div>
                        </div>

                        <div className="flex min-h-44 flex-col gap-3 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="text-lg font-bold text-slate-950">{product.name}</h2>
                                <p className="shrink-0 rounded border border-slate-200 px-3 py-1 text-sm font-bold text-slate-950">Rs. {product.price}</p>
                            </div>

                            <p className="flex-1 text-sm leading-6 text-slate-600">{product.description}</p>

                            {product.uploadedBy && (
                                <p className="border-t border-slate-100 pt-3 text-sm font-semibold text-slate-700">
                                    Uploaded by {product.uploadedBy.name}
                                </p>
                            )}

                            {product.canManage && (
                                <div className="flex gap-2 border-t border-slate-100 pt-3">
                                    <button onClick={() => startEditing(product)} className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 cursor-pointer">
                                        Edit
                                    </button>
                                    <button onClick={() => deleteProduct(product._id)} className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-bold text-white cursor-pointer">
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}