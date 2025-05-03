document.addEventListener('DOMContentLoaded', () => {
    const btnMenu = document.getElementById('btn-menu');
    const navMenu = document.getElementById('nav-menu');
    const formCita = document.getElementById('form-cita');
    const submitBtn = formCita.querySelector('button[type="submit"]');
    const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbzyr1R2YyzLXPvCx4cmIlMZr7d5iO3Xk4LxVxkLO2t7sw_JHTn_jyk9dJvUgv5KXT1F/exec'; // Reemplaza con tu URL de Apps Script;
  
    // Menú hamburguesa
    btnMenu.addEventListener('click', () => navMenu.classList.toggle('open'));
    navMenu.querySelectorAll('a').forEach(link => 
      link.addEventListener('click', () => navMenu.classList.remove('open'))
    );
  
    // Envío de formulario
    formCita.addEventListener('submit', async (e) => {
      e.preventDefault();
      const originalText = submitBtn.textContent;
      
      try {
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
  
        const response = await fetch(
          URL_APPS_SCRIP, // ← Reemplaza con tu URL
          {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: formCita.nombre.value,
              producto: formCita.producto.value,
              email: formCita.email.value
            })
          }
        );
  
        if (!response.ok) throw new Error('Error en la red');
        
        const data = await response.json();
        if (data.result !== 'success') throw new Error(data.message);
  
        alert('✅ ¡Cita enviada! Te contactaremos pronto.');
        formCita.reset();
  
      } catch (err) {
        console.error('Error:', err);
        alert(`❌ Error: ${err.message || 'Intenta nuevamente'}`);
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  });
  
