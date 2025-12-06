document.getElementById("toggle-password").addEventListener('click', () => {
    const pass = document.getElementById("pass");

    const eyeOpen = document.getElementById('eye-icon-open');

    const eyeClose = document.getElementById('eye-icon-close');

    // verificar contraseña oculta

    const isHidden = pass.type === 'password';

    // cambiar del password a type

    pass.type = isHidden ? 'text' : 'password';

    // alteración íconos según estado

    eyeOpen.classList.toggle('hidden', !isHidden);
    eyeClose.classList.toggle('hidden', isHidden);

});


