const { createApp } = Vue;

createApp({
    data() {

        return {
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
    methods: {
        submit() {

            this.evaluarInputs(true);

            if(!Object.values(this.errores).some(e => e !== "") || 
                Object.entries(this.errores).filter(e => e[1] !== "").length === 1 && 
                this.errores.otraMascota &&
                this.data.mascota !== "otro" ){

                this.enviando = true;

                setTimeout(() => this.enviando = false, 2000)

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

        reEvaluarInputs() {

            this.evaluarInputs(false);

        }

    }
}).mount('#app')