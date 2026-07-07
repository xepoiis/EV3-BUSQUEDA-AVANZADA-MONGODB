window.onload = function () {
    obtenerCuentasUsuario();
}

async function obtenerCuentasUsuario() {
    try {
        // Se obtiene el ID del usuario desde los parámetros de la URL
        const parametrosUrl = new URLSearchParams(window.location.search);
        const idUsuario = parametrosUrl.get('id');

        const respuesta = await fetch('http://localhost:3000/obtenerCuentas');
        const todasLasCuentas = await respuesta.json();

        // Se filtra el arreglo de cuentas para mostrar solo las del ID recuperado
        let cuentasDelUsuario = [];
        if (idUsuario) {
            cuentasDelUsuario = todasLasCuentas.filter(cuenta => cuenta.usuario === idUsuario);
        }

        // Se renderiza el DataTable con la información de la entidad y el $lookup
        new DataTable('#tablaCuentas', {
            data: cuentasDelUsuario,
            columns: [
                { data: 'banco' },
                { data: 'tipoCuenta' },
                { data: 'numeroCuenta' },
                { data: 'moneda' },
                { 
                    data: 'saldo',
                    render: function (data) {
                        return '$' + data;
                    }
                },
                // Se accede a la información del usuario gracias al $lookup
                { 
                    data: null,
                    render: function (data, type, row) {
                        return row.datosUsuario.nombre + ' (' + row.datosUsuario.rut + ')';
                    }
                }
            ],
            language: {
                emptyTable: "El usuario seleccionado no tiene cuentas registradas en el sistema."
            }
        });
    } catch (error) {
        console.log('Error al obtener los datos de la cuenta: ', error)
    }
}