const Producto = require('../models/producto');
const Usuarios = require('../models/usuario');
const Categoria = require('../models/categoria');


const crearproducto = async (req,res) => {
    try {
        const producto = await Producto.find({ _id: { $ne: "63b50531f2b31c66ebd81b11" } });
        const productos = producto.reverse();
        res.json({
            ok:true,
            producto:productos
        })
    } catch (error) {
        console.log(error)
    }
    }
    const productoPrincipal = async (req,res) => {
        try {
            const producto = await Producto.findById("63b50531f2b31c66ebd81b11");
            res.json({
                ok:true,
                data:producto
            })
        } catch (error) {
            console.log(error)
        }
        }

    const crearCategoria = async (req,res) => {
        const categoris = req.params.crear;
        try {
            const categoria = await Categoria.find({familia:categoris});
            const categorias = categoria.reverse();
            res.json({
                ok:true,
                categorias
            })
        } catch (error) {
            console.log(error)
        }
        }
    

    const crearusuario = async (req,res) => {
        try {
            let producto = await Usuarios.find();
            producto = producto.reverse();
            res.json({
                ok:true,
                producto
            })
        } catch (error) {
            console.log(error)
        }
        }
    
const productosUserMostrar = async (req,res) => {
    const miId = req.params.user;
    try {
        const producto = await Producto.find().limit(20).sort();
        res.json({
            ok:true,
            producto:producto
        })
    } catch (error) {
        console.log(error)
    }
    }
    
    
    

module.exports ={
    crearproducto,
    productosUserMostrar,
    crearusuario,
    crearCategoria,
    productoPrincipal
}