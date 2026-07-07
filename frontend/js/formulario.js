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
    let formularioValido = true;

    campoError.hide();
    listaErrores.empty();

    if (!validarInput(campoNombre)) {
        agregarError('<li>El campo NOMBRE es requerido.</li>');
        formularioValido = false;
    }

    if (!validaRut(campoRut)) {
        agregarError('<li id="errorRutRequerido">El campo RUT es requerido.</li>');
        formularioValido = false;
    }

    if (!validarCorreo(campoCorreo)) {
        agregarError('<li id="errorEmailRequerido">El campo EMAIL es requerido.</li>');
        formularioValido = false;
    }

    if (!validarContrasena(campoContrasena)) {
        agregarError('<li id="errorContrasenaRequerido">El campo CONTRASEÑA es requerido.</li>');
        formularioValido = false;
    }

    if (!validarRepetirContrasena(campoRepetirContrasena)) {
        agregarError('<li id="errorRepetirContrasenaRequerido">El campo REPETIR CONTRASEÑA es requerido.</li>');
        formularioValido = false;
    }

    if (!validarInput(selectNacionalidad)) {
        agregarError('<li>El campo NACIONALIDAD es requerido.</li>');
        formularioValido = false;
    }

    if (!validarInput(selectComuna)) {
        agregarError('<li>El campo COMUNA es requerido.</li>');
        formularioValido = false;
    }

    if (!validarInput(campoCalle)) {
        agregarError('<li>El campo CALLE es requerido.</li>');
        formularioValido = false;
    }

    if (formularioValido) {
        campoError.hide();
        listaErrores.empty();
        alert('Formulario válido. Enviando datos...');

        const formulario = $('#formularioRegistro')[0];
        const dataForm = new FormData(formulario);

        const direccion = {
            comuna: dataForm.get('comuna'),
            calle: dataForm.get('calle'),
            numero: dataForm.get('numero'),
            departamento: dataForm.get('departamento'),
            codigoPostal: dataForm.get('codigoPostal')
        }
        dataForm.set('direccion', JSON.stringify(direccion));

        const datos = Object.fromEntries(dataForm.entries());

        const enviarFormulario = async () => {
            try {
                const respuesta = await fetch('http://localhost:3000/guardarUsuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                });

                const data = await respuesta.json();
                console.log('Datos alcenados correctamente: ', data);
                if (respuesta.ok) {
                    window.location.href = './listado.html';
                }
            } catch (error) {
                console.log('Ha ocurrido un error: ', error);
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
        // Limpiar el RUT de caracteres extraños
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

            // Algoritmo Módulo 11
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
            agregarError('<li>Su contraseña NO es segura, recuerde incluir al menos:<ul><li>1 Letra mayúscula.</li><li>1 Letra minúscula.</li><li>1 dígito.</li><li>1 caracter especial.</li><li>8 caracteres como mínimo.</li></ul></li>');
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
        console.log(paises);

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
        console.log(comunas);

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