window.onload = function () {
    obtenerUsuarios();
}

async function obtenerUsuarios() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerUsuarios');
        const usuarios = await respuesta.json();

        new DataTable('#tablaUsuarios', {
            data: usuarios,
            columns: [
                { data: 'nombre' },
                { data: 'correo' },
                {
                    data: 'genero',
                    'render': function (data, type, row) {
                        let respuesta = '';
                        switch (data) {
                            case 'M':
                                respuesta = 'Masculino';
                                break;
                            case 'F':
                                respuesta = 'Femenino';
                                break;
                            case 'O':
                                respuesta = 'Otro';
                                break;
                            default:
                                respuesta = data;
                        }
                        return respuesta;
                    }
                },
                { data: 'fechaNacimiento' },
                { data: 'gentilicio[0].nombre' },
                // Se agrega el botón que redirige al detalle de la cuenta
                {
                    data: null,
                    'render': function (data, type, row) {
                        return `<a href="./cuentas.html?id=${row._id}" class="btn btn-primary btn-sm">Ver Cuenta</a>`;
                    }
                }
            ]
        });
    } catch (error) {
        console.log('Error al obtener los datos: ', error)
    }
}