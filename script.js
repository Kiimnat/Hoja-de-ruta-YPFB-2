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

  // Número secuencial
  let numeroSecuencial = localStorage.getItem('numeroHojaYPFB');
  if (!numeroSecuencial) numeroSecuencial = 18200;
  else numeroSecuencial = parseInt(numeroSecuencial, 10) + 1;
  localStorage.setItem('numeroHojaYPFB', numeroSecuencial);

  const numero = `YPFB-${numeroSecuencial}`;

  // Cargar logo con promesa
  function cargarImagen(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("No se pudo cargar el logo"));
      img.src = src;
    });
  }

  try {
    const logo = await cargarImagen('logo-ypfb.png');
    doc.addImage(logo, 'PNG', 10, 10, 30, 30);
  } catch (err) {
    alert(err.message + ". El PDF se generará sin logo
