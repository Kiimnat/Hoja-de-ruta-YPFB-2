document.getElementById('correspondenciaForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Obtener valores del formulario
  const fecha = this.fecha.value;
  const de = this.de.value;
  const cargo = this.cargo.value;
  const destinatarioRaw = this.destinatarioSelect.value;
  if (!destinatarioRaw) {
    alert("Por favor selecciona un destinatario.");
    return;
  }
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

  // Función para cargar logo con promesa
  function cargarImagen(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // evitar problemas CORS
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("No se pudo cargar el logo"));
      img.src = src;
    });
  }

  // Intentar cargar logo y centrarlo
  try {
    const logo = await cargarImagen('logo-ypfb.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight);
  } catch (err) {
    console.warn(err.message);
    // No detener generación si logo falla
  }

  // Centrar títulos justo debajo del logo (logo empieza en y=10, altura 30, así que y texto 45 y 53)
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  const titulo1 = "Yacimientos Petrolíferos Fiscales Bolivianos";
  const titulo1Width = doc.getTextWidth(titulo1);
  doc.text(titulo1, (pageWidth - titulo1Width) / 2, 45);

  doc.setFontSize(14);
  const titulo2 = "Hoja Única de Correspondencia Externa";
  const titulo2Width = doc.getTextWidth(titulo2);
  doc.text(titulo2, (pageWidth - titulo2Width) / 2, 53);

  doc.setFontSize(10);

  // Etiquetas en negrita
  doc.setFont("helvetica", "bold");
  doc.text("De:", 10, 58);
  doc.text("Cargo:", 100, 58);
  doc.text("Destinatario:", 10, 66);
  doc.text("C
