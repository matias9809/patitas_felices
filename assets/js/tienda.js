const { createApp } = Vue
createApp( {
    
    computed: {

        cargando(){

            if(!this.tarjetas.length) setTimeout(() => this.estaCargando = false, 2000)
        
        }

    }
    }).mount("#app")

