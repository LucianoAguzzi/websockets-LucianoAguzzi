import express  from 'express';
import handlebars from 'express-handlebars'
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// Configurar rutas y middlewares de Express
app.use(express.static('public'));

app.get('/', (req, res) => {
  // Array de productos de ejemplo
  const products = ['Producto 1', 'Producto 2', 'Producto 3'];

  res.render('index', { products });
});

app.get('/realtimeproducts', (req, res) => {
  const products = ['Producto 1', 'Producto 2', 'Producto 3'];
  res.render('realTimeProducts', { products });
});

app.post('/create-product', (req, res) => {
  const { productName } = req.body;

  // Realiza las operaciones necesarias para crear el producto

  // Emitir el evento 'newProduct' a todos los clientes conectados
  io.emit('newProduct', productName);

  res.redirect('/realtimeproducts');
});

const socket = io();

const productForm = document.querySelector('#product-form');

productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const productName = document.querySelector('input[name="productName"]').value;

  // Enviar los datos al servidor a través de websockets
  socket.emit('createProduct', { productName });
});

// Configurar eventos de Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  // Evento para crear un producto
  socket.on('createProduct', (data) => {
    const { productName } = data;

    // Realizar las operaciones necesarias para crear el producto

    // Emitir el evento 'newProduct' a todos los clientes conectados
    io.emit('newProduct', productName);
  });

  // ...
});

// Configurar eventos de Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Escucha el evento 'newProduct' para agregar un producto
socket.on('newProduct', (product) => {
  products.push(product);
  io.emit('productUpdate', products);
});

// Escucha el evento 'deleteProduct' para eliminar un producto
socket.on('deleteProduct', (product) => {
  const index = products.indexOf(product);
  if (index !== -1) {
    products.splice(index, 1);
    io.emit('productUpdate', products);
  }
})

// Iniciar el servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`server listening on port" + ${PORT}`);
})