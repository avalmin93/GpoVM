document.adddocument.addEventListener('DOMContentLoaded', () => {
    const btnMenu = document.getElementById('btn-menu');
    const navMenu = document.getElementById('nav-menu');
    const formCita = document.getElementById('form-cita');

    // URL ACTUALIZADA DE TU SCRIPT
    const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbzl6BDfyRWT-kO9DrkGv7fPnn8G43XsdrT6-j6XOz5myl-zwp0qOpXR4FtIFUwqwjlB/exec';

    if (formCita) {
        const submitBtn = formCita.querySelector('button[type="submit"]');
        
        formCita.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!submitBtn) {
                alert("❌ Error: No se pudo encontrar el botón de envío.");
                return;
            }

            const originalText = submitBtn.textContent;

            try {
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;

                const formData = {
                    nombre: formCita.nombre.value.trim(),
                    producto: formCita.producto.value.trim(),
                    email: formCita.email.value.trim()
                };

                if (!formData.nombre || !formData.producto || !formData.email) {
                    throw new Error("Por favor, completa todos los campos.");
                }

                // CONFIGURACIÓN DE FETCH ACTUALIZADA
                const response = await fetch(URL_APPS_SCRIPT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error ${response.status}: ${errorText}`);
                }

                const data = await response.json();

                if (data.result !== 'success') {
                    throw new Error(data.message || 'Error desconocido del servidor');
                }

                alert('✅ ¡Cita enviada con éxito! Te contactaremos pronto.');
                formCita.reset();

            } catch (err) {
                console.error('Error:', err);
                alert(`❌ Error al enviar: ${err.message}`);

            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Menú hamburguesa
    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => navMenu.classList.toggle('open'));
        navMenu.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', () => navMenu.classList.remove('open'))
        );
    }
});