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

  // Ajuste espacio: bajar un poco el título (antes Y=38 ahora Y=36)
  doc.setFontSize(18);
  const titulo1 = "Yacimientos Petrolíferos Fiscales Bolivianos";
  const titulo1Width = doc.getTextWidth(titulo1);
  doc.text(titulo1, (pageWidth - titulo1Width) / 2, 36);

  // Ajuste espacio: bajar un poco subtítulo (antes Y=50 ahora Y=48)
  doc.setFontSize(14);
  const titulo2 = "Hoja Única de Correspondencia Externa";
  const titulo2Width = doc.getTextWidth(titulo2);
  doc.text(titulo2, (pageWidth - titulo2Width) / 2, 48);

  doc.setFontSize(10);

  // Etiquetas en negrita con espacio reducido (antes Y=67 ahora Y=65)
  doc.setFont("helvetica", "bold");
  doc.text("De:", 10, 65);
  doc.text("Cargo:", 100, 65);
  doc.text("Destinatario:", 10, 73);
  doc.text("Cargo destinatario:", 100, 73);
  doc.text("Referencia:", 10, 81);
  doc.setFont("helvetica", "normal");

  doc.text(de, 25, 65);
  doc.text(cargo, 120, 65);
  doc.text(destinatarioNombre, 35, 73);
  doc.text(cargoDestinatario, 140, 73);
  doc.text(referencia, 35, 81);

  doc.setFont("helvetica", "bold");
  doc.text("PRIMER DESTINATARIO:", 10, 89);

  const primerDestX = 10;
  const espacioSeparacion = 17;
  const etiquetaWidth = doc.getTextWidth("PRIMER DESTINATARIO:");
  const textoX = primerDestX + etiquetaWidth + espacioSeparacion;

  doc.setFont("helvetica", "normal");
  const textoDestinatario = `${destinatarioNombre} - ${cargoDestinatario}`;
  doc.text(textoDestinatario, textoX, 89);

  doc.setFont("helvetica", "bold");
  doc.text("INSTRUCTIVO:", 10, 97);
  doc.setFont("helvetica", "normal");

  const splitText = doc.splitTextToSize(instructivo, 180);
  doc.text(splitText, 10, 102);

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
