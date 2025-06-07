// Datos iniciales
const categories = {
    health: { 
        name: 'Salud', 
        progress: 28, 
        color: 'health',
        description: 'Nada funcionará si no me cuido. Invertir en mi salud es invertir en todo lo demás.',
        tasks: [
            { name: 'Realizar exámenes ETS', progress: 99 },
            { name: 'Inscribirse en consultorio Copiapó', progress: 100 },
            { name: 'Tratar hongos', progress: 0 },
            { name: 'Sacar muelas', progress: 0 },
            { name: 'Viajar a Santiago 1 vez al mes (3/12)', progress: 25 },
            { name: 'Practicar un deporte: buceo o calistenia (0/9) 3 veces a la semana', progress: 0 },
            { name: 'Asistir al psicólogo', progress: 0 },
            { name: 'no ver XXX (0/9)', progress: 0 }
        ]
    },
    financial: { 
        name: 'Financiero', 
        progress: 97, 
        color: 'financial',
        description: 'Tener paz financiera para vivir tranquilo y avanzar hacia mis sueños.',
        tasks: [
            { name: 'Calcular ingreso vs gastos', progress: 100 },
            { name: 'Planificar presupuesto ajustado por un año', progress: 90 },
            { name: 'Diseñar plan de ahorro realista hacia meta de $7.800.000', progress: 100 }
        ]
    },
    housing: { 
        name: 'Vivienda', 
        progress: 9, 
        color: 'housing',
        description: 'Ser dueño de mi espacio, asegurar mi futuro y consolidar mi autonomía.',
        tasks: [
            { name: 'Ahorrar $7.8MM (2/12)', progress: 17 },
            { name: 'Entrar al 60% del RSH', progress: 0 }
        ]
    },
    hazeladd: { 
        name: 'Hazeladd', 
        progress: 30, 
        color: 'hazeladd',
        description: 'Transformar Hazeladd en un proyecto reconocido, rentable y de impacto real.',
        tasks: [
            { name: 'ganar corfo semilla inicia', progress: 100 },
            { name: 'Firmar acuerdo de confidencialidad con Volcán', progress: 50 },
            { name: 'Probar aditivo y fabricar planchas', progress: 0 },
            { name: 'Lograr ventas de $100K', progress: 0 },
            { name: 'cumplir con los requisitos para ganar expande', progress: 0 }
        ]
    },
    sindtech: { 
        name: 'Sindtech', 
        progress: 17, 
        color: 'sindtech',
        description: 'Participar sin quemarme. Avanzar pero protegiendo mi bienestar emocional.',
        tasks: [
            { name: 'conseguir ingresos como minimo de 50K', progress: 0 },
            { name: 'Pilotear Aumi', progress: 50 },
            { name: 'Firmar contratos con 3 sindicatos', progress: 0 }
        ]
    },
    work: { 
        name: 'Trabajo', 
        progress: 78, 
        color: 'work',
        description: 'Aprovechar esta experiencia como base para futuros proyectos, mientras vivo el proceso de forma más amable conmigo mismo.',
        tasks: [
            { name: 'analisis de perfil profesional', progress: 100 },
            { name: 'pedir cartas de recomendación y certificados de experiencia', progress: 100 },
            { name: 'conseguir trabajo estable', progress: 100 },
            { name: 'conseguir prueba de 3 meses', progress: 100 },
            { name: 'conseguir contrato hasta fin de año', progress: 0 },
            { name: 'realizar 3 cursos de perfeccionamiento', progress: 70 }
        ]
    }
};

// Variables globales
let currentCategory = null;
const editModal = document.getElementById('edit-modal');
const modalTaskList = document.getElementById('modal-task-list');
const newTaskInput = document.getElementById('new-task-input');
const addTaskButton = document.getElementById('add-task-button');
const modalTitle = document.getElementById('modal-title');
const closeModalButton = document.querySelector('.close-modal');

// Cargar datos desde localStorage
function loadDataFromStorage() {
    const savedData = localStorage.getItem('goalTracker');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Combinar datos guardados con estructura por defecto
            for (const category in parsedData) {
                if (categories[category]) {
                    categories[category].progress = parsedData[category].progress;
                    categories[category].tasks = parsedData[category].tasks;
                }
            }
        } catch (error) {
            console.error('Error al cargar datos guardados:', error);
        }
    }
}

// Guardar datos en localStorage
function saveDataToStorage() {
    try {
        const dataToSave = {};
        for (const category in categories) {
            dataToSave[category] = {
                progress: categories[category].progress,
                tasks: categories[category].tasks
            };
        }
        localStorage.setItem('goalTracker', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Error al guardar datos:', error);
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    updateAnnualProgress();
    setupEventListeners();
    renderAllGraphs();
});

// Configurar event listeners
function setupEventListeners() {
    // Abrir modal al hacer clic en un gráfico
    document.querySelectorAll('.graph').forEach(graph => {
        if (graph.id !== 'annual-graph') {
            graph.addEventListener('click', function() {
                openEditModal(this.dataset.category);
            });
        }
    });
    
    // Cerrar modal
    closeModalButton.addEventListener('click', closeEditModal);
    
    // Cerrar modal al hacer clic fuera del contenido
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // Agregar nueva tarea
    addTaskButton.addEventListener('click', addNewTask);
    newTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });
}

