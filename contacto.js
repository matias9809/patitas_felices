const { createApp } = Vue;

createApp({
    data() {

        return {
            data: {
                nombre: "",
                apellido: "",
                telefono: "",
                mascota: "",
                mensaje: ""
            },
            errors: {
                nombre: "",
                apellido: "",
                telefono: "",
                mascota: "",
                mensaje: ""
            },
            sending: null

        }

    },
    methods: {
        submit() {

            this.evaluarInputs(true);

            console.log(Object.values(this.errors))

            if(!Object.values(this.errors).some(e => e !== "")){

                this.sending = true;

                setTimeout(() => this.sending = false, 2000)

            }

        },
        evaluarInputs(isSending){

            for(let [key] of Object.entries(this.errors)){

                if (isSending && !this.data[key]) this.errors[key] = "*campo obligatorio";

                else if(this.data[key]) this.errors[key] = "";

                if(this.data[key]){

                    if(!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g.test(this.data[key]) && (key === "nombre" || key === "apellido" || key === "mascota")) this.errors[key] = "*sólo introducir letras";
    
                    else if(key === "telefono" && !/^[0-9]+$/g.test(this.data[key])) this.errors.telefono = "*sólo introducir números";

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