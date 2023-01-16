const { createApp } = Vue
createApp( {
    data(){
        return {
            disponibles:[],
            tarjetas : [],
            categorias : [],
            valorDeBusqueda: "",
            chequeados: [],
            tarjetasFiltradas : [],
            carrito:[],
            aux:[]
        }
    },
    created(){
        fetch(`https://mindhub-xj03.onrender.com/api/petshop`)
            .then( respuesta => respuesta.json() )
            .then( datos => {
                switch(document.getElementById("titulo").innerHTML){
                    case "juguetes":{
                        this.disponibles =[...new Set( datos.map(e=>{
                            if(e.categoria=="jugueteria"){
                                return{
                                    _id:e._id,
                                    disponibles:e.disponibles
        
                                }
                            }
                        }))]
                        this.disponibles.shift()
                        console.log(this.disponibles)
                        this.tarjetas= datos.filter(e=>e.categoria=="jugueteria")
                        this.categorias=datos.filter(e=>e.categoria=="jugueteria")
                        this.tarjetasFiltradas = datos.filter(e=>e.categoria=="jugueteria")
                        console.log(this.tarjetasFiltradas,this.tarjetas)
                        this.categorias = [ ...new Set( this.categorias.map( tar => tar.precio ) ) ]
                        break
                    }
                    case "farmacia":{
                        this.disponibles =[...new Set( datos.map(e=>{
                            if(e.categoria=="farmacia"){
                        return{
                            _id:e._id,
                            disponibles:e.disponibles
                                }
                            }
                        }))]
                        this.tarjetas= datos.filter(e=>e.categoria=="farmacia")
                        this.categorias=datos.filter(e=>e.categoria=="farmacia")
                        this.tarjetasFiltradas = datos.filter(e=>e.categoria=="farmacia")
                        console.log(this.tarjetasFiltradas,this.tarjetas)
                        this.categorias = [ ...new Set( this.categorias.map( tar => tar.precio ) ) ]
                        break
                    }
                }

            } )
            .catch( )   
            JSON.parse(localStorage.getItem("carrito"))
    },
    methods: {
    filtroCruzado: function(){
            let filtradoPorBusqueda = this.tarjetas.filter( eventos => eventos.producto.toLowerCase().includes( this.valorDeBusqueda.toLowerCase()))
            if( this.chequeados.length === 0 ){
                this.tarjetasFiltradas = filtradoPorBusqueda
            }else{
                let filtradosPorCheck = filtradoPorBusqueda.filter( eventos => this.chequeados.includes( eventos.precio ))
                this.tarjetasFiltradas = filtradosPorCheck 
            }
        },
    agregar: function(objeto){
            if(objeto.disponibles==0){
                alert("no hay stock disponible")
            }
            if(objeto.disponibles>0){
                this.carrito=this.carrito.concat(objeto)
                objeto.disponibles--
                console.log(this.carrito)
                localStorage.setItem("carrito",JSON.stringify(this.carrito))
            }

        },
        eliminar: function(objeto){
            console.log("inicio")
            console.log(this.carrito.filter(e=>e._id===objeto._id))
            console.log(this.carrito)
            for(let prueba of this.carrito){
                console.log(prueba)
            }
            let filtro=this.disponibles.find(e=>e._id==objeto._id)
            if(this.carrito.some(e=>e._id==objeto._id)){
                this.aux=this.carrito.filter(e=>e._id==objeto._id)
                console.log(this.aux)
                console.log(objeto.disponibles,filtro.disponibles)
                if(objeto.disponibles<filtro.disponibles){
                    console.log("llego")
                    this.aux.shift()
                    objeto.disponibles++
                    console.log("eliminar 1",this.aux)
                }
                if(this.aux.length>0){
                console.log("aux mayor a 0")
                this.carrito=this.carrito.filter(e=>e._id!=objeto._id)
                this.carrito=this.carrito.concat(this.aux)
                console.log(this.carrito)}

                else{
                    console.log("else")
                    this.carrito=this.carrito.filter(e=>e._id!=objeto._id)
                    console.log(this.carrito)
                }
            }                
            else if(this.carrito.length==0){
                alert("no hay productos que eliminar en el carrito ")
            }
            else if(this.carrito.length>0){
                alert("ese producto no se encuentra en el carrito")
            }
            localStorage.setItem("carrito",JSON.stringify(this.carrito))
        }

    },

} ).mount("#app")