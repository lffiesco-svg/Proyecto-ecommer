// Obtener email del localStorage
const emailRecuperacion = localStorage.getItem('emailRecuperacion');

if (!emailRecuperacion) {
    // Si no hay email guardado, redirigir a la primera pantalla
    window.location.href = 'recuperar-contrasena.html';
}

// Mostrar el email
document.getElementById('emailMostrar').textContent = emailRecuperacion;

const form = document.getElementById('formVerificar');
const codigoInput = document.getElementById('codigo');
const nuevaContrasenaInput = document.getElementById('nuevaContrasena');
const confirmarContrasenaInput = document.getElementById('confirmarContrasena');
const btnCambiar = document.getElementById('btnCambiar');

// Solo permitir números en el código
codigoInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const codigo = codigoInput.value.trim();
    const nuevaContrasena = nuevaContrasenaInput.value;
    const confirmarContrasena = confirmarContrasenaInput.value;

    // Validaciones
    if (codigo.length !== 6) {
        mostrarToast('El código debe tener 6 dígitos', 'error');
        return;
    }

    if (nuevaContrasena.length < 6) {
        mostrarToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
        mostrarToast('Las contraseñas no coinciden', 'error');
        return;
    }

    // Deshabilitar botón
    btnCambiar.disabled = true;
    btnCambiar.textContent = 'Cambiando...';

    try {
        const response = await fetch('https://backend-msql-bptv.onrender.com/api/recuperar/cambiar-contrasena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailRecuperacion,
                codigo: codigo,
                nuevaContrasena: nuevaContrasena
            })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarToast('¡Contraseña actualizada exitosamente!', 'success');
            
            // Limpiar localStorage
            localStorage.removeItem('emailRecuperacion');
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            mostrarToast(data.message || 'Error al cambiar contraseña', 'error');
            btnCambiar.disabled = false;
            btnCambiar.textContent = 'Cambiar Contraseña';
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarToast('Error de conexión. Verifica que el backend esté corriendo', 'error');
        btnCambiar.disabled = false;
        btnCambiar.textContent = 'Cambiar Contraseña';
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