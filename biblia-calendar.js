// ============================================
// BIBLIA CALENDAR - Calendario Super Completo
// Eventos, notas, URLs, adjuntos, Google Maps
// Integrado con el Bot
// ============================================

class BibliaCalendar {
    constructor() {
        this.isOpen = false;
        this.currentDate = new Date();
        this.viewMonth = this.currentDate.getMonth();
        this.viewYear = this.currentDate.getFullYear();
        this.selectedDate = null;
        this.editingEvent = null;

        // Event types with icons
        this.eventTypes = [
            { id: 'iglesia', label: 'Iglesia', icon: '\u26EA', color: '#667eea' },
            { id: 'video', label: 'Video/Prédica', icon: '\uD83C\uDFA5', color: '#cc0000' },
            { id: 'estudio', label: 'Estudio Bíblico', icon: '\uD83D\uDCD6', color: '#27ae60' },
            { id: 'oracion', label: 'Oración', icon: '\uD83D\uDE4F', color: '#9b59b6' },
            { id: 'reunion', label: 'Reunión/Célula', icon: '\uD83E\uDD1D', color: '#e67e22' },
            { id: 'evento', label: 'Evento', icon: '\uD83C\uDF89', color: '#e74c3c' },
            { id: 'recordatorio', label: 'Recordatorio', icon: '\u23F0', color: '#f39c12' },
            { id: 'otro', label: 'Otro', icon: '\uD83D\uDCCC', color: '#95a5a6' }
        ];

        this.MONTHS = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        this.DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        // Load events from localStorage
        this.events = this.loadEvents();

        this.render();
        this.bindEvents();
    }

    // ==========================================
    // PERSISTENCE
    // ==========================================
    loadEvents() {
        try {
            return JSON.parse(localStorage.getItem('biblia_calendar_events') || '[]');
        } catch { return []; }
    }

    saveEvents() {
        localStorage.setItem('biblia_calendar_events', JSON.stringify(this.events));
    }

