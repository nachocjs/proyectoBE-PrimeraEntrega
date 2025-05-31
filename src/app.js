import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();

app.use(express.json());

const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json")

//GET All Products
app.get("/api/products", async(req, res)=> {
  try {
    const products = await productManager.getProducts();

    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

//POST Add Product
app.post("/api/products", async(req, res) => {
  try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }

        const newProduct = await productManager.addProduct({ title, description, code, price, stock, category, thumbnails })

        res.status(201).json({status : "success", newProduct})
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

//DELETE Product by id
app.delete("/api/products/:pid", async(req, res)=> {
  try {
    const productId = req.params.pid;
    const products = await productManager.deleteProductById(productId);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

//PUT Update Product
app.put("/api/products/:pid", async(req, res)=> {
  try {
    const productId = req.params.pid;
    const updatedData = req.body;

    const products = await productManager.updateProductById(productId, updatedData);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

//GET ProductById
app.get("/api/products/:pid", async(req, res)=> {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);

    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

//POST Add new cart
app.post("/api/carts", async(req, res) => {
  try {
    const carts = await cartManager.newCart();
    res.status(201).json({ status : "success", carts });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

//POST Add Product Cart
app.post("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;  
    const productId = req.params.pid; 
    const { quantity } = req.body;   

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ status: "error", message: "Debe ingresar un número valido" });
    }

    
    const updatedCart = await cartManager.addProductInCart(parseInt(cartId), parseInt(productId), parseInt(quantity));

    res.status(200).json({ status: "success", updatedCart });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});


//GET Cart Products By Id
app.get("/api/carts/:cid", async(req, res)=> {
  try {
    const cartId = req.params.cid;
    const products = await cartManager.getCartProductsById(cartId);

    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});


app.listen(8080, ()=> {
  console.log("Servidor iniciado en el puerto 8080");
});