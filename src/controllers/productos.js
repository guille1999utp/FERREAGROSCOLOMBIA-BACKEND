const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Videos = require('../models/videos');
const Imagenes = require('../models/Imagenes');

const categorias = async (req,res) => {  
try {
  const categorias = await Categoria.find({mostrar: "true",familia:"familia"});
  res.json({
      ok:true,
      filtervar:categorias
      })
} catch (error) {
  console.log(error);
  res.json({
      ok:false,
      msg:'no se encontro producto'
  })
}
  }


  const categoriasindividual  = async (req,res) => {  

    try {
      let familia = await Categoria.find({familia: "familia"});
      familia = familia.map(function(filter){
        return filter.categoria
      })
      let categoria = await Categoria.find({familia: "categoria"});
      categoria = categoria.map(function(filter){
        return filter.categoria
      })
      let subCategoria = await Categoria.find({familia: "subCategoria"});
      subCategoria = subCategoria.map(function(filter){
        return filter.categoria
      })
          res.json({
          ok:true,
          familia,
          categoria,
          subCategoria
          })
    } catch (error) {
      console.log(error);
      res.json({
          ok:false,
          msg:'no se encontro producto'
      })
    }
      }

      const categoriasPersonalizadas  = async (req,res) => {  
        const categoriabuscar = req.params.hijos;

        try {
          let categorias = await Categoria.find({familia:categoriabuscar});
          categorias = categorias.map(function(filter){
            return filter.categoria
          })
          res.json({
              ok:true,
              indi:categorias
              })
        } catch (error) {
          console.log(error);
          res.json({
              ok:false,
              msg:'no se encontro producto'
          })
        }
          }

          const categoriasPersonalizadashijos  = async (req,res) => {  
            const categoriabuscar = req.params.hijos;
            const { categoria = ''} = req.query;
            try {
              if(categoria.length > 0){
                let subcategorias = await Categoria.find({familia:"subCategoria",hijo:categoria});
                subcategorias = subcategorias.map(function(filter){
                  return filter.categoria
                })
                let categorias = await Categoria.find({familia:"categoria",hijo:categoriabuscar});
                categorias = categorias.map(function(filter){
                  return filter.categoria
                })
                res.json({
                  ok:true,
                  subcategorias,
                  categorias
                  })
              }else{
                let categorias = await Categoria.find({familia:"categoria",hijo:categoriabuscar});
                categorias = categorias.map(function(filter){
                  return filter.categoria
                })
                res.json({
                  ok:true,
                  categorias
                  })
              }
             
              
            } catch (error) {
              console.log(error);
              res.json({
                  ok:false,
                  msg:'no se encontro producto'
              })
            }
              }

