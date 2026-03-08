// ============================================
// BIBLIA RECURSOS - Infografías, Mapas,
// Ilustraciones, Guías de Estudio y más
// Todo gratuito para estudio bíblico
// ============================================

class BibliaRecursos {
    constructor() {
        this.isOpen = false;
        this.activeCategory = null;

        this.categories = [
            {
                id: 'biblia',
                icon: '\uD83D\uDCD5',
                color: '#e74c3c',
                title: 'Biblia',
                desc: 'Infografías sobre el libro de los libros.',
                resources: [
                    { name: 'InfograBiblia', desc: 'Infografías visuales educativas sobre la Biblia.', url: 'https://infograbiblia.com/', type: 'web' },
                    { name: '23 Infografías Gratuitas', desc: 'Coalición por el Evangelio - Infografías de Acceso Directo para estudio personal.', url: 'https://www.coalicionporelevangelio.org/entradas/steven-morales/23-infograficas-gratuitas-sobre-la-biblia/', type: 'web' },
                    { name: 'StalkeatuBiblia - Infografías', desc: 'Infografías descargables, fondos de pantalla e imágenes para compartir.', url: 'https://stalkeatubiblia.com/infografias/', type: 'download' },
                    { name: 'Infografías AT - Lifeway', desc: 'Colección de infografías del Antiguo Testamento por Lifeway.', url: 'https://issuu.com/lifeway-espanol/docs/infografias_at', type: 'web' },
                    { name: 'BibleProject en Español', desc: 'Videos animados que explican cada libro de la Biblia y temas teológicos.', url: 'https://spa.bibleproject.com/', type: 'video' },
                    { name: 'BibleProject - Descargas', desc: 'Pósters, guías de estudio y notas descargables gratis.', url: 'https://bibleproject.com/locale/downloads/spa/', type: 'download' },
                    { name: 'Visual Unit - Libros de la Biblia', desc: 'Gráfico visual de todos los libros de la Biblia en español.', url: 'https://visualunit.me/2015/09/14/los-libros-de-la-biblia/', type: 'download' },
                    { name: 'Tabla Periódica de la Biblia', desc: 'Visual Unit - Tabla periódica creativa con datos de cada libro.', url: 'https://visualunit.me/2015/07/09/la-tabla-periodica-de-la-biblia-the-periodic-table-spanish-version/', type: 'download' },
                ]
            },
            {
                id: 'tematica',
                icon: '\u270D',
                color: '#27ae60',
                title: 'Temática',
                desc: 'Gráficas de estudio sobre eventos y temas específicos.',
                resources: [
                    { name: 'BibleProject - Temas', desc: 'Videos animados sobre temas bíblicos: Gracia, Justicia, Pacto, etc.', url: 'https://spa.bibleproject.com/', type: 'video' },
                    { name: 'Guía para Estudiar la Biblia', desc: 'CVCLAVOZ - Guía imprimible gratuita de estudio bíblico.', url: 'https://cvclavoz.com/blog/inspiracional/descarga-gratis-guia-para-estudiar-la-biblia/', type: 'download' },
                    { name: 'Concordancia Bíblica', desc: 'BibliaTodo - Concordancia, diccionario, Biblia paralela y comentarios.', url: 'https://www.bibliatodo.com/concordancia-biblica', type: 'web' },
                    { name: 'Blue Letter Bible (Español)', desc: 'Comentarios, diccionarios y léxicos para estudio profundo.', url: 'https://www.blueletterbible.org/spanish/', type: 'web' },
                    { name: 'Escuela Bíblica Online', desc: 'Biblia online con búsqueda de concordancia por palabras y frases.', url: 'https://www.escuelabiblica.com/biblia-online.php', type: 'web' },
                    { name: 'Métodos Creativos de Estudio', desc: 'Curso completo en PDF sobre métodos creativos de estudio bíblico.', url: 'https://www.aibi.ph/espanol/doc/pdf-modulos/M%C3%A9todos%20Creativos%20del%20Estudio%20B%C3%ADblico.pdf', type: 'pdf' },
                    { name: 'Cómo Estudiar la Biblia', desc: 'Sistema paso a paso de estudio bíblico en PDF.', url: 'https://discipuladobiblico.com/como_estudiar_la_Biblia.pdf', type: 'pdf' },
                    { name: 'Estudios Bíblicos en PDF', desc: 'Misión Simple - Colección de estudios bíblicos evangélicos gratuitos.', url: 'https://misionsimple.com/descarga-gratis-estudios-biblicos-cristianos-evangelicos-en-pdf/', type: 'download' },
                ]
            },
            {
                id: 'mapas',
                icon: '\uD83D\uDDFA',
                color: '#3498db',
                title: 'Lugares y Mapas',
                desc: 'Lugares y locaciones bíblicas desde una perspectiva diferente.',
                resources: [
                    { name: 'Mapas Bíblicos - BibliaTodo', desc: 'Buscador de mapas por nombre, ubicación, país y región.', url: 'https://www.bibliatodo.com/mapas-biblicos/', type: 'web' },
                    { name: 'Mapas Bíblicos - Biblia para la Vida', desc: 'Mapas bíblicos para estudio práctico y ministerio.', url: 'https://bibliaparalavida.com/mapas-biblicos/', type: 'web' },
                    { name: 'Mapas Bíblicos - SOBICAIN', desc: 'Centro Bíblico San Pablo, Madrid - Mapas de tierras bíblicas.', url: 'https://www.sobicain.org/contenido/mapas-biblicos/', type: 'web' },
                    { name: 'Atlas Bíblico (PDF completo)', desc: 'John Strange / Sociedades Bíblicas Unidas, 1999.', url: 'http://www.elolivo.net/LIBROS/Strange-AtlasBiblico.pdf', type: 'pdf' },
                    { name: 'Atlas de la Biblia', desc: 'Internet Archive - Libro digital completo de atlas bíblico.', url: 'https://archive.org/details/atlasdelabiblia', type: 'web' },
                    { name: 'Atlas de la Biblia - Reader\'s Digest', desc: 'Guía Ilustrada de Tierra Santa con mapas detallados.', url: 'https://archive.org/details/atlas-de-la-biblia-readers-digest', type: 'web' },
                    { name: 'Atlas Didáctico de la Biblia', desc: 'PDF académico con mapas didácticos detallados.', url: 'https://www.academia.edu/37730417/Atlas_Did%C3%A1ctico_de_la_Biblia', type: 'pdf' },
                    { name: 'OpenBible.info', desc: 'Datos bíblicos abiertos: geocodificación, temas y referencias cruzadas.', url: 'https://www.openbible.info/', type: 'web' },
                ]
            },
            {
                id: 'ilustraciones',
                icon: '\uD83C\uDFA8',
                color: '#9b59b6',
                title: 'Ilustraciones',
                desc: 'Arte e ilustraciones bíblicas inspiradoras.',
                resources: [
                    { name: 'Free Bible Images', desc: '+1,400 sets de ilustraciones bíblicas. Descarga en PowerPoint, PDF, JPEG.', url: 'https://www.freebibleimages.org/', type: 'download' },
                    { name: 'Imágenes Bíblicas Gratis', desc: 'Versión en español de Free Bible Images. +1,100 sets de escenas bíblicas.', url: 'https://www.imagenesbiblicasgratis.org/', type: 'download' },
                    { name: 'Public Domain Bible Art', desc: '+1,000 imágenes de arte bíblico en dominio público via Google Drive.', url: 'https://publicdomainbibleart.com/', type: 'download' },
                    { name: '3,000 Imágenes de toda la Biblia', desc: 'Recursos Bíblicos - Imágenes organizadas por libro bíblico.', url: 'https://www.recursos-biblicos.com/2015/02/imagenes-de-toda-la-biblia-para.html', type: 'web' },
                    { name: 'Arte Bíblica', desc: 'Galería de arte bíblico, ilustraciones cristianas en dominio público.', url: 'http://artebiblica.blogspot.com/', type: 'web' },
                    { name: 'Ilustraciones de la Biblia', desc: 'Ilustraciones católicas de alta resolución (2400x3200), dominio público.', url: 'https://uncatolico.com/ilustraciones-de-la-biblia/', type: 'download' },
                    { name: 'Pixabay - Biblia', desc: '+2,000 ilustraciones bíblicas libres de regalías, sin atribución requerida.', url: 'https://pixabay.com/es/illustrations/search/la%20biblia/', type: 'web' },
                    { name: 'Library of Congress - Bible', desc: '+25,000 imágenes bíblicas del Archivo de Dominio Público.', url: 'https://loc.getarchive.net/topics/bible', type: 'web' },
                ]
            },
            {
                id: 'personajes',
                icon: '\u2B50',
                color: '#f39c12',
                title: 'Personajes e Historias',
                desc: 'Muy conocidos o no tanto, pero con una enseñanza.',
                resources: [
                    { name: 'Visual Unit - Línea de Tiempo', desc: 'Línea del tiempo bíblica completa en PDF español.', url: 'https://visualunit.me/wp-content/uploads/2016/11/lc3adnea-del-tiempo1.pdf', type: 'pdf' },
                    { name: 'Visual Unit', desc: 'Líneas de tiempo, árboles genealógicos, gráficos de libros bíblicos.', url: 'https://visualunit.me/', type: 'web' },
                    { name: '2 Líneas de Tiempo Ilustradas', desc: 'Recursos Bíblicos - Líneas de tiempo detalladas en PDF.', url: 'https://www.recursos-biblicos.com/2020/09/2-lineas-de-tiempo-de-la-biblia-ilustrada-y-a-detalle-en-pdf.html', type: 'pdf' },
                    { name: 'Línea Interactiva de Libros', desc: 'Genially - Línea del tiempo interactiva de los libros de la Biblia.', url: 'https://view.genially.com/6558f16ae5bec400113c0455/interactive-content-linea-del-tiempo-de-los-libros-de-la-biblia', type: 'web' },
                    { name: 'Historias en Orden Cronológico', desc: 'CVCLAVOZ - Todas las historias de la Biblia en orden cronológico.', url: 'https://cvclavoz.com/blog/inspiracional/las-historias-de-la-biblia-en-orden-cronologico/', type: 'web' },
                    { name: 'Línea de Tiempo Personajes', desc: 'Timetoast - Línea interactiva de personajes bíblicos.', url: 'https://www.timetoast.com/timelines/linea-de-tiempo-personajes-biblicos', type: 'web' },
                    { name: 'La Biblia para Niños', desc: 'Historias bíblicas ilustradas en PDF gratuito y libros para colorear.', url: 'https://bibleforchildren.org/languages/spanish/stories.php', type: 'download' },
                    { name: 'Proyecto Biblia - Videos', desc: 'Videos animados cortos de historias bíblicas para descargar.', url: 'https://proyectobiblia.com/explore/', type: 'video' },
                ]
            },
            {
                id: 'educativos',
                icon: '\uD83D\uDCDA',
                color: '#1abc9c',
                title: 'Recursos Educativos',
                desc: 'Guías y libros para el estudio de la Biblia.',
                resources: [
                    { name: 'BibleProject en Español', desc: 'Videos, guías de estudio, pósters y podcasts de cada libro bíblico.', url: 'https://spa.bibleproject.com/', type: 'video' },
                    { name: 'Estudios Bíblicos Adventistas', desc: 'Series de estudio bíblico interactivo en PDF para móvil, tablet o impresión.', url: 'https://downloads.adventistas.org/es/kits/estudios-biblicos/', type: 'download' },
                    { name: 'Curso de Estudio Inductivo', desc: 'Instituto Bíblico Ministerial - Guía descargable en PDF.', url: 'https://institutobiblicoministerial.com/archivos/329', type: 'pdf' },
                    { name: 'Guías de Estudio - Amaras a Israel', desc: 'Guías de estudio bíblico por Baruch Korman.', url: 'https://amarasaisrael.org/guias-de-estudio/', type: 'web' },
                    { name: 'Recursos Bíblicos', desc: 'Colección masiva: +3,000 imágenes, marcadores, estudios PowerPoint, líneas de tiempo.', url: 'https://www.recursos-biblicos.com/', type: 'web' },
                    { name: 'Biblia.es - Online', desc: 'Biblia en español online con búsqueda de concordancia.', url: 'https://www.biblia.es/biblia-online.php', type: 'web' },
                    { name: 'YouVersion - Bible.com', desc: '+2,400 versiones de la Biblia, audio, planes de lectura.', url: 'https://www.bible.com/es', type: 'web' },
                    { name: 'Bible Study Tools - RVR', desc: 'Reina-Valera online con herramientas de estudio.', url: 'https://www.biblestudytools.com/rvr/', type: 'web' },
                ]
            },
            {
                id: 'ninos',
                icon: '\uD83C\uDF1F',
                color: '#e67e22',
                title: 'Para Niños',
                desc: 'Materiales bíblicos para los más pequeños.',
                resources: [
                    { name: 'TruewayKids', desc: 'Lecciones imprimibles del AT y NT: hojas de trabajo, páginas para colorear.', url: 'https://truewaykids.com/old-testament-bible-lessons/', type: 'download' },
                    { name: 'Sermons4Kids (Español)', desc: 'Historias bíblicas, sermones, páginas para colorear y sopas de letras.', url: 'https://sermons4kids.com/es/categories/historias-de-la-biblia', type: 'web' },
                    { name: 'Actividades Bíblicas PDF', desc: 'Más Impulso Global - PDFs de actividades bíblicas para niños.', url: 'https://www.masimpulsoglobal.com/en/actividades-biblicas-para-ninos-pdf/', type: 'download' },
                    { name: 'Los Peques del Reino', desc: 'Cuaderno de actividades: rompecabezas, sopas de letras, laberintos.', url: 'https://www.lospequesdelreino.com/la-biblia-actividades', type: 'web' },
                    { name: 'La Biblia para Niños', desc: 'Historias ilustradas para descargar en PDF y colorear.', url: 'https://bibleforchildren.org/languages/spanish/stories.php', type: 'download' },
                    { name: 'BibleKids - Videos Animados', desc: '+50 videos animados de historias bíblicas para niños.', url: 'https://biblekids.io/en/app/', type: 'video' },
                    { name: 'Garden of Praise (Español)', desc: 'Lecciones bíblicas para niños en español.', url: 'https://gardenofpraise.com/spanishbible.htm', type: 'web' },
                ]
            },
            {
                id: 'descargas',
                icon: '\u2B07',
                color: '#2c3e50',
                title: 'Descargas',
                desc: 'Contenidos de descarga gratuita para aprender y enseñar.',
                resources: [
                    { name: 'BibleProject - Pósters PDF', desc: 'Pósters descargables de cada libro de la Biblia en español.', url: 'https://bibleproject.com/locale/downloads/spa/', type: 'download' },
                    { name: 'Atlas Bíblico PDF', desc: 'Atlas completo de John Strange / Sociedades Bíblicas (PDF).', url: 'http://www.elolivo.net/LIBROS/Strange-AtlasBiblico.pdf', type: 'pdf' },
                    { name: 'Línea de Tiempo PDF', desc: 'Visual Unit - Línea del tiempo bíblica completa en español.', url: 'https://visualunit.me/wp-content/uploads/2016/11/lc3adnea-del-tiempo1.pdf', type: 'pdf' },
                    { name: 'Tabla Periódica de la Biblia PDF', desc: 'Visual Unit - Tabla periódica creativa de la Biblia.', url: 'https://visualunit.me/2015/07/09/la-tabla-periodica-de-la-biblia-the-periodic-table-spanish-version/', type: 'download' },
                    { name: 'Estudios Bíblicos PDF', desc: 'Misión Simple - Colección completa de estudios en PDF.', url: 'https://misionsimple.com/descarga-gratis-estudios-biblicos-cristianos-evangelicos-en-pdf/', type: 'download' },
                    { name: 'Métodos de Estudio PDF', desc: 'Curso completo de métodos creativos de estudio bíblico.', url: 'https://www.aibi.ph/espanol/doc/pdf-modulos/M%C3%A9todos%20Creativos%20del%20Estudio%20B%C3%ADblico.pdf', type: 'pdf' },
                    { name: 'Free Bible Images (ZIP)', desc: '+1,400 sets de ilustraciones en PowerPoint, PDF, JPEG.', url: 'https://www.freebibleimages.org/', type: 'download' },
                    { name: '3,000 Imágenes Bíblicas', desc: 'Recursos Bíblicos - Toda la Biblia en imágenes para descargar.', url: 'https://www.recursos-biblicos.com/2015/02/imagenes-de-toda-la-biblia-para.html', type: 'download' },
                ]
            }
        ];

        this.render();
        this.bindEvents();
    }

