const { createApp } = Vue
createApp( {
    data(){
        return {
            tarjetas : [],
            categorias : [],
            valorDeBusqueda: "",
            chequeados: [],
            tarjetasFiltradas : [],
            sin_datos:"looding"
        }
    },
    created(){
        fetch(`https://mindhub-xj03.onrender.com/api/petshop`)
            .then( respuesta => respuesta.json() )
            .then( datos => {
                this.tarjetas = datos.filter(e=>e.categoria=="jugueteria")
                this.tarjetasFiltradas = this.tarjetas
                this.categorias = [ ...new Set( this.tarjetas.map( tar => tar.precio ) ) ]
/*                 this.categorias =this.tarjetas.foreach( tar => {
                    if(tar.precio<=1500){
                        categoria.push(1500)
                    }
                    else if(tar.precio<=2200&&tar.precio>1500){
                        categoria.push(2200)
                    }
                    else if(tar.precio>2200){
                        categoria.push(2201)
                    }
                } )  */
                        } )
            .catch( )   
    },
    methods: {
    filtroCruzado: function(){
            let filtradoPorBusqueda = this.tarjetas.filter( eventos => eventos.producto.toLowerCase().includes( this.valorDeBusqueda.toLowerCase()))
            if( this.chequeados.length === 0 ){
                this.tarjetasFiltradas = filtradoPorBusqueda
            }else{
                let filtradosPorCheck = filtradoPorBusqueda.filter( eventos => this.chequeados.includes( eventos.precio ))
/*                 let filtradosPorCheck = filtradoPorBusqueda.filter( eventos => {
                    if(chequeados==1500)
                    {this.chequeados.includes( eventos.precio<=chequeados )}
                    else if(chequeados==2200){
                        this.chequeados.includes( eventos.precio<=chequeados&&eventos>1500)
                    }
                    else if(chequeados>=2201){
                        this.chequeados.includes( eventos.precio>=chequeados)
                    } */
/*                 }) */
                this.tarjetasFiltradas = filtradosPorCheck 
            }
        } ,
        agregar: function(array){
            if(array.disponibles>0){
                this.carrito=this.carrito.concat(array)
                array.disponibles--
                console.log(this.carrito)
            }
            if(array.disponibles==0){
                alert("no hay stock disponible")
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
        }
    },

} ).mount("#app")