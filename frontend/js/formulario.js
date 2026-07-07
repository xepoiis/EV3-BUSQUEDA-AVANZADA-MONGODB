$(document).ready(function () {
    cargarInfoPaises();
    cargarInfoComunas();
});

function validarFormulario() {
    let campoNombre = $('#input_nombre');
    let campoRut = $('#inputRut');
    let campoCorreo = $('#input_correo');
    let campoContrasena = $('#input_contrasena');
    let campoRepetirContrasena = $('#input_rep_contrasena');
    let selectGenero = $('#selectGenero');
    let selectNacionalidad = $('#selectNacionalidad')
    let campoFechaNacimiento = $('#inputNacimiento');
    let campoError = $('#errorFormulario');
    let listaErrores = $('#listaErrores');
    
    let selectComuna = $('#selectComuna');
    let campoCalle = $('#input_calle');
    let campoNumero = $('#input_numero');

    // Variables de la sección de Cuenta Bancaria
    let campoBanco = $('#inputBanco');
    let selectTipoCuenta = $('#selectTipoCuenta');
    let campoNumeroCuenta = $('#inputNumeroCuenta');
    let selectMoneda = $('#selectMoneda');
    let campoSaldo = $('#inputSaldo');
    let campoFechaApertura = $('#inputFechaApertura');
    let selectEstadoCuenta = $('#selectEstadoCuenta');
    let campoTitular = $('#inputTitular');

    let formularioValido = true;

    campoError.hide();
    listaErrores.empty();

    // Validaciones Usuario
    if (!validarInput(campoNombre)) { agregarError('<li>El campo NOMBRE es requerido.</li>'); formularioValido = false; }
    if (!validaRut(campoRut)) { agregarError('<li id="errorRutRequerido">El campo RUT es requerido.</li>'); formularioValido = false; }
    if (!validarCorreo(campoCorreo)) { agregarError('<li id="errorEmailRequerido">El campo EMAIL es requerido.</li>'); formularioValido = false; }
    if (!validarContrasena(campoContrasena)) { agregarError('<li id="errorContrasenaRequerido">El campo CONTRASEÑA es requerido.</li>'); formularioValido = false; }
    if (!validarRepetirContrasena(campoRepetirContrasena)) { agregarError('<li id="errorRepetirContrasenaRequerido">El campo REPETIR CONTRASEÑA es requerido.</li>'); formularioValido = false; }
    if (!validarInput(selectNacionalidad)) { agregarError('<li>El campo NACIONALIDAD es requerido.</li>'); formularioValido = false; }
    if (!validarFechaNacimiento(campoFechaNacimiento)) { formularioValido = false; }
    
    // Validaciones Dirección
    if (!validarInput(selectComuna)) { agregarError('<li>El campo COMUNA es requerido.</li>'); formularioValido = false; }
    if (!validarInput(campoCalle)) { agregarError('<li>El campo CALLE es requerido.</li>'); formularioValido = false; }
    if (!validarInput(campoNumero)) { agregarError('<li>El campo NÚMERO (Dirección) es requerido.</li>'); formularioValido = false; }

    // Validaciones Cuenta Bancaria
    if (!validarInput(campoBanco)) { agregarError('<li>El campo BANCO es requerido.</li>'); formularioValido = false; }
    if (!validarInput(selectTipoCuenta)) { agregarError('<li>El campo TIPO DE CUENTA es requerido.</li>'); formularioValido = false; }
    if (!validarInput(campoNumeroCuenta)) { agregarError('<li>El campo NÚMERO DE CUENTA es requerido.</li>'); formularioValido = false; }
    if (!validarInput(selectMoneda)) { agregarError('<li>El campo MONEDA es requerido.</li>'); formularioValido = false; }
    if (!validarInput(campoSaldo)) { agregarError('<li>El campo SALDO INICIAL es requerido.</li>'); formularioValido = false; }
    if (!validarInput(campoFechaApertura)) { agregarError('<li>El campo FECHA DE APERTURA es requerido.</li>'); formularioValido = false; }
    if (!validarInput(selectEstadoCuenta)) { agregarError('<li>El campo ESTADO DE LA CUENTA es requerido.</li>'); formularioValido = false; }
    if (!validarInput(campoTitular)) { agregarError('<li>El campo TITULAR es requerido.</li>'); formularioValido = false; }


    if (formularioValido) {
        campoError.hide();
        listaErrores.empty();
        alert('Formulario válido. Guardando usuario y cuenta...');

        const formulario = $('#formularioRegistro')[0];
        const dataForm = new FormData(formulario);

        // Preparamos el objeto Dirección
        const direccion = {
            comuna: dataForm.get('comuna'),
            calle: dataForm.get('calle'),
            numero: dataForm.get('numero'),
            departamento: dataForm.get('departamento'),
            codigoPostal: dataForm.get('codigoPostal')
        }

        // Separamos los datos del Usuario
        const datosUsuario = {
            nombre: dataForm.get('nombre'),
            rut: dataForm.get('rut'),
            correo: dataForm.get('correo'),
            telefono: dataForm.get('telefono'),
            fechaNacimiento: dataForm.get('fechaNacimiento'),
            nacionalidad: dataForm.get('nacionalidad'),
            genero: dataForm.get('genero'),
            direccion: JSON.stringify(direccion), // Enviamos la dirección stringificada como antes
            contrasena: dataForm.get('contrasena')
        };

        // Separamos los datos de la Cuenta Bancaria
        const datosCuenta = {
            banco: dataForm.get('banco'),
            tipoCuenta: dataForm.get('tipoCuenta'),
            numeroCuenta: dataForm.get('numeroCuenta'),
            moneda: dataForm.get('moneda'),
            saldo: dataForm.get('saldo'),
            fechaApertura: dataForm.get('fechaApertura'),
            estado: dataForm.get('estado'),
            sucursal: dataForm.get('sucursal'),
            titular: dataForm.get('titular')
            // Nos falta el ID de usuario, se lo asignaremos después de crear al usuario
        };

        const enviarFormulario = async () => {
            try {
                // 1. Guardar primero el Usuario
                const respuestaUsuario = await fetch('http://localhost:3000/guardarUsuario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosUsuario)
                });

                if (respuestaUsuario.ok) {
                    const dataUsuario = await respuestaUsuario.json();
                    
                    // 2. Asociar el ID del nuevo usuario a la cuenta bancaria
                    datosCuenta.usuario = dataUsuario.idUsuario;

                    // 3. Guardar la Cuenta Bancaria
                    const respuestaCuenta = await fetch('http://localhost:3000/guardarCuenta', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datosCuenta)
                    });

                    if (respuestaCuenta.ok) {
                        console.log('Usuario y Cuenta Bancaria almacenados correctamente.');
                        window.location.href = './listado.html';
                    } else {
                        console.log('Usuario guardado, pero ocurrió un error al guardar la cuenta.');
                    }
                } else {
                    console.log('Error al guardar el usuario, no se procesó la cuenta.');
                }
            } catch (error) {
                console.log('Ha ocurrido un error en la transacción: ', error);
            }
        }
        enviarFormulario();
    } else {
        campoError.show();
    }
};

