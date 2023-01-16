const { createApp } = Vue
createApp( {
    data(){
        return {
            tarjetas : [],
            categorias : [],
            valorDeBusqueda: "",
            chequeados: [],
            tarjetasFiltradas : [],
            sin_datos:"looding",
            informacionDeTarjeta: ""
        }
    },
    created(){
        fetch(`https://mindhub-xj03.onrender.com/api/petshop`)
            .then( respuesta => respuesta.json() )
            .then( datos => {
                this.tarjetas = datos.filter(e=>e.categoria=="jugueteria")
                this.tarjetasFiltradas = this.tarjetas
                this.categorias = [ ...new Set( this.tarjetas.map( tar => tar.categoria ) ) ]
                this.informacionDeTarjeta = ""
            } )
            .catch( )   
    },
    methods: {
        filtroCruzado: function(){
            let filtradoPorBusqueda = this.tarjetas.filter( eventos => eventos.producto.toLowerCase().includes( this.valorDeBusqueda.toLowerCase()))
            if( this.chequeados.length === 0 ){
                this.tarjetasFiltradas = filtradoPorBusqueda
            }else{
                let filtradosPorCheck = filtradoPorBusqueda.filter( eventos => this.chequeados.includes( eventos.categoria ))
                this.tarjetasFiltradas = filtradosPorCheck 
            }
        },
        verMas: function(id){
            this.tarjetas.forEach(tarjeta => tarjeta._id === id ? this.informacionDeTarjeta = tarjeta : `No hay informacion acerca del producto` );
        }
    },

} ).mount("#app")