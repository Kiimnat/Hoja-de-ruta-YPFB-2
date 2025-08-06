document.getElementById('correspondenciaForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const fecha = this.fecha.value;
  const de = this.de.value;
  const cargo = this.cargo.value;

  const destinatarioRaw = this.destinatario.value;
  const [destinatarioNombre] = destinatarioRaw.split("|");
  const cargoDestinatario = this.cargoDestinatario.value;

  const asunto = this.asunto.value;
  const contenido = this.contenido.value;

  const numero = `YPFB-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;

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

    doc.setFontSize(9);
    doc.text(`Fecha: ${fecha}`, 10, 50);
    doc.text(`De: ${de}`, 10, 58);
    doc.text(`Cargo: ${cargo}`, 100, 58);
    doc.text(`Destinatario: ${destinatarioNombre}`, 10, 66);
    doc.text(`Cargo destinatario: ${cargoDestinatario}`, 100, 66);
    doc.text(`Asunto: ${asunto}`, 10, 74);

    doc.text("Contenido:", 10, 84);
    const splitText = doc.splitTextToSize(contenido, 180);
    doc.text(splitText, 10, 89);

    doc.setFontSize(9);
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

    doc.setFontSize(9);
    doc.
