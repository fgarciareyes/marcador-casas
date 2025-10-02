// Generar reporte PDF
function setupPDF() {
    const reportBtn = document.getElementById('report-btn');
    
    if (reportBtn) {
        reportBtn.addEventListener('click', generatePDF);
    }
}

function generatePDF() {
    // Crear elemento temporal para el PDF
    const pdfElement = document.createElement('div');
    pdfElement.style.padding = '20px';
    pdfElement.style.fontFamily = 'Arial, sans-serif';
    
    // Obtener fecha y hora actual
    const now = new Date();
    const fechaHora = now.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Construir contenido del PDF
    pdfElement.innerHTML = `
        <div class="pdf-header">
            <h1>Marcador de Competencias - Reporte</h1>
            <p>Generado el: ${fechaHora}</p>
        </div>
        
        <div class="pdf-section">
            <h2>Resultados por Casa</h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                <div style="background-color: ${houses.cartago.color}; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                    <h3>Cartago</h3>
                    <div style="font-size: 24px; font-weight: bold;">${houses.cartago.score}</div>
                </div>
                <div style="background-color: ${houses.hipona.color}; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                    <h3>Hipona</h3>
                    <div style="font-size: 24px; font-weight: bold;">${houses.hipona.score}</div>
                </div>
                <div style="background-color: ${houses.milan.color}; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                    <h3>Milán</h3>
                    <div style="font-size: 24px; font-weight: bold;">${houses.milan.score}</div>
                </div>
                <div style="background-color: ${houses.tagaste.color}; padding: 15px; border-radius: 8px; text-align: center;">
                    <h3>Tagaste</h3>
                    <div style="font-size: 24px; font-weight: bold;">${houses.tagaste.score}</div>
                </div>
            </div>
        </div>
        
        <div class="pdf-section">
            <h2>Gráfico de Resultados</h2>
            <div class="pdf-chart-container">
                <!-- El gráfico se generará después -->
            </div>
        </div>
        
        <div class="pdf-section">
            <h2>Resultados por Grado</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Grado</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cartago</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Hipona</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Milán</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Tagaste</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Ganador</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateGradeTableHTML()}
                </tbody>
            </table>
        </div>
        
        <div class="pdf-footer">
            <p>Reporte generado automáticamente por el Sistema de Marcador de Competencias</p>
            <p>${fechaHora}</p>
        </div>
    `;
    
    // Agregar al documento temporalmente
    document.body.appendChild(pdfElement);
    
    // Crear canvas para el gráfico del PDF
    const pdfChartContainer = pdfElement.querySelector('.pdf-chart-container');
    const canvas = document.createElement('canvas');
    canvas.id = 'pdfChart';
    canvas.width = 600;
    canvas.height = 300;
    pdfChartContainer.appendChild(canvas);
    
    // Crear gráfico para el PDF
    const pdfChartCtx = canvas.getContext('2d');
    
    // Esperar un momento para que el canvas esté listo
    setTimeout(() => {
        new Chart(pdfChartCtx, {
            type: 'bar',
            data: {
                labels: Object.values(houses).map(house => house.name),
                datasets: [{
                    label: 'Puntos',
                    data: Object.values(houses).map(house => house.score),
                    backgroundColor: Object.values(houses).map(house => house.color),
                    borderColor: Object.values(houses).map(house => house.color),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
        
        // Esperar a que el gráfico se renderice
        setTimeout(() => {
            // Configurar opciones para PDF
            const options = {
                margin: 10,
                filename: `reporte_competencias_${now.getTime()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    logging: false
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            // Generar PDF
            html2pdf()
                .set(options)
                .from(pdfElement)
                .save()
                .finally(() => {
                    // Limpiar elemento temporal
                    document.body.removeChild(pdfElement);
                });
        }, 500);
    }, 100);
}

// Generar HTML para la tabla de grados en el PDF
function generateGradeTableHTML() {
    const grades = ['pre-kinder', 'kinder', '1ro', '2do', '3ro', '4to', '5to', 
                   '6to', '7mo', '8vo', '9no', '10mo', '11mo'];
    
    return grades.map(grade => {
        const cartagoScore = pointsByGrade[grade].cartago;
        const hiponaScore = pointsByGrade[grade].hipona;
        const milanScore = pointsByGrade[grade].milan;
        const tagasteScore = pointsByGrade[grade].tagaste;
        
        const scores = [cartagoScore, hiponaScore, milanScore, tagasteScore];
        const maxScore = Math.max(...scores);
        
        let winner = '';
        if (maxScore > 0) {
            if (cartagoScore === maxScore) winner = houses.cartago.name;
            if (hiponaScore === maxScore) winner = houses.hipona.name;
            if (milanScore === maxScore) winner = houses.milan.name;
            if (tagasteScore === maxScore) winner = houses.tagaste.name;
        }
        
        return `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${getGradeText(grade)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${cartagoScore}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${hiponaScore}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${milanScore}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${tagasteScore}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: ${winner ? (winner === 'Cartago' ? houses.cartago.color : winner === 'Hipona' ? houses.hipona.color : winner === 'Milán' ? houses.milan.color : houses.tagaste.color) : '#333'}">
                    ${winner || '-'}
                </td>
            </tr>
        `;
    }).join('');
}
