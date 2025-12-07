// script de login -techstore pro

//verificar que toda la pagina este cargada con los elementos html

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ página cargada correcta - sistema listo')

    const api_url = "https://backend-msql-bptv.onrender.com/api/login";

    // enviar datos del formulario

    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        // preparar elementos
        const btn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        const errorMsg = document.getElementById('login-error-message');

        errorDiv.classList.add('hidden');

        // recoger datos del formulario

        const datos = {
            email:document.getElementById('email').value.trim(),
            pass:document.getElementById('pass').value
        };

        // validamos que los campos estén válidos

        if (!datos.email || !datos.pass) {
            errorMsg.textContent = 'Por favor completa los datos';
            errorDiv.classList.remove('hidden');
            return;
        }

        
        // cambia el botón mientras procesa

        btn.disabled = true;
        btn.textContent = 'Iniciando sesión';

        // envía los datos al servidor

        try {
            const response = await fetch(api_url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify(datos)
            });

            // recibir respuesta
            const resultado = await response.json();

            if (response.ok) {
                console.log('201 - inicio de sesión exitoso');
                // guardar datos
                localStorage.setItem('sesionActiva', 'true'); 
                localStorage.setItem('usuario', JSON.stringify({
                    name:resultado.usuario.name,
                    lastName:resultado.usuario.lastName,
                    email:resultado.usuario.email,
                    tel:resultado.usuario.tel
                }));

                // mensaje de exito
                errorDiv.className = 'bg-green-50 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent = 'Iniciando sesión....';
                errorDiv.classList.remove('hidden');

                // redirigir a productos
                setTimeout(() => window.location.href='productos.html', 3000);
            // credenciales incorrectas
            } else {
                errorMsg.textContent = resultado.message || 'Credenciales incorrectas';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = 'Iniciar sesión';4
            }
        } catch (err) {
            console.log("error 404 - Error de conexión con el servidor", err);
            errorMsg.textContent = "Error de conexión";
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.innerHTML = 'Iniciar sesión';
        };

    });
});