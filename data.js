// Puntos por posición
const collectivePoints = {1: 100, 2: 80, 3: 60, 4: 40};
const individualPoints = {1: 20, 2: 16, 3: 14, 4: 12};

// Cargar datos guardados o inicializar
function loadSavedData() {
    const savedHouses = localStorage.getItem('competitionHouses');
    const savedPointsByGrade = localStorage.getItem('competitionPointsByGrade');
    
    if (savedHouses && savedPointsByGrade) {
        return {
            houses: JSON.parse(savedHouses),
            pointsByGrade: JSON.parse(savedPointsByGrade)
        };
    } else {
        // Inicializar estructura de datos
        const houses = {
            cartago: { name: "Cartago", color: "#4CAF50", score: 0 },
            hipona: { name: "Hipona", color: "#2196F3", score: 0 },
            milan: { name: "Milán", color: "#F44336", score: 0 },
            tagaste: { name: "Tagaste", color: "#FFC107", score: 0 }
        };
        
        const pointsByGrade = {};
        const grades = ['pre-kinder', 'kinder', '1ro', '2do', '3ro', '4to', '5to', 
                       '6to', '7mo', '8vo', '9no', '10mo', '11mo'];
        
        grades.forEach(grade => {
            pointsByGrade[grade] = {
                cartago: 0,
                hipona: 0,
                milan: 0,
                tagaste: 0
            };
        });
        
        return { houses, pointsByGrade };
    }
}

// Guardar datos
function saveData() {
    localStorage.setItem('competitionHouses', JSON.stringify(houses));
    localStorage.setItem('competitionPointsByGrade', JSON.stringify(pointsByGrade));
}

// Obtener texto del grado
function getGradeText(gradeValue) {
    const grades = {
        'pre-kinder': 'Pre Kinder',
        'kinder': 'Kinder',
        '1ro': '1er Grado',
        '2do': '2do Grado',
        '3ro': '3er Grado',
        '4to': '4to Grado',
        '5to': '5to Grado',
        '6to': '6to Grado',
        '7mo': '7mo Grado',
        '8vo': '8vo Grado',
        '9no': '9no Grado',
        '10mo': '10mo Grado',
        '11mo': '11mo Grado'
    };
    return grades[gradeValue] || 'Ninguno';
}

// Cargar datos iniciales
const initialData = loadSavedData();
let houses = initialData.houses;
let pointsByGrade = initialData.pointsByGrade;
let selectedGrade = "";