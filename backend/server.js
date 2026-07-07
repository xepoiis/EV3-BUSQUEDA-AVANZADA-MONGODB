// Importar depedencias del backend, cada librería se almacenará en una constante
// La dependencia se almacenará como un objeto
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Iniciamos nuestra aplicación express
const aplicacion = express();
const puerto = 3000;

// Instanciamos las depedencias de nuetra aplicación
aplicacion.use(cors());
aplicacion.use(express.json());

// Conexion a MongoDB
mongoose.connect('mongodb://localhost:27017/Jose_Galdamez')
    .then(() => console.log('Conexión Exitosa!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse a la DB: ', excepcion));

// Testear si efectivamente la APP está corriendo en el puerto especificado
const PORT = process.env.PORT || 3000;
aplicacion.listen(PORT, () => console.log(`Corriendo en el puerto: ${PORT}`));

// Definimos el objeto dirección sin arreglo para el esquema de usuario
const direccion = new mongoose.Schema({
    comuna: { type: String, required: true },
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    departamento: String,
    codigoPostal: String
}, { _id: false });

// Se actualiza el esquema aplicando tipos de datos estrictos y validaciones
const usuario = new mongoose.Schema({
    nombre: { type: String, required: true },
    rut: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: String,
    fechaNacimiento: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(v) { return v < new Date(); },
            message: 'La fecha de nacimiento debe ser anterior a la actual.'
        }
    },
    nacionalidad: { type: String, required: true },
    genero: { type: String, enum: ['M', 'F', 'O'] },
    direccion: { type: direccion, required: true },
    contrasena: { type: String, required: true },
    fechaRegistro: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true }
});

const Usuario = mongoose.model('Usuario', usuario, 'usuarios');

// Creamos el esquema y modelo para la entidad asignada
const cuentaBancaria = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    banco: { type: String, required: true },
    tipoCuenta: { type: String, required: true },
    numeroCuenta: { type: String, required: true },
    moneda: { type: String, required: true },
    saldo: { type: Number, required: true },
    fechaApertura: { type: Date, required: true },
    estado: { type: String, required: true },
    sucursal: String,
    titular: { type: String, required: true }
});

const CuentaBancaria = mongoose.model('CuentaBancaria', cuentaBancaria, 'cuentasBancarias');

const pais = new mongoose.Schema({
    nombre: String,
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});

const Pais = mongoose.model('Pais', pais, 'paises');

const comuna = new mongoose.Schema({
    codigo: String,
    nombre: String,
    region: String
});

const Comuna = mongoose.model('Comuna', comuna, 'comunas');

// Método POST para guardar datos de USUARIO
// Definimos el "ENDPOINT" o ruta final donde se canalizará la REQUEST (solicitud)
aplicacion.post('/guardarUsuario', async (solicitud, respuesta) => {
    try {
        //
        const { nombre, rut, correo, telefono, fechaNacimiento, nacionalidad, genero, direccion, contrasena } = solicitud.body;
        // Encriptamos la contraseña recibida desde frontend
        const salt = bcrypt.genSaltSync(10);
        const contrasenaHash = bcrypt.hashSync(contrasena, salt);
        // Parseamos el objeto dirección que viene del frontend, en un objeto objetoDireccion
        const objetoDireccion = JSON.parse(direccion);
        const nuevoUsuario = new Usuario({ nombre, rut, correo, telefono, fechaNacimiento, nacionalidad, genero, direccion: objetoDireccion, contrasena: contrasenaHash });

        await nuevoUsuario.save();
        respuesta.status(200).json({ message: 'Datos Ingresados Correctamente', idUsuario: nuevoUsuario._id });
    }
    catch (excepcion) {
        respuesta.status(500).json({ message: 'No ha sido posible guardar los datos: ', excepcion });
    }
});

// Método GET para leer datos de USUARIOS
aplicacion.get('/obtenerUsuarios', async (request, response) => {
    try {
        // Obtenemos una lista de objetos de tipo Usuario
        // Usamos agregaciones para obtener info desde otras colecciones e incorporarlas a nuestra colección
        const usuarios = await Usuario.aggregate([{
            $lookup: {
                from: 'paises', // Colección desde la que queremos traer datos
                localField: 'nacionalidad', // Campo de la colección con la info a buscar
                foreignField: 'iso2', // Campo de la colección referenciada que quiero mostrar
                as: 'gentilicio' // Nuevo nombre del campo con la info
            }
        }]);

        // En la RESPONSE (res) formateamos los usuarios como JSON y los enviamos
        response.json(usuarios);
    } catch (excepcion) {
        response.status(500).json({ message: 'No ha sido posible obtener los datos. ', excepcion });
    }
});

// Método POST para persistir datos de CUENTA BANCARIA
aplicacion.post('/guardarCuenta', async (solicitud, respuesta) => {
    try {
        const nuevaCuenta = new CuentaBancaria(solicitud.body);
        await nuevaCuenta.save();
        respuesta.status(200).json({ message: 'Cuenta bancaria registrada exitosamente.' });
    } catch (excepcion) {
        respuesta.status(500).json({ message: 'Error al registrar la cuenta bancaria.', excepcion });
    }
});

// Método GET para leer datos de CUENTAS BANCARIAS usando agregación ($lookup)
aplicacion.get('/obtenerCuentas', async (request, response) => {
    try {
        const cuentas = await CuentaBancaria.aggregate([
            {
                $lookup: {
                    from: 'usuarios', // Colección a relacionar
                    localField: 'usuario', // Campo local
                    foreignField: '_id', // Campo referenciado en usuarios
                    as: 'datosUsuario' // Nombre del arreglo resultante
                }
            },
            {
                $unwind: '$datosUsuario' // Extraemos el objeto del arreglo
            }
        ]);
        response.json(cuentas);
    } catch (excepcion) {
        response.status(500).json({ message: 'Error al obtener cuentas bancarias.', excepcion });
    }
});

// Método GET para leer datos de PAISES
aplicacion.get('/obtenerPaises', async (request, response) => {
    try {
        const paises = await Pais.find();
        response.json(paises);
    } catch (excepcion) {
        response.status(500).json({ message: 'No ha sido posible obtener los datos. ', excepcion });
    }
});

// Método GET para leer datos de COMUNAS
aplicacion.get('/obtenerComunas', async (request, response) => {
    try {
        const comunas = await Comuna.find();
        response.json(comunas);
    } catch (excepcion) {
        response.status(500).json({ message: 'No ha sido posible obtener los datos. ', excepcion });
    }
});

// Si hay un error ERR_CONNECTION_REFUSED, puede ser porque el puerto estaba en uso...
// Usando el terminal de windows, buscamos el ID de la aplicación: netstat -ano | findstr :3000
// Teniendo el ID de la aplicación: taskkill /PID id_app /F