    // ==========================================
    // RENDER
    // ==========================================
    render() {
        this.panel = document.createElement('div');
        this.panel.className = 'rec-panel';
        this.panel.innerHTML = `
            <div class="rec-header">
                <div class="rec-header-left">
                    <button class="rec-back" id="recBack" style="display:none">\u25C0</button>
                    <div class="rec-title" id="recTitle">\uD83D\uDCDA Recursos Bíblicos</div>
                </div>
                <button class="rec-close" id="recClose">\u2715</button>
            </div>
            <div class="rec-body">
                <!-- Categories grid -->
                <div class="rec-categories" id="recCategories"></div>
                <!-- Resource list (shown when category selected) -->
                <div class="rec-resources" id="recResources" style="display:none"></div>
            </div>
        `;
        document.body.appendChild(this.panel);
    }

    // ==========================================
    // EVENTS
    // ==========================================
    bindEvents() {
        document.getElementById('recClose').addEventListener('click', () => this.close());
        document.getElementById('recBack').addEventListener('click', () => this.showCategories());
        this.renderCategories();
    }

    // ==========================================
    // CATEGORIES GRID
    // ==========================================
    renderCategories() {
        const container = document.getElementById('recCategories');
        let html = '<div class="rec-subtitle">Recursos gratuitos para el estudio de la Biblia</div>';
        html += '<div class="rec-cat-grid">';

        this.categories.forEach(cat => {
            html += `
                <div class="rec-cat-card" data-id="${cat.id}">
                    <div class="rec-cat-icon" style="background:${cat.color}">${cat.icon}</div>
                    <div class="rec-cat-info">
                        <div class="rec-cat-title">${cat.title}</div>
                        <div class="rec-cat-desc">${cat.desc}</div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('.rec-cat-card').forEach(card => {
            card.addEventListener('click', () => {
                const cat = this.categories.find(c => c.id === card.dataset.id);
                if (cat) this.showCategory(cat);
            });
        });
    }

    // ==========================================
    // SHOW CATEGORY RESOURCES
    // ==========================================
    showCategory(cat) {
        this.activeCategory = cat;
        document.getElementById('recCategories').style.display = 'none';
        document.getElementById('recResources').style.display = 'block';
        document.getElementById('recBack').style.display = 'flex';
        document.getElementById('recTitle').innerHTML = `${cat.icon} ${cat.title}`;

        const container = document.getElementById('recResources');
        let html = `<div class="rec-cat-header-desc">${cat.desc}</div>`;
        html += '<div class="rec-list">';

        cat.resources.forEach(res => {
            const typeLabel = this.getTypeLabel(res.type);
            const typeClass = `rec-type-${res.type}`;

            html += `
                <a href="${this.escapeHtml(res.url)}" target="_blank" rel="noopener" class="rec-item">
                    <div class="rec-item-body">
                        <div class="rec-item-name">${this.escapeHtml(res.name)}</div>
                        <div class="rec-item-desc">${this.escapeHtml(res.desc)}</div>
                    </div>
                    <div class="rec-item-right">
                        <span class="rec-type-badge ${typeClass}">${typeLabel}</span>
                        <span class="rec-item-arrow">\u2197</span>
                    </div>
                </a>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    showCategories() {
        this.activeCategory = null;
        document.getElementById('recCategories').style.display = 'block';
        document.getElementById('recResources').style.display = 'none';
        document.getElementById('recBack').style.display = 'none';
        document.getElementById('recTitle').innerHTML = '\uD83D\uDCDA Recursos B\u00edblicos';
    }

    getTypeLabel(type) {
        switch (type) {
            case 'web': return 'Web';
            case 'download': return 'Descarga';
            case 'pdf': return 'PDF';
            case 'video': return 'Video';
            default: return 'Link';
        }
    }

    // ==========================================
    // OPEN / CLOSE
    // ==========================================
    open() {
        this.isOpen = true;
        this.panel.classList.add('active');
        document.getElementById('overlay').classList.add('active');
        this.showCategories();

        const btn = document.getElementById('toggleRecursos');
        if (btn) btn.classList.add('active');
    }

    close() {
        this.isOpen = false;
        this.panel.classList.remove('active');
        document.getElementById('overlay').classList.remove('active');

        const btn = document.getElementById('toggleRecursos');
        if (btn) btn.classList.remove('active');
    }

    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bibliaRecursos = new BibliaRecursos();
});
