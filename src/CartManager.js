import fs from "fs"

class CartManager{

  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId(carts) {
    if (carts.length > 0) {
      return carts[carts.length - 1].id + 1;
    } else {
      return 1;
    }
  }

  async newCart(){
    try {
     const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
     const carts = JSON.parse(fileData);   

     const newId = this.generateNewId(carts);
     const cart = { id: newId,
                    Products:[],
     };
     carts.push(cart);

     await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
     return carts;


    } catch (error) {
        throw new Error("Error al crear el producto", error.message);
    }
  }

  
}
export default CartManager;