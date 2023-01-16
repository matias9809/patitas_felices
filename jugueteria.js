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
            informacionDeTarjeta: "",
            tarjetasFiltradasJuguetes: [],
            tarjetasFiltradasFarmacia: [],
            tarjetasFarmacia: [],
            tarjetasJuguete: []
        }
    },
    created(){
        fetch(`https://mindhub-xj03.onrender.com/api/petshop`)
            .then( respuesta => respuesta.json() )
            .then( datos => {
                this.tarjetas = datos
                this.tarjetasFarmacia = datos.filter(e=>e.categoria=="farmacia")
                this.tarjetasJuguetes = datos.filter(e=>e.categoria=="jugueteria")
                this.tarjetasFiltradasJuguetes = this.filtroCruzado(this.tarjetasJuguetes)
                this.tarjetasFiltradasFarmacia = this.filtroCruzado(this.tarjetasFarmacia)
                this.categorias = [ ...new Set( this.tarjetas.map( tar => tar.categoria ) ) ]
                
            } )
            .catch( )   
    },
    methods: {
        filtroCruzado: function(array2){
            let filtradoPorBusqueda = array2.filter( eventos => eventos.producto.toLowerCase().includes( this.valorDeBusqueda.toLowerCase()))
            if( this.chequeados.length === 0 ){
                return filtradoPorBusqueda
            }else{
                let filtradosPorCheck = filtradoPorBusqueda.filter( eventos => this.chequeados.includes( eventos.categoria ))
                return filtradosPorCheck 
            }
        },
        verMas: function(id){
            this.tarjetas.forEach(tarjeta => tarjeta._id === id ? this.informacionDeTarjeta = tarjeta : `No hay informacion acerca del producto` );
        }
    },

} ).mount("#app")