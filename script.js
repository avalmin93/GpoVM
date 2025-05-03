document.addEventListener('DOMContentLoaded', () => {
    // MENÚ HAMBURGUESA
    const btnMenu = document.getElementById('btn-menu');
    const navMenu = document.getElementById('nav-menu');
    btnMenu.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => navMenu.classList.remove('open'))
    );
  
    // ENVÍO DE FORMULARIO vía Apps Script
    const form = document.getElementById('form-cita');
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
  
      const data = {
        nombre:   this.nombre.value,
        producto: this.producto.value,
        email:    this.email.value
      };
  
      try {
        const res = await fetch(
          // ← Sustituye esta URL por la de tu última implementación (Deploy → New deployment → Web app)
          'https://script.google.com/macros/s/TU_URL_DE_APPS_SCRIPT/exec',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          }
        );
  
        // Si no es 200 lanza error
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
  
        const json = await res.json();
  
        if (json.result === 'success') {
          alert('✅ Tu cita ha sido enviada correctamente.');
          form.reset();
        } else {
          console.error('Respuesta inesperada del servidor:', json);
          throw new Error(json.message || 'Error en la respuesta');
        }
      } catch (err) {
        console.error('Error al enviar cita:', err);
        alert('❌ Error al enviar. Intenta luego.');
      }
    });
  });
  