// Abrir modal de edición
function openEditModal(category) {
    currentCategory = category;
    const categoryData = categories[category];
    
    // Configurar título del modal
    modalTitle.textContent = `Editar ${categoryData.name}`;
    
    // Limpiar lista de tareas
    modalTaskList.innerHTML = '';
    
    // Agregar tareas existentes
    categoryData.tasks.forEach((task, index) => {
        addTaskToModal(task.name, task.progress, index);
    });
    
    // Mostrar modal
    editModal.style.display = 'flex';
    newTaskInput.focus();
}

// Cerrar modal de edición
function closeEditModal() {
    editModal.style.display = 'none';
    currentCategory = null;
    newTaskInput.value = '';
}

// Agregar tarea al modal
function addTaskToModal(name, progress, index) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <div class="task-name">${name}</div>
        <div class="task-input-container">
            <input type="number" class="task-input" value="${progress}" min="0" max="100" data-index="${index}">
            <span class="percent-symbol">%</span>
        </div>
        <button class="delete-task" data-index="${index}">🗑️</button>
    `;
    modalTaskList.appendChild(taskItem);
    
    // Configurar event listeners
    const input = taskItem.querySelector('.task-input');
    const deleteBtn = taskItem.querySelector('.delete-task');
    
    input.addEventListener('change', function() {
        const value = Math.min(100, Math.max(0, parseInt(this.value) || 0));
        this.value = value;
        updateTaskProgress(this.dataset.index, value);
    });
    
    deleteBtn.addEventListener('click', function() {
        deleteTask(this.dataset.index);
    });
}

// Agregar nueva tarea
function addNewTask() {
    const taskName = newTaskInput.value.trim();
    if (taskName && currentCategory) {
        const categoryData = categories[currentCategory];
        const newTask = { name: taskName, progress: 0 };
        categoryData.tasks.push(newTask);
        
        // Agregar al modal
        addTaskToModal(taskName, 0, categoryData.tasks.length - 1);
        
        // Limpiar input
        newTaskInput.value = '';
        newTaskInput.focus();
        
        // Actualizar progreso
        updateCategoryProgress(currentCategory);
        
        // Guardar cambios
        saveDataToStorage();
    }
}

// Actualizar progreso de una tarea
function updateTaskProgress(index, progress) {
    if (currentCategory) {
        categories[currentCategory].tasks[index].progress = progress;
        updateCategoryProgress(currentCategory);
        
        // Guardar cambios
        saveDataToStorage();
    }
}

// Eliminar tarea
function deleteTask(index) {
    if (currentCategory) {
        categories[currentCategory].tasks.splice(index, 1);
        
        // Volver a renderizar todas las tareas
        openEditModal(currentCategory);
        
        // Actualizar progreso
        updateCategoryProgress(currentCategory);
        
        // Guardar cambios
        saveDataToStorage();
    }
}

// Actualizar progreso de categoría
function updateCategoryProgress(category) {
    const categoryData = categories[category];
    let total = 0;
    
    categoryData.tasks.forEach(task => {
        total += task.progress;
    });
    
    const average = categoryData.tasks.length > 0 ? Math.round(total / categoryData.tasks.length) : 0;
    categoryData.progress = average;
    
    // Actualizar gráfico
    document.getElementById(`${category}-progress`).textContent = average + '%';
    updateGraph(category);
    
    // Actualizar progreso anual
    updateAnnualProgress();
}

// Actualizar gráfico de categoría
function updateGraph(category) {
    const circle = document.querySelector(`#${category}-graph .progress`);
    const circumference = 2 * Math.PI * 15.9155;
    const dashValue = (categories[category].progress / 100) * circumference;
    circle.style.strokeDasharray = `${dashValue} ${circumference}`;
}

// Renderizar todos los gráficos
function renderAllGraphs() {
    for (const category in categories) {
        updateGraph(category);
        // Actualizar el texto del progreso en el HTML
        document.getElementById(`${category}-progress`).textContent = categories[category].progress + '%';
    }
}

// Actualizar progreso anual
function updateAnnualProgress() {
    let total = 0;
    let count = 0;
    
    for (const category in categories) {
        total += categories[category].progress;
        count++;
    }
    
    const annualAverage = count > 0 ? Math.round(total / count) : 0;
    document.getElementById('annual-progress').textContent = annualAverage + '%';
    
    // Actualizar gráfico circular
    const circle = document.querySelector('.annual.progress');
    const circumference = 2 * Math.PI * 15.9155;
    const dashValue = (annualAverage / 100) * circumference;
    circle.style.strokeDasharray = `${dashValue} ${circumference}`;
}