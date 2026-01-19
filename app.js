// Colores predefinidos
const COLORS = [
    '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', 
    '#f39c12', '#1abc9c', '#e67e22', '#34495e',
    '#16a085', '#27ae60', '#2980b9', '#8e44ad',
    '#f368e0', '#ff6b6b', '#4834d4', '#686de0'
];

// Estado de la aplicación
let categories = {};
let currentCategoryId = null;
let editingCategoryId = null;

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromMemory();
    renderCategories();
    updateAnnualProgress();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('new-task-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });
}

// Cargar datos desde memoria
function loadDataFromMemory() {
    const savedData = localStorage.getItem('goalTrackerDynamic');
    if (savedData) {
        try {
            categories = JSON.parse(savedData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            categories = getDefaultCategories();
        }
    } else {
        categories = getDefaultCategories();
    }
}

// Guardar datos en memoria
function saveDataToMemory() {
    try {
        localStorage.setItem('goalTrackerDynamic', JSON.stringify(categories));
    } catch (error) {
        console.error('Error al guardar datos:', error);
    }
}

// Categorías por defecto
function getDefaultCategories() {
    return {
        'health': { 
            name: 'Salud', 
            progress: 28, 
            color: '#3498db',
            description: 'Nada funcionará si no me cuido. Invertir en mi salud es invertir en todo lo demás.',
            tasks: [
                { name: 'Realizar exámenes ETS', progress: 99 },
                { name: 'Inscribirse en consultorio Copiapó', progress: 100 },
                { name: 'Tratar hongos', progress: 0 },
                { name: 'Sacar muelas', progress: 0 }
            ]
        },
        'financial': { 
            name: 'Financiero', 
            progress: 97, 
            color: '#2ecc71',
            description: 'Tener paz financiera para vivir tranquilo y avanzar hacia mis sueños.',
            tasks: [
                { name: 'Calcular ingreso vs gastos', progress: 100 },
                { name: 'Planificar presupuesto ajustado por un año', progress: 90 }
            ]
        },
        'housing': { 
            name: 'Vivienda', 
            progress: 9, 
            color: '#e74c3c',
            description: 'Ser dueño de mi espacio, asegurar mi futuro y consolidar mi autonomía.',
            tasks: [
                { name: 'Ahorrar $7.8MM (2/12)', progress: 17 },
                { name: 'Entrar al 60% del RSH', progress: 0 }
            ]
        },
        'hazeladd': { 
            name: 'Hazeladd', 
            progress: 30, 
            color: '#9b59b6',
            description: 'Transformar Hazeladd en un proyecto reconocido, rentable y de impacto real.',
            tasks: [
                { name: 'ganar corfo semilla inicia', progress: 100 },
                { name: 'Firmar acuerdo de confidencialidad con Volcán', progress: 50 },
                { name: 'Probar aditivo y fabricar planchas', progress: 0 }
            ]
        },
        'sindtech': { 
            name: 'Sindtech', 
            progress: 17, 
            color: '#f39c12',
            description: 'Participar sin quemarme. Avanzar pero protegiendo mi bienestar emocional.',
            tasks: [
                { name: 'conseguir ingresos como minimo de 50K', progress: 0 },
                { name: 'Pilotear Aumi', progress: 50 },
                { name: 'Firmar contratos con 3 sindicatos', progress: 0 }
            ]
        },
        'work': { 
            name: 'Trabajo', 
            progress: 78, 
            color: '#1abc9c',
            description: 'Aprovechar esta experiencia como base para futuros proyectos.',
            tasks: [
                { name: 'analisis de perfil profesional', progress: 100 },
                { name: 'pedir cartas de recomendación', progress: 100 },
                { name: 'conseguir trabajo estable', progress: 100 }
            ]
        }
    };
}

// Renderizar todas las categorías
function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';

    for (const categoryId in categories) {
        const category = categories[categoryId];
        const graphDiv = createCategoryGraph(categoryId, category);
        container.appendChild(graphDiv);
    }

    updateAllGraphs();
}

// Crear gráfico de categoría
function createCategoryGraph(categoryId, category) {
    const div = document.createElement('div');
    div.className = 'graph';
    div.id = `${categoryId}-graph`;
    div.onclick = () => openTasksModal(categoryId);

    div.innerHTML = `
        <div class="graph-actions">
            <button class="graph-action-btn" onclick="event.stopPropagation(); editCategory('${categoryId}')" title="Editar categoría">✏️</button>
        </div>
        <div class="progress-circle">
            <svg viewBox="0 0 36 36">
                <circle class="background" cx="18" cy="18" r="15.9155"></circle>
                <circle class="progress" cx="18" cy="18" r="15.9155" style="stroke: ${category.color}"></circle>
            </svg>
            <div class="progress-value" id="${categoryId}-progress">${category.progress}%</div>
        </div>
        <div class="graph-title">${category.name}</div>
        <div class="graph-description">${category.description}</div>
    `;

    return div;
}

// Abrir modal de nueva categoría
function openCategoryModal() {
    editingCategoryId = null;
    document.getElementById('category-modal-title').textContent = 'Nueva Categoría';
    document.getElementById('category-name').value = '';
    document.getElementById('category-description').value = '';
    renderColorPicker();
    document.getElementById('category-modal').style.display = 'flex';
}

// Editar categoría existente
function editCategory(categoryId) {
    editingCategoryId = categoryId;
    const category = categories[categoryId];
    
    document.getElementById('category-modal-title').textContent = 'Editar Categoría';
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-description').value = category.description;
    renderColorPicker(category.color);
    document.getElementById('category-modal').style.display = 'flex';
}

