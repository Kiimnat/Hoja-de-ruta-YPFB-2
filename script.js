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
  } catch (err) {
    console.warn(err.message);
  }

  const pageWidth = doc.internal.pageSize.getWidth();

  // Reducción extra de 6 puntos verticales aprox.
  doc.setFontSize(18);
  const titulo1 = "Yacimientos Petrolíferos Fiscales Bolivianos";
  const titulo1Width = doc.getTextWidth(titulo1);
  doc.text(titulo1, (pageWidth - titulo1Width) / 2, 28); // Antes 34.2

  doc.setFontSize(14);
  const titulo2 = "Hoja Única de Correspondencia Externa";
  const titulo2Width = doc.getTextWidth(titulo2);
  doc.text(titulo2, (pageWidth - titulo2Width) / 2, 39); // Antes 45

  doc.setFontSize(10);

  doc.setFont("helvetica", "bold");
  doc.text("De:", 10, 56); // Antes 62
  doc.text("Cargo:", 100, 56);
  doc.text("Destinatario:", 10, 64);
  doc.text("Cargo destinatario:", 100, 64);
  doc.text("Referencia:", 10, 72);
  doc.setFont("helvetica", "normal");

  doc.text(de, 25, 56);
  doc.text(cargo, 120, 56);
  doc.text(destinatarioNombre, 35, 64);
  doc.text(cargoDestinatario, 140, 64);
  doc.text(referencia, 35, 72);

  doc.setFont("helvetica", "bold");
  doc.text("PRIMER DESTINATARIO:", 10, 78); // Antes 86

  const primerDestX = 10;
  const espacioSeparacion = 17;
  const etiquetaWidth = doc.getTextWidth("PRIMER DESTINATARIO:");
  const textoX = primerDestX + etiquetaWidth + espacioSeparacion;

  doc.setFont("helvetica", "normal");
  const textoDestinatario = `${destinatarioNombre} - ${cargoDestinatario}`;
  doc.text(textoDestinatario, textoX, 78);

  doc.setFont("helvetica", "bold");
  doc.text("INSTRUCTIVO:", 10, 86); // Antes 94
  doc.setFont("helvetica", "normal");

  const splitText = doc.splitTextToSize(instructivo, 180);
  doc.text(splitText, 10, 91); // Antes 99

  doc.setFontSize(9);
  const pie = "YPFB Cochabamba - Documento para uso interno oficial";
  const pieWidth = doc.getTextWidth(pie);
  doc.text(pie, (pageWidth - pieWidth) / 2, 280);

  const pdfUrl = doc.output('bloburl');
  const printWindow = window.open(pdfUrl);
  printWindow.focus();
  printWindow.onload = function() {
    printWindow.print();
  };

  this.reset();
});