    // ==========================================
    // RENDER MAIN PANEL
    // ==========================================
    render() {
        this.panel = document.createElement('div');
        this.panel.className = 'cal-panel';
        this.panel.innerHTML = `
            <div class="cal-header">
                <div class="cal-title">\uD83D\uDCC5 Calendario</div>
                <button class="cal-close" id="calClose">\u2715</button>
            </div>
            <div class="cal-body">
                <!-- Month navigation -->
                <div class="cal-month-nav">
                    <button class="cal-nav-btn" id="calPrevMonth">\u25C0</button>
                    <div class="cal-month-label" id="calMonthLabel"></div>
                    <button class="cal-nav-btn" id="calNextMonth">\u25B6</button>
                    <button class="cal-today-btn" id="calToday">Hoy</button>
                </div>

                <!-- Calendar grid -->
                <div class="cal-grid" id="calGrid"></div>

                <!-- Selected day events -->
                <div class="cal-day-events" id="calDayEvents" style="display:none">
                    <div class="cal-day-header">
                        <div class="cal-day-title" id="calDayTitle"></div>
                        <button class="cal-add-btn" id="calAddEvent">+ Nuevo evento</button>
                    </div>
                    <div class="cal-events-list" id="calEventsList"></div>
                </div>

                <!-- Upcoming events (when no day selected) -->
                <div class="cal-upcoming" id="calUpcoming">
                    <div class="cal-upcoming-title">Próximos eventos</div>
                    <div class="cal-upcoming-list" id="calUpcomingList"></div>
                </div>
            </div>

            <!-- Event editor modal -->
            <div class="cal-modal" id="calModal" style="display:none">
                <div class="cal-modal-content">
                    <div class="cal-modal-header">
                        <div class="cal-modal-title" id="calModalTitle">Nuevo Evento</div>
                        <button class="cal-modal-close" id="calModalClose">\u2715</button>
                    </div>
                    <div class="cal-modal-body">
                        <div class="cal-field">
                            <label class="cal-label">Título *</label>
                            <input type="text" class="cal-input" id="calEvTitle" placeholder="Nombre del evento..." maxlength="120">
                        </div>

                        <div class="cal-field-row">
                            <div class="cal-field cal-field-half">
                                <label class="cal-label">Fecha</label>
                                <input type="date" class="cal-input" id="calEvDate">
                            </div>
                            <div class="cal-field cal-field-half">
                                <label class="cal-label">Hora</label>
                                <input type="time" class="cal-input" id="calEvTime">
                            </div>
                        </div>

                        <div class="cal-field-row">
                            <div class="cal-field cal-field-half">
                                <label class="cal-label">Hora fin (opcional)</label>
                                <input type="time" class="cal-input" id="calEvTimeEnd">
                            </div>
                            <div class="cal-field cal-field-half">
                                <label class="cal-label">Tipo</label>
                                <select class="cal-input cal-select" id="calEvType"></select>
                            </div>
                        </div>

                        <div class="cal-field">
                            <label class="cal-label">Descripción</label>
                            <textarea class="cal-textarea" id="calEvDesc" placeholder="Detalles del evento..." rows="3"></textarea>
                        </div>

                        <div class="cal-field">
                            <label class="cal-label">\uD83D\uDCCD Ubicación / Google Maps</label>
                            <input type="text" class="cal-input" id="calEvLocation" placeholder="Dirección o link de Google Maps...">
                        </div>

                        <div class="cal-field">
                            <label class="cal-label">\uD83D\uDD17 URL / Enlace</label>
                            <input type="url" class="cal-input" id="calEvUrl" placeholder="https://...">
                        </div>

                        <div class="cal-field">
                            <label class="cal-label">\uD83D\uDCCE Adjuntos (fotos, audio, video)</label>
                            <div class="cal-attachments-zone" id="calAttachZone">
                                <input type="file" id="calFileInput" multiple accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt" style="display:none">
                                <button class="cal-attach-btn" id="calAttachBtn">\uD83D\uDCCE Agregar archivos</button>
                                <span class="cal-attach-hint">Fotos, audio, video, documentos</span>
                            </div>
                            <div class="cal-attachments-list" id="calAttachList"></div>
                        </div>

                        <div class="cal-field">
                            <label class="cal-label">\uD83D\uDCDD Notas</label>
                            <textarea class="cal-textarea" id="calEvNotes" placeholder="Notas adicionales..." rows="2"></textarea>
                        </div>

                        <div class="cal-field">
                            <label class="cal-label">\uD83D\uDD14 Recordatorio</label>
                            <select class="cal-input cal-select" id="calEvReminder">
                                <option value="">Sin recordatorio</option>
                                <option value="0">Al momento</option>
                                <option value="5">5 minutos antes</option>
                                <option value="15">15 minutos antes</option>
                                <option value="30">30 minutos antes</option>
                                <option value="60">1 hora antes</option>
                                <option value="1440">1 día antes</option>
                            </select>
                        </div>

                        <div class="cal-field">
                            <label class="cal-label cal-label-check">
                                <input type="checkbox" id="calEvRecurring"> Evento recurrente (semanal)
                            </label>
                        </div>
                    </div>
                    <div class="cal-modal-footer">
                        <button class="cal-btn-delete" id="calEvDelete" style="display:none">Eliminar</button>
                        <div class="cal-modal-spacer"></div>
                        <button class="cal-btn-cancel" id="calEvCancel">Cancelar</button>
                        <button class="cal-btn-save" id="calEvSave">Guardar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.panel);
    }

    // ==========================================
    // EVENTS BINDING
    // ==========================================
    bindEvents() {
        document.getElementById('calClose').addEventListener('click', () => this.close());
        document.getElementById('calPrevMonth').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('calNextMonth').addEventListener('click', () => this.changeMonth(1));
        document.getElementById('calToday').addEventListener('click', () => this.goToday());
        document.getElementById('calAddEvent').addEventListener('click', () => this.openEditor());
        document.getElementById('calModalClose').addEventListener('click', () => this.closeEditor());
        document.getElementById('calEvCancel').addEventListener('click', () => this.closeEditor());
        document.getElementById('calEvSave').addEventListener('click', () => this.saveEvent());
        document.getElementById('calEvDelete').addEventListener('click', () => this.deleteEvent());

        // File attachments
        document.getElementById('calAttachBtn').addEventListener('click', () => {
            document.getElementById('calFileInput').click();
        });
        document.getElementById('calFileInput').addEventListener('change', (e) => this.handleFiles(e));

        // Populate type selector
        const typeSelect = document.getElementById('calEvType');
        this.eventTypes.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `${t.icon} ${t.label}`;
            typeSelect.appendChild(opt);
        });
    }

    // ==========================================
    // MONTH NAVIGATION
    // ==========================================
    changeMonth(delta) {
        this.viewMonth += delta;
        if (this.viewMonth > 11) { this.viewMonth = 0; this.viewYear++; }
        if (this.viewMonth < 0) { this.viewMonth = 11; this.viewYear--; }
        this.renderCalendar();
    }

    goToday() {
        const now = new Date();
        this.viewMonth = now.getMonth();
        this.viewYear = now.getFullYear();
        this.selectedDate = this.formatDate(now);
        this.renderCalendar();
        this.showDayEvents(this.selectedDate);
    }

    // ==========================================
    // RENDER CALENDAR GRID
    // ==========================================
    renderCalendar() {
        document.getElementById('calMonthLabel').textContent =
            `${this.MONTHS[this.viewMonth]} ${this.viewYear}`;

        const grid = document.getElementById('calGrid');
        let html = '';

        // Day headers
        this.DAYS.forEach(d => {
            html += `<div class="cal-day-name">${d}</div>`;
        });

        // Calculate first day of month and total days
        const firstDay = new Date(this.viewYear, this.viewMonth, 1).getDay();
        const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
        const today = this.formatDate(new Date());

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="cal-cell cal-cell-empty"></div>';
        }

        // Day cells
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${this.viewYear}-${String(this.viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = dateStr === today;
            const isSelected = dateStr === this.selectedDate;
            const dayEvents = this.getEventsForDate(dateStr);
            const hasEvents = dayEvents.length > 0;

            let classes = 'cal-cell';
            if (isToday) classes += ' cal-cell-today';
            if (isSelected) classes += ' cal-cell-selected';
            if (hasEvents) classes += ' cal-cell-has-events';

            let dots = '';
            if (hasEvents) {
                const uniqueTypes = [...new Set(dayEvents.map(e => e.type))];
                dots = '<div class="cal-cell-dots">';
                uniqueTypes.slice(0, 4).forEach(t => {
                    const typeInfo = this.eventTypes.find(et => et.id === t) || this.eventTypes[7];
                    dots += `<span class="cal-dot" style="background:${typeInfo.color}"></span>`;
                });
                dots += '</div>';
            }

            html += `<div class="${classes}" data-date="${dateStr}">
                <span class="cal-cell-num">${d}</span>
                ${dots}
            </div>`;
        }

        grid.innerHTML = html;

        // Click on day cells
        grid.querySelectorAll('.cal-cell:not(.cal-cell-empty)').forEach(cell => {
            cell.addEventListener('click', () => {
                const date = cell.dataset.date;
                this.selectedDate = date;
                this.renderCalendar();
                this.showDayEvents(date);
            });
        });

        // Show upcoming or selected day
        if (this.selectedDate) {
            this.showDayEvents(this.selectedDate);
        } else {
            this.showUpcoming();
        }
    }

    // ==========================================
    // SHOW DAY EVENTS
    // ==========================================
    showDayEvents(dateStr) {
        const dayEvDiv = document.getElementById('calDayEvents');
        const upcomingDiv = document.getElementById('calUpcoming');
        const titleDiv = document.getElementById('calDayTitle');
        const listDiv = document.getElementById('calEventsList');

        dayEvDiv.style.display = 'block';
        upcomingDiv.style.display = 'none';

        const date = new Date(dateStr + 'T12:00:00');
        const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()];
        titleDiv.textContent = `${dayName} ${date.getDate()} de ${this.MONTHS[date.getMonth()]}`;

        const events = this.getEventsForDate(dateStr);

        if (events.length === 0) {
            listDiv.innerHTML = '<div class="cal-no-events">No hay eventos para este día</div>';
            return;
        }

        // Sort by time
        events.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

        let html = '';
        events.forEach(ev => {
            const typeInfo = this.eventTypes.find(t => t.id === ev.type) || this.eventTypes[7];
            html += this.renderEventCard(ev, typeInfo);
        });

        listDiv.innerHTML = html;
        this.bindEventCardActions(listDiv);
    }

    renderEventCard(ev, typeInfo) {
        const timeStr = ev.time ? this.formatTime12(ev.time) : '';
        const timeEndStr = ev.timeEnd ? ` - ${this.formatTime12(ev.timeEnd)}` : '';
        const hasLocation = ev.location && ev.location.trim();
        const hasUrl = ev.url && ev.url.trim();
        const hasNotes = ev.notes && ev.notes.trim();
        const hasAttachments = ev.attachments && ev.attachments.length > 0;
        const isMap = hasLocation && (ev.location.includes('google.com/maps') || ev.location.includes('goo.gl/maps') || ev.location.includes('maps.app'));

        let extras = '';

        if (ev.description) {
            extras += `<div class="cal-ev-desc">${this.escapeHtml(ev.description)}</div>`;
        }

        if (hasLocation) {
            if (isMap) {
                extras += `<a href="${this.escapeHtml(ev.location)}" target="_blank" rel="noopener" class="cal-ev-link">\uD83D\uDCCD Ver en Google Maps</a>`;
            } else {
                const mapsUrl = 'https://www.google.com/maps/search/' + encodeURIComponent(ev.location);
                extras += `<a href="${mapsUrl}" target="_blank" rel="noopener" class="cal-ev-link">\uD83D\uDCCD ${this.escapeHtml(ev.location)}</a>`;
            }
        }

        if (hasUrl) {
            extras += `<a href="${this.escapeHtml(ev.url)}" target="_blank" rel="noopener" class="cal-ev-link">\uD83D\uDD17 ${this.truncate(ev.url, 50)}</a>`;
        }

        if (hasAttachments) {
            extras += '<div class="cal-ev-attachments">';
            ev.attachments.forEach((att, i) => {
                if (att.type.startsWith('image/')) {
                    extras += `<div class="cal-ev-attach-thumb" data-ev="${ev.id}" data-idx="${i}">
                        <img src="${att.data}" alt="${this.escapeHtml(att.name)}">
                    </div>`;
                } else if (att.type.startsWith('audio/')) {
                    extras += `<div class="cal-ev-attach-file">\uD83C\uDFB5 <span>${this.escapeHtml(att.name)}</span>
                        <audio controls src="${att.data}" preload="none"></audio>
                    </div>`;
                } else if (att.type.startsWith('video/')) {
                    extras += `<div class="cal-ev-attach-file">\uD83C\uDFA5 <span>${this.escapeHtml(att.name)}</span>
                        <video controls src="${att.data}" preload="none" style="max-width:100%;border-radius:6px;margin-top:4px;"></video>
                    </div>`;
                } else {
                    extras += `<div class="cal-ev-attach-file">\uD83D\uDCCE ${this.escapeHtml(att.name)}</div>`;
                }
            });
            extras += '</div>';
        }

        if (hasNotes) {
            extras += `<div class="cal-ev-notes">\uD83D\uDCDD ${this.escapeHtml(ev.notes)}</div>`;
        }

        if (ev.recurring) {
            extras += `<div class="cal-ev-recurring">\uD83D\uDD01 Semanal</div>`;
        }

        return `
            <div class="cal-event-card" data-id="${ev.id}" style="border-left-color: ${typeInfo.color}">
                <div class="cal-ev-top">
                    <span class="cal-ev-icon" style="color:${typeInfo.color}">${typeInfo.icon}</span>
                    <div class="cal-ev-info">
                        <div class="cal-ev-title">${this.escapeHtml(ev.title)}</div>
                        ${timeStr ? `<div class="cal-ev-time">${timeStr}${timeEndStr}</div>` : ''}
                    </div>
                    <button class="cal-ev-edit" data-id="${ev.id}" title="Editar">\u270F</button>
                </div>
                ${extras ? `<div class="cal-ev-extras">${extras}</div>` : ''}
            </div>
        `;
    }

    bindEventCardActions(container) {
        container.querySelectorAll('.cal-ev-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const ev = this.events.find(ev => ev.id === btn.dataset.id);
                if (ev) this.openEditor(ev);
            });
        });
    }

    // ==========================================
    // SHOW UPCOMING EVENTS
    // ==========================================
    showUpcoming() {
        const dayEvDiv = document.getElementById('calDayEvents');
        const upcomingDiv = document.getElementById('calUpcoming');
        const listDiv = document.getElementById('calUpcomingList');

        dayEvDiv.style.display = 'none';
        upcomingDiv.style.display = 'block';

        const today = this.formatDate(new Date());
        const upcoming = this.events
            .filter(ev => ev.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
            .slice(0, 10);

        if (upcoming.length === 0) {
            listDiv.innerHTML = '<div class="cal-no-events">No hay eventos próximos. Seleccioná un día para agregar.</div>';
            return;
        }

        let html = '';
        upcoming.forEach(ev => {
            const typeInfo = this.eventTypes.find(t => t.id === ev.type) || this.eventTypes[7];
            const date = new Date(ev.date + 'T12:00:00');
            const dateLabel = `${date.getDate()} ${this.MONTHS[date.getMonth()].substring(0, 3)}`;
            const timeStr = ev.time ? this.formatTime12(ev.time) : '';

            html += `
                <div class="cal-upcoming-item" data-date="${ev.date}">
                    <div class="cal-upcoming-date">${dateLabel}</div>
                    <span class="cal-upcoming-icon" style="color:${typeInfo.color}">${typeInfo.icon}</span>
                    <div class="cal-upcoming-info">
                        <div class="cal-upcoming-name">${this.escapeHtml(ev.title)}</div>
                        ${timeStr ? `<div class="cal-upcoming-time">${timeStr}</div>` : ''}
                    </div>
                </div>
            `;
        });

        listDiv.innerHTML = html;

        listDiv.querySelectorAll('.cal-upcoming-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectedDate = item.dataset.date;
                const d = new Date(item.dataset.date + 'T12:00:00');
                this.viewMonth = d.getMonth();
                this.viewYear = d.getFullYear();
                this.renderCalendar();
                this.showDayEvents(item.dataset.date);
            });
        });
    }

    // ==========================================
    // EVENT EDITOR
    // ==========================================
    openEditor(existingEvent) {
        const modal = document.getElementById('calModal');
        this.currentAttachments = [];

        if (existingEvent) {
            this.editingEvent = existingEvent;
            document.getElementById('calModalTitle').textContent = 'Editar Evento';
            document.getElementById('calEvTitle').value = existingEvent.title || '';
            document.getElementById('calEvDate').value = existingEvent.date || '';
            document.getElementById('calEvTime').value = existingEvent.time || '';
            document.getElementById('calEvTimeEnd').value = existingEvent.timeEnd || '';
            document.getElementById('calEvType').value = existingEvent.type || 'otro';
            document.getElementById('calEvDesc').value = existingEvent.description || '';
            document.getElementById('calEvLocation').value = existingEvent.location || '';
            document.getElementById('calEvUrl').value = existingEvent.url || '';
            document.getElementById('calEvNotes').value = existingEvent.notes || '';
            document.getElementById('calEvReminder').value = existingEvent.reminder || '';
            document.getElementById('calEvRecurring').checked = existingEvent.recurring || false;
            document.getElementById('calEvDelete').style.display = 'block';
            this.currentAttachments = existingEvent.attachments ? [...existingEvent.attachments] : [];
        } else {
            this.editingEvent = null;
            document.getElementById('calModalTitle').textContent = 'Nuevo Evento';
            document.getElementById('calEvTitle').value = '';
            document.getElementById('calEvDate').value = this.selectedDate || this.formatDate(new Date());
            document.getElementById('calEvTime').value = '';
            document.getElementById('calEvTimeEnd').value = '';
            document.getElementById('calEvType').value = 'iglesia';
            document.getElementById('calEvDesc').value = '';
            document.getElementById('calEvLocation').value = '';
            document.getElementById('calEvUrl').value = '';
            document.getElementById('calEvNotes').value = '';
            document.getElementById('calEvReminder').value = '';
            document.getElementById('calEvRecurring').checked = false;
            document.getElementById('calEvDelete').style.display = 'none';
            this.currentAttachments = [];
        }

        this.renderAttachments();
        modal.style.display = 'flex';
        document.getElementById('calEvTitle').focus();
    }

    closeEditor() {
        document.getElementById('calModal').style.display = 'none';
        this.editingEvent = null;
        this.currentAttachments = [];
    }

    saveEvent() {
        const title = document.getElementById('calEvTitle').value.trim();
        if (!title) {
            this.toast('Ingresá un título para el evento');
            document.getElementById('calEvTitle').focus();
            return;
        }

        const eventData = {
            id: this.editingEvent ? this.editingEvent.id : this.generateId(),
            title: title,
            date: document.getElementById('calEvDate').value,
            time: document.getElementById('calEvTime').value,
            timeEnd: document.getElementById('calEvTimeEnd').value,
            type: document.getElementById('calEvType').value,
            description: document.getElementById('calEvDesc').value.trim(),
            location: document.getElementById('calEvLocation').value.trim(),
            url: document.getElementById('calEvUrl').value.trim(),
            notes: document.getElementById('calEvNotes').value.trim(),
            reminder: document.getElementById('calEvReminder').value,
            recurring: document.getElementById('calEvRecurring').checked,
            attachments: this.currentAttachments,
            createdAt: this.editingEvent ? this.editingEvent.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.editingEvent) {
            const idx = this.events.findIndex(e => e.id === this.editingEvent.id);
            if (idx !== -1) this.events[idx] = eventData;
        } else {
            this.events.push(eventData);
        }

        // Handle recurring: generate next 12 weeks
        if (eventData.recurring && !this.editingEvent) {
            const baseDate = new Date(eventData.date + 'T12:00:00');
            for (let w = 1; w <= 12; w++) {
                const next = new Date(baseDate);
                next.setDate(next.getDate() + (7 * w));
                const clone = { ...eventData };
                clone.id = this.generateId();
                clone.date = this.formatDate(next);
                clone.recurring = true;
                clone.parentId = eventData.id;
                this.events.push(clone);
            }
        }

        this.saveEvents();
        this.closeEditor();
        this.renderCalendar();
        this.toast(this.editingEvent ? 'Evento actualizado' : 'Evento creado');
    }

    deleteEvent() {
        if (!this.editingEvent) return;
        const id = this.editingEvent.id;

        // Also delete recurring children
        this.events = this.events.filter(e => e.id !== id && e.parentId !== id);
        this.saveEvents();
        this.closeEditor();
        this.renderCalendar();
        this.toast('Evento eliminado');
    }

    // ==========================================
    // FILE ATTACHMENTS
    // ==========================================
    handleFiles(e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                this.toast(`${file.name} es muy grande (máx 10MB)`);
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                this.currentAttachments.push({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: reader.result
                });
                this.renderAttachments();
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        e.target.value = '';
    }

    renderAttachments() {
        const list = document.getElementById('calAttachList');
        if (!this.currentAttachments.length) {
            list.innerHTML = '';
            return;
        }

        let html = '';
        this.currentAttachments.forEach((att, i) => {
            const icon = att.type.startsWith('image/') ? '\uD83D\uDDBC'
                       : att.type.startsWith('audio/') ? '\uD83C\uDFB5'
                       : att.type.startsWith('video/') ? '\uD83C\uDFA5'
                       : '\uD83D\uDCCE';
            const preview = att.type.startsWith('image/')
                ? `<img src="${att.data}" class="cal-attach-preview">`
                : '';

            html += `<div class="cal-attach-item">
                ${preview}
                <span class="cal-attach-name">${icon} ${this.escapeHtml(att.name)}</span>
                <button class="cal-attach-remove" data-idx="${i}">\u2715</button>
            </div>`;
        });

        list.innerHTML = html;

        list.querySelectorAll('.cal-attach-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentAttachments.splice(parseInt(btn.dataset.idx), 1);
                this.renderAttachments();
            });
        });
    }

    // ==========================================
    // OPEN / CLOSE PANEL
    // ==========================================
    open() {
        this.isOpen = true;
        this.panel.classList.add('active');
        document.getElementById('overlay').classList.add('active');
        this.renderCalendar();

        const btn = document.getElementById('toggleCalendar');
        if (btn) btn.classList.add('active');
    }

    close() {
        this.isOpen = false;
        this.panel.classList.remove('active');
        document.getElementById('overlay').classList.remove('active');

        const btn = document.getElementById('toggleCalendar');
        if (btn) btn.classList.remove('active');
    }

    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    // ==========================================
    // BOT INTEGRATION
    // ==========================================
    addEventFromBot(eventData) {
        // Called by the bot to add an event
        const ev = {
            id: this.generateId(),
            title: eventData.title || 'Evento del Bot',
            date: eventData.date || this.formatDate(new Date()),
            time: eventData.time || '',
            timeEnd: eventData.timeEnd || '',
            type: eventData.type || 'recordatorio',
            description: eventData.description || '',
            location: eventData.location || '',
            url: eventData.url || '',
            notes: eventData.notes || '',
            reminder: eventData.reminder || '',
            recurring: eventData.recurring || false,
            attachments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.events.push(ev);
        this.saveEvents();
        this.toast('Evento agregado al calendario');
        return ev;
    }

    getUpcomingForBot(days) {
        // Returns upcoming events for the bot context
        const today = this.formatDate(new Date());
        const limit = new Date();
        limit.setDate(limit.getDate() + (days || 7));
        const limitStr = this.formatDate(limit);

        return this.events
            .filter(ev => ev.date >= today && ev.date <= limitStr)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(ev => {
                const typeInfo = this.eventTypes.find(t => t.id === ev.type) || this.eventTypes[7];
                return `${ev.date} ${ev.time || ''} - ${typeInfo.icon} ${ev.title}${ev.location ? ' (' + ev.location + ')' : ''}`;
            })
            .join('\n');
    }

    updateEventFromBot(eventId, updates) {
        const idx = this.events.findIndex(e => e.id === eventId);
        if (idx === -1) return null;
        Object.assign(this.events[idx], updates, { updatedAt: new Date().toISOString() });
        this.saveEvents();
        this.toast('Evento actualizado');
        return this.events[idx];
    }

    deleteEventFromBot(eventId) {
        const ev = this.events.find(e => e.id === eventId);
        if (!ev) return false;
        this.events = this.events.filter(e => e.id !== eventId && e.parentId !== eventId);
        this.saveEvents();
        this.toast('Evento eliminado');
        return true;
    }

    searchEvents(query) {
        const q = query.toLowerCase();
        return this.events.filter(ev =>
            (ev.title && ev.title.toLowerCase().includes(q)) ||
            (ev.description && ev.description.toLowerCase().includes(q)) ||
            (ev.notes && ev.notes.toLowerCase().includes(q))
        );
    }

    getEventsInRange(startDate, endDate) {
        return this.events
            .filter(ev => ev.date >= startDate && ev.date <= endDate)
            .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));
    }

    getAllEventsForBot() {
        const today = this.formatDate(new Date());
        const upcoming = this.events.filter(ev => ev.date >= today).sort((a, b) => a.date.localeCompare(b.date));
        const past = this.events.filter(ev => ev.date < today).sort((a, b) => b.date.localeCompare(a.date));
        return { upcoming, past, total: this.events.length };
    }

    // ==========================================
    // HELPERS
    // ==========================================
    getEventsForDate(dateStr) {
        return this.events.filter(ev => ev.date === dateStr);
    }

    formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    formatTime12(time24) {
        if (!time24) return '';
        const [h, m] = time24.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
    }

    generateId() {
        return 'ev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
    }

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    truncate(str, max) {
        if (!str) return '';
        return str.length > max ? str.substring(0, max) + '...' : str;
    }

    toast(msg) {
        if (window.bibliaApp && window.bibliaApp.toast) {
            window.bibliaApp.toast(msg);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bibliaCalendar = new BibliaCalendar();
});
