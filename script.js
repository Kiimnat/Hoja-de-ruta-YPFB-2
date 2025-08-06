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

  const generarPDF = (conLogo = false, img = null) => {
    if (conLogo && img) {
      doc.addImage(img, 'PNG', 10, 10, 30,
