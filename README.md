# Recetas Cosinas - Aplicación Web de Recetas

# Descripción del Proyecto

**Recetas Cosinas** es una aplicación web moderna desarrollada con Angular que permite a los usuarios compartir, descubrir y guardar sus recetas de cocina favoritas. Los usuarios pueden crear cuentas, publicar sus propias recetas, explorar recetas de otros usuarios, y mantener una colección personalizada de favoritos.

## Tecnologías y Herramientas Utilizadas

### Frontend
- **Angular 18** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Angular Router** - Navegación y enrutamiento
- **Reactive Forms** - Gestión de formularios con validaciones
- **RxJS** - Programación reactiva

### Backend y Base de Datos
- **Firebase Authentication** - Autenticación de usuarios (Email/Password y Google)
- **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Hosting** - Despliegue de la aplicación

### Estilos
- **CSS3** - Estilos personalizados

## Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)
- **Angular CLI** (versión 18 o superior)
  ```bash
  npm install -g @angular/cli

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/recetas-cosinas.git
cd recetas-cosinas
```

### 2. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar en Desarrollo
```bash
ng serve
```


## Arquitectura del Proyecto

### Estructura de Carpetas

src/app/
├── components/           # Componentes reutilizables
│   ├── crear-receta/    # Modal para crear/editar recetas
│   ├── lista-recetas/   # Lista de recetas con filtros
│   └── ver-receta/      # Modal para ver detalle de receta
├── pages/               # Páginas principales (rutas)
│   ├── home/           # Página principal - todas las recetas
│   ├── mis-recetas/    # Recetas del usuario autenticado
│   ├── favoritos/      # Recetas marcadas como favoritas
│   ├── detalle-receta/ # Vista completa de una receta
│   └── error/          # Página 404
├── services/            # Servicios de la aplicación
│   ├── auth.service.ts       # Autenticación de usuarios
│   ├── recetas.service.ts    # CRUD de recetas
│   ├── favoritos.service.ts  # Gestión de favoritos
│   └── modal.service.ts      # Comunicación entre componentes
├── guards/              # Protección de rutas
│   └── auth.guard.ts   # Guard para rutas protegidas
├── models/              # Modelos de datos (interfaces)
│   └── receta.model.ts # Interfaces de Receta y Favorito
├── pipes/               # Pipes personalizados
│   └── tiempo.pipe.ts  # Formato de tiempo de preparación
├── menu/                # Componente del menú lateral
├── busqueda/            # Componente de búsqueda
└── login/               # Componente de login/registro

### Componentes Principales

#### 1. **AppComponent** (`app.ts`)
- Componente raíz de la aplicación
- Maneja el layout principal (menú + contenido)
- Gestiona el estado de autenticación global
- Controla modals de login y crear receta

#### 2. **MenuComponent** (`menu.ts`)
- Menú lateral estilo YouTube
- Navegación entre secciones
- Se adapta según estado de autenticación
- Oculta opciones si no hay usuario logueado

#### 3. **BusquedaComponent** (`busqueda.ts`)
- Barra de búsqueda en tiempo real
- Botón de "Nueva Receta"
- Botón de "Iniciar sesión"
- Información del usuario logueado

#### 4. **HomeComponent** (`pages/home/`)
- Muestra todas las recetas publicadas
- Filtros por categoría
- Ordenamiento múltiple
- Búsqueda integrada

#### 5. **CrearRecetaComponent** (`components/crear-receta/`)
- Formulario reactivo con validaciones
- Campos: título, categoría, tiempo, ingredientes, pasos
- Modo crear y editar
- Validación en tiempo real

#### 6. **ListaRecetasComponent** (`components/lista-recetas/`)
- Muestra grid de recetas
- Filtros por categoría
- Ordenamiento (fecha, nombre, tiempo)
- Botones de favorito, editar, eliminar

### Servicios

#### 1. **AuthService** (`auth.service.ts`)
Gestiona la autenticación de usuarios:
- `register()` - Registro con email/password
- `login()` - Inicio de sesión
- `loginWithGoogle()` - Login con Google
- `logout()` - Cerrar sesión
- `getCurrentUser()` - Obtener usuario actual
- `user$` - Observable del estado de autenticación

