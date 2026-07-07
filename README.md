# Evaluación: Búsqueda Avanzada con MongoDB

Este repositorio contiene el proyecto práctico desarrollado para la evaluación de bases de datos no relacionales. El objetivo principal de esta entrega es organizar comandos para conformar rutinas de búsqueda en documentos, subdocumentos y arreglos, considerando la problemática planteada y los requerimientos de seguridad establecidos.

## Requerimientos Cumplidos de la Evaluación

Durante el desarrollo de esta evaluación, se implementaron las siguientes exigencias técnicas:

* **Modificación del Modelo USUARIO:** El esquema fue actualizado para incluir campos estrictos (`rut`, `correo`, `fechaNacimiento`, `nacionalidad`, etc.) con sus respectivos tipos de datos y validaciones.
* **Seguridad y Criptografía:** Las contraseñas de los usuarios se almacenan utilizando el algoritmo hash de `bcrypt`.
* **Relación de Entidades:** Se creó la nueva colección, su respectivo `mongoose.Schema` y modelo para la entidad asignada por el sistema, asociándola correctamente al modelo base.
* **Consultas Relacionales (Agregaciones):** El método GET incluye la implementación de `$lookup` para traer los datos del usuario unidos con los de su objeto correspondiente.
* **Despliegue en Vistas HTML:** Se modificaron las vistas y se creó una tabla para listar los objetos, mostrando el Nombre o RUT del usuario para su asociación visual.
