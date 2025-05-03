document.addEventListener('DOMContentLoaded', () => {
    // 1. VERIFICAR QUE LOS ELEMENTOS EXISTAN
    const btnMenu = document.getElementById('btn-menu');
    const navMenu = document.getElementById('nav-menu');
    const formCita = document.getElementById('form-cita');

    // 2. VALIDACIONES INICIALES
    if (!btnMenu || !navMenu || !formCita) {
        console.error("Error: Elementos críticos no encontrados en el DOM");
        return;
    }

    // 3. MENÚ HAMBURGUESA (CON VALIDACIÓN ADICIONAL)
    btnMenu.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
        });
    });

    // 4. FORMULARIO (CON GESTIÓN COMPLETA DE ERRORES)
    const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbzl6BDfyRWT-kO9DrkGv7fPnn8G43XsdrT6-j6XOz5myl-zwp0qOpXR4FtIFUwqwjlB/exec';
    const submitBtn = formCita.querySelector('button[type="submit"]');

    if (!submitBtn) {
        console.error("Error: Botón de submit no encontrado");
        return;
    }

    formCita.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 5. VALIDAR CAMPOS ANTES DE ENVIAR
        const formData = {
            nombre: formCita.querySelector('[name="nombre"]').value.trim(),
            producto: formCita.querySelector('[name="producto"]').value.trim(),
            email: formCita.querySelector('[name="email"]').value.trim()
        };

        if (!Object.values(formData).every(Boolean)) {
            alert("⚠️ Por favor completa todos los campos");
            return;
        }

        // 6. MANEJO DEL ESTADO DEL BOTÓN
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';

        try {
            // 7. ENVÍO CON GESTIÓN DE CORS
            const response = await fetch(URL_APPS_SCRIPT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.result !== 'success') throw new Error(data.message);

            // 8. RESET Y FEEDBACK POSITIVO
            formCita.reset();
            alert("✅ Cita enviada con éxito");

        } catch (error) {
            // 9. MANEJO DE ERRORES DETALLADO
            console.error("Error en submit:", error);
            alert(`❌ Fallo en el envío: ${error.message || 'Error desconocido'}`);

        } finally {
            // 10. RESTAURAR ESTADO INICIAL
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});