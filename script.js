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
    alert(err.message + ". El PDF se generará sin logo.");
  }

  doc.setFontSize(18);
  doc.text("Yacimientos Petrolíferos Fiscales Bolivianos", 50, 20);
  doc.setFontSize(14);
  doc.text("Hoja Única de Correspondencia Externa", 50, 28);

  doc.setFontSize(10);

  doc.setFont("helvetica", "bold");
  doc.text("De:", 10, 58);
  doc.text("Cargo:", 100, 58);
  doc.text("Destinatario:", 10, 66);
  doc.text("Cargo destinatario:", 100, 66);
  doc.text("Referencia:", 10, 74);
  doc.setFont("helvetica", "normal");

  doc.text(de, 25, 58);
  doc.text(cargo, 120, 58);
  doc.text(destinatarioNombre, 35, 66);
  doc.text(cargoDestinatario, 140, 66);
  doc.text(referencia, 35, 74);

  doc.setFont("helvetica", "bold");
  doc.text("PRIMER DESTINATARIO:", 10, 82);

  const primerDestX = 10;
  const espacioSeparacion = 28.35;
  const etiquetaWidth = doc.getTextWidth("PRIMER DESTINATARIO:");
  const textoX = primerDestX + etiquetaWidth + espacioSeparacion;

  doc.setFont("helvetica", "normal");
  const textoDestinatario = `${destinatarioNombre} - ${cargoDestinatario}`;
  doc.text(textoDestinatario, textoX, 82);

  doc.setFont("helvetica", "bold");
  doc.text("INSTRUCTIVO:", 10, 90);
  doc.setFont("helvetica", "normal");

  const splitText = doc.splitTextToSize(instructivo, 180);
  doc.text(splitText, 10, 95);

  doc.setFontSize(9);
  doc.text("YPFB Cochabamba - Documento para uso interno oficial", 50, 280);

  // En lugar de doc.save, mostramos el PDF para imprimir
  const pdfUrl = doc.output('bloburl');
  const printWindow = window.open(pdfUrl);
  printWindow.focus();
  printWindow.onload = function() {
    printWindow.print();
  };

  this.reset();
});
