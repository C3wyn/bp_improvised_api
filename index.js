const express = require('express');
const cors = require('cors'); // Add this line to enable CORS
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('./controller/products.controller');
const { getExtras, updateExtra, createExtra, deleteExtra } = require('./controller/extras.controller');
const { getIngredients, updateIngredient, createIngredient, deleteIngredient } = require('./controller/ingredients.controller');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('./controller/categories.controller');
const { createOrder, getOpenOrders, updateOrder, getOrderHistory } = require('./controller/orders.controller');

const app = express();
const port = process.env.API_PORT;

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

app.use(express.json());
app.use(cors()); // Add this line to enable CORS

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('newOrder', (order) => {
        console.log('new order:', order);
        io.emit('order', order);
    });
});

app.get('/products',  getProducts);
app.post('/product',  createProduct);
app.put('/product/:id',  updateProduct);
app.delete('/product/:id',  deleteProduct);

app.get('/extras',  getExtras);
app.post('/extra',  createExtra);
app.put('/extra/:id',  updateExtra);
app.delete('/extra/:id',  deleteExtra);

app.get('/ingredients', getIngredients);
app.post('/ingredient', createIngredient);
app.put('/ingredient/:id', updateIngredient);
app.delete('/ingredient/:id', deleteIngredient);

app.get('/categories', getCategories);
app.post('/category', createCategory);
app.put('/category/:id', updateCategory);
app.delete('/category/:id', deleteCategory);

app.get('/openOrders', getOpenOrders);
app.post('/createOrder', createOrder, informSockets);
app.put('/updateOrder/:id', updateOrder, informSockets);
app.get('/orderHistory', getOrderHistory);
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

function informSockets(req, res) {
    io.emit('orders', 'Update orders');
}