document.getElementById('correspondenciaForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

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

  let numeroSecuencial = localStorage.getItem('numeroHojaYPFB');
  if (!numeroSecuencial) numeroSecuencial = 18200;
  else numeroSecuencial = parseInt(numeroSecuencial, 10) + 1;
  localStorage.setItem('numeroHojaYPFB', numeroSecuencial);
  const numero = `YPFB-${numeroSecuencial}`;

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
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Nº de hoja: ${numero}`, pageWidth - 10, 10, { align: "right" });
  } catch (err) {
    console.warn(err.message);
  }

  const pageWidth = doc.internal.pageSize.getWidth();

  // Títulos
  doc.setFontSize(18);
  const titulo1 = "Yacimientos Petrolíferos Fiscales Bolivianos";
  doc.text(titulo1, (pageWidth - doc.getTextWidth(titulo1)) / 2, 42);

  doc.setFontSize(14);
  const titulo2 = "Hoja Única de Correspondencia Externa";
  doc.text(titulo2, (pageWidth - doc.getTextWidth(titulo2)) / 2, 47);

  doc.setFontSize(10);

  // Recuadro para datos generales
  doc.rect(10, 52, 190, 18); // rectángulo grande
  doc.setFont("helvetica", "bold");
  doc.text("De:", 12, 57);
  doc.text("Cargo:", 100, 57);
  doc.text("Destinatario:", 12, 62);
  doc.text("Cargo destinatario:", 100, 62);
  doc.text("Referencia:", 12, 67);
  doc.setFont("helvetica", "normal");
  doc.text(de, 18, 57);
  doc.text(cargo, 112, 57);
  doc.text(destinatarioNombre, 34, 62);
  doc.text(cargoDestinatario, 133, 62);
  doc.text(referencia, 32, 67);

  // Recuadro primer destinatario
  doc.setFont("helvetica", "bold");
  doc.rect(10, 70, 190, 30);
  doc.text("PRIMER DESTINATARIO:", 12, 75);
  doc.setFont("helvetica", "normal");
  doc.text(`${destinatarioNombre} - ${cargoDestinatario}`, 65, 75);
  doc.text("INSTRUCTIVO:", 12, 80);
  doc.setFont("helvetica", "bold");
  const instructivoTexto = doc.splitTextToSize(instructivo, 185);
  doc.text(instructivoTexto, 12, 83);

  // Pie de página
  doc.setFontSize(9);
  const pie = "YPFB Cochabamba - Documento para uso interno oficial";
  doc.text(pie, (pageWidth - doc.getTextWidth(pie)) / 2, 280);

  const pdfUrl = doc.output('bloburl');
  const printWindow = window.open(pdfUrl);
  printWindow.focus();
  printWindow.onload = function() {
    printWindow.print();
  };

  this.reset();
});












