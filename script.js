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
    const form = document.getElementById("form-cita");
    form.addEventListener("submit", async function(e) {
      e.preventDefault();  // evita cualquier envío por defecto
      const data = {
        nombre:   this.nombre.value,
        producto: this.producto.value,
        email:    this.email.value
      };
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbxminZYk_FaxBYkjE5gtThUA9CpIly4lNxXJ9EwrTz0BQAV1ohIS1NRFjOhivyBlnFJ/exec",
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
          }
        );
        const json = await res.json();
        if (json.result === "success") {
          alert("✅ Tu cita ha sido enviada correctamente.");
          form.reset();
        } else {
          console.error('Error en el servidor:', json);
          throw new Error();
        }
      } catch (err) {
        console.error(err);
        alert("❌ Error al enviar. Intenta luego.");
      }
    });
  });
  