const pedirproducto = async (req,res) => {
    const producto = req.params.producto;
    
try {
    const descr = await Producto.findById( producto );
    res.json({
        ok:true,
        de:descr.de,
        pid:descr._id,
        textdescripsion:descr.textdescripsion,
        fotosdescripsion: descr.fotosdescripsion,
        titulo:descr.titulo,
        detalles: descr.detalles
        })
} catch (error) {
    console.log(error);
    res.json({
        ok:false,
        msg:'no se encontro producto'
    })
}
    }
    
    const informacionAdicional = async (req,res) => {
        const producto = req.params.busqueda;
      const {modelo = '',min = 0,max = 0,categoria = '',mayor = 'false',menor = 'false'} = req.query;
        try {
            let filtervar = await Producto.find({$or: [{ titulo: { $regex: producto,$options:'i' } },{ textdescripsion: { $regex: producto , $options:'i'} }] });
            const n1 = parseInt(min);
            const n2 = parseInt(max);

            if(modelo.length !== 0){
                  filtervar = filtervar.filter(function(producto){
                    return modelo === producto.detalles[0].Age;
                 })
                    }else{
                      console.log('no entro a modelo');
                    }

             if(n1 !== 0 ){
                 filtervar = filtervar.filter(function(producto){
                  const number = parseInt(producto.detalles[0].Precio)
                  if(number > n1){
                    return producto;
                  }
                 })

                  } 
                 
             if(n2 !== 0 ){

                 filtervar = filtervar.filter(function(producto){
                   const number = parseInt(producto.detalles[0].Precio)
                   if(number <= n2){
                     return producto;
                   }
                 })
               } 
             if(categoria.length !== 0 ){
                 filtervar = filtervar.filter(function(producto){
                   return producto.detalles[0].Categoria === categoria;
                })
              }  

           
             if(mayor === 'true' ){
              filtervar.sort(function (a, b) {
                if (parseInt(a.detalles[0].Precio) > parseInt(b.detalles[0].Precio)) {
                  return -1;
                }
                if (parseInt(a.detalles[0].Precio) < parseInt(b.detalles[0].Precio)) {
                  return 1;
                }
                return 0;
              });
            } 
            if(menor === 'true' ){
              filtervar.sort(function (a, b) {
                if (parseInt(a.detalles[0].Precio) > parseInt(b.detalles[0].Precio)) {
                  return 1;
                }
                if (parseInt(a.detalles[0].Precio) < parseInt(b.detalles[0].Precio)) {
                  return -1;
                }
                return 0;
              });
            }

            res.json({
                ok:true,
                filtervar
                })
        } catch (error) {
            console.log(error);
            res.json({
                ok:false,
                msg:'no se encontro producto'
            })
        }

        }

        const informacionmostrarcategoria = async (req,res) => {
          const categoriabuscar = req.params.categoria;
         try{ 
           if(categoriabuscar === 'descuentos'){
            const filter = await Producto.find({"detalles.PrecioD":{$gt:"1"}}).limit(100).sort({creacion: 'desc'});
            const filtervar = filter.filter((data)=>{
              return parseInt(data.detalles[0].PrecioD) >  parseInt(data.detalles[0].Precio)
            })
            return res.json({
                ok:true,
                filtervar
                })
           }
           if(categoriabuscar === 'destacados'){
            const filtervar = await Producto.find().limit(30).sort({creacion: 'desc'});
            return res.json({
                ok:true,
                filtervar
                })
           }
          const filtervar = await Producto.find({"detalles.Familia": categoriabuscar}).limit(30).sort({creacion: 'desc'});
              return res.json({
                  ok:true,
                  filtervar
                  })

                  }catch (error) {
              console.log(error);
              res.json({
                  ok:false,
                  msg:'no se encontro producto'
              })
          }
          }
          const CategoriasTodas = async (req,res) => {
            const categoriabuscar = req.params.familia;
            const {categoria = '',subCategoria = ''} = req.query;
            const limit = req.header('limit');
           try{ 
             if(categoriabuscar === 'todos'){
              let filtervar = await Producto.find().limit(limit*100);
              const length = filtervar.length;
              filtervar = filtervar.slice(limit*100-100,limit*100);
              res.json({
                  ok:true,
                  filtervar,
                  length
                  })
             }else{
               if(subCategoria.length >0){
                let filtervar = await Producto.find({"detalles.Familia":  categoriabuscar,"detalles.Categoria":  categoria,"detalles.subCategoria":  subCategoria});
                const length = filtervar.length;
                filtervar = filtervar.slice(0,limit*100);
                res.json({
                    ok:true,
                    filtervar,
                    length
                    })
               }else if(categoria.length >0){
                let filtervar = await Producto.find({"detalles.Familia":  categoriabuscar,"detalles.Categoria":  categoria}).sort({"detalles.Categoria":  1,"detalles.subCategoria":  0});
                const length = filtervar.length;
                filtervar = filtervar.slice(0,limit*100);
                res.json({
                    ok:true,
                    filtervar,
                    length
                    })
               }else{
                let filtervar = await Producto.find({"detalles.Familia":  categoriabuscar}).sort({"detalles.Familia":1,"detalles.Categoria":  0,"detalles.subCategoria":  0});
                const length = filtervar.length;
                filtervar = filtervar.slice(0,limit*100);
                res.json({
                    ok:true,
                    filtervar,
                    length
                    })
               }
               
             }
                    }catch (error) {
                console.log(error);
                res.json({
                    ok:false,
                    msg:'no se encontro producto'
                })
            }
            }


            const VideosTodos = async (req,res) => {
             try{ 
                const videos = await Videos.find();
                res.json({
                    ok:true,
                    videos
                    })
 
                      }catch (error) {
                  console.log(error);
                  res.json({
                      ok:false,
                      msg:'no se encontro videos'
                  })
              }
              }
    
              const ImagenesTodos = async (req,res) => {
                try{ 
                   const imagene = await Imagenes.find();
                   res.json({
                       ok:true,
                       imagene
                       })
    
                         }catch (error) {
                     console.log(error);
                     res.json({
                         ok:false,
                         msg:'no se encontro Imagenes'
                     })
                 }
                 }

              const SubirUrl = async (req,res) => {
                console.log(req)
                try{ 
                   const videos = new Videos({urlvideo:req.body.url});
                   await videos.save();
                   res.json({
                       ok:true,
                       videos
                       })
    
                         }catch (error) {
                     console.log(error);
                     res.json({
                         ok:false,
                         msg:'video fallido'
                     })
                 }
                 }
       
            const FeedBack = async (req,res) => {
              res.json({
                ok:true,
                Preference_id: req.query.preference_id,
                Payment: req.query.payment_id,
                Status: req.query.status,
                MerchantOrder: req.query.merchant_order_id,
                Typepago: req.query.payment_type
              });
              }
      

module.exports ={
    pedirproducto,
    informacionAdicional,
    informacionmostrarcategoria,
    FeedBack,
    categorias,
    categoriasindividual,
    CategoriasTodas,
    VideosTodos,
    SubirUrl,
    ImagenesTodos,
    categoriasPersonalizadas,
    categoriasPersonalizadashijos
}