#### 2. **RecetasService** (`recetas.service.ts`)
Maneja operaciones CRUD de recetas:
- `crearReceta()` - Crear nueva receta
- `obtenerRecetas()` - Obtener todas las recetas
- `obtenerRecetasPorUsuario()` - Recetas de un usuario
- `actualizarReceta()` - Editar receta existente
- `eliminarReceta()` - Eliminar receta

#### 3. **FavoritosService** (`favoritos.service.ts`)
Gestiona los favoritos de usuarios:
- `agregarFavorito()` - Agregar a favoritos
- `quitarFavorito()` - Quitar de favoritos
- `obtenerFavoritosPorUsuario()` - Obtener favoritos del usuario
- `esFavorito()` - Verificar si una receta es favorita

#### 4. **ModalService** (`modal.service.ts`)
Comunicación entre componentes para editar recetas:
- `abrirEditarReceta()` - Emite evento para abrir modal de edición

### Guards

#### **AuthGuard** (`auth.guard.ts`)
- Protege rutas que requieren autenticación
- Redirige a `/home` si no hay sesión activa
- Rutas protegidas: `/mis-recetas`, `/favoritos`

### Modelos de Datos

#### **Receta**
```typescript
interface Receta {
  id?: string;
  titulo: string;
  ingredientes: string[];
  pasos: string[];
  categoria: string;
  tiempo_preparacion: number;
  userId: string;
  userEmail?: string;
  createdAt?: any;
}
```
#### **Favorito**
```typescript
interface Favorito {
  id?: string;
  userId: string;
  recetaId: string;
  createdAt?: any;
}
```
### Pipes Personalizados

#### **TiempoPipe** (`tiempo.pipe.ts`)
Convierte minutos a formato legible:
- `30` → "30 minutos"
- `90` → "1h 30min"
- `120` → "2 horas"

## Manual de Usuario

### 1. Registro e Inicio de Sesión

#### Crear una Cuenta
1. Haz clic en el botón **"Iniciar sesión"** en la barra superior
2. En el modal, haz clic en **"Regístrate"**
3. Ingresa tu correo electrónico y contraseña (mínimo 6 caracteres)
4. Haz clic en **"Registrarse"**

#### Iniciar Sesión
- **Con Email:**
  1. Haz clic en **"Iniciar sesión"**
  2. Ingresa tu correo y contraseña
  3. Haz clic en **"Iniciar sesión"**

- **Con Google:**
  1. Haz clic en **"Continuar con Google"**
  2. Selecciona tu cuenta de Google
  3. Autoriza el acceso

### 2. Explorar Recetas

#### Ver Todas las Recetas
1. La página principal muestra todas las recetas publicadas
2. Cada tarjeta muestra:
   - Título de la receta
   - Categoría (Desayuno, Almuerzo, Cena, etc.)
   - Tiempo de preparación
   - Número de ingredientes y pasos
   - Autor de la receta

#### Buscar Recetas
1. Usa la barra de búsqueda en la parte superior
2. Escribe el nombre de la receta, categoría o ingrediente
3. Los resultados se filtran automáticamente

#### Filtrar por Categoría
1. En la página de recetas, usa el selector **"Todas las categorías"**
2. Selecciona una categoría específica
3. Solo se mostrarán recetas de esa categoría

#### Ordenar Recetas
Puedes ordenar las recetas por:
- **Más recientes** - Últimas publicadas primero
- **Más antiguos** - Primeras publicadas primero
- **Nombre (A-Z)** - Orden alfabético ascendente
- **Nombre (Z-A)** - Orden alfabético descendente
- **Más rápidas** - Menor tiempo de preparación primero
- **Más lentas** - Mayor tiempo de preparación primero

### 3. Ver Detalle de una Receta

1. Haz clic en **"Ver receta completa"** en cualquier tarjeta
2. Se abrirá la página de detalle con:
   - Título y categoría
   - Tiempo de preparación
   - Lista completa de ingredientes
   - Pasos de preparación numerados
   - Información del autor
3. Haz clic en **"Volver"** para regresar

### 4. Crear una Receta

**Nota:** Debes estar autenticado para crear recetas

