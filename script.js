document.getElementById('correspondenciaForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Obtener valores del formulario
  const fecha = this.fecha.value;
  const de = this.de.value;
  const cargo = this.cargo.value;
  const destinatarioRaw = this.destinatario.value;
  const [destinatarioNombre] = destinatarioRaw.split("|");
  const cargoDestinatario = this.cargoDestinatario.value;
  const asunto = this.asunto.value;
  const contenido = this.contenido.value;

  const numero = `YPFB-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;

  // Cargar logo como base64
  const logo = new Image();
  logo.src = 'logo-ypfb.png';

  logo.onload = function () {
    // Insertar logo
    doc.addImage(logo, 'PNG', 10, 10, 30, 30);

    // Encabezado
    doc.setFontSize(18);
    doc.text("Yacimientos Petrolíferos Fiscales Bolivianos", 50, 20);
    doc.setFontSize(14);
    doc.text("Hoja Única de Correspondencia Externa", 50, 28);

    // Nº hoja
    doc.setFontSize(10);
    doc.text(`Nº Hoja: ${numero}`, 150, 10);

    // Datos
    doc.setFontSize(9); // Letra más pequeña
    doc.text(`Fecha: ${fecha}`, 10, 50);
    doc.text(`De: ${de}`, 10, 58);
    doc.text(`Cargo: ${cargo}`, 100, 58); // más a la derecha

    doc.text(`Destinatario: ${destinatarioNombre}`, 10, 66);
    doc.text(`Cargo destinatario: ${cargoDestinatario}`, 100, 66); // más a la derecha

    doc.text(`Asunto: ${asunto}`, 10, 74);

    doc.text("Contenido:", 10, 82);
    const splitText = doc.splitTextToSize(contenido, 180);
    doc.text(splitText, 10, 87);

    // Pie de página
    doc.setFontSize(9);
    doc.text("YPFB Cochabamba - Documento para uso interno oficial", 50, 280);

    // Descargar PDF
    doc.save(`Hoja_Correspondencia_${numero}.pdf`);

    // Limpiar formulario
    document.getElementById('correspondenciaForm').reset();
  };

  logo.onerror = function () {
    alert("Error al cargar el logo. Asegúrate de que 'logo-ypfb.png' está en la misma carpeta que tu HTML.");
  };
});
