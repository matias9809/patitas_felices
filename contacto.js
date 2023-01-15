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
            errors: {
                nombre: "",
                apellido: "",
                telefono: "",
                mascota: "",
                otraMascota: "",
                mensaje: "",

            },
            sending: null

        }

    },
    methods: {
        submit() {

            this.evaluarInputs(true);

            console.log( Object.entries(this.errors).filter(e => e[1] !== "").length)
            console.log(this.errors.otraMascota)
            console.log(this.data.mascota)

            if(!Object.values(this.errors).some(e => e !== "") || 
                Object.entries(this.errors).filter(e => e[1] !== "").length === 1 && 
                this.errors.otraMascota &&
                this.data.mascota !== "otro" ){

                this.sending = true;

                setTimeout(() => this.sending = false, 2000)

            }

        },
        evaluarInputs(isSending){

            for(let [key] of Object.entries(this.errors)){

                if (isSending && !this.data[key]) this.errors[key] = "*campo obligatorio";

                else if(this.data[key]) this.errors[key] = "";

                if(this.data[key]){

                    if(!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g.test(this.data[key]) && 
                        (   key === "nombre" || 
                            key === "apellido" || 
                            key === "OtraMascota")) this.errors[key] = "*sólo introducir letras";
    
                    else if(key === "telefono" && 
                            !/^[0-9]+$/g.test(this.data[key])) this.errors.telefono = "*sólo introducir números";

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