1. Haz clic en el botón verde **"Nueva Receta"** en la barra superior
2. Completa el formulario:
   - **Título:** Nombre de tu receta (mínimo 3 caracteres)
   - **Categoría:** Selecciona una categoría
   - **Tiempo de preparación:** En minutos
   - **Descripción:** (Opcional) Breve descripción
   - **Ingredientes:** 
     - Ingresa cada ingrediente
     - Usa **"+ Agregar ingrediente"** para más
     - Puedes eliminar con el botón 
   - **Pasos de preparación:**
     - Describe cada paso
     - Usa **"+ Agregar paso"** para más
     - Puedes eliminar con el botón 
3. Haz clic en **"Publicar"**
4. Tu receta aparecerá en la página principal

### 5. Editar una Receta

**Nota:** Solo puedes editar tus propias recetas

1. Ve a **"Mis Publicaciones"** en el menú lateral
2. Busca la receta que deseas editar
3. Haz clic en el botón **"Editar"** (ícono de lápiz)
4. Modifica los campos necesarios
5. Haz clic en **"Actualizar"**

### 6. Eliminar una Receta

**Nota:** Solo puedes eliminar tus propias recetas

1. Ve a **"Mis Publicaciones"**
2. Busca la receta que deseas eliminar
3. Haz clic en el botón **"Eliminar"** (ícono de basurero)
4. Confirma la eliminación en el mensaje que aparece
5. La receta será eliminada permanentemente

### 7. Sistema de Favoritos

#### Agregar a Favoritos
1. En cualquier receta, haz clic en la **estrella** (esquina superior derecha)
2. La estrella se pondrá roja indicando que es favorita
3. La receta se guarda en tu colección de favoritos

#### Ver tus Favoritos
1. Haz clic en **"Favoritos"** en el menú lateral
2. Verás todas las recetas que has marcado como favoritas
3. Puedes filtrar y ordenar igual que en otras secciones

#### Quitar de Favoritos
1. Haz clic nuevamente en la **estrella roja**
2. La estrella vuelve a su estado normal
3. La receta se elimina de tus favoritos

### 8. Mis Publicaciones

1. Haz clic en **"Mis Publicaciones"** en el menú lateral
2. Verás solo las recetas que tú has creado
3. Aquí puedes:
   - Ver tus recetas
   - Editarlas
   - Eliminarlas
   - Agregarlas a favoritos

### 9. Navegación

#### Menú Lateral
- **Recetas:** Todas las recetas (acceso público)
- **Mis Publicaciones:** Tus recetas (requiere login)
- **Favoritos:** Recetas favoritas (requiere login)
- **Categorías:** (Próximamente)
- **Otros:** (Próximamente)

#### Barra Superior
- **Barra de búsqueda:** Busca recetas por nombre, categoría o ingredientes
- **Nueva Receta:** Crea una nueva receta (botón verde)
- **Iniciar sesión:** Accede a tu cuenta
- **Usuario logueado:** Muestra tu email y botón de cerrar sesión

### 10. Cerrar Sesión

1. Haz clic en tu email en la esquina superior derecha
2. Haz clic en **"Cerrar sesión"**
3. Serás redirigido a la página principal
4. El menú mostrará solo opciones públicas

## Solución de Problemas

### Problema: No puedo iniciar sesión
**Solución:** 
- Verifica que tu correo y contraseña sean correctos
- Asegúrate de haber confirmado tu email
- Revisa que Firebase Authentication esté habilitado

### Problema: No veo mis recetas
**Solución:**
- Asegúrate de estar en la sección "Mis Publicaciones"
- Verifica que hayas iniciado sesión
- Refresca la página (F5)

### Problema: Error al crear receta
**Solución:**
- Completa todos los campos requeridos (*)
- Asegúrate de tener al menos un ingrediente y un paso
- Verifica que el tiempo sea mayor a 0

### Problema: No puedo editar una receta
**Solución:**
- Solo puedes editar tus propias recetas
- Asegúrate de estar en "Mis Publicaciones"
- Verifica que hayas iniciado sesión con la cuenta correcta

##  Licencia

Este proyecto fue desarrollado como parte de un proyecto académico.

## Autor

**Tu Nombre** Luis Miguel Vargas Oscco
- GitHub: [@Luiz-vargz](https://github.com/Luiz-vargz/Gestor_de_Recetas_de_Cocina.git)









# RecetasCosinas

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
