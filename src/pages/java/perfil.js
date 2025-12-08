document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    const contenedor = document.getElementById("user-menu-container");

    // Variables del perfil
    let usuarioActual = null;

    // ========== CARGAR PERFIL EN LA PÁGINA DE EDICIÓN ==========
    const avatarElement = document.getElementById("avatar");
    const tituloNombre = document.getElementById("titulo-nombre");
    const tituloEmail = document.getElementById("titulo-email");
    const inputName = document.getElementById("name");
    const inputLastName = document.getElementById("lastName");
    const inputEmail = document.getElementById("email");
    const inputTel = document.getElementById("tel");
    const botonesDiv = document.getElementById("botones");
    const editarBtn = document.getElementById("editarBtn");

    // Si estamos en la página de perfil (miperfil.html)
    if (avatarElement && tituloNombre) {
        if (!sesionActiva) {
            window.location.href = "../pages/login.html";
            return;
        }

        const perfil = JSON.parse(localStorage.getItem("usuario"));
        if (!perfil || !perfil.email) {
            window.location.href = "../pages/login.html";
            return;
        }

        try {
            const res = await fetch( "https://backend-msql-bptv.onrender.com/api/obtener", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: perfil.email })
            });

            const data = await res.json();
            if (!res.ok) throw new Error("No se pudo obtener perfil");

            usuarioActual = data.usuario;

            // Llenar los campos con la información del usuario
            const avatar = `${usuarioActual.name[0]}${usuarioActual.lastName[0]}`.toUpperCase();
            avatarElement.textContent = avatar;
            tituloNombre.textContent = `${usuarioActual.name} ${usuarioActual.lastName}`;
            tituloEmail.textContent = usuarioActual.email;
            
            inputName.value = usuarioActual.name;
            inputLastName.value = usuarioActual.lastName;
            inputEmail.value = usuarioActual.email;
            inputTel.value = usuarioActual.tel || "";

        } catch (error) {
            console.error("Error al obtener el perfil", error);
            localStorage.clear();
            window.location.href = "../pages/login.html";
            return;
        }

        // ========== BOTÓN EDITAR PERFIL ==========
        editarBtn.addEventListener("click", () => {
            // Habilitar campos para editar
            inputName.disabled = false;
            inputLastName.disabled = false;
            inputTel.disabled = false;

            // Cambiar los botones
            botonesDiv.innerHTML = `
                <div class="flex flex-col gap-4">
                    <div class="flex gap-4">
                        <button id="guardarBtn" class="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition">
                            Guardar Cambios
                        </button>
                        <button id="cancelarBtn" class="flex-1 py-3 rounded-xl bg-gray-600 text-white font-bold text-lg hover:bg-gray-700 transition">
                            Cancelar
                        </button>
                    </div>
                    <button id="eliminarBtn" class="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition">
                        Eliminar Cuenta
                    </button>
                </div>
            `;

            // ========== BOTÓN GUARDAR CAMBIOS ==========
            document.getElementById("guardarBtn").addEventListener("click", async () => {
                const nuevoNombre = inputName.value.trim();
                const nuevoApellido = inputLastName.value.trim();
                const nuevoTelefono = inputTel.value.trim();

                if (!nuevoNombre || !nuevoApellido || !nuevoTelefono) {
                    mostrarToast("Todos los campos son obligatorios", "error");
                    return;
                }

                try {
                    const res = await fetch("https://backend-msql-bptv.onrender.com/api/actualizar", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: usuarioActual.email,
                            name: nuevoNombre,
                            lastName: nuevoApellido,
                            tel: nuevoTelefono
                        })
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || "Error al actualizar");
                    }

                    // Actualizar localStorage
                    localStorage.setItem("usuario", JSON.stringify(data.usuario));

                    // Actualizar la interfaz
                    usuarioActual = data.usuario;
                    const avatar = `${usuarioActual.name[0]}${usuarioActual.lastName[0]}`.toUpperCase();
                    avatarElement.textContent = avatar;
                    tituloNombre.textContent = `${usuarioActual.name} ${usuarioActual.lastName}`;

                    // Deshabilitar campos
                    inputName.disabled = true;
                    inputLastName.disabled = true;
                    inputTel.disabled = true;

                    // Restaurar botón de editar
                    botonesDiv.innerHTML = `
                        <button id="editarBtn" class="w-full py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold text-lg">
                            Editar Perfil
                        </button>
                    `;

                    // Reconectar evento de editar
                    document.getElementById("editarBtn").addEventListener("click", () => location.reload());

                    mostrarToast("Perfil actualizado correctamente", "success");

                } catch (error) {
                    console.error("Error al actualizar perfil:", error);
                    mostrarToast(error.message || "Error al actualizar perfil", "error");
                }
            });

            // ========== BOTÓN CANCELAR ==========
            document.getElementById("cancelarBtn").addEventListener("click", () => {
                // Restaurar valores originales
                inputName.value = usuarioActual.name;
                inputLastName.value = usuarioActual.lastName;
                inputTel.value = usuarioActual.tel || "";

                // Deshabilitar campos
                inputName.disabled = true;
                inputLastName.disabled = true;
                inputTel.disabled = true;

                // Restaurar botón de editar
                botonesDiv.innerHTML = `
                    <button id="editarBtn" class="w-full py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold text-lg">
                        Editar Perfil
                    </button>
                `;

                // Reconectar evento de editar
                document.getElementById("editarBtn").addEventListener("click", () => location.reload());
            });

            // ========== BOTÓN ELIMINAR CUENTA ==========
            document.getElementById("eliminarBtn").addEventListener("click", async () => {
                // Confirmar eliminación
                const confirmar = confirm("⚠️ ¿Estás seguro de que deseas eliminar tu cuenta?\n\nEsta acción es permanente y no se puede deshacer.");
                
                if (!confirmar) return;

                try {
                    const res = await fetch("https://backend-msql-bptv.onrender.com/api/eliminar", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: usuarioActual.email })
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || "Error al eliminar cuenta");
                    }

                    // Limpiar localStorage
                    localStorage.clear();

                    // Mostrar mensaje y redirigir
                    mostrarToast("Cuenta eliminada correctamente", "success");
                    
                    setTimeout(() => {
                        window.location.href = "../pages/login.html";
                    }, 2000);

                } catch (error) {
                    console.error("Error al eliminar cuenta:", error);
                    mostrarToast(error.message || "Error al eliminar cuenta", "error");
                }
            });
        });
    }

    // ========== MENÚ DE USUARIO (Para otras páginas) ==========
    if (!contenedor) return;
    if (!sesionActiva) return;

    const perfil = JSON.parse(localStorage.getItem("usuario"));
    if (!perfil || !perfil.email) return;

    let usuario = null;
    try {
        const res = await fetch("https://backend-msql-bptv.onrender.com/api/obtener", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: perfil.email })
        });

        const data = await res.json();
        if (!res.ok) throw new Error("No se pudo obtener perfil");
        usuario = data.usuario;
    } catch (error) {
        console.error("Error al obtener el perfil", error);
        localStorage.clear();
        window.location.href = "../pages/login.html";
        return;
    }

    // Crear el menú del usuario
    contenedor.innerHTML = `
        <div class="relative group">
            <button id="user-menu-btn" class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 transition-transform">
                <span id="user-avatar"></span>
            </button>
            <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border-gray-100 py-2 z-50 transition-all duration-200">
                <div class="px-4 py-3 border-b border-gray-200">
                    <p class="text-sm font-semibold text-gray-900" id="user-name"></p>
                    <p class="text-xs text-gray-500" id="user-email"></p>
                </div>
                <a href="../pages/miperfil.html" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-all duration-150 rounded-md cursor-pointer">
                    Mi Perfil
                </a>
                <button id="logout-btn" class="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition-all duration-150 rounded-md cursor-pointer">
                    Cerrar sesión
                </button>
            </div>
        </div>
    `;

    // Insertar Datos en el menú
    document.getElementById("user-name").textContent = `${usuario.name} ${usuario.lastName}`;
    document.getElementById("user-email").textContent = usuario.email;
    const avatar = `${usuario.name[0]}${usuario.lastName[0]}`.toUpperCase();
    document.getElementById("user-avatar").textContent = avatar;

    // Animación Abrir/cerrar
    document.getElementById("user-menu-btn").addEventListener("click", () => {
        const drop = document.getElementById("user-dropdown");
        drop.classList.toggle("hidden");
    });
});

// ========== CERRAR SESIÓN ==========
document.addEventListener("click", (e) => {
    if (e.target.id === "logout-btn") {
        localStorage.clear();
        mostrarToast("Cerrando sesión...", "info");
        setTimeout(() => {
            window.location.href = "../pages/login.html";
        }, 1500);
    }
});

// ========== FUNCIÓN PARA MOSTRAR TOASTS ==========
function mostrarToast(mensaje, tipo = "info") {
    // Crear toast si no existe
    let toast = document.getElementById("toast-notification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-notification";
        toast.className = "fixed top-5 right-5 px-6 py-4 rounded-lg shadow-lg text-white font-semibold z-[9999] transition-opacity duration-300 opacity-0";
        document.body.appendChild(toast);
    }

    // Definir colores según tipo
    const colores = {
        success: "bg-blue-500",
        error: "bg-red-500",
        info: "bg-green-500"
    };

    toast.className = `fixed top-5 right-5 px-6 py-4 rounded-lg shadow-lg text-white font-semibold z-[9999] transition-opacity duration-300 ${colores[tipo] || colores.info}`;
    toast.textContent = mensaje;

    // Mostrar toast
    setTimeout(() => toast.classList.add("opacity-100"), 20);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
    }, 3000);
}