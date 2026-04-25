 Mono Motos del Llano - Sistema de Gestión

Este proyecto consiste en una aplicación web desarrollada para el taller **Mono Motos del Llano**, con el objetivo de mejorar la atención al cliente mediante la gestión digital de citas y reservas de motocicletas.

La plataforma permite a los usuarios registrarse, iniciar sesión y acceder a diferentes servicios de manera rápida, organizada y confiable.


 Funcionalidades principales

- Registro de usuarios
- Inicio de sesión
- Agendamiento de citas para servicios técnicos
- Reserva de motocicletas
- Gestión organizada de la información
- Interfaz clara y fácil de usar


##  Base de datos en Supabase

La base de datos fue desarrollada utilizando Supabase.

Para recrearla:

1. Ingresar a Supabase
2. Ir a SQL Editor
3. Copiar y ejecutar el archivo `database.sql` incluido en el repositorio

 ## Uso de Supabase

El proyecto utiliza Supabase como base de datos en la nube.

El archivo `database.sql` contiene la estructura necesaria para crear las tablas utilizadas por el sistema.

Para revisar los datos registrados:

1. Ingresar al proyecto de Supabase.
2. Ir al menú lateral izquierdo.
3. Seleccionar **Table Editor**.
4. Abrir la tabla `app_users` para ver los usuarios registrados.
5. Abrir la tabla `appointments` para ver las citas o reservas creadas.

Cuando un usuario se registra desde la aplicación, su información se almacena en la tabla `app_users`.

Cuando un cliente agenda una cita o reserva, la información se almacena en la tabla `appointments`.


##  Cómo ejecutar el proyecto

Sigue estos pasos para ejecutar la aplicación en tu computador:

### 1. Clonar el repositorio

```bash
git clone https://github.com/carrero20006-lgtm/mono-motos-del-llano1
```

### 2. Entrar a la carpeta del proyecto

```bash
cd mono-motos-del-llano1
```

### 3. Entrar a la carpeta de la aplicación

```bash
cd app
```

### 4. Instalar las dependencias

```bash
npm install
```

### 5. Ejecutar la aplicación

```bash
ng serve
```

### 6. Abrir en el navegador

http://localhost:4200

