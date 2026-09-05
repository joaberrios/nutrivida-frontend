const formulario = document.getElementById("formAgendar");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    // Obtener los datos
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const nutricionista = document.getElementById("nutricionista").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const motivo = document.getElementById("motivo").value;


    // Obtener los mensajes
    const errorNombre = document.getElementById("errorNombre");

    const errorCorreo = document.getElementById("errorCorreo");
    const mensajeCorreo = document.getElementById("mensajeCorreo");

    const errorTelefono = document.getElementById("errorTelefono");
    const mensajeTelefono = document.getElementById("mensajeTelefono");

    const errorNutricionista = document.getElementById("errorNutricionista");
    const mensajeNutricionista = document.getElementById("mensajeNutricionista");

    const errorFecha = document.getElementById("errorFecha");
    const mensajeFecha = document.getElementById("mensajeFecha");

    const errorHora = document.getElementById("errorHora");
    const mensajeHora = document.getElementById("mensajeHora");

    const errorMotivo = document.getElementById("errorMotivo");
    const mensajeMotivo = document.getElementById("mensajeMotivo");

    const mensajeFinal = document.getElementById("mensajeFinal");


    let formularioCorrecto = true;


    // Validar nombre
    if (nombre.trim() === "") {

        errorNombre.textContent = "Debe ingresar su nombre";
        formularioCorrecto = false;

    } else {

        errorNombre.textContent = "";

    }


    // Validar correo
    if (correo.trim() === "") {

        errorCorreo.textContent = "Debe ingresar su correo electrónico";
        mensajeCorreo.textContent = "";
        formularioCorrecto = false;

    } else if (!correo.includes("@") || !correo.includes(".")) {

        errorCorreo.textContent = "Ingrese un correo válido, por ejemplo: nombre@gmail.com";
        mensajeCorreo.textContent = "";
        formularioCorrecto = false;

    } else {

        errorCorreo.textContent = "";
        mensajeCorreo.textContent = "Correo válido";

    }


    // Validar teléfono
    if (telefono.trim() === "") {

        errorTelefono.textContent = "Debe ingresar su teléfono";
        mensajeTelefono.textContent = "";
        formularioCorrecto = false;

    } else if (telefono.length !== 9 || isNaN(telefono)) {

        errorTelefono.textContent = "El teléfono debe contener 9 números";
        mensajeTelefono.textContent = "";
        formularioCorrecto = false;

    } else {

        errorTelefono.textContent = "";
        mensajeTelefono.textContent = "Teléfono válido";

    }


    // Validar nutricionista
    if (nutricionista === "") {

        errorNutricionista.textContent = "Debe seleccionar un nutricionista";
        mensajeNutricionista.textContent = "";
        formularioCorrecto = false;

    } else {

        errorNutricionista.textContent = "";
        mensajeNutricionista.textContent = "Nutricionista seleccionado";

    }


    // Validar fecha
    if (fecha === "") {

        errorFecha.textContent = "Debe seleccionar una fecha";
        mensajeFecha.textContent = "";
        formularioCorrecto = false;

    } else {

        errorFecha.textContent = "";
        mensajeFecha.textContent = "Fecha seleccionada";

    }


    // Validar hora
    if (hora === "") {

        errorHora.textContent = "Debe seleccionar una hora";
        mensajeHora.textContent = "";
        formularioCorrecto = false;

    } else {

        errorHora.textContent = "";
        mensajeHora.textContent = "Hora seleccionada";

    }


    // Validar motivo
    if (motivo.trim() === "") {

        errorMotivo.textContent = "Debe ingresar el motivo de la consulta";
        mensajeMotivo.textContent = "";
        formularioCorrecto = false;

    } else if (motivo.trim().length < 10) {

        errorMotivo.textContent = "Explique un poco más el motivo de la consulta";
        mensajeMotivo.textContent = "";
        formularioCorrecto = false;

    } else {

        errorMotivo.textContent = "";
        mensajeMotivo.textContent = "Motivo ingresado";

    }


    // Resultado final
    if (formularioCorrecto === true) {

        mensajeFinal.textContent = "Cita solicitada correctamente";

    } else {

        mensajeFinal.textContent = "";

    }

});