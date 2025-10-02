// Elementos del DOM
let scoreChart;

// Inicializar la aplicación
function init() {
    setupNavigation();
    setupAuth();
    setupPDF();
    setupEventListeners();
    updateScores();
    
    // Si está logueado, mostrar la página de ingreso de puntos
    if (isLoggedIn()) {
        showPage('points-entry');
    }
}

// Configurar navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            
            // Si intenta acceder a la página de ingreso de puntos sin estar logueado
            if (targetPage === 'points-entry' && !isLoggedIn()) {
                showPage('login');
                return;
            }
            
            showPage(targetPage);
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    const gradeSelect = document.getElementById('grade-select');
    const addCollectiveBtn = document.getElementById('add-collective-points');
    const addIndividualBtn = document.getElementById('add-individual-points');
    
    if (gradeSelect) {
        gradeSelect.addEventListener('change', (e) => {
            selectedGrade = e.target.value;
            updateGradeDisplay();
        });
    }
    
    if (addCollectiveBtn) {
        addCollectiveBtn.addEventListener('click', addCollectivePoints);
    }
    
    if (addIndividualBtn) {
        addIndividualBtn.addEventListener('click', addIndividualPoints);
    }
}

// Mostrar página específica
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// Actualizar display del grado seleccionado
function updateGradeDisplay() {
    const currentGradeDisplay = document.getElementById('current-grade-display');
    const selectedGradeSpan = document.getElementById('selected-grade');
    
    if (selectedGrade) {
        const gradeText = getGradeText(selectedGrade);
        selectedGradeSpan.textContent = gradeText;
        currentGradeDisplay.style.display = 'block';
    } else {
        currentGradeDisplay.style.display = 'none';
    }
}

// Agregar puntos para deportes colectivos
function addCollectivePoints() {
    if (!validateGradeSelection()) return;
    
    const sport = document.getElementById('collective-sport').value;
    const position = document.getElementById('collective-position').value;
    const house = document.getElementById('collective-house').value;
    
    if (!sport || !position || !house) {
        showMessage('Por favor, complete todos los campos', 'error');
        return;
    }
    
    const points = collectivePoints[position];
    
    // Actualizar puntos por casa general
    houses[house].score += points;
    
    // Actualizar puntos por grado y casa
    pointsByGrade[selectedGrade][house] += points;
    
    // Guardar datos y actualizar interfaz
    saveData();
    updateScores();
    showMessage(`Se agregaron ${points} puntos a ${houses[house].name} por ${sport} en ${getGradeText(selectedGrade)}`, 'success');
    
    // Limpiar formulario
    document.getElementById('collective-sport').value = '';
    document.getElementById('collective-position').value = '';
    document.getElementById('collective-house').value = '';
}

// Agregar puntos para deportes individuales
function addIndividualPoints() {
    if (!validateGradeSelection()) return;
    
    const sport = document.getElementById('individual-sport').value;
    const position = document.getElementById('individual-position').value;
    const house = document.getElementById('individual-house').value;
    
    if (!sport || !position || !house) {
        showMessage('Por favor, complete todos los campos', 'error');
        return;
    }
    
    const points = individualPoints[position];
    
    // Actualizar puntos por casa general
    houses[house].score += points;
    
    // Actualizar puntos por grado y casa
    pointsByGrade[selectedGrade][house] += points;
    
    // Guardar datos y actualizar interfaz
    saveData();
    updateScores();
    showMessage(`Se agregaron ${points} puntos a ${houses[house].name} por ${sport} en ${getGradeText(selectedGrade)}`, 'success');
    
    // Limpiar formulario
    document.getElementById('individual-sport').value = '';
    document.getElementById('individual-position').value = '';
    document.getElementById('individual-house').value = '';
}

// Validar que se haya seleccionado un grado
function validateGradeSelection() {
    if (!selectedGrade) {
        showMessage('Por favor, seleccione un grado primero', 'error');
        return false;
    }
    return true;
}

// Mostrar mensajes
function showMessage(text, type) {
    const pointsMessage = document.getElementById('points-message');
    pointsMessage.textContent = text;
    pointsMessage.style.display = 'block';
    pointsMessage.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    pointsMessage.style.color = type === 'success' ? '#155724' : '#721c24';
    pointsMessage.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
    
    setTimeout(() => {
        pointsMessage.style.display = 'none';
    }, 3000);
}

// Actualizar puntajes en la interfaz
function updateScores() {
    document.getElementById('cartago-score').textContent = houses.cartago.score;
    document.getElementById('hipona-score').textContent = houses.hipona.score;
    document.getElementById('milan-score').textContent = houses.milan.score;
    document.getElementById('tagaste-score').textContent = houses.tagaste.score;
    
    updateChart();
    updateGradeTable();
}

// Actualizar gráfico
function updateChart() {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    
    if (scoreChart) {
        scoreChart.destroy();
    }
    
    scoreChart = new Chart(ctx, {
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
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Actualizar tabla de resultados por grado
function updateGradeTable() {
    const tableBody = document.querySelector('#results-by-grade tbody');
    tableBody.innerHTML = '';
    
    const grades = ['pre-kinder', 'kinder', '1ro', '2do', '3ro', '4to', '5to', 
                   '6to', '7mo', '8vo', '9no', '10mo', '11mo'];
    
    grades.forEach(grade => {
        const row = document.createElement('tr');
        
        const cartagoScore = pointsByGrade[grade].cartago;
        const hiponaScore = pointsByGrade[grade].hipona;
        const milanScore = pointsByGrade[grade].milan;
        const tagasteScore = pointsByGrade[grade].tagaste;
        
        const scores = {
            cartago: cartagoScore,
            hipona: hiponaScore,
            milan: milanScore,
            tagaste: tagasteScore
        };
        
        // Encontrar el ganador (puede haber empate)
        let winner = '';
        const maxScore = Math.max(cartagoScore, hiponaScore, milanScore, tagasteScore);
        
        if (maxScore > 0) {
            if (cartagoScore === maxScore) winner = 'cartago';
            if (hiponaScore === maxScore) winner = 'hipona';
            if (milanScore === maxScore) winner = 'milan';
            if (tagasteScore === maxScore) winner = 'tagaste';
        }
        
        row.innerHTML = `
            <td>${getGradeText(grade)}</td>
            <td>${cartagoScore}</td>
            <td>${hiponaScore}</td>
            <td>${milanScore}</td>
            <td>${tagasteScore}</td>
            <td class="winner-cell" style="color: ${winner ? houses[winner].color : '#333'}">
                ${winner ? houses[winner].name : '-'}
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Ejecutar inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
