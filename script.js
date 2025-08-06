document.getElementById('correspondenciaForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  codocument.getElementById('correspondenciaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const logo = document.getElementById('logo').files[0];
    const de = document.getElementById('de').value;
    const cargo = document.getElementById('cargo').value;
    const destinatarioNombre = document.getElementById('destinatarioNombre').value;
    const cargoDestinatario = document.getElementById('cargoDestinatario').value;
    const referencia = document.getElementById('referencia').value;
    const instructivo = document.getElementById('instructivo').value;

    const reader = new FileReader();
    reader.onload = function(event) {
        const imgData = event.target.result;

        const doc = new jspdf.jsPDF();

        // Número de hoja
        doc.setFontSize(10);
        doc.text("N° de hoja: YPFB-18215", 200 - doc.getTextWidth("N° de hoja: YPFB-18215") - 10, 10);

        // Logo
        doc.addImage(imgData, 'PNG', 90, 15, 30, 20);

        // Títulos
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Yacimientos Petrolíferos Fiscales Bolivianos", 105, 45, null, null, 'center');
        doc.setFontSize(12);
        doc.text("Hoja Única de Correspondencia Externa", 105, 52, null, null, 'center');

        // Recuadro datos generales
        doc.rect(10, 60, 190, 30); 
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("De:", 12, 65);
        doc.text("Cargo:", 100, 65);
        doc.text("Destinatario:", 12, 72);
        doc.text("Cargo destinatario:", 100, 72);
        doc.text("Referencia:", 12, 79);
        doc.setFont("helvetica", "normal");
        doc.text(de, 30, 65);
        doc.text(cargo, 120, 65);
        doc.text(destinatarioNombre, 42, 72);
        doc.text(cargoDestinatario, 140, 72);
        doc.text(referencia, 42, 79);

        // Recuadro combinado Primer destinatario + Instructivo
        doc.rect(10, 95, 190, 65);
        doc.setFont("helvetica", "bold");
        doc.text("PRIMER DESTINATARIO:", 12, 100);
        doc.setFont("helvetica", "normal");
        const primText = `${destinatarioNombre} - ${cargoDestinatario}`;
        const primLines = doc.splitTextToSize(primText, 168);
        doc.text(primLines, 15, 107);

        doc.setFont("helvetica", "bold");
        doc.text("INSTRUCTIVO:", 12, 120);
        doc.setFont("helvetica", "normal");
        const instrLines = doc.splitTextToSize(instructivo, 168);
        doc.text(instrLines, 15, 127);

        // Mostrar PDF
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    };

    if (logo) {
        reader.readAsDataURL(logo);
    } else {
        alert("Por favor, selecciona un archivo de imagen para el logo.");
    }
});
