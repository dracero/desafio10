const express = require('express')
const handlebars = require('express-handlebars')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const Producto = require('./models/producto')
const mensaje = require('./models/mensaje')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(express.static(__dirname + '/public'))
app.engine('hbs',handlebars({
  extname: '.hbs',
  layoutsDir: __dirname + '/views/layouts', 
}))
app.set('view engine','hbs')
app.set('views', __dirname + '/views');


//Rutas 
app.get('/',(req,res)=>{
  res.render('form',{layout: 'index'})
})
app.use('/productos',require('./routes/rutvist'))

//Rutas API
app.use('/api/productos', require('./routes/api/rutapi'))

//Sockets
io.on('connect', async (socket) =>{
  socket.emit('productos',await Producto.getAll())
  socket.on('productos:update',async  () =>{
      io.sockets.emit('productos',await Producto.getAll())
    }
  )
    
  socket.emit('mensajes',await mensaje.getAll())
  socket.on('mensajes:nuevo',async (msg) => {
      await mensaje.save(msg)
      io.sockets.emit('mensajes', await mensaje.getAll())
  })
})

// Middleware para manejar errores
app.use((error, req, res, next) => {
  res.status(error.code || 500).json({ error : error.message })
})

const PORT = 8080

const server = http.listen(PORT, () => {
  console.log(`servidor escuchando en http://localhost:${PORT}`)
})

server.on('error', error => {
  console.log('error en el servidor:', error)
})
