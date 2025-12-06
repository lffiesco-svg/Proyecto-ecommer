
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ página cardaga correcta - sistema listo')

    const api_url = "http://localhost:8081/api/register";

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        // preparar elementos
        const btn = document.getElementById('register-btn');
        const errorDiv = document.getElementById('register-error');
        const errorMsg = document.getElementById('register-error-message');
        const confirmPass = document.getElementById('confirm-pass');
        const textConfirmPass = document.getElementById('confirm-pass-error');

        errorDiv.classList.add('hidden');

        // recoger datos del formulario
        const datos = {
            name:document.getElementById('nombre').value.trim(),
            lastName:document.getElementById('apellido').value.trim(),
            email:document.getElementById('email').value.trim(),
            tel:document.getElementById('tel').value.trim(),
            pass:document.getElementById('pass').value
        }

        // validamos que los campos estén válidos
        if (!datos.name || !datos.lastName || !datos.email || !datos.tel || !datos.pass) {
            errorMsg.textContent = 'Por favor, completa los datos.';
            errorDiv.classList.remove('hidden');
            return;
        }
        // validar contraseñas iguales
        if(datos.pass != confirmPass.value) {
            textConfirmPass.textContent = "Las contraseñas deben ser iguales";
            return;

        }

        // cambia el botón mientras procesa

        btn.disabled = true;
        btn.textContent = 'Registrándote';

        // envía los datos al servidor para crear la cuentica

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
                // // guardar datos
                // localStorage.setItem('sesion activa', 'true'); 
                // localStorage.setItem('usuario', JSON.stringify({
                //     name:resultado.usuario.name,
                //     lastName:resultado.usuario.lastName,
                //     email:resultado.usuario.email,
                //     tel:resultado.usuario.tel,
                // }));

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
                btn.innerHTML = 'Iniciar sesión';
            }
            console.log(datos);

            
        } catch (err) {

            console.log("error 404 - Error de conexión con el servidor", err);
            errorMsg.textContent = "Error de conexión";
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            
        }

    });

});