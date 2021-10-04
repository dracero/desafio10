const express = require('express')
const router = express.Router()
const prod = require('../models/producto')



router.get('/vista',async (req,res)=>{
    const productos = await prod.getAll()
    res.render('vista',{ layout: 'index',productos: productos, hayProductos:  productos.length ? true : false})
  })

module.exports= router