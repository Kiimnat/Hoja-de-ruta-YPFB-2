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

  // Obtener número guardado en localStorage o iniciar en 18200
  let numeroSecuencial = localStorage.getItem('numeroHojaYPFB');
  if (!numeroSecuencial) {
    numeroSecuencial = 18200;
  } else {
    numeroSecuencial = parseInt(numeroSecuencial, 10) + 1;
  }
  localStorage.setItem('numeroHojaYPFB', numeroSecuencial);

  // Crear número hoja
  const numero = `YPFB-${numeroSecuencial}`;

  // Cargar logo
  const logo = new Image();
  logo.src = 'logo-ypfb.png';

  logo.onload = function () {
    doc.addImage(logo, 'PNG', 10, 10, 30, 30);

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

    doc.text(`Referencia: ${referencia}`, 10, 74);

    // Modificación para "PRIMER DESTINATARIO" en mayúsculas y negrilla, con nombre y cargo centrados
    doc.setFont("helvetica", "bold");
    doc.text("PRIMER DESTINATARIO:", 10, 82);
    doc.setFont("helvetica", "normal");

    const primerDestX = 10;
    const textoEtiqueta = "PRIMER DESTINATARIO:";
    const etiquetaWidth = doc.getTextWidth(textoEtiqueta);
    const margenDerecho = 200; // ancho total aproximado de la hoja
    const espacioDisponible = margenDerecho - (primerDestX + etiquetaWidth + 5); // 5 unidades de separación

    const textoDestinatario = `${destinatarioNombre} - ${cargoDestinatario}`;
    const textoWidth = doc.getTextWidth(textoDestinatario);

    const textoX = primerDestX + etiquetaWidth + 5 + (espacioDisponible / 2) - (textoWidth / 2);

    doc.text(textoDestinatario, textoX, 82);

    // "INSTRUCTIVO" en mayúsculas y negrilla
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUCTIVO:", 10, 90);
    doc.setFont("helvetica", "normal");

    const splitText = doc.splitTextToSize(instructivo, 180);
    doc.text(splitText, 10, 95);

    doc.setFontSize(9);
    doc.text("YPFB Cochabamba - Documento para uso interno oficial", 50, 280);

    doc.save(`Hoja_Correspondencia_${numero}.pdf`);

    document.getElementById('correspondenciaForm').reset();
  };

  logo.onerror = function () {
    alert("Error al cargar el logo. Asegúrate de que 'logo-ypfb.png' está en la misma carpeta que tu HTML.");
  };
});