function validarInput(elemento) {
    const campo = $(elemento)
    if ($(elemento).val() == '') {
        campo.addClass('is-invalid');
        campo.removeClass('is-valid');
        return false
    } else {
        campo.removeClass('is-invalid');
        campo.addClass('is-valid');
        return true
    }
};

function validaRut(elemento) {
    if (validarInput(elemento)) {
        const campo = $(elemento);
        let rutCompleto = $(elemento).val();
        rutCompleto = rutCompleto.replace(/[.-]/g, '');
        if (!/^[0-9]+[0-9kK]{1}$/.test(rutCompleto)) {
            $('#errorRutRequerido').remove();
            agregarError('<li id="errorFormatoRut">El formato de RUT no corresponde.</li>');
            campo.addClass('is-invalid');
            campo.removeClass('is-valid');
            return false
        } else {
            const tmp = rutCompleto.substring(0, rutCompleto.length - 1);
            const digv = rutCompleto.substring(rutCompleto.length - 1).toLowerCase();
            let suma = 0;
            let modulo = 2;
            for (let i = tmp.length - 1; i >= 0; i--) {
                suma += parseInt(tmp.charAt(i)) * modulo;
                modulo = modulo === 7 ? 2 : modulo + 1;
            }
            const res = 11 - (suma % 11);
            let dvEsperado;
            if (res === 11) {
                dvEsperado = '0';
            } else if (res === 10) {
                dvEsperado = 'k';
            } else {
                dvEsperado = res.toString();
            }

            if (dvEsperado === digv) {
                campo.removeClass('is-invalid');
                campo.addClass('is-valid');
                return true
            } else {
                $('#errorRutRequerido').remove();
                $('#errorFormatoRut').remove();
                agregarError('<li>RUT inválido.</li>');
                campo.addClass('is-invalid');
                campo.removeClass('is-valid');
                return false
            };
        };
    }
};

