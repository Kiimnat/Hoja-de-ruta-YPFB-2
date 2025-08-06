document.getElementById('correspondenciaForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Tomar datos del formulario
  const fechaInput = this.fecha.value;
  const de = this.de.value;
  const cargo = this.cargo.value;

  const destinatarioRaw = this.destinatario.value;
  const [destinatarioNombre] = destinatarioRaw.split("|");

  const cargoDestinatario = this.cargoDestinatario.value;

  const asunto = this.asunto.value;
  const contenido = this.contenido.value;

  // Número único para la hoja
  const numero = `YPFB-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;

  // Obtener fecha y hora actuales en formato legible
  const ahora = new Date();
  const fechaHora = ahora.toLocaleString('es-BO', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  // Crear imagen logo
  const img = new Image();
  img.src = 'logo-ypfb.png';
  img.onload = function() {
    doc.addImage(img, 'PNG', 10, 10, 30, 30);

    doc.setFontSize(18);
    doc.text("Yacimientos Petrolíferos Fiscales Bolivianos", 50, 20);
    doc.setFontSize(14);
    doc.text("Hoja Única de Correspondencia Externa", 50, 28);

    doc.setFontSize(10);
    doc.text(`Nº Hoja: ${numero}`, 150, 10);

    doc.text(`Fecha y hora: ${fechaHora}`, 10, 50);

    // De y Cargo en misma línea
    doc.text(`De: ${de}`, 10, 60);
    doc.text(`Cargo: ${cargo}`, 100, 60);

    // Destinatario y cargo destinatario en la misma línea
    doc.text(`Destinatario: ${destinatarioNombre}`, 10, 80);
    doc.text(`Cargo destinatario: ${cargoDestinatario}`, 100, 80);

    doc.text(`Asunto: ${asunto}`, 10, 100);

    doc.text("Contenido:", 10, 115);
    const splitText = doc.splitTextToSize(contenido, 180);
    doc.text(splitText, 10, 120);

    doc.setFontSize(10);
    doc.text("YPFB Cochabamba - Documento para uso interno oficial", 50, 280);

    doc.save(`Hoja_Correspondencia_${numero}.pdf`);
  };

  img.onerror = function() {
    doc.setFontSize(18);
    doc.text("Yacimientos Petrolíferos Fiscales Bolivianos", 50, 20);
    doc.setFontSize(14);
    doc.text("Hoja Única de Correspondencia Externa", 50, 28);

    doc.setFontSize(10);
    doc.text(`Nº Hoja: ${numero}`, 150, 10);

    doc.text(`Fecha y hora: ${fechaHora}`, 10, 50);

    // De y Cargo en misma línea
    doc.text(`De: ${de}`, 10, 60);
    doc.text(`Cargo: ${cargo}`, 100, 60);

    // Destinatario y cargo destinatario en la misma línea
    doc.text(`Destinatario: ${destinatarioNombre}`, 10, 80);
    doc.text(`Cargo destinatario: ${cargoDestinatario}`, 100, 80);

    doc.text(`Asunto: ${asunto}`, 10, 100);

    doc.text("Contenido:", 10, 115);
    const splitText = doc.splitTextToSize(contenido, 180);
    doc.text(splitText, 10, 120);

    doc.setFontSize(10);
    doc.text("YPFB Cochabamba - Documento para uso interno oficial", 50, 280);

    doc.save(`Hoja_Correspondencia_${numero}.pdf`);
  };
});
