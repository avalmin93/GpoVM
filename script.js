document.addEventListener('DOMContentLoaded', () => {
    const btnMenu = document.getElementById('btn-menu');
    const navMenu = document.getElementById('nav-menu');
    const formCita = document.getElementById('form-cita');
  
    // Asegúrate que el formulario exista antes de añadir el listener
    if (formCita) {
      const submitBtn = formCita.querySelector('button[type="submit"]');
      // Usa la URL correcta de tu implementación de Apps Script
      const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbzyr1R2YyzLXPvCx4cmIlMZr7d5iO3Xk4LxVxkLO2t7sw_JHTn_jyk9dJvUgv5KXT1F/exec';
  
      // Envío de formulario
      formCita.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir el envío tradicional del formulario
  
        // Validar que el botón de envío exista
        if (!submitBtn) {
          console.error("Botón de envío no encontrado en el formulario.");
          alert("❌ Error: No se pudo encontrar el botón de envío.");
          return;
        }
  
        const originalText = submitBtn.textContent; // Guardar texto original del botón
  
        try {
          // Deshabilitar botón y cambiar texto mientras se envía
          submitBtn.textContent = 'Enviando...';
          submitBtn.disabled = true;
  
          // Crear objeto con los datos del formulario
          const formData = {
            nombre: formCita.nombre.value.trim(),
            producto: formCita.producto.value.trim(),
            email: formCita.email.value.trim()
          };
  
          // Validar que los campos no estén vacíos (opcional, pero buena práctica)
          if (!formData.nombre || !formData.producto || !formData.email) {
            throw new Error("Por favor, completa todos los campos.");
          }
  
          // Realizar la solicitud fetch a Google Apps Script
          const response = await fetch(
            URL_APPS_SCRIPT, // Nombre de variable corregido
            {
              method: 'POST',
              // ELIMINADO -> mode: 'no-cors', // <- ¡ESTO CAUSABA EL PROBLEMA PRINCIPAL!
              headers: {
                'Content-Type': 'application/json', // Indicar que enviamos JSON
              },
              body: JSON.stringify(formData) // Convertir datos a cadena JSON
            }
          );
  
          // Verificar si la respuesta HTTP fue exitosa (ej. status 200 OK)
          if (!response.ok) {
            // Si no fue OK, intentar leer el cuerpo como texto para más detalles
            let errorDetails = response.statusText;
            try {
              const errorBody = await response.text();
              errorDetails += ` - ${errorBody}`;
            } catch (textError) {
              // Ignorar si no se puede leer el cuerpo del error
            }
            throw new Error(`Error de red (${response.status}): ${errorDetails}`);
          }
  
          // Si la respuesta HTTP fue OK, intentar parsear el cuerpo como JSON
          const data = await response.json();
  
          // Verificar si el script de Google devolvió un resultado exitoso
          if (data.result !== 'success') {
            // Si el script devolvió un error, usar su mensaje
            throw new Error(data.message || 'El servidor devolvió un error desconocido.');
          }
  
          // ¡Éxito! Mostrar mensaje y limpiar formulario
          alert('✅ ¡Cita enviada con éxito! Te contactaremos pronto.');
          formCita.reset(); // Limpiar los campos del formulario
  
        } catch (err) {
          // Capturar cualquier error (validación, red, parseo, error del script)
          console.error('Error detallado en el envío:', err);
          // Mostrar un mensaje de error claro al usuario
          alert(`❌ Hubo un problema al enviar tu cita: ${err.message}\n\nPor favor, inténtalo de nuevo.`);
  
        } finally {
          // Siempre se ejecuta, haya error o no: Restaurar botón
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    } else {
      console.warn("Elemento con ID 'form-cita' no encontrado en el DOM.");
    }
  
    // Menú hamburguesa (si existe)
    if (btnMenu && navMenu) {
      btnMenu.addEventListener('click', () => navMenu.classList.toggle('open'));
      // Cerrar menú al hacer clic en un enlace dentro de él
      navMenu.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', () => navMenu.classList.remove('open'))
      );
    } else {
       console.warn("Elementos 'btn-menu' o 'nav-menu' no encontrados.");
    }
  });
  
