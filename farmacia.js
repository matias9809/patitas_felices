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
                this.tarjetas = datos.filter(e=>e.categoria=="farmacia")
                this.tarjetasFiltradas = this.tarjetas
                this.categorias = [ ...new Set( this.tarjetas.map( tar => tar.precio ) ) ]
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
                this.tarjetasFiltradas = filtradosPorCheck 
            }
        } 
    },

} ).mount("#app")