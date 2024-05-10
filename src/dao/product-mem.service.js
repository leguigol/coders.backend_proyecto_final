class ProductMemServiceDao {
    products;
    constructor() {
      this.products = [];
    }
  
    getAllProducts = async (req, res) => {
      try {
        return await this.products;
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    };
  
    getProductById = async (req, res) => {
      try {
        return await this.products.find((p) => p.id === req.params.productId);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    };
  
    createProduct = async (productDTO) => {
      try {
        this.products.push(productDTO);
        return productDTO;
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    };
  
    deleteProduct = async (req, res) => {
      try {
        // TODO: delete product in memory
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    };
  }
  
  export default ProductMemServiceDao;