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

  // Intentar cargar logo y centrarlo horizontalmente
  try {
    const logo = await cargarImagen('logo-ypfb.png');
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = (pageWidth - logoWidth) / 2; // Centrado horizontal
    doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight);
  } catch (err) {
    console.warn(err.message);
    // No detener generación si logo falla
  }

  const pageWidth = doc.internal.pageSize.getWidth();

  // Texto título centrado (más abajo, para dar espacio al logo)
  doc.setFontSize(18);
  const titulo1 = "Yacimientos Petrolíferos Fiscales Bolivianos";
  const titulo1Width = doc.getTextWidth(titulo1);
  doc.text(titulo1, (pageWidth - titulo1Width) / 2, 45);

  // Subtítulo centrado justo debajo del título con menos espacio
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
  doc.text("Cargo destinatario:", 100, 66);
  doc.text("Referencia:", 10, 74);
  doc.setFont("helvetica", "normal");

  // Valores
  doc.text(de, 25, 58);
  doc.text(cargo, 120, 58);
  doc.text(destinatarioNombre, 35, 66);
  doc.text(cargoDestinatario, 140, 66);
  doc.text(referencia, 35, 74);

  // PRIMER DESTINATARIO en mayúsculas y negrita
  doc.setFont("helvetica", "bold");
  doc.text("PRIMER DESTINATARIO:", 10, 82);

  const primerDestX = 10;
  const espacioSeparacion = 17; // espacio reducido a 0.6 cm aprox.
  const etiquetaWidth = doc.getTextWidth("PRIMER DESTINATARIO:");
  const textoX = primerDestX + etiquetaWidth + espacioSeparacion;

  doc.setFont("helvetica", "normal");
  const textoDestinatario = `${destinatarioNombre} - ${cargoDestinatario}`;
  doc.text(textoDestinatario, textoX, 82);

  // INSTRUCTIVO en mayúsculas y negrita
  doc.setFont("helvetica", "bold");
  doc.text("INSTRUCTIVO:", 10, 90);
  doc.setFont("helvetica", "normal");

  const splitText = doc.splitTextToSize(instructivo, 180);
  doc.text(splitText, 10, 95);

  // Pie de página centrado
  doc.setFontSize(9);
  const pie = "YPFB Cochabamba - Documento para uso interno oficial";
  const pieWidth = doc.getTextWidth(pie);
  doc.text(pie, (pageWidth - pieWidth) / 2, 280);

  // Mostrar PDF para imprimir
  const pdfUrl = doc.output('bloburl');
  const printWindow = window.open(pdfUrl);
  printWindow.focus();
  printWindow.onload = function() {
    printWindow.print();
  };

  this.reset();
});
