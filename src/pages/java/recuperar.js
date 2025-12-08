const form = document.getElementById('formSolicitar');
const emailInput = document.getElementById('email');
const btnEnviar = document.getElementById('btnEnviar');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
        mostrarToast('Por favor ingresa tu correo', 'error');
        return;
    }

    // Deshabilitar botón mientras se procesa
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    try {
        const response = await fetch('http://localhost:8081/api/recuperar/solicitar-codigo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarToast('¡Código enviado! Revisa tu correo', 'success');
            
            // Guardar email en localStorage
            localStorage.setItem('emailRecuperacion', email);
            
            // Redirigir a la página de verificación después de 2 segundos
            setTimeout(() => {
                window.location.href = 'verificar-codigo.html';
            }, 2000);
        } else {
            mostrarToast(data.message || 'Error al enviar código', 'error');
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar Código';
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error de conexión. Verifica que el backend esté corriendo', 'error');
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar Código';
    }
});

function mostrarToast(mensaje, tipo = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    const colores = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    toast.className = `fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl text-white font-semibold transition-transform duration-300 z-50 ${colores[tipo]}`;
    toastMessage.textContent = mensaje;
    
    // Mostrar
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
    }, 3000);
}