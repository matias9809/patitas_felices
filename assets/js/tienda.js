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
            perroOGtao: "",
            disponibles_iniciales:[],
            agregandoAlCarrito: false,
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

            console.log(this.perroOGtao)
            let filtradoPorBusqueda = this.productos.filter( eventos => eventos.producto.toLowerCase().includes( this.valorDeBusqueda.toLowerCase()))
            if( this.chequeados.length === 0 ){
                this.productosFiltrados = filtradoPorBusqueda
            }else{
                let filtradosPorCheck
                if(this.chequeados<=1500){
                    filtradosPorCheck = filtradoPorBusqueda.filter( eventos =>this.chequeados>=eventos.precio)
                }else if(this.chequeados==1501){
                    filtradosPorCheck = filtradoPorBusqueda.filter( eventos => (this.chequeados<eventos.precio&&eventos.precio<=2000))
                }
                else if(this.chequeados==2001){
                    filtradosPorCheck = filtradoPorBusqueda.filter( eventos => this.chequeados<=eventos.precio)
                    
                }
                this.productosFiltrados = filtradosPorCheck 
            }
        },
        agregar: function(objeto){//crear v-if en disponibles y boton agregar colocar mensaje no hay displonibles
            this.agregadoAlcarrito()
            
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
        agregadoAlcarrito(){

            this.agregandoAlCarrito = true;

            setTimeout(() => this.agregandoAlCarrito = false, 2000)

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
