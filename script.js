document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const btnMenu = document.getElementById('btn-menu');
    const navMenu = document.getElementById('nav-menu');
    const formCita = document.getElementById('form-cita');
    
    // Configuración GAS
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzl6BDfyRWT-kO9DrkGv7fPnn8G43XsdrT6-j6XOz5myl-zwp0qOpXR4FtIFUwqwjlB/exec';
  
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
        
        // Validar elementos
        if (!submitBtn) return;
  
        // Obtener datos
        const formData = {
          nombre: formCita.nombre.value.trim(),
          producto: formCita.producto.value.trim(),
          email: formCita.email.value.trim()
        };
  
        // Validar campos
        if (!Object.values(formData).every(Boolean)) {
          alert('⚠️ Completa todos los campos');
          return;
        }
  
        // Bloquear botón
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
  
        try {
          // Enviar a GAS
          const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            redirect: 'follow'
          });
  
          // Manejar errores HTTP
          if (!response.ok) throw new Error(`Error ${response.status}`);
          
          // Parsear respuesta
          const data = await response.json();
          
          // Manejar errores lógicos
          if (data.result !== 'success') throw new Error(data.message);
  
          // Éxito
          alert('✅ Cita registrada');
          formCita.reset();
  
        } catch (error) {
          // Manejar errores
          console.error('Error:', error);
          alert(`❌ Fallo: ${error.message}`);
  
        } finally {
          // Restaurar botón
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
    }
  });