function validarCorreo(elemento) {
    if (validarInput(elemento)) {
        const campo = $(elemento);
        const correo = $(elemento).val();
        const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regexCorreo.test(correo)) {
            campo.removeClass('is-invalid');
            campo.addClass('is-valid');
            return true
        } else {
            $('#errorEmailRequerido').remove();
            agregarError('<li>El EMAIL es inválido.</li>');
            campo.addClass('is-invalid');
            campo.removeClass('is-valid');
            return false
        }
    }
};

function validarContrasena(elemento) {
    if (validarInput(elemento)) {
        const campo = $(elemento);
        const password = $(elemento).val();
        const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
        if (regexContrasena.test(password)) {
            campo.removeClass('is-invalid');
            campo.addClass('is-valid');
            return true
        } else {
            $('#errorContrasenaRequerido').remove();
            agregarError('<li>Su contraseña NO es segura.</li>');
            campo.addClass('is-invalid');
            campo.removeClass('is-valid');
            return false
        }
    }
};

function validarRepetirContrasena(elemento) {
    if (validarInput(elemento)) {
        const campo = $(elemento);
        if ($(elemento).val() === $('#input_contrasena').val()) {
            campo.removeClass('is-invalid');
            campo.addClass('is-valid');
            return true
        } else {
            $('#errorRepetirContrasenaRequerido').remove();
            agregarError('<li>Sus contraseñas no son iguales.</li>');
            campo.addClass('is-invalid');
            campo.removeClass('is-valid');
            return false
        }
    }
};

function validarFechaNacimiento(elemento) {
    if (validarInput(elemento)) {
        const campo = $(elemento);
        const fechaIngresada = new Date($(elemento).val());
        const fechaActual = new Date();
        
        fechaIngresada.setHours(fechaIngresada.getHours() + Math.abs(fechaIngresada.getTimezoneOffset() / 60));

        if (fechaIngresada < fechaActual) {
            campo.removeClass('is-invalid');
            campo.addClass('is-valid');
            return true;
        } else {
            $('#errorFechaNacimiento').remove();
            agregarError('<li id="errorFechaNacimiento">La fecha de nacimiento debe ser anterior a hoy.</li>');
            campo.addClass('is-invalid');
            campo.removeClass('is-valid');
            return false;
        }
    }
    return false;
};

function agregarError(mensaje) {
    let mensajeError = '';
    let listaErrores = $('#listaErrores');
    mensajeError += mensaje;
    listaErrores.append(mensajeError);
}

async function cargarInfoPaises() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerPaises');
        const paises = await respuesta.json();
        const select = $('#selectNacionalidad');
        $.each(paises, function (index, pais) {
            select.append($('<option>', {
                value: pais.iso2,
                text: pais.nacionalidad
            }));
        });
    } catch (error) {
        console.log('Error al obtener los datos: ', error)
    }
};

async function cargarInfoComunas() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerComunas');
        const comunas = await respuesta.json();
        const select = $('#selectComuna');
        $.each(comunas, function (index, comuna) {
            select.append($('<option>', {
                value: comuna.codigo,
                text: comuna.nombre
            }));
        });
    } catch (error) {
        console.log('Error al obtener los datos: ', error)
    }
};