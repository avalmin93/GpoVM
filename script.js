document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const btnMenu = document.getElementById('btn-menu');
    const navMenu = document.getElementById('nav-menu');
    const formCita = document.getElementById('form-cita');
    
    // Configuración
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzl6BDfyRWT-kO9DrkGv7fPnn8G43XsdrT6-j6XOz5myl-zwp0qOpXR4FtIFUwqwjlB/exec';
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'; // Proxy CORS
    
    // Menú hamburguesa
    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => navMenu.classList.toggle('open'));
        navMenu.querySelectorAll('a').forEach(link => 
            link.addEventListener('click', () => navMenu.classList.remove('open'))
        );
    }

    // Manejo de formulario
    if (formCita) {
        const submitBtn = formCita.querySelector('button[type="submit"]');
        
        formCita.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!submitBtn) return;

            // Validar campos
            const campos = {
                nombre: formCita.nombre.value.trim(),
                producto: formCita.producto.value.trim(),
                email: formCita.email.value.trim()
            };

            if (!Object.values(campos).every(Boolean)) {
                alert('⚠️ Todos los campos son obligatorios');
                return;
            }

            // Estado de carga
            submitBtn.disabled = true;
            const textoOriginal = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';

            try {
                // Usar proxy + GAS
                const respuesta = await fetch(PROXY_URL + GAS_URL, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest' // Cabecera importante
                    },
                    body: JSON.stringify(campos),
                    mode: 'cors' // Forzar modo CORS
                });

                // Manejar errores HTTP
                if (!respuesta.ok) {
                    const errorTexto = await respuesta.text();
                    throw new Error(`Error ${respuesta.status}: ${errorTexto}`);
                }

                // Parsear y validar respuesta
                const datos = await respuesta.json();
                if (datos.result !== 'success') {
                    throw new Error(datos.message || 'Error desconocido');
                }

                // Éxito
                formCita.reset();
                alert('✅ ¡Cita registrada con éxito!');

            } catch (error) {
                // Manejo de errores
                console.error('Error en envío:', error);
                alert(`❌ Error: ${error.message || 'Fallo en la conexión'}`);

            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.textContent = textoOriginal;
            }
        });
    }
});