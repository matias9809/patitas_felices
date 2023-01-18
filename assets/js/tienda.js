const { createApp } = Vue

createApp( {
    data(){
        return {
            todosLosProductos: [],
            compras: [],
            productos:[],
            informacionDeTarjeta:{},
            chequeados:"",
            valorDeBusqueda:"",
            switchCheck: "",
            todos:[],
            estaCargando: true,
            productosFiltrados : [],
            filtradoPorMascota: [],
            perro: [],
            disponibles_iniciales:[],
            data: {
                nombre: "",
                apellido: "",
                telefono: "",
                mascota: "",
                otraMascota: "",
                mensaje: ""
            },
            errores: {
                nombre: "",
                apellido: "",
                telefono: "",
                mascota: "",
                otraMascota: "",
                mensaje: "",

            },
            enviando: null
        }
    },
    created(){
        fetch(`https://mindhub-xj03.onrender.com/api/petshop`)
            .then( respuesta => respuesta.json() )
            .then( datos => {
                this.todosLosProductos=[...datos];
                this.todosLosProductos.forEach(producto=>producto.ventas=0);

                if(localStorage.getItem("nuestrosProductos"))
                this.todosLosProductos = JSON.parse(localStorage.getItem("nuestrosProductos"));
                let nombrePagina=location.pathname;//ve pagina nombre
                if (nombrePagina.includes("farmacia"))
                this.productos=this.todosLosProductos.filter(producto=>producto.categoria==="farmacia");
                else
                this.productos=this.todosLosProductos.filter(producto=>producto.categoria==="jugueteria");

                this.compras=this.todosLosProductos.filter(e=>e.ventas>0);

                this.disponibles_iniciales=[...new Set(datos.map(e=>{
                    return{
                        _id:e._id,
                        disponibles:e.disponibles,
                        ventas:0
                    }
                }))]

                this.productosFiltrados = this.productos;
            } )
            .catch()

            
    },
    methods: {
        filtroCruzado: function(){
            let filtradoPorBusqueda = this.productos.filter( eventos => eventos.producto.toLowerCase().includes( this.valorDeBusqueda.toLowerCase()))   

            let arrayFiltradoMascota = []
            if(this.perro == "perro"){
                let filtroPorTipoPerro = filtradoPorBusqueda.filter( eventos => eventos.producto.toLowerCase().includes("perro"))
                let filtroPorTipoCachorro = filtradoPorBusqueda.filter( eventos => eventos.producto.toLowerCase().includes("cachorro"))

                arrayFiltradoMascota.push(filtroPorTipoPerro)
                arrayFiltradoMascota.push(filtroPorTipoCachorro)
                arrayFiltradoMascota = arrayFiltradoMascota.flat()
            }else if(this.perro == "gato"){
                let filtroPorTipoGato = filtradoPorBusqueda.filter( eventos => eventos.producto.toLowerCase().includes("gato"))
                let filtroPorTipoGatito = filtradoPorBusqueda.filter( eventos => eventos.producto.toLowerCase().includes("gatito"))

                arrayFiltradoMascota.push(filtroPorTipoGato)
                arrayFiltradoMascota.push(filtroPorTipoGatito)

                arrayFiltradoMascota = arrayFiltradoMascota.flat()
            }else if(this.perro == "hueso"){
                let filtroPorJuguetes = filtradoPorBusqueda.filter( eventos => eventos.producto.toLowerCase().includes("hueso"))
                arrayFiltradoMascota = filtroPorJuguetes
            }else if(this.perro == "pelota"){
                let filtroPorJuguetes = filtradoPorBusqueda.filter( eventos => eventos.producto.toLowerCase().includes("pelota"))
                arrayFiltradoMascota = filtroPorJuguetes
            }else if(this.perro == "rascador"){
                let filtroPorJuguetes = filtradoPorBusqueda.filter( eventos => eventos.producto.toLowerCase().includes("rascador"))
                arrayFiltradoMascota = filtroPorJuguetes
            }else if(this.perro == "peluche"){
                let filtroPorPeluche = filtradoPorBusqueda.filter( eventos => eventos.producto.toLowerCase().includes("peluche"))
                let filtroPorPollito = filtradoPorBusqueda.filter( eventos => eventos.producto.toLowerCase().includes("pollito"))

                arrayFiltradoMascota.push(filtroPorPeluche)
                arrayFiltradoMascota.push(filtroPorPollito)
                arrayFiltradoMascota = arrayFiltradoMascota.flat()
            }else{
                arrayFiltradoMascota = filtradoPorBusqueda
            }

            if( this.chequeados.length === 0 ){
                this.productosFiltrados = arrayFiltradoMascota
            }else{
                let filtradosPorCheck
                if(this.chequeados<=1500){
                    filtradosPorCheck = arrayFiltradoMascota.filter( eventos =>this.chequeados>=eventos.precio)
                }else if(this.chequeados==1501){
                    filtradosPorCheck = arrayFiltradoMascota.filter( eventos => (this.chequeados<eventos.precio&&eventos.precio<=2000))
                }
                else if(this.chequeados==2001){
                    filtradosPorCheck = arrayFiltradoMascota.filter( eventos => this.chequeados<=eventos.precio)
                    
                }
                this.productosFiltrados = filtradosPorCheck 
            }
        },
        agregar: function(objeto){//crear v-if en disponibles y boton agregar colocar mensaje no hay displonibles
            this.todosLosProductos.find(producto=>{
                if(producto._id==objeto._id){
                producto.disponibles--;
                producto.ventas++;}
            });
            this.compras=this.todosLosProductos.filter(e=>e.ventas>0);
            console.log(this.compras)
            localStorage.setItem("nuestrosProductos",JSON.stringify(this.todosLosProductos));
        },
        eliminar: function(objeto){
            this.todosLosProductos.find(producto=>{
                if(producto._id==objeto._id){
                producto.disponibles++;
                producto.ventas--;}
            });
            this.compras=this.todosLosProductos.filter(e=>e.ventas>0);
            localStorage.setItem("nuestrosProductos",JSON.stringify(this.todosLosProductos));
        },
        verMas: function(id){
            this.todosLosProductos.forEach(tarjeta => tarjeta._id === id ? this.informacionDeTarjeta = tarjeta : `No hay informacion acerca del producto` );
        },
        removerCarrito:function(){
            this.todosLosProductos.forEach(e=>{
                this.disponibles_iniciales.forEach(f=>{
                    if(e._id==f._id){
                        e.disponibles=f.disponibles
                        e.ventas=f.ventas 
                    }
                })
                
            })
            localStorage.removeItem("nuestrosProductos")
            this.compras=this.todosLosProductos.filter(e=>e.ventas>0);
        },
        submit() {

            this.evaluarInputs(true);

            if(!Object.values(this.errores).some(e => e !== "") || 
                Object.entries(this.errores).filter(e => e[1] !== "").length === 1 && 
                this.errores.otraMascota &&
                this.data.mascota !== "otro" ){

                this.enviando = true;

                setTimeout(() => this.enviando = false, 2000)

                setTimeout(() => {

                    this.resetearDatos()
                    this.enviando = null
    
                }, 6000)

            }

        },

        resetearDatos(){

            for(let [key, value] of Object.entries(this.data)){

                this.data[key] = ""

            }

        },

        evaluarInputs(isenviando){

            for(let [key] of Object.entries(this.errores)){

                if (isenviando && !this.data[key]) this.errores[key] = "*campo obligatorio";

                else if(this.data[key]) this.errores[key] = "";

                if(this.data[key]){

                    if(!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g.test(this.data[key]) && 
                        (   key === "nombre" || 
                            key === "apellido" || 
                            key === "OtraMascota")) this.errores[key] = "*sólo introducir letras";
    
                    else if(key === "telefono" && 
                            !/^[0-9]+$/g.test(this.data[key])) this.errores.telefono = "*sólo introducir números";

                }

            }

        }
    },
    computed: {

        cargando(){

            if(this.productosFiltrados.length) setTimeout(() => this.estaCargando = false, 2000)
        
        },
        reEvaluarInputs() {

            this.evaluarInputs(false);

        }


    } 
    }).mount("#app")
