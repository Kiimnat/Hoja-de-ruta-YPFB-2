document.getElementById('correspondenciaForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Obtener valores del formulario
  const fecha = this.fecha.value;
  const de = this.de.value;
  const cargo = this.cargo.value;
  const destinatarioRaw = this.destinatarioSelect.value;
  const [destinatarioNombre] = destinatarioRaw.split("|");
  const cargoDestinatario = this.cargoDestinatario.value;
  const referencia = this.referencia.value;
  const instructivo = this.instructivo.value;

  // Obtener número guardado en localStorage o iniciar en 18200
  let numeroSecuencial = localStorage.getItem('numeroHojaYPFB');
  if (!numeroSecuencial) {
    numeroSecuencial = 18200;
  } else {
    numeroSecuencial = parseInt(numeroSecuencial, 10) + 1;
  }
  localStorage.setItem('numeroHojaYPFB', numeroSecuencial);

  // Crear número hoja
  const numero = `YPFB-${numeroSecuencial}`;

  // Función para cargar imagen y devolver una promesa
  function cargarImagen(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Error al cargar el logo"));
    });
  }

  try {
    cons
