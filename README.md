
# Atom FE Challenge Template - Angular

Este proyecto es una plantilla para desarrollar el front-end de la prueba técnica de Atom. Utiliza Angular (versión 15.2.1) y se han configurado varias dependencias esenciales, como Angular Material, para facilitar el desarrollo de la aplicación.

## Estructura del Proyecto

El proyecto está organizado siguiendo una arquitectura modular y en capas, permitiendo una separación clara de responsabilidades y facilitando el escalamiento y mantenimiento de la aplicación. A continuación, se detalla la estructura de carpetas y una breve descripción de cada componente clave:

### Raíz del Proyecto
- `app`: Contiene los módulos principales, configuraciones de rutas y componentes compartidos.
- `assets`: Contiene imágenes, estilos globales y otros recursos estáticos.
- `environments`: Configuraciones de entorno para diferentes ambientes de desarrollo.

### `/app`
- `app-routing.module.ts`: Configuración de rutas de la aplicación, incluyendo guardas de autenticación.
- `app.module.ts`: Módulo principal de la aplicación.
- `core`: Contiene servicios y guardas que representan funcionalidades centrales y transversales de la aplicación, como autenticación y manejo de tareas.
- `modules`: Contiene módulos específicos como `auth` y `tasks`.
- `shared`: Componentes, directivas, interfaces y modelos compartidos entre los módulos.

### `/app/core`
- `guards`: Implementa guardas de rutas, como `auth.guard.ts`, para proteger rutas que requieren autenticación.
- `services`: Contiene servicios que centralizan la lógica de negocio y las peticiones HTTP a la API, como `auth.service.ts`, `config.service.ts`, y `task.service.ts`.

### `/app/modules`
- `auth`: Módulo de autenticación, que contiene el componente `login.component` para manejar el inicio de sesión.
- `tasks`: Módulo de tareas, con el componente `task-page.component` para gestionar y visualizar tareas.

### `/app/shared`
- `components`: Componentes reutilizables, como `custom-button` y `custom-input`, y `dialog.component` para diálogos informativos.
- `directives`: Directivas personalizadas, como `app-auto-focus` y `app-password-match`, para mejorar la experiencia de usuario.
- `interface`: Define interfaces para manejar estructuras de datos específicas, como `auth.interface.ts` y `task.interface.ts`.
- `models`: Modelos de datos que representan las entidades en el frontend, como `user.model.ts` y `task.model.ts`.

## Decisiones de Diseño

1. **Modularidad**: La aplicación está dividida en módulos (`auth`, `tasks`) para una organización y escalabilidad adecuadas. Esta separación permite gestionar mejor los distintos aspectos de la aplicación y facilita la carga diferida (lazy loading) en el futuro.

2. **Servicios en el Core**: Los servicios de autenticación y tareas están centralizados en `core/services`, siguiendo el principio DRY (Don't Repeat Yourself), lo que permite reutilizar código y facilita la prueba de componentes individuales.

3. **Componentes y Directivas Reutilizables**: Los componentes (`custom-button`, `custom-input`) y directivas (`app-auto-focus`, `app-password-match`) son reutilizables, mejorando la consistencia en la UI y simplificando la lógica de componentes individuales.

4. **Angular Material**: Se utiliza Angular Material para elementos de UI comunes, como botones, tarjetas, y cuadros de diálogo, lo que garantiza una interfaz de usuario moderna y consistente.

5. **Estructura de Estilos**: Los estilos están centralizados en `assets/styles`, permitiendo una fácil modificación del tema y personalización global de la aplicación.

6. **Control de Errores con Diálogos**: Los errores se muestran en `DialogComponent`, lo que ofrece una mejor experiencia de usuario al manejar errores de manera consistente y centralizada.

## Configuración y Ejecución

### Requisitos Previos

- Node.js (versión 14 o superior)
- Angular CLI (instalación recomendada: `npm install -g @angular/cli`)

### Instalación

1. Clona el repositorio y navega hasta la carpeta del proyecto:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd atom-challenge-fe-template-v15
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

### Servidor de Desarrollo

Ejecuta `ng serve` para iniciar un servidor de desarrollo y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente con los cambios realizados en los archivos fuente.

### Generación de Código

Ejecuta `ng generate component component-name` para generar un nuevo componente. También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Compilación

Ejecuta `ng build` para compilar el proyecto. Los archivos generados se almacenarán en el directorio `dist/`.

### Pruebas Unitarias

Ejecuta `ng test` para ejecutar las pruebas unitarias mediante [Karma](https://karma-runner.github.io).

### Pruebas de Extremo a Extremo (E2E)

Ejecuta `ng e2e` para realizar pruebas E2E a través de una plataforma de tu elección. Para usar este comando, necesitas añadir un paquete que implemente capacidades de prueba E2E.

### Ayuda Adicional

Para más ayuda sobre Angular CLI, usa `ng help` o consulta la [documentación de Angular CLI](https://angular.io/cli).

---

Este `README.md` te proporciona una descripción detallada del proyecto, su arquitectura y las decisiones de diseño clave, además de los comandos esenciales para compilar, ejecutar y probar la aplicación. Puedes expandir la sección "Comentarios sobre el desarrollo" para documentar problemas específicos o personalizaciones realizadas durante la prueba técnica.