// Cerrar modal de categoría
function closeCategoryModal() {
    document.getElementById('category-modal').style.display = 'none';
    editingCategoryId = null;
}

// Renderizar selector de colores
function renderColorPicker(selectedColor = COLORS[0]) {
    const container = document.getElementById('color-picker');
    container.innerHTML = '';

    COLORS.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-option' + (color === selectedColor ? ' selected' : '');
        colorDiv.style.backgroundColor = color;
        colorDiv.onclick = () => selectColor(color);
        container.appendChild(colorDiv);
    });
}

// Seleccionar color
function selectColor(color) {
    document.querySelectorAll('.color-option').forEach(el => {
        el.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

// Guardar categoría
function saveCategory() {
    const name = document.getElementById('category-name').value.trim();
    const description = document.getElementById('category-description').value.trim();
    const selectedColor = document.querySelector('.color-option.selected');

    if (!name) {
        alert('Por favor ingresa un nombre para la categoría');
        return;
    }

    const color = selectedColor ? selectedColor.style.backgroundColor : COLORS[0];
    const rgbToHex = (rgb) => {
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return rgb;
        return "#" + ((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1);
    };
    const hexColor = color.startsWith('#') ? color : rgbToHex(color);

    if (editingCategoryId) {
        // Editar categoría existente
        categories[editingCategoryId].name = name;
        categories[editingCategoryId].description = description;
        categories[editingCategoryId].color = hexColor;
    } else {
        // Crear nueva categoría
        const categoryId = 'cat_' + Date.now();
        categories[categoryId] = {
            name: name,
            description: description,
            color: hexColor,
            progress: 0,
            tasks: []
        };
    }

    saveDataToMemory();
    renderCategories();
    updateAnnualProgress();
    closeCategoryModal();
}

// Abrir modal de tareas
function openTasksModal(categoryId) {
    currentCategoryId = categoryId;
    const category = categories[categoryId];
    
    document.getElementById('tasks-modal-title').textContent = `${category.name} - Tareas`;
    
    const taskList = document.getElementById('modal-task-list');
    taskList.innerHTML = '';
    
    category.tasks.forEach((task, index) => {
        addTaskToModal(task.name, task.progress, index);
    });
    
    document.getElementById('tasks-modal').style.display = 'flex';
    document.getElementById('new-task-input').focus();
}

// Cerrar modal de tareas
function closeTasksModal() {
    document.getElementById('tasks-modal').style.display = 'none';
    currentCategoryId = null;
    document.getElementById('new-task-input').value = '';
}

// Agregar tarea al modal
function addTaskToModal(name, progress, index) {
    const taskList = document.getElementById('modal-task-list');
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
    taskList.appendChild(taskItem);
    
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
    const taskName = document.getElementById('new-task-input').value.trim();
    if (taskName && currentCategoryId) {
        const category = categories[currentCategoryId];
        const newTask = { name: taskName, progress: 0 };
        category.tasks.push(newTask);
        
        addTaskToModal(taskName, 0, category.tasks.length - 1);
        
        document.getElementById('new-task-input').value = '';
        document.getElementById('new-task-input').focus();
        
        updateCategoryProgress(currentCategoryId);
        saveDataToMemory();
    }
}

// Actualizar progreso de una tarea
function updateTaskProgress(index, progress) {
    if (currentCategoryId) {
        categories[currentCategoryId].tasks[index].progress = progress;
        updateCategoryProgress(currentCategoryId);
        saveDataToMemory();
    }
}

// Eliminar tarea
function deleteTask(index) {
    if (currentCategoryId) {
        categories[currentCategoryId].tasks.splice(index, 1);
        openTasksModal(currentCategoryId);
        updateCategoryProgress(currentCategoryId);
        saveDataToMemory();
    }
}

// Actualizar progreso de categoría
function updateCategoryProgress(categoryId) {
    const category = categories[categoryId];
    let total = 0;
    
    category.tasks.forEach(task => {
        total += task.progress;
    });
    
    const average = category.tasks.length > 0 ? Math.round(total / category.tasks.length) : 0;
    category.progress = average;
    
    const progressEl = document.getElementById(`${categoryId}-progress`);
    if (progressEl) {
        progressEl.textContent = average + '%';
    }
    
    updateGraph(categoryId);
    updateAnnualProgress();
}

// Actualizar gráfico individual
function updateGraph(categoryId) {
    const graph = document.getElementById(`${categoryId}-graph`);
    if (!graph) return;
    
    const circle = graph.querySelector('.progress');
    const circumference = 2 * Math.PI * 15.9155;
    const dashValue = (categories[categoryId].progress / 100) * circumference;
    circle.style.strokeDasharray = `${dashValue} ${circumference}`;
}

// Actualizar todos los gráficos
function updateAllGraphs() {
    for (const categoryId in categories) {
        updateGraph(categoryId);
    }
}

// Actualizar progreso anual
function updateAnnualProgress() {
    let total = 0;
    let count = 0;
    
    for (const categoryId in categories) {
        total += categories[categoryId].progress;
        count++;
    }
    
    const annualAverage = count > 0 ? Math.round(total / count) : 0;
    document.getElementById('annual-progress').textContent = annualAverage + '%';
    
    const circle = document.querySelector('.annual.progress');
    const circumference = 2 * Math.PI * 15.9155;
    const dashValue = (annualAverage / 100) * circumference;
    circle.style.strokeDasharray = `${dashValue} ${circumference}`;
}

// Confirmar eliminación de categoría
function confirmDeleteCategory() {
    if (!currentCategoryId) return;
    
    const category = categories[currentCategoryId];
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`)) {
        delete categories[currentCategoryId];
        saveDataToMemory();
        closeTasksModal();
        renderCategories();
        updateAnnualProgress();
    }
}
