/* script.js LIMPIO Y FUNCIONAL */
document.addEventListener('DOMContentLoaded', () => {
    const loginView = document.getElementById('login-view');
    const supervisorDashboard = document.getElementById('supervisor-dashboard');
    const asesorDashboard = document.getElementById('asesor-dashboard');
    const loginForm = document.getElementById('login-form');
    const calendarModal = document.getElementById('calendar-modal');
    const evaluationDetailModal = document.getElementById('evaluation-detail-modal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const supervisorBackBtn = document.getElementById('supervisor-back-btn');
    const supervisorLogoutBtn = document.getElementById('supervisor-logout-btn');
    const supervisorName = document.getElementById('supervisor-name');
    const asesorBackBtn = document.getElementById('asesor-back-btn');
    const asesorLogoutBtn = document.getElementById('asesor-logout-btn');
    const asesorName = document.getElementById('asesor-name');

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === 'E0000001') {
            loginView.classList.add('hidden');
            supervisorDashboard.classList.remove('hidden');
            if (supervisorName) supervisorName.textContent = 'Gian Melendez';
            renderSupervisorDashboard();
        } else if (username) {
            loginView.classList.add('hidden');
            asesorDashboard.classList.remove('hidden');
            if (asesorName) asesorName.textContent = username;
            renderAsesorDashboard();
        }
    });

    // Logout y navegación
    if (supervisorLogoutBtn) {
        supervisorLogoutBtn.addEventListener('click', () => {
            supervisorDashboard.classList.add('hidden');
            loginView.classList.remove('hidden');
            loginForm.reset();
        });
    }
    if (supervisorBackBtn) {
        supervisorBackBtn.addEventListener('click', () => {
            renderSupervisorDashboard();
        });
    }
    if (asesorLogoutBtn) {
        asesorLogoutBtn.addEventListener('click', () => {
            asesorDashboard.classList.add('hidden');
            loginView.classList.remove('hidden');
            loginForm.reset();
        });
    }
    if (asesorBackBtn) {
        asesorBackBtn.addEventListener('click', () => {
            renderAsesorDashboard();
        });
    }

    // Supervisor dashboard
    function renderSupervisorDashboard() {
        const supervisorMatrixBody = document.getElementById('supervisor-matrix-body');
        if (!supervisorMatrixBody) return;
        supervisorMatrixBody.innerHTML = '';
        // Datos de ejemplo para 1 asesor interactivo
        const asesores = [
            { nombre: 'Juan Pérez', antiguedad: '7179', monitoreos: 3, calidad: 95.02, llamadas: 256, rellamadas: 11, rellamadasPct: '4.3%', tnps: 87, tnpsPct: '80.46%', transfEncuesta: 253, transfLlamadas: 223, transfPct: '88.14%', ausencias: 0, diasAus: 14, ausPct: '0%', tmc: '81:32:44', horasProd: '89:00:00', horasUtil: '89:00:00', interactivo: true }
        ];
        asesores.forEach((asesor) => {
            const row = document.createElement('tr');
            let calidadCell = asesor.interactivo
                ? '<span class="clickable-calidad" id="supervisor-calidad-span" style="display:inline-block;padding:4px 10px;background:#1976d2;color:#fff;cursor:pointer;font-weight:bold;border-radius:6px;box-shadow:0 1px 4px #1976d233;transition:background 0.2s;">' + asesor.calidad + '</span>'
                : asesor.calidad;
            row.innerHTML =
                '<td>' + asesor.nombre + '</td>' +
                '<td>' + asesor.antiguedad + '</td>' +
                '<td>' + asesor.monitoreos + '</td>' +
                '<td>' + calidadCell + '</td>' +
                '<td>' + asesor.llamadas + '</td>' +
                '<td>' + asesor.rellamadas + '</td>' +
                '<td>' + asesor.rellamadasPct + '</td>' +
                '<td>' + asesor.tnps + '</td>' +
                '<td>' + asesor.tnpsPct + '</td>' +
                '<td>' + asesor.transfEncuesta + '</td>' +
                '<td>' + asesor.transfLlamadas + '</td>' +
                '<td>' + asesor.transfPct + '</td>' +
                '<td>' + asesor.ausencias + '</td>' +
                '<td>' + asesor.diasAus + '</td>' +
                '<td>' + asesor.ausPct + '</td>' +
                '<td>' + asesor.tmc + '</td>' +
                '<td>' + asesor.horasProd + '</td>' +
                '<td>' + asesor.horasUtil + '</td>';
            supervisorMatrixBody.appendChild(row);
        });
        // Evento solo para el primer asesor
        const supervisorCalidadSpan = document.getElementById('supervisor-calidad-span');
        if (supervisorCalidadSpan) {
            supervisorCalidadSpan.onclick = function() {
                showCalendar('supervisor');
            };
            supervisorCalidadSpan.onmouseover = function() { this.style.background = '#1565c0'; };
            supervisorCalidadSpan.onmouseout = function() { this.style.background = '#1976d2'; };
        }
    }

    // Asesor dashboard
    function renderAsesorDashboard() {
        const asesorMatrixBody = document.getElementById('asesor-matrix-body');
        if (!asesorMatrixBody) return;
        asesorMatrixBody.innerHTML = '';
        const row = document.createElement('tr');
        row.innerHTML =
            '<td>7179</td>' +
            '<td>3</td>' +
            '<td><span class="clickable-calidad" id="calidad-span" style="display:inline-block;padding:4px 10px;background:#1976d2;color:#fff;cursor:pointer;font-weight:bold;border-radius:6px;box-shadow:0 1px 4px #1976d233;transition:background 0.2s;">95.02</span></td>' +
            '<td>256</td>' +
            '<td>11</td>' +
            '<td>4.3%</td>' +
            '<td>87</td>' +
            '<td>80.46%</td>' +
            '<td>253</td>' +
            '<td>223</td>' +
            '<td>88.14%</td>' +
            '<td>0</td>' +
            '<td>14</td>' +
            '<td>0%</td>' +
            '<td>81:32:44</td>' +
            '<td>89:00:00</td>' +
            '<td>89:00:00</td>';
        asesorMatrixBody.appendChild(row);
        const totalRow = document.createElement('tr');
        totalRow.innerHTML =
            '<td>TOTAL</td>' +
            '<td>3</td>' +
            '<td>95.02</td>' +
            '<td>256</td>' +
            '<td>11</td>' +
            '<td>4.3%</td>' +
            '<td>87</td>' +
            '<td>80.46%</td>' +
            '<td>253</td>' +
            '<td>223</td>' +
            '<td>88.14%</td>' +
            '<td>0</td>' +
            '<td>14</td>' +
            '<td>0%</td>' +
            '<td>81:32:44</td>' +
            '<td>89:00:00</td>' +
            '<td>89:00:00</td>';
        asesorMatrixBody.appendChild(totalRow);
        const newCalidadSpan = document.getElementById('calidad-span');
        if (newCalidadSpan) {
            newCalidadSpan.onclick = function() { showCalendar('asesor'); };
            newCalidadSpan.onmouseover = function() { this.style.background = '#1565c0'; };
            newCalidadSpan.onmouseout = function() { this.style.background = '#1976d2'; };
        }
    }

    // Calendario y detalle
    function showCalendar(role) {
        calendarModal.classList.remove('hidden');
        calendarModal.style.display = 'block';
        const calendarView = document.getElementById('calendar-view');
        if (calendarView) {
            calendarView.classList.remove('hidden');
            calendarView.style.display = 'block';
            calendarView.innerHTML = '<h3>Calendario de Evaluaciones - Mayo 2025</h3>';
            const calendarGrid = document.createElement('div');
            calendarGrid.style.display = 'grid';
            calendarGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
            calendarGrid.style.gap = '5px';
            calendarGrid.style.background = '#f5f5f5';
            calendarGrid.style.padding = '10px';
            const calendarDates = [3, 7, 14, 19];
            for (let i = 1; i <= 31; i++) {
                const dateElement = document.createElement('div');
                dateElement.style.position = 'relative';
                dateElement.style.padding = '10px 4px 10px 4px';
                dateElement.style.textAlign = 'center';
                dateElement.style.border = '1px solid #ddd';
                dateElement.style.borderRadius = '8px';
                dateElement.style.background = '#fff';
                dateElement.style.minHeight = '48px';
                dateElement.style.fontSize = '15px';
                dateElement.textContent = i;
                if (calendarDates.includes(i)) {
                    const event = document.createElement('div');
                    event.textContent = 'Evaluación';
                    event.style.background = 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)';
                    event.style.color = '#fff';
                    event.style.borderRadius = '5px';
                    event.style.fontSize = '12px';
                    event.style.padding = '2px 0';
                    event.style.marginTop = '6px';
                    event.style.cursor = 'pointer';
                    event.title = 'Ver detalle de evaluación';
                    event.addEventListener('click', (e) => {
                        e.stopPropagation();
                        calendarModal.classList.add('hidden');
                        calendarModal.style.display = '';
                        if (calendarView) {
                            calendarView.classList.add('hidden');
                            calendarView.style.display = '';
                        }
                        if (role === 'supervisor') {
                            showEvaluationDetailSupervisor(i);
                        } else {
                            showEvaluationDetailAsesor(i);
                        }
                    });
                    dateElement.appendChild(event);
                    dateElement.style.border = '2px solid #1976d2';
                }
                calendarGrid.appendChild(dateElement);
            }
            calendarView.appendChild(calendarGrid);
        }
    }

    // Modal de detalle para asesor
    function showEvaluationDetailAsesor(date) {
        evaluationDetailModal.classList.remove('hidden');
        const evaluationInfo = document.getElementById('evaluation-info');
        const sn = Array.from({length: 11}, () => Math.random().toString(36).charAt(2)).join('').toUpperCase();
        if (evaluationInfo) {
            evaluationInfo.innerHTML =
                '<div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start;">' +
                    '<div style="flex: 2 1 320px; min-width: 260px;">' +
                        '<p><strong>SN:</strong> ' + sn + '</p>' +
                        '<div class="evaluation-section">' +
                            '<h4>Me gusta</h4>' +
                            '<p>Brindas la información de manera clara, generas vínculo con el cliente a través de frases empáticas sinceras. También valido que tienes un conocimiento bastante bueno del escenario ya que la información brindada fue correcta.</p>' +
                        '</div>' +
                        '<div class="evaluation-section">' +
                            '<h4>Observaciones y recomendaciones</h4>' +
                            '<p>3.12 Dejas tiempos en espera al cliente. 1.9.3 No completas la plantilla del registro completa. 3.2.2 No saludas de manera inmediata.</p>' +
                        '</div>' +
                    '</div>' +
                    '<div style="flex: 1 1 220px; min-width: 180px; max-width: 320px; display: flex; flex-direction: column; gap: 12px;">' +
                        '<label><strong>Compromiso del Asesor</strong><br>' +
                            '<textarea id="compromiso" rows="5" style="width:100%;resize:vertical;"></textarea>' +
                        '</label>' +
                        '<label><strong>Acuerdo</strong><br>' +
                            '<select id="acuerdo" style="width:100%;">' +
                                '<option value="de-acuerdo">De Acuerdo</option>' +
                                '<option value="no-de-acuerdo">No Estoy de Acuerdo</option>' +
                            '</select>' +
                        '</label>' +
                        '<button id="save-btn" class="btn" style="margin-top:8px;align-self:flex-end;">Guardar</button>' +
                    '</div>' +
                '</div>';
        }
        setTimeout(() => {
            const saveBtn = document.getElementById('save-btn');
            if (saveBtn) {
                saveBtn.onclick = () => {
                    const compromiso = document.getElementById('compromiso').value;
                    const acuerdo = document.getElementById('acuerdo').value;
                    alert('Guardado:\nCompromiso: ' + compromiso + '\nAcuerdo: ' + acuerdo);
                    evaluationDetailModal.classList.add('hidden');
                };
            }
        }, 100);
    }

    // Modal de detalle para supervisor
    function showEvaluationDetailSupervisor(date) {
        evaluationDetailModal.classList.remove('hidden');
        const evaluationInfo = document.getElementById('evaluation-info');
        const notas = { 3: '65%', 7: '60%', 14: '75%' };
        const nota = notas[date] || 'N/A';
        if (evaluationInfo) {
            evaluationInfo.innerHTML =
                '<p><strong>Fecha de Evaluación:</strong> Mayo ' + date + ', 2025</p>' +
                '<p><strong>Nota Obtenida:</strong> ' + nota + '</p>' +
                '<div class="evaluation-section">' +
                    '<h4>Me gusta</h4>' +
                    '<textarea id="me-gusta-supervisor" rows="2" style="width:100%;">Brindas la información de manera clara, generas vínculo con el cliente a través de frases empáticas sinceras. También valido que tienes un conocimiento bastante bueno del escenario ya que la información brindada fue correcta.</textarea>' +
                '</div>' +
                '<div class="evaluation-section">' +
                    '<h4>Observaciones y recomendaciones</h4>' +
                    '<textarea id="observaciones-supervisor" rows="2" style="width:100%;">3.12 Dejas tiempos en espera al cliente. 1.9.3 No completas la plantilla del registro completa. 3.2.2 No saludas de manera inmediata.</textarea>' +
                '</div>' +
                '<div class="evaluation-form-section">' +
                    '<h4>Compromiso del Asesor</h4>' +
                    '<textarea id="compromiso" rows="4" style="width:100%;"></textarea>' +
                '</div>' +
                '<div class="evaluation-form-section">' +
                    '<h4>Acuerdo</h4>' +
                    '<select id="acuerdo" style="width:100%;">' +
                        '<option value="de-acuerdo">De Acuerdo</option>' +
                        '<option value="no-de-acuerdo">No Estoy de Acuerdo</option>' +
                    '</select>' +
                '</div>' +
                '<div class="evaluation-form-section">' +
                    '<h4>Datos adicionales supervisor</h4>' +
                    '<textarea id="datos-adicionales-supervisor" rows="2" style="width:100%;" placeholder="Agregar datos adicionales de la evaluación..."></textarea>' +
                '</div>';
        }
    }

    // Cierre de modales
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.style.display = '';
                if (modal.id === 'calendar-modal') {
                    const calendarView = document.getElementById('calendar-view');
                    if (calendarView) {
                        calendarView.classList.add('hidden');
                        calendarView.style.display = '';
                    }
                }
            }
        });
    });

    // Cierre de modal de detalle (si existe el botón)
    const closeDetailBtn = document.getElementById('close-detail-btn');
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', () => {
            evaluationDetailModal.classList.add('hidden');
        });
    }
});