const path = require('path');
const Products = require('./products');
const Orders = require('./orders');
const autoCatch = require('./lib/auto-catch'); // Middleware to automatically catch errors for async functions

/**
 * Handle the root route.
 * Serves the main HTML file when the root URL is accessed.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products.
 * Supports pagination using `offset` and `limit` query parameters and filtering by `tag`.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 */
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query; // Default values for offset and limit
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }));
}

/**
 * Get a single product by ID.
 * If the product does not exist, calls the next middleware for error handling.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) {
    return next(); // Pass to error handling middleware if not found
  }
  return res.json(product);
}

/**
 * Create a new product.
 * Expects product details in the request body.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 */
async function createProduct(req, res) {
  const product = await Products.create(req.body);
  res.json(product);
}

/**
 * Edit an existing product by ID.
 * Updates the product with the changes provided in the request body.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
async function editProduct(req, res, next) {
  const change = req.body;
  const product = await Products.edit(req.params.id, change);
  res.json(product);
}

/**
 * Delete a product by ID.
 * Removes the product from the database.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
async function deleteProduct(req, res, next) {
  const response = await Products.destroy(req.params.id);
  res.json(response);
}

/**
 * Create a new order.
 * Expects order details in the request body.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 */
async function createOrder(req, res) {
  const order = await Orders.create(req.body);
  res.json(order);
}

/**
 * Get a single order by ID.
 * If the order does not exist, calls the next middleware for error handling.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
async function getOrder(req, res, next) {
  const { id } = req.params;
  const order = await Orders.get(id);
  if (!order) {
    return next(); // Pass to error handling middleware if not found
  }
  return res.json(order);
}

/**
 * List all orders.
 * Supports pagination using `offset` and `limit` query parameters and filtering by `productId` or `status`.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 */
async function listOrders(req, res) {
  const { offset = 0, limit = 25, productId, status } = req.query;
  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status
  });
  res.json(orders);
}

/**
 * Edit an existing order by ID.
 * Updates the order with the changes provided in the request body.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 */
async function editOrder(req, res) {
  const change = req.body;
  const order = await Orders.edit(req.params.id, change);
  res.json(order);
}

/**
 * Delete an order by ID.
 * Removes the order from the database.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 */
async function deleteOrder(req, res) {
  const response = await Orders.destroy(req.params.id);
  res.json(response);
}

// Export all functions wrapped with autoCatch for automatic error handling
module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  createOrder,
  listOrders,
  editOrder,
  deleteOrder,
  getOrder
});

