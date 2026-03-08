// ============================================
// BIBLE TIMELINE DATA - Cronología Bíblica
// Años, períodos, eventos y mapas por libro
// ============================================

const BIBLE_TIMELINE = {

    periods: [
        { id: "creacion", label: "Creación", yearStart: -4000, yearEnd: -2100, era: "bc", color: "#8B4513" },
        { id: "patriarcas", label: "Patriarcas", yearStart: -2100, yearEnd: -1800, era: "bc", color: "#DAA520" },
        { id: "esclavitud", label: "Esclavitud en Egipto", yearStart: -1800, yearEnd: -1446, era: "bc", color: "#B22222" },
        { id: "exodo", label: "Éxodo y Conquista", yearStart: -1446, yearEnd: -1375, era: "bc", color: "#FF6347" },
        { id: "jueces", label: "Jueces", yearStart: -1375, yearEnd: -1050, era: "bc", color: "#CD853F" },
        { id: "monarquia-unida", label: "Monarquía Unida", yearStart: -1050, yearEnd: -930, era: "bc", color: "#4169E1" },
        { id: "monarquia-dividida", label: "Monarquía Dividida", yearStart: -930, yearEnd: -586, era: "bc", color: "#9932CC" },
        { id: "exilio", label: "Exilio Babilónico", yearStart: -586, yearEnd: -538, era: "bc", color: "#2F4F4F" },
        { id: "restauracion", label: "Restauración", yearStart: -538, yearEnd: -400, era: "bc", color: "#228B22" },
        { id: "intertestamentario", label: "Periodo Intertestamentario", yearStart: -400, yearEnd: -5, era: "bc", color: "#708090" },
        { id: "vida-jesus", label: "Vida de Jesús", yearStart: -5, yearEnd: 33, era: "ad", color: "#DC143C" },
        { id: "iglesia-primitiva", label: "Iglesia Primitiva", yearStart: 33, yearEnd: 100, era: "ad", color: "#FF8C00" }
    ],

    books: {
        genesis:       { yearStart: -4000, yearEnd: -1805, era: "bc", period: "Patriarcas", mapRegion: "mesopotamia", keyEvents: [{ year: -4000, event: "Creación del mundo" },{ year: -2348, event: "El Diluvio universal" },{ year: -2100, event: "Llamado de Abraham" },{ year: -1900, event: "Nacimiento de Jacob" },{ year: -1805, event: "José muere en Egipto" }] },
        exodo:         { yearStart: -1446, yearEnd: -1405, era: "bc", period: "Éxodo", mapRegion: "egipto", keyEvents: [{ year: -1446, event: "Las diez plagas y la Pascua" },{ year: -1446, event: "Cruce del Mar Rojo" },{ year: -1445, event: "Entrega de la Ley en el Sinaí" },{ year: -1444, event: "El becerro de oro" }] },
        levitico:      { yearStart: -1445, yearEnd: -1444, era: "bc", period: "Éxodo", mapRegion: "egipto", keyEvents: [{ year: -1445, event: "Leyes de los sacrificios" },{ year: -1445, event: "Consagración de Aarón" },{ year: -1445, event: "Día de la Expiación instituido" }] },
        numeros:       { yearStart: -1444, yearEnd: -1406, era: "bc", period: "Éxodo", mapRegion: "egipto", keyEvents: [{ year: -1444, event: "Primer censo de Israel" },{ year: -1443, event: "Los doce espías en Canaán" },{ year: -1407, event: "La serpiente de bronce" }] },
        deuteronomio:  { yearStart: -1406, yearEnd: -1406, era: "bc", period: "Éxodo", mapRegion: "canaan", keyEvents: [{ year: -1406, event: "Discursos de Moisés" },{ year: -1406, event: "Renovación del pacto" },{ year: -1406, event: "Muerte de Moisés en Nebo" }] },
        josue:         { yearStart: -1406, yearEnd: -1375, era: "bc", period: "Éxodo", mapRegion: "canaan", keyEvents: [{ year: -1406, event: "Cruce del Jordán" },{ year: -1406, event: "Caída de Jericó" },{ year: -1390, event: "Repartición de la tierra" }] },
        jueces:        { yearStart: -1375, yearEnd: -1050, era: "bc", period: "Jueces", mapRegion: "canaan", keyEvents: [{ year: -1209, event: "Débora y Barac" },{ year: -1162, event: "Gedeón derrota a madianitas" },{ year: -1090, event: "Sansón juzga Israel" }] },
        rut:           { yearStart: -1140, yearEnd: -1100, era: "bc", period: "Jueces", mapRegion: "canaan", keyEvents: [{ year: -1120, event: "Rut sigue a Noemí" },{ year: -1100, event: "Rut se casa con Booz" }] },
        "1samuel":     { yearStart: -1100, yearEnd: -1010, era: "bc", period: "Monarquía Unida", mapRegion: "canaan", keyEvents: [{ year: -1050, event: "Saúl ungido rey" },{ year: -1025, event: "David ungido por Samuel" },{ year: -1020, event: "David vence a Goliat" }] },
        "2samuel":     { yearStart: -1010, yearEnd: -970, era: "bc", period: "Monarquía Unida", mapRegion: "jerusalen", keyEvents: [{ year: -1010, event: "David coronado rey" },{ year: -1003, event: "David conquista Jerusalén" },{ year: -1000, event: "Pacto davídico" }] },
        "1reyes":      { yearStart: -970, yearEnd: -853, era: "bc", period: "Monarquía Dividida", mapRegion: "jerusalen", keyEvents: [{ year: -966, event: "Templo de Salomón" },{ year: -930, event: "División del reino" },{ year: -875, event: "Elías vs profetas de Baal" }] },
        "2reyes":      { yearStart: -853, yearEnd: -586, era: "bc", period: "Monarquía Dividida", mapRegion: "jerusalen", keyEvents: [{ year: -722, event: "Caída de Samaria" },{ year: -640, event: "Reforma de Josías" },{ year: -586, event: "Destrucción del Templo" }] },
        "1cronicas":   { yearStart: -1010, yearEnd: -970, era: "bc", period: "Monarquía Unida", mapRegion: "jerusalen", keyEvents: [{ year: -1003, event: "Jerusalén como capital" },{ year: -1000, event: "Arca en Jerusalén" }] },
        "2cronicas":   { yearStart: -970, yearEnd: -586, era: "bc", period: "Monarquía Dividida", mapRegion: "jerusalen", keyEvents: [{ year: -966, event: "Dedicación del Templo" },{ year: -715, event: "Reforma de Ezequías" },{ year: -586, event: "Caída de Jerusalén" }] },
        esdras:        { yearStart: -538, yearEnd: -458, era: "bc", period: "Restauración", mapRegion: "jerusalen", keyEvents: [{ year: -538, event: "Decreto de Ciro" },{ year: -516, event: "Templo reconstruido" },{ year: -458, event: "Esdras llega con la Ley" }] },
        nehemias:      { yearStart: -445, yearEnd: -430, era: "bc", period: "Restauración", mapRegion: "jerusalen", keyEvents: [{ year: -444, event: "Muros reconstruidos en 52 días" },{ year: -444, event: "Lectura pública de la Ley" }] },
        ester:         { yearStart: -483, yearEnd: -473, era: "bc", period: "Restauración", mapRegion: "persia", keyEvents: [{ year: -479, event: "Ester elegida reina" },{ year: -473, event: "Judíos librados; fiesta de Purim" }] },
        job:           { yearStart: -2100, yearEnd: -1900, era: "bc", period: "Patriarcas", mapRegion: "mesopotamia", keyEvents: [{ year: -2000, event: "Pruebas de Job" },{ year: -2000, event: "Dios responde desde el torbellino" }] },
        salmos:        { yearStart: -1440, yearEnd: -430, era: "bc", period: "Monarquía Unida", mapRegion: "jerusalen", keyEvents: [{ year: -1000, event: "Salmos de David" },{ year: -586, event: "Salmos del exilio" }] },
        proverbios:    { yearStart: -970, yearEnd: -686, era: "bc", period: "Monarquía Unida", mapRegion: "jerusalen", keyEvents: [{ year: -970, event: "Salomón compone proverbios" }] },
        eclesiastes:   { yearStart: -940, yearEnd: -930, era: "bc", period: "Monarquía Unida", mapRegion: "jerusalen", keyEvents: [{ year: -935, event: "Todo tiene su tiempo" }] },
        cantares:      { yearStart: -965, yearEnd: -960, era: "bc", period: "Monarquía Unida", mapRegion: "jerusalen", keyEvents: [{ year: -960, event: "Cantar de amor" }] },
        isaias:        { yearStart: -740, yearEnd: -680, era: "bc", period: "Monarquía Dividida", mapRegion: "jerusalen", keyEvents: [{ year: -740, event: "Llamamiento de Isaías" },{ year: -700, event: "Profecía del Siervo sufriente" }] },
        jeremias:      { yearStart: -627, yearEnd: -586, era: "bc", period: "Monarquía Dividida", mapRegion: "jerusalen", keyEvents: [{ year: -627, event: "Llamamiento de Jeremías" },{ year: -586, event: "Profecía del Nuevo Pacto" }] },
        lamentaciones: { yearStart: -586, yearEnd: -585, era: "bc", period: "Exilio", mapRegion: "jerusalen", keyEvents: [{ year: -586, event: "Lamento por Jerusalén" }] },
        ezequiel:      { yearStart: -593, yearEnd: -571, era: "bc", period: "Exilio", mapRegion: "babilonia", keyEvents: [{ year: -593, event: "Visión del trono de Dios" },{ year: -580, event: "Valle de los huesos secos" }] },
        daniel:        { yearStart: -605, yearEnd: -536, era: "bc", period: "Exilio", mapRegion: "babilonia", keyEvents: [{ year: -603, event: "Sueño de Nabucodonosor" },{ year: -539, event: "Caída de Babilonia" },{ year: -538, event: "Foso de los leones" }] },
        oseas:         { yearStart: -755, yearEnd: -715, era: "bc", period: "Monarquía Dividida", mapRegion: "canaan", keyEvents: [{ year: -755, event: "Oseas se casa con Gomer" }] },
        joel:          { yearStart: -835, yearEnd: -800, era: "bc", period: "Monarquía Dividida", mapRegion: "jerusalen", keyEvents: [{ year: -835, event: "Plaga de langostas" },{ year: -825, event: "Promesa del Espíritu" }] },
        amos:          { yearStart: -760, yearEnd: -750, era: "bc", period: "Monarquía Dividida", mapRegion: "canaan", keyEvents: [{ year: -760, event: "Amós, pastor de Tecoa" }] },
        abdias:        { yearStart: -586, yearEnd: -583, era: "bc", period: "Exilio", mapRegion: "canaan", keyEvents: [{ year: -586, event: "Profecía contra Edom" }] },
        jonas:         { yearStart: -785, yearEnd: -760, era: "bc", period: "Monarquía Dividida", mapRegion: "mesopotamia", keyEvents: [{ year: -780, event: "Jonás tragado por el pez" },{ year: -780, event: "Nínive se arrepiente" }] },
        miqueas:       { yearStart: -735, yearEnd: -700, era: "bc", period: "Monarquía Dividida", mapRegion: "jerusalen", keyEvents: [{ year: -710, event: "Mesías nacerá en Belén" }] },
        nahum:         { yearStart: -663, yearEnd: -612, era: "bc", period: "Monarquía Dividida", mapRegion: "mesopotamia", keyEvents: [{ year: -612, event: "Caída de Nínive" }] },
        habacuc:       { yearStart: -612, yearEnd: -605, era: "bc", period: "Monarquía Dividida", mapRegion: "jerusalen", keyEvents: [{ year: -607, event: "El justo por su fe vivirá" }] },
        sofonias:      { yearStart: -640, yearEnd: -625, era: "bc", period: "Monarquía Dividida", mapRegion: "jerusalen", keyEvents: [{ year: -640, event: "Día del Señor" }] },
        hageo:         { yearStart: -520, yearEnd: -520, era: "bc", period: "Restauración", mapRegion: "jerusalen", keyEvents: [{ year: -520, event: "Reconstruir el Templo" }] },
        zacarias:      { yearStart: -520, yearEnd: -480, era: "bc", period: "Restauración", mapRegion: "jerusalen", keyEvents: [{ year: -500, event: "Rey montado en asno" }] },
        malaquias:     { yearStart: -435, yearEnd: -400, era: "bc", period: "Restauración", mapRegion: "jerusalen", keyEvents: [{ year: -400, event: "Mensajero preparará el camino" }] },
        mateo:         { yearStart: -5, yearEnd: 33, era: "ad", period: "Vida de Jesús", mapRegion: "jerusalen", keyEvents: [{ year: -5, event: "Nacimiento en Belén" },{ year: 28, event: "Sermón del Monte" },{ year: 33, event: "Crucifixión y resurrección" }] },
        marcos:        { yearStart: 26, yearEnd: 33, era: "ad", period: "Vida de Jesús", mapRegion: "canaan", keyEvents: [{ year: 26, event: "Bautismo de Jesús" },{ year: 33, event: "Pasión y resurrección" }] },
        lucas:         { yearStart: -5, yearEnd: 33, era: "ad", period: "Vida de Jesús", mapRegion: "canaan", keyEvents: [{ year: -5, event: "Nacimiento de Jesús" },{ year: 29, event: "Parábola del hijo pródigo" },{ year: 33, event: "Crucifixión y ascensión" }] },
        juan:          { yearStart: -5, yearEnd: 33, era: "ad", period: "Vida de Jesús", mapRegion: "jerusalen", keyEvents: [{ year: 27, event: "Bodas de Caná" },{ year: 30, event: "Resurrección de Lázaro" },{ year: 33, event: "Crucifixión y resurrección" }] },
        hechos:        { yearStart: 33, yearEnd: 62, era: "ad", period: "Iglesia Primitiva", mapRegion: "roma", keyEvents: [{ year: 33, event: "Pentecostés" },{ year: 35, event: "Martirio de Esteban" },{ year: 37, event: "Conversión de Pablo" },{ year: 49, event: "Concilio de Jerusalén" }] },
        romanos:       { yearStart: 57, yearEnd: 57, era: "ad", period: "Iglesia Primitiva", mapRegion: "grecia", keyEvents: [{ year: 57, event: "Justificación por la fe" }] },
        "1corintios":  { yearStart: 55, yearEnd: 55, era: "ad", period: "Iglesia Primitiva", mapRegion: "grecia", keyEvents: [{ year: 55, event: "Capítulo del amor" }] },
        "2corintios":  { yearStart: 56, yearEnd: 56, era: "ad", period: "Iglesia Primitiva", mapRegion: "grecia", keyEvents: [{ year: 56, event: "Poder en la debilidad" }] },
        galatas:       { yearStart: 49, yearEnd: 49, era: "ad", period: "Iglesia Primitiva", mapRegion: "asia-menor", keyEvents: [{ year: 49, event: "Libertad en Cristo" }] },
        efesios:       { yearStart: 60, yearEnd: 61, era: "ad", period: "Iglesia Primitiva", mapRegion: "asia-menor", keyEvents: [{ year: 60, event: "Armadura de Dios" }] },
        filipenses:    { yearStart: 61, yearEnd: 61, era: "ad", period: "Iglesia Primitiva", mapRegion: "grecia", keyEvents: [{ year: 61, event: "Todo lo puedo en Cristo" }] },
        colosenses:    { yearStart: 60, yearEnd: 61, era: "ad", period: "Iglesia Primitiva", mapRegion: "asia-menor", keyEvents: [{ year: 60, event: "Supremacía de Cristo" }] },
        "1tesalonicenses": { yearStart: 51, yearEnd: 51, era: "ad", period: "Iglesia Primitiva", mapRegion: "grecia", keyEvents: [{ year: 51, event: "Segunda venida de Cristo" }] },
        "2tesalonicenses": { yearStart: 51, yearEnd: 52, era: "ad", period: "Iglesia Primitiva", mapRegion: "grecia", keyEvents: [{ year: 52, event: "El hombre de pecado" }] },
        "1timoteo":    { yearStart: 64, yearEnd: 64, era: "ad", period: "Iglesia Primitiva", mapRegion: "asia-menor", keyEvents: [{ year: 64, event: "Pelea la buena batalla" }] },
        "2timoteo":    { yearStart: 67, yearEnd: 67, era: "ad", period: "Iglesia Primitiva", mapRegion: "roma", keyEvents: [{ year: 67, event: "Toda Escritura es inspirada" }] },
        tito:          { yearStart: 65, yearEnd: 65, era: "ad", period: "Iglesia Primitiva", mapRegion: "grecia", keyEvents: [{ year: 65, event: "Gracia de Dios manifestada" }] },
        filemon:       { yearStart: 60, yearEnd: 61, era: "ad", period: "Iglesia Primitiva", mapRegion: "asia-menor", keyEvents: [{ year: 60, event: "Pablo intercede por Onésimo" }] },
        hebreos:       { yearStart: 64, yearEnd: 68, era: "ad", period: "Iglesia Primitiva", mapRegion: "jerusalen", keyEvents: [{ year: 67, event: "Héroes de la fe (cap. 11)" }] },
        santiago:      { yearStart: 45, yearEnd: 49, era: "ad", period: "Iglesia Primitiva", mapRegion: "jerusalen", keyEvents: [{ year: 46, event: "Fe sin obras está muerta" }] },
        "1pedro":      { yearStart: 64, yearEnd: 65, era: "ad", period: "Iglesia Primitiva", mapRegion: "asia-menor", keyEvents: [{ year: 64, event: "Esperanza viva" }] },
        "2pedro":      { yearStart: 66, yearEnd: 67, era: "ad", period: "Iglesia Primitiva", mapRegion: "roma", keyEvents: [{ year: 67, event: "Cielos nuevos y tierra nueva" }] },
        "1juan":       { yearStart: 90, yearEnd: 95, era: "ad", period: "Iglesia Primitiva", mapRegion: "asia-menor", keyEvents: [{ year: 93, event: "Dios es amor" }] },
        "2juan":       { yearStart: 90, yearEnd: 95, era: "ad", period: "Iglesia Primitiva", mapRegion: "asia-menor", keyEvents: [{ year: 92, event: "Caminar en verdad" }] },
        "3juan":       { yearStart: 90, yearEnd: 95, era: "ad", period: "Iglesia Primitiva", mapRegion: "asia-menor", keyEvents: [{ year: 92, event: "Hospitalidad de Gayo" }] },
        judas:         { yearStart: 65, yearEnd: 80, era: "ad", period: "Iglesia Primitiva", mapRegion: "jerusalen", keyEvents: [{ year: 68, event: "Contender por la fe" }] },
        apocalipsis:   { yearStart: 95, yearEnd: 95, era: "ad", period: "Iglesia Primitiva", mapRegion: "asia-menor", keyEvents: [{ year: 95, event: "Visión de Cristo en Patmos" },{ year: 95, event: "Siete iglesias de Asia" },{ year: 95, event: "Nueva Jerusalén" }] }
    },

    // Top 50 major events
    events: [
        { year: -4000, event: "Creación del mundo" },
        { year: -3900, event: "Caída en el Edén" },
        { year: -2348, event: "El Diluvio universal" },
        { year: -2242, event: "Torre de Babel" },
        { year: -2100, event: "Llamado de Abraham" },
        { year: -2050, event: "Pacto con Abraham" },
        { year: -2050, event: "Destrucción de Sodoma" },
        { year: -2025, event: "Sacrificio de Isaac" },
        { year: -1900, event: "Jacob renombrado Israel" },
        { year: -1880, event: "José vendido como esclavo" },
        { year: -1870, event: "José gobernador de Egipto" },
        { year: -1446, event: "Diez plagas sobre Egipto" },
        { year: -1446, event: "Primera Pascua y Éxodo" },
        { year: -1446, event: "Cruce del Mar Rojo" },
        { year: -1445, event: "Diez Mandamientos en Sinaí" },
        { year: -1406, event: "Muerte de Moisés" },
        { year: -1406, event: "Caída de Jericó" },
        { year: -1209, event: "Victoria de Débora" },
        { year: -1162, event: "Gedeón con 300 hombres" },
        { year: -1090, event: "Hazañas de Sansón" },
        { year: -1050, event: "Saúl primer rey" },
        { year: -1020, event: "David vence a Goliat" },
        { year: -1010, event: "David rey de Israel" },
        { year: -1003, event: "Jerusalén capital" },
        { year: -966, event: "Templo de Salomón" },
        { year: -930, event: "División del reino" },
        { year: -875, event: "Elías en el Carmelo" },
        { year: -760, event: "Profetas Amós e Isaías" },
        { year: -722, event: "Caída de Israel (norte)" },
        { year: -640, event: "Reforma de Josías" },
        { year: -612, event: "Caída de Nínive" },
        { year: -605, event: "Daniel llevado a Babilonia" },
        { year: -586, event: "Destrucción del Templo" },
        { year: -539, event: "Caída de Babilonia" },
        { year: -538, event: "Decreto de Ciro" },
        { year: -516, event: "Segundo Templo dedicado" },
        { year: -479, event: "Ester salva a los judíos" },
        { year: -444, event: "Muros de Jerusalén reconstruidos" },
        { year: -5, event: "Nacimiento de Jesús" },
        { year: 26, event: "Bautismo de Jesús" },
        { year: 28, event: "Sermón del Monte" },
        { year: 33, event: "Crucifixión y resurrección" },
        { year: 33, event: "Pentecostés" },
        { year: 35, event: "Martirio de Esteban" },
        { year: 37, event: "Conversión de Pablo" },
        { year: 49, event: "Concilio de Jerusalén" },
        { year: 60, event: "Pablo prisionero en Roma" },
        { year: 70, event: "Destrucción del Segundo Templo" },
        { year: 95, event: "Juan escribe Apocalipsis" }
    ],

    // Map images from Wikimedia Commons (public domain / CC BY-SA 3.0)
    maps: {
        mesopotamia: {
            title: "Mesopotamia y el Creciente Fértil",
            local: "img/maps/mesopotamia.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Map_of_fertile_crescent.svg/1280px-Map_of_fertile_crescent.svg.png",
            books: ["genesis", "job"]
        },
        egipto: {
            title: "Éxodo: de Egipto al Sinaí",
            local: "img/maps/egipto.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/C%2BB-Exodus-Map.PNG",
            books: ["exodo", "levitico", "numeros"]
        },
        canaan: {
            title: "Las 12 Tribus de Israel",
            local: "img/maps/canaan.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/12_Tribes_of_Israel_Map.svg/1280px-12_Tribes_of_Israel_Map.svg.png",
            books: ["deuteronomio", "josue", "jueces", "rut", "1samuel", "oseas", "amos"]
        },
        jerusalen: {
            title: "Reino Unido de Israel",
            local: "img/maps/jerusalen.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Kingdom_of_Israel_1020_map.svg/1280px-Kingdom_of_Israel_1020_map.svg.png",
            books: ["2samuel", "1reyes", "1cronicas", "2cronicas", "salmos", "proverbios", "eclesiastes", "cantares"]
        },
        "reino-dividido": {
            title: "Reinos de Israel y Judá (~830 a.C.)",
            local: "img/maps/reino-dividido.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Kingdoms_of_Israel_and_Judah_map_830.svg/1280px-Kingdoms_of_Israel_and_Judah_map_830.svg.png",
            books: ["2reyes", "2cronicas", "isaias", "jeremias", "oseas", "amos", "miqueas", "joel", "abdias", "jonas", "nahum", "habacuc", "sofonias"]
        },
        babilonia: {
            title: "Imperio Neo-Babilónico",
            local: "img/maps/babilonia.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Neo-Babylonian_Empire_%28greatest_extent%29.svg/1280px-Neo-Babylonian_Empire_%28greatest_extent%29.svg.png",
            books: ["ezequiel", "daniel", "lamentaciones"]
        },
        persia: {
            title: "Imperio Persa (Aqueménida)",
            local: "img/maps/persia.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Achaemenid_Empire_En.svg/1280px-Achaemenid_Empire_En.svg.png",
            books: ["esdras", "nehemias", "ester", "hageo", "zacarias", "malaquias"]
        },
        "palestina-jesus": {
            title: "Palestina en tiempos de Jesús",
            local: "img/maps/palestina-jesus.jpg",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Palestine_in_the_time_of_Jesus.jpg/1280px-Palestine_in_the_time_of_Jesus.jpg",
            books: ["mateo", "marcos", "lucas", "juan"]
        },
        "viajes-pablo": {
            title: "Viajes Misioneros de Pablo",
            local: "img/maps/viajes-pablo.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Apostle_Paul%27s_journeys.svg/1280px-Apostle_Paul%27s_journeys.svg.png",
            books: ["hechos", "romanos", "1corintios", "2corintios", "galatas"]
        },
        roma: {
            title: "Imperio Romano siglo I",
            local: "img/maps/roma.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/RomanEmpire_117.svg/1280px-RomanEmpire_117.svg.png",
            books: ["hechos", "romanos", "2timoteo", "2pedro"]
        },
        "asia-menor": {
            title: "Siete Iglesias de Asia Menor",
            local: "img/maps/asia-menor.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Seven_churches_of_asia.svg/1280px-Seven_churches_of_asia.svg.png",
            books: ["efesios", "colosenses", "1timoteo", "filemon", "1pedro", "1juan", "2juan", "3juan", "apocalipsis"]
        },
        grecia: {
            title: "Grecia y Macedonia",
            local: "img/maps/grecia.png",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Paul_the_Apostle%2C_second_missionary_journey.svg/1280px-Paul_the_Apostle%2C_second_missionary_journey.svg.png",
            books: ["filipenses", "1tesalonicenses", "2tesalonicenses", "tito", "hebreos"]
        }
    }
};
