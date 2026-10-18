// =============================================================
// BIBLE IMAGES GENERATOR
// Generates biblia-images-data.js + downloads all images
// =============================================================
const https = require('https');
const fs = require('fs');
const path = require('path');

// ---- DORÉ OT ILLUSTRATIONS (verified URLs) ----
// Format: [number, title_es, book, chapters, verseHint, skip_reason_or_null]
const DORE_OT = [
  ["003", "Adán y Eva expulsados del Edén", "genesis", [3], 24, null],
  ["004", "Caín y Abel ofrecen sacrificios", "genesis", [4], 3, null],
  ["005", "Caín mata a Abel", "genesis", [4], 8, null],
  ["006", "El mundo destruido por las aguas", "genesis", [6,7], 17, null],
  ["007", "El Gran Diluvio", "genesis", [7], 11, null],
  ["008", "Una paloma es enviada desde el Arca", "genesis", [8], 8, null],
  ["009", "Noé maldice a Cam", "genesis", [9], 25, null],
  ["010", "La Torre de Babel", "genesis", [11], 4, null],
  ["011", "Abraham va a la tierra de Canaán", "genesis", [12], 5, null],
  ["013", "Lot huye mientras arden Sodoma y Gomorra", "genesis", [19], 15, null],
  ["014", "Abraham envía lejos a Agar e Ismael", "genesis", [21], 14, null],
  ["015", "Agar e Ismael en el desierto", "genesis", [21], 15, null],
  ["017", "El entierro de Sara", "genesis", [23], 19, null],
  ["018", "Eliezer y Rebeca en el pozo", "genesis", [24], 15, null],
  ["019", "El encuentro de Isaac y Rebeca", "genesis", [24], 63, null],
  ["020", "Isaac bendice a Jacob", "genesis", [27], 27, null],
  ["022", "Jacob cuida los rebaños de Labán", "genesis", [29], 9, null],
  ["025", "Jacob y Esaú se encuentran", "genesis", [33], 4, null],
  ["026", "José es vendido por sus hermanos", "genesis", [37], 28, null],
  ["027", "José interpreta el sueño del Faraón", "genesis", [41], 25, null],
  ["028", "José se revela a sus hermanos", "genesis", [45], 1, null],
  ["029", "Jacob viaja a Egipto", "genesis", [46], 5, null],
  ["030", "El niño Moisés en el Nilo", "exodo", [2], 3, null],
  ["031", "El hallazgo de Moisés", "exodo", [2], 5, null],
  ["032", "Moisés y Aarón ante el Faraón", "exodo", [7], 10, null],
  ["033", "La quinta plaga: peste del ganado", "exodo", [9], 3, null],
  ["034", "La novena plaga: tinieblas", "exodo", [10], 22, null],
  ["035", "Los primogénitos de Egipto son muertos", "exodo", [12], 29, null],
  ["036", "Los egipcios piden a Moisés que se vaya", "exodo", [12], 33, null],
  ["037", "Los egipcios se ahogan en el mar", "exodo", [14], 27, null],
  ["041", "Moisés golpea la roca en Horeb", "exodo", [17], 6, null],
  ["041A", "Moisés rompe las Tablas de la Ley", "exodo", [32], 19, null],
  ["040", "La muerte de Coré, Datán y Abiram", "numeros", [16], 31, null],
  ["041B", "Los espías regresan de la Tierra Prometida", "numeros", [13], 23, null],
  ["044", "Los israelitas cruzan el río Jordán", "josue", [3], 14, null],
  ["046", "Las murallas de Jericó caen", "josue", [6], 20, null],
  ["047", "Josué perdona a Rahab", "josue", [6], 23, null],
  ["048", "Acán es apedreado", "josue", [7], 25, null],
  ["049", "Josué quema la ciudad de Hai", "josue", [8], 19, null],
  ["050", "El ejército de los amorreos es destruido", "josue", [10], 10, null],
  ["051", "Josué ordena al sol detenerse", "josue", [10], 12, null],
  ["052", "Jael mata a Sísara", "jueces", [4], 21, null],
  ["053", "Débora alaba a Jael", "jueces", [5], 24, null],
  ["054", "Gedeón elige 300 soldados", "jueces", [7], 5, null],
  ["055", "Los madianitas son derrotados", "jueces", [7], 21, null],
  ["056", "La muerte de los hijos de Gedeón", "jueces", [9], 5, null],
  ["057", "La muerte de Abimelec", "jueces", [9], 53, null],
  ["058", "La hija de Jefté sale a recibir a su padre", "jueces", [11], 34, null],
  ["059", "Las mujeres lloran con la hija de Jefté", "jueces", [11], 40, null],
  ["060", "Sansón mata un león", "jueces", [14], 6, null],
  ["061", "Sansón destruye a los filisteos con una quijada", "jueces", [15], 15, null],
  ["062", "Sansón carga las puertas de Gaza", "jueces", [16], 3, null],
  ["063", "Sansón y Dalila", "jueces", [16], 19, null],
  ["064", "La muerte de Sansón", "jueces", [16], 30, null],
  ["065", "Un levita encuentra el cuerpo de una mujer", "jueces", [19], 27, null],
  ["066", "El levita lleva el cuerpo", "jueces", [19], 29, null],
  ["067", "Los benjaminitas toman las vírgenes de Jabés", "jueces", [21], 21, null],
  ["068", "Noemí y sus nueras", "rut", [1], 14, null],
  ["069", "Rut y Booz", "rut", [2], 5, null],
  ["070", "El Arca es devuelta a Bet-semes", "1samuel", [6], 13, null],
  ["070A", "Samuel unge a Saúl", "1samuel", [10], 1, null],
  ["071", "La muerte de Agag", "1samuel", [15], 33, null],
  ["071A", "David vence a Goliat", "1samuel", [17], 49, null],
  ["072", "Saúl intenta matar a David", "1samuel", [18], 11, null],
  ["073", "David escapa por la ventana", "1samuel", [19], 12, null],
  ["073A", "David y Jonatán", "1samuel", [20], 41, null],
  ["074", "David muestra a Saúl cómo perdonó su vida", "1samuel", [24], 8, null],
  ["075", "Saúl y la pitonisa de Endor", "1samuel", [28], 14, null],
  ["076", "La muerte de Saúl", "1samuel", [31], 4, null],
  ["077", "Recuperan los cuerpos de Saúl y sus hijos", "1samuel", [31], 12, null],
  ["078", "Combate entre soldados de Is-boset y David", "2samuel", [2], 14, null],
  ["079", "David ataca a los amonitas", "2samuel", [10], 7, null],
  ["080", "La muerte de Absalón", "2samuel", [18], 9, null],
  ["081", "David llora la muerte de Absalón", "2samuel", [18], 33, null],
  ["082", "Rizpa cuida los muertos", "2samuel", [21], 10, null],
  ["083", "Abisai salva la vida de David", "2samuel", [21], 17, null],
  ["084", "El juicio de Salomón", "1reyes", [3], 25, null],
  ["085", "Cortan cedros para el Templo", "1reyes", [5], 6, null],
  ["086", "Salomón recibe a la Reina de Sabá", "1reyes", [10], 2, null],
  ["087", "El Rey Salomón en su vejez", "1reyes", [11], 4, null],
  ["088", "Un profeta desobediente es muerto por un león", "1reyes", [13], 24, null],
  ["090", "Los profetas de Baal son muertos", "1reyes", [18], 40, null],
  ["092", "Los israelitas derrotan a los sirios", "1reyes", [20], 21, null],
  ["093", "La muerte de Acab", "1reyes", [22], 34, null],
  ["095B", "Unos jóvenes son destruidos por osos", "2reyes", [2], 24, null],
  ["096", "Hambruna en Samaria", "2reyes", [6], 25, null],
  ["097", "La muerte de Jezabel", "2reyes", [9], 33, null],
  ["098", "Hallan los restos de Jezabel", "2reyes", [9], 35, null],
  ["099", "La muerte de Atalía", "2reyes", [11], 16, null],
  ["100", "Leones devoran naciones extranjeras en Samaria", "2reyes", [17], 25, null],
  ["101", "El ejército de Senaquerib es destruido", "2reyes", [19], 35, null],
  ["102", "Los hijos de Sedequías muertos ante sus ojos", "2reyes", [25], 7, null],
  ["103", "Los ejércitos amonitas y moabitas destruidos", "2cronicas", [20], 22, null],
  ["104", "Ciro devuelve los utensilios del Templo", "esdras", [1], 7, null],
  ["105", "Comienza la reconstrucción del Templo", "esdras", [3], 10, null],
  ["106", "Artajerjes concede libertad a los judíos", "esdras", [7], 13, null],
  ["108", "Nehemías observa las ruinas de Jerusalén", "nehemias", [2], 13, null],
  ["109", "Esdras lee la Ley al pueblo", "nehemias", [8], 5, null],
  ["114", "La Reina Vasti se niega a obedecer", "ester", [1], 12, null],
  ["115", "Ester ante el Rey", "ester", [5], 2, null],
  ["116", "El triunfo de Mardoqueo", "ester", [6], 11, null],
  ["117", "Ester acusa a Amán", "ester", [7], 6, null],
  ["118", "Job recibe noticias de sus desgracias", "job", [1], 14, null],
  ["119", "Job habla con sus amigos", "job", [2], 11, null],
  ["120", "El Profeta Isaías", "isaias", [1], 1, null],
  ["121", "Visión de la destrucción de Babilonia", "isaias", [13], 1, null],
  ["123", "El Profeta Jeremías", "jeremias", [1], 1, null],
  ["123B", "Baruc escribe las profecías de Jeremías", "jeremias", [36], 4, null],
  ["124", "El pueblo llora la destrucción de Jerusalén", "lamentaciones", [1], 1, null],
  ["126", "El Profeta Ezequiel", "ezequiel", [1], 1, null],
  ["128", "Daniel entre los exiliados", "daniel", [1], 6, null],
  ["130", "Daniel interpreta la escritura en la pared", "daniel", [5], 5, null],
  ["131", "Daniel en el foso de los leones", "daniel", [6], 16, null],
  ["136", "El Profeta Amós", "amos", [1], 1, null],
  ["137", "Jonás es arrojado por la ballena", "jonas", [2], 10, null],
  ["138", "Jonás predica a los ninivitas", "jonas", [3], 4, null],
  ["139", "Miqueas exhorta a los israelitas", "miqueas", [1], 1, null],
];

// ---- DORÉ NT ILLUSTRATIONS (figurative only) ----
const DORE_NT = [
  ["dore_nt_flight_egypt", "Gustave_dore_bible_-_the_flight_into_egypt.jpg", "Huida a Egipto", "mateo", [2], 14],
  ["dore_nt_samaritan_woman", "Jesus_asks_the_Samaritan_woman_for_a_draft_from_the_well.jpg", "Jesús y la Samaritana en el pozo", "juan", [4], 7],
  ["dore_nt_tempest", "JesusCalmingtheTempestDore.jpg", "Jesús calma la tempestad", "marcos", [4], 39],
  ["dore_nt_prodigal", "Gustave_Dore_-_The_prodigal_son_decides_to_return_to_his_father.jpg", "El Hijo Pródigo decide regresar", "lucas", [15], 18],
  ["dore_nt_tribute", "Gustave_Dore_-_Jesus_talks_of_the_tribute_money.jpg", "Jesús habla del tributo", "mateo", [22], 19],
  ["dore_nt_lazarus_rich", "Gustave_Dore_Lazarus_and_the_Rich_Man.jpg", "Lázaro y el hombre rico", "lucas", [16], 20],
  ["dore_nt_adulteress", "Dore_adultress.jpg", "La mujer adúltera", "juan", [8], 7],
  ["dore_nt_peter_denies", "Peter_denies_that_he_is_one_of_Jesus%27_disciples.jpg", "Pedro niega a Jesús", "mateo", [26], 70],
  ["dore_nt_stephen", "The_Death_of_Stephen_by_Gustave_Dore.jpg", "La muerte de Esteban", "hechos", [7], 59],
  ["dore_nt_paul_crowd", "Paul_Addresses_the_Crowd_After_His_Arrest_by_Gustave_Dore.jpg", "Pablo se dirige a la multitud", "hechos", [22], 1],
  ["dore_nt_paul_preaching", "DoreStPaulPreachingtotheThessalonians.jpg", "Pablo predica a los Tesalonicenses", "1tesalonicenses", [2], 2],
  ["dore_nt_peter_cornelius", "StPeterattheHouseofCornelius.jpg", "Pedro en casa de Cornelio", "hechos", [10], 25],
  ["dore_nt_peter_escape", "Peter%27sEscapefromPrison.jpg", "Pedro escapa de la prisión", "hechos", [12], 7],
  ["dore_nt_paul_prison", "St_Paul_in_prison.jpg", "Pablo en prisión", "2timoteo", [4], 6],
  ["dore_nt_cana", "Marriage_at_Cana_engraving_by_Gustave_Dore.jpg", "Las Bodas de Caná", "juan", [2], 9],
  ["dore_nt_feeding", "JesusFeedingMultitude.jpg", "Jesús alimenta a la multitud", "mateo", [14], 19],
  ["dore_nt_pharisees", "JesusPharisees.jpg", "Jesús y los Fariseos", "mateo", [23], 13],
  ["dore_nt_ananias", "DoreDeathofAnanias.jpg", "La muerte de Ananías", "hechos", [5], 5],
  ["dore_nt_fish", "La_peche_miraculeuse_de_Gustave_Dore.jpg", "La pesca milagrosa", "lucas", [5], 6],
  ["dore_nt_mary_martha", "Jesus_talks_with_Mary_and_Martha_in_their_house.jpg", "Jesús con María y Marta", "lucas", [10], 38],
  ["dore_nt_donkey", "Gustave_Dore_-_Jesus_rides_into_Jerusalem_on_a_donkey_on_Palm_Sunday.jpg", "Jesús entra en Jerusalén", "mateo", [21], 8],
  ["dore_nt_pale_horse", "Gustave_Dore_-_Death_on_the_Pale_Horse.png", "La Muerte sobre el Caballo Pálido", "apocalipsis", [6], 8],
];

// ---- EXISTING PAINTINGS (already downloaded) ----
const EXISTING = [
  { local: "img/art/genesis_2.jpg", book: "genesis", chapters: [6,7,8,9], verseHint: 14, title: "El Arca de Noé", artist: "Edward Hicks, 1846" },
  { local: "img/art/genesis_3.jpg", book: "genesis", chapters: [11], verseHint: 4, title: "La Torre de Babel", artist: "Pieter Bruegel el Viejo, 1563" },
  { local: "img/art/exodo_0.jpg", book: "exodo", chapters: [2], verseHint: 5, title: "Moisés salvado de las aguas", artist: "Lawrence Alma-Tadema, 1904" },
  { local: "img/art/exodo_2.jpg", book: "exodo", chapters: [7,8,9,10,11,12], verseHint: 21, title: "La Séptima Plaga de Egipto", artist: "John Martin, 1823" },
  { local: "img/art/exodo_3.jpg", book: "exodo", chapters: [14,15], verseHint: 21, title: "El Cruce del Mar Rojo", artist: "Hans Jordaens III, c. 1620" },
  { local: "img/art/exodo_5.jpg", book: "exodo", chapters: [32], verseHint: 4, title: "La Adoración del Becerro de Oro", artist: "Nicolas Poussin, c. 1634" },
  { local: "img/art/levitico_0.jpg", book: "levitico", chapters: [16], verseHint: 21, title: "El Chivo Expiatorio", artist: "William Holman Hunt, 1856" },
  { local: "img/art/numeros_1.jpg", book: "numeros", chapters: [22], verseHint: 28, title: "El Asna de Balaam", artist: "Rembrandt, 1626" },
  { local: "img/art/deuteronomio_0.jpg", book: "deuteronomio", chapters: [34], verseHint: 1, title: "Moisés contempla la Tierra Prometida", artist: "Frederic Edwin Church, 1846" },
  { local: "img/art/josue_0.jpg", book: "josue", chapters: [6], verseHint: 20, title: "La Caída de Jericó", artist: "Gustave Doré, c. 1870" },
  { local: "img/art/josue_1.jpg", book: "josue", chapters: [10], verseHint: 12, title: "Josué detiene el Sol", artist: "John Martin, 1816" },
  { local: "img/art/jueces_0.jpg", book: "jueces", chapters: [7], verseHint: 20, title: "Gedeón y sus 300 hombres", artist: "Maarten van Heemskerck, c. 1550" },
  { local: "img/art/jueces_1.jpg", book: "jueces", chapters: [16], verseHint: 19, title: "Sansón y Dalila", artist: "Peter Paul Rubens, 1610" },
  { local: "img/art/rut_0.jpg", book: "rut", chapters: [2,3], verseHint: 2, title: "Rut en el Campo de Booz", artist: "Gebhard Fugel, c. 1920" },
  { local: "img/art/1samuel_0.jpg", book: "1samuel", chapters: [16,18,19], verseHint: 23, title: "David tocando el Arpa ante Saúl", artist: "Rembrandt, c. 1656" },
  { local: "img/art/1samuel_1.jpg", book: "1samuel", chapters: [17], verseHint: 49, title: "David y Goliat", artist: "Caravaggio, c. 1610" },
  { local: "img/art/2samuel_0.jpg", book: "2samuel", chapters: [11], verseHint: 2, title: "Betsabé en el Baño", artist: "Rembrandt, 1654" },
  { local: "img/art/1reyes_0.jpg", book: "1reyes", chapters: [3], verseHint: 25, title: "El Juicio de Salomón", artist: "Palazzo Farnese, c. 1560" },
  { local: "img/art/1reyes_1.jpg", book: "1reyes", chapters: [18], verseHint: 38, title: "Elías desafía a los profetas de Baal", artist: "Ilustración bíblica, c. 1870" },
  { local: "img/art/ester_0.jpg", book: "ester", chapters: [5,7], verseHint: 2, title: "Ester ante el Rey Asuero", artist: "Franciszek Smuglewicz, 1778" },
  { local: "img/art/job_0.jpg", book: "job", chapters: [1,2,38,42], verseHint: 1, title: "Job", artist: "Léon Bonnat, 1880" },
  { local: "img/art/salmos_0.jpg", book: "salmos", chapters: [1,23,51,100,150], verseHint: 1, title: "El Rey David Tocando el Arpa", artist: "Gerard van Honthorst, 1622" },
  { local: "img/art/jeremias_0.jpg", book: "jeremias", chapters: [1,52], verseHint: 1, title: "Jeremías Lamentando", artist: "Rembrandt, 1630" },
  { local: "img/art/lamentaciones_0.jpg", book: "lamentaciones", chapters: [1,2,3,4,5], verseHint: 1, title: "Jeremías llora sobre Jerusalén", artist: "Rembrandt, 1630" },
  { local: "img/art/daniel_0.jpg", book: "daniel", chapters: [5], verseHint: 5, title: "El Festín de Belsasar", artist: "Rembrandt, c. 1636" },
  { local: "img/art/daniel_1.jpg", book: "daniel", chapters: [6], verseHint: 16, title: "Daniel en el Foso de los Leones", artist: "Peter Paul Rubens, 1614" },
  { local: "img/art/daniel_2.jpg", book: "daniel", chapters: [3], verseHint: 25, title: "Los tres jóvenes en el Horno de Fuego", artist: "J.M.W. Turner, c. 1832" },
  { local: "img/art/jonas_0.jpg", book: "jonas", chapters: [1,2], verseHint: 17, title: "Jonás y la Ballena", artist: "Pieter Lastman, 1621" },
  { local: "img/art/marcos_1.jpg", book: "marcos", chapters: [4], verseHint: 39, title: "La Tormenta en el Mar de Galilea", artist: "Rembrandt, 1633" },
  { local: "img/art/lucas_1.jpg", book: "lucas", chapters: [10], verseHint: 34, title: "El Buen Samaritano", artist: "Rembrandt, 1638" },
  { local: "img/art/lucas_2.jpg", book: "lucas", chapters: [15], verseHint: 20, title: "El Retorno del Hijo Pródigo", artist: "Rembrandt, c. 1668" },
  { local: "img/art/lucas_3.jpg", book: "lucas", chapters: [24], verseHint: 30, title: "La Cena de Emaús", artist: "Caravaggio, 1601" },
  { local: "img/art/hechos_1.jpg", book: "hechos", chapters: [9], verseHint: 4, title: "La Conversión de Pablo", artist: "Caravaggio, 1601" },
];

// ---- BIBLICA OPEN BIBLE MAPS (best map set) ----
const BIBLICA_MAPS = [
  { id: "biblica_01", fname: "biblica_01.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Biblica_Open_Bible_Map_01_The_Holy_Land_relief.png/1280px-Biblica_Open_Bible_Map_01_The_Holy_Land_relief.png", title: "Tierra Santa - Relieve", books: ["genesis","josue","jueces","1samuel","2samuel"] },
  { id: "biblica_02", fname: "biblica_02.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Biblica_Open_Bible_Map_02_03_The_World_of_the_Patriarchs.png/1280px-Biblica_Open_Bible_Map_02_03_The_World_of_the_Patriarchs.png", title: "El Mundo de los Patriarcas", books: ["genesis"] },
  { id: "biblica_04", fname: "biblica_04.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Biblica_Open_Bible_Map_04_The_Exodus_and_Conquest_of_Canaan.png/1280px-Biblica_Open_Bible_Map_04_The_Exodus_and_Conquest_of_Canaan.png", title: "El Éxodo y la Conquista de Canaán", books: ["exodo","numeros","deuteronomio","josue"] },
  { id: "biblica_05", fname: "biblica_05.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Biblica_Open_Bible_Map_05_The_Twelve_Tribes_of_Israel.png/1280px-Biblica_Open_Bible_Map_05_The_Twelve_Tribes_of_Israel.png", title: "Las Doce Tribus de Israel", books: ["josue","jueces"] },
  { id: "biblica_06", fname: "biblica_06.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Biblica_Open_Bible_Map_06_The_Kingdoms_of_Saul_David_and_Solomon.png/1280px-Biblica_Open_Bible_Map_06_The_Kingdoms_of_Saul_David_and_Solomon.png", title: "Reinos de Saúl, David y Salomón", books: ["1samuel","2samuel","1reyes","1cronicas"] },
  { id: "biblica_07", fname: "biblica_07.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Biblica_Open_Bible_Map_07_The_Kingdoms_of_Israel_and_Judah.png/1280px-Biblica_Open_Bible_Map_07_The_Kingdoms_of_Israel_and_Judah.png", title: "Reinos de Israel y Judá", books: ["1reyes","2reyes","2cronicas","isaias","jeremias","oseas","amos"] },
  { id: "biblica_08", fname: "biblica_08.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Biblica_Open_Bible_Map_08_The_Prophets_of_Judah_and_Israel.png/1280px-Biblica_Open_Bible_Map_08_The_Prophets_of_Judah_and_Israel.png", title: "Los Profetas de Judá e Israel", books: ["isaias","jeremias","ezequiel","oseas","joel","amos","abdias","jonas","miqueas","nahum","habacuc","sofonias"] },
  { id: "biblica_09", fname: "biblica_09.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Biblica_Open_Bible_Map_09_The_Assyrian_Empire_c700BC.png/1280px-Biblica_Open_Bible_Map_09_The_Assyrian_Empire_c700BC.png", title: "Imperio Asirio c. 700 a.C.", books: ["2reyes","isaias","nahum"] },
  { id: "biblica_10", fname: "biblica_10.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Biblica_Open_Bible_Map_10_The_Babylonian_Empire_c600BC.png/1280px-Biblica_Open_Bible_Map_10_The_Babylonian_Empire_c600BC.png", title: "Imperio Babilónico c. 600 a.C.", books: ["2reyes","jeremias","ezequiel","daniel","lamentaciones","habacuc"] },
  { id: "biblica_11", fname: "biblica_11.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Biblica_Open_Bible_Map_11_Persian_Empire_c450BC.png/1280px-Biblica_Open_Bible_Map_11_Persian_Empire_c450BC.png", title: "Imperio Persa c. 450 a.C.", books: ["esdras","nehemias","ester","daniel","hageo","zacarias","malaquias"] },
  { id: "biblica_15", fname: "biblica_15.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Biblica_Open_Bible_Map_15_The_Early_Spread_of_Christianity.png/1280px-Biblica_Open_Bible_Map_15_The_Early_Spread_of_Christianity.png", title: "Expansión del Cristianismo Primitivo", books: ["hechos","romanos","1corintios","2corintios","galatas","efesios","filipenses","colosenses","1tesalonicenses","2tesalonicenses"] },
  { id: "biblica_16", fname: "biblica_16.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Biblica_Open_Bible_Map_16_17_Paul_missionary_journeys_map.png/1280px-Biblica_Open_Bible_Map_16_17_Paul_missionary_journeys_map.png", title: "Viajes Misioneros de Pablo", books: ["hechos","romanos","1corintios","2corintios","galatas"] },
  { id: "biblica_18", fname: "biblica_18.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Biblica_Open_Bible_Map_18_The_Roman_Empire_and_the_Early_Church.png/1280px-Biblica_Open_Bible_Map_18_The_Roman_Empire_and_the_Early_Church.png", title: "El Imperio Romano y la Iglesia Primitiva", books: ["hechos","romanos","2timoteo"] },
  { id: "biblica_c44", fname: "biblica_c44.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Biblica_Open_Bible_Map_COLOR_44_Romans.png/1280px-Biblica_Open_Bible_Map_COLOR_44_Romans.png", title: "Mapa: Epístola a los Romanos", books: ["romanos"] },
  { id: "biblica_c45", fname: "biblica_c45.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Biblica_Open_Bible_Map_COLOR_45_Corinthians.png/1280px-Biblica_Open_Bible_Map_COLOR_45_Corinthians.png", title: "Mapa: Epístolas a los Corintios", books: ["1corintios","2corintios"] },
  { id: "biblica_c46", fname: "biblica_c46.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Biblica_Open_Bible_Map_COLOR_46_Galatians.png/1280px-Biblica_Open_Bible_Map_COLOR_46_Galatians.png", title: "Mapa: Epístola a los Gálatas", books: ["galatas"] },
  { id: "biblica_c47", fname: "biblica_c47.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Biblica_Open_Bible_Map_COLOR_47_Philippians.png/1280px-Biblica_Open_Bible_Map_COLOR_47_Philippians.png", title: "Mapa: Epístola a los Filipenses", books: ["filipenses"] },
  { id: "biblica_c48", fname: "biblica_c48.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Biblica_Open_Bible_Map_COLOR_48_Colossians.png/1280px-Biblica_Open_Bible_Map_COLOR_48_Colossians.png", title: "Mapa: Epístola a los Colosenses", books: ["colosenses","filemon"] },
  { id: "biblica_c49", fname: "biblica_c49.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Biblica_Open_Bible_Map_COLOR_49_Thessalonians.png/1280px-Biblica_Open_Bible_Map_COLOR_49_Thessalonians.png", title: "Mapa: Epístolas a los Tesalonicenses", books: ["1tesalonicenses","2tesalonicenses"] },
  { id: "biblica_c50", fname: "biblica_c50.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Biblica_Open_Bible_Map_COLOR_50_Timothy.png/1280px-Biblica_Open_Bible_Map_COLOR_50_Timothy.png", title: "Mapa: Epístolas a Timoteo", books: ["1timoteo","2timoteo"] },
  { id: "biblica_c51", fname: "biblica_c51.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Biblica_Open_Bible_Map_COLOR_51_Titus.png/1280px-Biblica_Open_Bible_Map_COLOR_51_Titus.png", title: "Mapa: Epístola a Tito", books: ["tito"] },
  { id: "biblica_c52", fname: "biblica_c52.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Biblica_Open_Bible_Map_COLOR_52_Peter.png/1280px-Biblica_Open_Bible_Map_COLOR_52_Peter.png", title: "Mapa: Epístolas de Pedro", books: ["1pedro","2pedro"] },
  { id: "biblica_c53", fname: "biblica_c53.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Biblica_Open_Bible_Map_COLOR_53_Revelation.png/1280px-Biblica_Open_Bible_Map_COLOR_53_Revelation.png", title: "Mapa: Apocalipsis - Siete Iglesias", books: ["apocalipsis"] },
  { id: "biblica_c43", fname: "biblica_c43.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Biblica_Open_Bible_Map_COLOR_43_Epistles_Overview.png/1280px-Biblica_Open_Bible_Map_COLOR_43_Epistles_Overview.png", title: "Vista General de las Epístolas", books: ["romanos","1corintios","2corintios","galatas","efesios","filipenses","colosenses","1tesalonicenses","2tesalonicenses","1timoteo","2timoteo","tito","filemon","hebreos","santiago","1pedro","2pedro","1juan","2juan","3juan","judas"] },
  { id: "paul_1st", fname: "paul_1st.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Paul_the_Apostle%2C_first_missionary_journey.svg/1280px-Paul_the_Apostle%2C_first_missionary_journey.svg.png", title: "Primer Viaje Misionero de Pablo", books: ["hechos"] },
  { id: "paul_2nd", fname: "paul_2nd.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Paul_the_Apostle%2C_second_missionary_journey.svg/1280px-Paul_the_Apostle%2C_second_missionary_journey.svg.png", title: "Segundo Viaje Misionero de Pablo", books: ["hechos","filipenses","1tesalonicenses","2tesalonicenses"] },
  { id: "paul_3rd", fname: "paul_3rd.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Paul_the_Apostle%2C_third_missionary_journey.svg/1280px-Paul_the_Apostle%2C_third_missionary_journey.svg.png", title: "Tercer Viaje Misionero de Pablo", books: ["hechos","1corintios","2corintios","romanos","efesios"] },
  { id: "paul_4th", fname: "paul_4th.png", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Paul_the_Apostle%2C_fourth_missionary_journey_%28Rome%29.svg/1280px-Paul_the_Apostle%2C_fourth_missionary_journey_%28Rome%29.svg.png", title: "Viaje de Pablo a Roma", books: ["hechos"] },
];

// ---- Doré URL base patterns (verified by agent) ----
const DORE_BASE = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
// Map of Doré numbers to their verified thumbnail URLs
const DORE_URLS = {
  "003": "0/01/003.Adam_and_Eve_Are_Driven_out_of_Eden.jpg/960px-003.Adam_and_Eve_Are_Driven_out_of_Eden.jpg",
  "004": "9/97/004.Cain_and_Abel_Offer_Their_Sacrifices.jpg/960px-004.Cain_and_Abel_Offer_Their_Sacrifices.jpg",
  "005": "b/bc/005.Cain_Slays_Abel.jpg/960px-005.Cain_Slays_Abel.jpg",
  "006": "f/f0/006.The_World_Is_Destroyed_by_Water.jpg/960px-006.The_World_Is_Destroyed_by_Water.jpg",
  "007": "6/64/007.The_Great_Flood.jpg/960px-007.The_Great_Flood.jpg",
  "008": "d/d4/008.A_Dove_Is_Sent_Forth_from_the_Ark.jpg/960px-008.A_Dove_Is_Sent_Forth_from_the_Ark.jpg",
  "009": "2/25/009.Noah_Curses_Ham_and_Canaan.jpg/960px-009.Noah_Curses_Ham_and_Canaan.jpg",
  "010": "1/14/010.The_Tower_of_Babel.jpg/960px-010.The_Tower_of_Babel.jpg",
  "011": "e/e5/011.Abraham_Goes_to_the_Land_of_Canaan.jpg/960px-011.Abraham_Goes_to_the_Land_of_Canaan.jpg",
  "013": "5/59/013.Lot_Flees_as_Sodom_and_Gomorrah_Burn.jpg/960px-013.Lot_Flees_as_Sodom_and_Gomorrah_Burn.jpg",
  "014": "3/35/014.Abraham_Sends_Hagar_and_Ishmael_Away.jpg/960px-014.Abraham_Sends_Hagar_and_Ishmael_Away.jpg",
  "015": "3/35/015.Hagar_and_Ishmael_in_the_Wilderness.jpg/960px-015.Hagar_and_Ishmael_in_the_Wilderness.jpg",
  "017": "5/50/017.The_Burial_of_Sarah.jpg/960px-017.The_Burial_of_Sarah.jpg",
  "018": "a/a4/018.Eliezer_and_Rebekah_at_the_Well.jpg/960px-018.Eliezer_and_Rebekah_at_the_Well.jpg",
  "019": "c/c6/019.The_Meeting_of_Isaac_and_Rebekah.jpg/960px-019.The_Meeting_of_Isaac_and_Rebekah.jpg",
  "020": "5/50/020.Isaac_Blesses_Jacob.jpg/960px-020.Isaac_Blesses_Jacob.jpg",
  "022": "1/15/022.Jacob_Tends_Laban%27s_Flocks_and_Meets_Rachel.jpg/960px-022.Jacob_Tends_Laban%27s_Flocks_and_Meets_Rachel.jpg",
  "025": "1/1c/025.Jacob_and_Esau_Meet.jpg/960px-025.Jacob_and_Esau_Meet.jpg",
  "026": "3/38/026.Joseph_Is_Sold_by_His_Brothers.jpg/960px-026.Joseph_Is_Sold_by_His_Brothers.jpg",
  "027": "c/c5/027.Joseph_Interprets_Pharaoh%27s_Dream.jpg/960px-027.Joseph_Interprets_Pharaoh%27s_Dream.jpg",
  "028": "5/5e/028.Joseph_Reveals_Himself_to_His_Brothers.jpg/960px-028.Joseph_Reveals_Himself_to_His_Brothers.jpg",
  "029": "9/98/029.Jacob_Goes_to_Egypt.jpg/960px-029.Jacob_Goes_to_Egypt.jpg",
  "030": "7/79/030.The_Child_Moses_on_the_Nile.jpg/960px-030.The_Child_Moses_on_the_Nile.jpg",
  "031": "3/3e/031.The_Finding_of_Moses.jpg/960px-031.The_Finding_of_Moses.jpg",
  "032": "8/8c/032.Moses_and_Aaron_Appear_before_Pharaoh.jpg/960px-032.Moses_and_Aaron_Appear_before_Pharaoh.jpg",
  "033": "a/ad/033.The_Fifth_Plague._Livestock_Disease.jpg/960px-033.The_Fifth_Plague._Livestock_Disease.jpg",
  "034": "3/35/034.The_Ninth_Plague._Darkness.jpg/960px-034.The_Ninth_Plague._Darkness.jpg",
  "035": "0/0b/035.The_Firstborn_of_the_Egyptians_Are_Slain.jpg/960px-035.The_Firstborn_of_the_Egyptians_Are_Slain.jpg",
  "036": "7/7e/036.The_Egyptians_Ask_Moses_to_Depart.jpg/960px-036.The_Egyptians_Ask_Moses_to_Depart.jpg",
  "037": "4/45/037.The_Egyptians_Drown_in_the_Sea.jpg/960px-037.The_Egyptians_Drown_in_the_Sea.jpg",
  "040": "5/5a/040.The_Death_of_Korah%2C_Dathan%2C_and_Abiram.jpg/960px-040.The_Death_of_Korah%2C_Dathan%2C_and_Abiram.jpg",
  "041": "f/f2/041.Moses_Strikes_the_Rock_at_Horeb.jpg/960px-041.Moses_Strikes_the_Rock_at_Horeb.jpg",
  "041A": "5/54/041A.Moses_Breaks_the_Tables_of_the_Law.jpg/960px-041A.Moses_Breaks_the_Tables_of_the_Law.jpg",
  "041B": "3/3b/041B.The_Spies_Return_from_the_Promised_Land.jpg/960px-041B.The_Spies_Return_from_the_Promised_Land.jpg",
  "044": "f/fe/044._The_Israelites_Cross_the_Jordan_River.jpg/960px-044._The_Israelites_Cross_the_Jordan_River.jpg",
  "046": "e/ed/046.The_Walls_of_Jericho_Fall_Down.jpg/960px-046.The_Walls_of_Jericho_Fall_Down.jpg",
  "047": "1/1a/047.Joshua_Spares_Rahab.jpg/960px-047.Joshua_Spares_Rahab.jpg",
  "048": "f/fd/048.Achan_Is_Stoned_to_Death.jpg/960px-048.Achan_Is_Stoned_to_Death.jpg",
  "049": "9/96/049.Joshua_Burns_the_Town_of_Ai.jpg/960px-049.Joshua_Burns_the_Town_of_Ai.jpg",
  "050": "9/9b/050.The_Army_of_the_Amorites_Is_Destroyed.jpg/960px-050.The_Army_of_the_Amorites_Is_Destroyed.jpg",
  "051": "8/8b/051.Joshua_Commands_the_Sun_to_Stand_Still.jpg/960px-051.Joshua_Commands_the_Sun_to_Stand_Still.jpg",
  "052": "7/70/052.Jael_Kills_Sisera.jpg/960px-052.Jael_Kills_Sisera.jpg",
  "053": "4/40/053.Deborah_Praises_Jael.jpg/960px-053.Deborah_Praises_Jael.jpg",
  "054": "d/d5/054.Gideon_Chooses_300_Soldiers.jpg/960px-054.Gideon_Chooses_300_Soldiers.jpg",
  "055": "c/cc/055.The_Midianites_Are_Routed.jpg/960px-055.The_Midianites_Are_Routed.jpg",
  "056": "7/70/056.The_Death_of_Gideon%27s_Sons.jpg/960px-056.The_Death_of_Gideon%27s_Sons.jpg",
  "057": "2/20/057.The_Death_of_Abimelech.jpg/960px-057.The_Death_of_Abimelech.jpg",
  "058": "5/5a/058.Jephthah%27s_Daughter_Comes_to_Meet_Her_Father.jpg/960px-058.Jephthah%27s_Daughter_Comes_to_Meet_Her_Father.jpg",
  "059": "2/2f/059.Israelite_Women_Mourn_with_Jephthah%27s_Daughter.jpg/960px-059.Israelite_Women_Mourn_with_Jephthah%27s_Daughter.jpg",
  "060": "2/20/060.Samson_Slays_a_Lion.jpg/960px-060.Samson_Slays_a_Lion.jpg",
  "061": "4/48/061.Samson_Destroys_the_Philistines_with_an_Ass%27_Jawbone.jpg/960px-061.Samson_Destroys_the_Philistines_with_an_Ass%27_Jawbone.jpg",
  "062": "a/a4/062.Samson_Carries_away_the_Gates_of_Gaza.jpg/960px-062.Samson_Carries_away_the_Gates_of_Gaza.jpg",
  "063": "e/e9/063.Samson_and_Delilah.jpg/960px-063.Samson_and_Delilah.jpg",
  "064": "6/64/064.The_Death_of_Samson.jpg/960px-064.The_Death_of_Samson.jpg",
  "065": "e/ee/065.A_Levite_Finds_a_Woman%27s_Corpse.jpg/960px-065.A_Levite_Finds_a_Woman%27s_Corpse.jpg",
  "066": "5/53/066.The_Levite_Carries_the_Woman%27s_Body_Away.jpg/960px-066.The_Levite_Carries_the_Woman%27s_Body_Away.jpg",
  "067": "1/1b/067.The_Benjaminites_Take_the_Virgins_of_Jabesh-gilead.jpg/960px-067.The_Benjaminites_Take_the_Virgins_of_Jabesh-gilead.jpg",
  "068": "4/41/068.Naomi_and_Her_Daughters-in-Law.jpg/960px-068.Naomi_and_Her_Daughters-in-Law.jpg",
  "069": "2/2e/069.Ruth_and_Boaz.jpg/960px-069.Ruth_and_Boaz.jpg",
  "070": "7/70/070.The_Ark_Is_Returned_to_Beth-shemesh.jpg/960px-070.The_Ark_Is_Returned_to_Beth-shemesh.jpg",
  "070A": "5/5b/070A.Samuel_Blesses_Saul.jpg/960px-070A.Samuel_Blesses_Saul.jpg",
  "071": "3/39/071.The_Death_of_Agag.jpg/960px-071.The_Death_of_Agag.jpg",
  "071A": "0/00/071A.David_Slays_Goliath.jpg/960px-071A.David_Slays_Goliath.jpg",
  "072": "4/4e/072.Saul_Attempts_to_Kill_David.jpg/960px-072.Saul_Attempts_to_Kill_David.jpg",
  "073": "4/4a/073.David_Escapes_through_a_Window.jpg/960px-073.David_Escapes_through_a_Window.jpg",
  "073A": "9/9d/073A.David_and_Jonathan.jpg/960px-073A.David_and_Jonathan.jpg",
  "074": "6/62/074.David_Shows_Saul_How_He_Spared_His_Life.jpg/960px-074.David_Shows_Saul_How_He_Spared_His_Life.jpg",
  "075": "0/08/075.Saul_and_the_Witch_of_Endor.jpg/960px-075.Saul_and_the_Witch_of_Endor.jpg",
  "076": "8/88/076.The_Death_of_Saul.jpg/960px-076.The_Death_of_Saul.jpg",
  "077": "d/d5/077.Jabesh-Gileadites_Recover_the_Bodies_of_Saul_and_His_Sons.jpg/960px-077.Jabesh-Gileadites_Recover_the_Bodies_of_Saul_and_His_Sons.jpg",
  "078": "6/69/078.Combat_between_Soldiers_of_Ish-bosheth_and_David.jpg/960px-078.Combat_between_Soldiers_of_Ish-bosheth_and_David.jpg",
  "079": "2/25/079.David_Attacks_the_Ammonites.jpg/960px-079.David_Attacks_the_Ammonites.jpg",
  "080": "6/6d/080.The_Death_of_Absalom.jpg/960px-080.The_Death_of_Absalom.jpg",
  "081": "7/71/081.David_Mourns_the_Death_of_Absalom.jpg/960px-081.David_Mourns_the_Death_of_Absalom.jpg",
  "082": "9/93/082.Rizpah%E2%80%99s_Kindness_toward_the_Dead.jpg/960px-082.Rizpah%E2%80%99s_Kindness_toward_the_Dead.jpg",
  "083": "b/bb/083.Abishai_Saves_David%27s_Life.jpg/960px-083.Abishai_Saves_David%27s_Life.jpg",
  "084": "6/61/084.The_Judgment_of_Solomon.jpg/960px-084.The_Judgment_of_Solomon.jpg",
  "085": "8/88/085.Cedars_Are_Cut_Down_for_the_Jerusalem_Temple.jpg/960px-085.Cedars_Are_Cut_Down_for_the_Jerusalem_Temple.jpg",
  "086": "7/7d/086.Solomon_Receives_the_Queen_of_Sheba.jpg/960px-086.Solomon_Receives_the_Queen_of_Sheba.jpg",
  "087": "3/39/087.King_Solomon_in_Old_Age.jpg/960px-087.King_Solomon_in_Old_Age.jpg",
  "088": "0/0d/088.The_Disobedient_Prophet_Is_Slain_by_a_Lion.jpg/960px-088.The_Disobedient_Prophet_Is_Slain_by_a_Lion.jpg",
  "090": "2/26/090.The_Prophets_of_Baal_Are_Slaughtered.jpg/960px-090.The_Prophets_of_Baal_Are_Slaughtered.jpg",
  "092": "f/f6/092.The_Israelites_Slaughter_the_Syrians.jpg/960px-092.The_Israelites_Slaughter_the_Syrians.jpg",
  "093": "5/52/093.The_Death_of_Ahab.jpg/960px-093.The_Death_of_Ahab.jpg",
  "095B": "4/41/095.Some_Children_Are_Destroyed_by_Bears.jpg/960px-095.Some_Children_Are_Destroyed_by_Bears.jpg",
  "096": "6/69/096.A_Famine_in_Samaria.jpg/960px-096.A_Famine_in_Samaria.jpg",
  "097": "c/c6/097.The_Death_of_Jezebel.jpg/960px-097.The_Death_of_Jezebel.jpg",
  "098": "3/35/098.Jehu%27s_Companions_Find_Jezebel%27s_Remains.jpg/960px-098.Jehu%27s_Companions_Find_Jezebel%27s_Remains.jpg",
  "099": "5/57/099.The_Death_of_Athaliah.jpg/960px-099.The_Death_of_Athaliah.jpg",
  "100": "2/2f/100.Foreign_Nations_Are_Slain_by_Lions_in_Samaria.jpg/960px-100.Foreign_Nations_Are_Slain_by_Lions_in_Samaria.jpg",
  "101": "2/2f/101.Sennacherib%27s_Army_Is_Destroyed.jpg/960px-101.Sennacherib%27s_Army_Is_Destroyed.jpg",
  "102": "a/af/102.Zedekiah%27s_Sons_Are_Slaughtered_before_His_Eyes.jpg/960px-102.Zedekiah%27s_Sons_Are_Slaughtered_before_His_Eyes.jpg",
  "103": "9/94/103.The_Ammonite_and_Moabite_Armies_Are_Destroyed.jpg/960px-103.The_Ammonite_and_Moabite_Armies_Are_Destroyed.jpg",
  "104": "d/d4/104.Cyrus_Restores_the_Vessels_of_the_Temple.jpg/960px-104.Cyrus_Restores_the_Vessels_of_the_Temple.jpg",
  "105": "9/9e/105.The_Rebuilding_of_the_Temple_Is_Begun.jpg/960px-105.The_Rebuilding_of_the_Temple_Is_Begun.jpg",
  "106": "f/fb/106.Artaxerxes_Grants_Freedom_to_the_Jews.jpg/960px-106.Artaxerxes_Grants_Freedom_to_the_Jews.jpg",
  "108": "5/53/108.Nehemiah_Views_the_Ruins_of_Jerusalem%27s_Walls.jpg/960px-108.Nehemiah_Views_the_Ruins_of_Jerusalem%27s_Walls.jpg",
  "109": "b/b0/109.Ezra_Reads_the_Law_to_the_People.jpg/960px-109.Ezra_Reads_the_Law_to_the_People.jpg",
  "114": "3/37/114.Queen_Vashti_Refuses_to_Obey_Ahasuerus%27_Command.jpg/960px-114.Queen_Vashti_Refuses_to_Obey_Ahasuerus%27_Command.jpg",
  "115": "1/13/115.Esther_Before_the_King.jpg/960px-115.Esther_Before_the_King.jpg",
  "116": "8/89/116.The_Triumph_of_Mordecai.jpg/960px-116.The_Triumph_of_Mordecai.jpg",
  "117": "e/e5/117.Esther_Accuses_Haman.jpg/960px-117.Esther_Accuses_Haman.jpg",
  "118": "5/5e/118.Job_Hears_of_His_Misfortunes.jpg/960px-118.Job_Hears_of_His_Misfortunes.jpg",
  "119": "7/79/119.Job_Speaks_with_His_Friends.jpg/960px-119.Job_Speaks_with_His_Friends.jpg",
  "120": "4/43/120.The_Prophet_Isaiah.jpg/960px-120.The_Prophet_Isaiah.jpg",
  "121": "5/5c/121.Isaiah%27s_Vision_of_the_Destruction_of_Babylon.jpg/960px-121.Isaiah%27s_Vision_of_the_Destruction_of_Babylon.jpg",
  "123": "d/d3/123.The_Prophet_Jeremiah.jpg/960px-123.The_Prophet_Jeremiah.jpg",
  "123B": "c/c7/123.Baruch_Writes_Jeremiah%27s_Prophecies.jpg/960px-123.Baruch_Writes_Jeremiah%27s_Prophecies.jpg",
  "124": "9/9f/124.People_Mourn_over_the_Destruction_of_Jerusalem.jpg/960px-124.People_Mourn_over_the_Destruction_of_Jerusalem.jpg",
  "126": "4/42/126.The_Prophet_Ezekiel.jpg/960px-126.The_Prophet_Ezekiel.jpg",
  "128": "3/36/128.Daniel_among_the_Exiles.jpg/960px-128.Daniel_among_the_Exiles.jpg",
  "130": "7/70/130.Daniel_Interprets_the_Writing_on_the_Wall.jpg/960px-130.Daniel_Interprets_the_Writing_on_the_Wall.jpg",
  "131": "a/a7/131.Daniel_in_the_Lions%27_Den.jpg/960px-131.Daniel_in_the_Lions%27_Den.jpg",
  "136": "c/cf/136.The_Prophet_Amos.jpg/960px-136.The_Prophet_Amos.jpg",
  "137": "7/73/137.Jonah_Is_Spewed_Forth_by_the_Whale.jpg/960px-137.Jonah_Is_Spewed_Forth_by_the_Whale.jpg",
  "138": "e/e9/138.Jonah_Preaches_to_the_Ninevites.jpg/960px-138.Jonah_Preaches_to_the_Ninevites.jpg",
  "139": "2/29/139.Micah_Exhorts_the_Israelites_to_Repent.jpg/960px-139.Micah_Exhorts_the_Israelites_to_Repent.jpg",
};

// ========== DOWNLOAD FUNCTION ==========
function download(url, dest) {
  return new Promise((resolve) => {
    const opts = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/*,*/*;q=0.8',
        'Referer': 'https://commons.wikimedia.org/'
      }
    };
    const u = new URL(url);
    opts.hostname = u.hostname;
    opts.path = u.pathname + (u.search || '');
    https.get(opts, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve);
        return;
      }
      if (res.statusCode !== 200) { resolve({ ok: false, status: res.statusCode }); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length > 3000) { fs.writeFileSync(dest, buf); resolve({ ok: true, size: buf.length }); }
        else resolve({ ok: false, size: buf.length });
      });
    }).on('error', e => resolve({ ok: false, error: e.message }));
  });
}

// ========== GENERATE DATA FILE ==========
function generateDataFile(allImages) {
  // Group by book
  const byBook = {};
  for (const img of allImages) {
    if (!byBook[img.book]) byBook[img.book] = [];
    byBook[img.book].push(img);
  }

  // Book order
  const bookOrder = ["genesis","exodo","levitico","numeros","deuteronomio","josue","jueces","rut",
    "1samuel","2samuel","1reyes","2reyes","1cronicas","2cronicas","esdras","nehemias","ester","job",
    "salmos","proverbios","eclesiastes","cantares","isaias","jeremias","lamentaciones","ezequiel",
    "daniel","oseas","joel","amos","abdias","jonas","miqueas","nahum","habacuc","sofonias","hageo",
    "zacarias","malaquias","mateo","marcos","lucas","juan","hechos","romanos","1corintios","2corintios",
    "galatas","efesios","filipenses","colosenses","1tesalonicenses","2tesalonicenses","1timoteo",
    "2timoteo","tito","filemon","hebreos","santiago","1pedro","2pedro","1juan","2juan","3juan","judas","apocalipsis"];

  let js = `// ============================================
// BIBLE IMAGES DATA - Ilustraciones Bíblicas
// Doré + Arte figurativo narrativo
// Total: ${allImages.length} ilustraciones
// ============================================

const BIBLE_IMAGES = {\n`;

  for (const book of bookOrder) {
    const imgs = byBook[book];
    if (!imgs || imgs.length === 0) continue;
    const key = book.match(/^\d/) ? `"${book}"` : book;
    js += `    ${key}: [\n`;
    for (const img of imgs) {
      const ch = JSON.stringify(img.chapters);
      const fallback = img.url ? `, url: ${JSON.stringify(img.url)}` : '';
      js += `        { local: "${img.local}", title: "${img.title}", artist: "${img.artist || 'Gustave Doré, 1866'}", chapters: ${ch}, verseHint: ${img.verseHint}${fallback} },\n`;
    }
    js += `    ],\n`;
  }

  js += `};\n\nif (typeof window !== 'undefined') {\n    window.BIBLE_IMAGES = BIBLE_IMAGES;\n}\n`;
  return js;
}

// ========== MAIN ==========
async function main() {
  const artDir = path.join(__dirname, 'img', 'art');
  const mapDir = path.join(__dirname, 'img', 'maps');
  fs.mkdirSync(path.join(artDir, 'dore'), { recursive: true });

  // Build image list
  const allImages = [];
  const toDownload = [];

  // 1. Doré OT
  for (const [num, title, book, chapters, verseHint] of DORE_OT) {
    const urlPath = DORE_URLS[num];
    if (!urlPath) { console.log('SKIP no URL:', num); continue; }
    const url = DORE_BASE + urlPath;
    const fname = `dore_${num}.jpg`;
    const local = `img/art/dore/${fname}`;
    const dest = path.join(artDir, 'dore', fname);
    allImages.push({ local, url, title, artist: "Gustave Doré, 1866", book, chapters, verseHint });
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 5000) {
      toDownload.push({ url, dest, fname });
    }
  }

  // 2. Doré NT
  for (const [id, wikiFile, title, book, chapters, verseHint] of DORE_NT) {
    const url = `https://upload.wikimedia.org/wikipedia/commons/${wikiFile}`;
    const ext = wikiFile.endsWith('.png') ? 'png' : 'jpg';
    const fname = `${id}.${ext}`;
    const local = `img/art/dore/${fname}`;
    const dest = path.join(artDir, 'dore', fname);
    allImages.push({ local, url, title, artist: "Gustave Doré, 1866", book, chapters, verseHint });
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 3000) {
      toDownload.push({ url, dest, fname });
    }
  }

  // 3. Existing paintings
  for (const img of EXISTING) {
    allImages.push({ ...img, url: img.url || null });
  }

  console.log(`Total images: ${allImages.length}`);
  console.log(`To download: ${toDownload.length}`);
  console.log(`Already have: ${allImages.length - toDownload.length}`);

  // Download maps
  const mapDownloads = [];
  for (const m of BIBLICA_MAPS) {
    const dest = path.join(mapDir, m.fname);
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 3000) {
      mapDownloads.push({ url: m.url, dest, fname: m.fname });
    }
  }
  console.log(`Maps to download: ${mapDownloads.length}`);

  // Generate data file first
  const dataJS = generateDataFile(allImages);
  fs.writeFileSync(path.join(__dirname, 'biblia-images-data.js'), dataJS);
  console.log('Generated biblia-images-data.js');

  // Download all in sequence with delays
  const allDownloads = [...toDownload, ...mapDownloads];
  let success = 0, fail = 0;
  for (let i = 0; i < allDownloads.length; i++) {
    const { url, dest, fname } = allDownloads[i];
    process.stdout.write(`[${i+1}/${allDownloads.length}] ${fname}... `);
    const result = await download(url, dest);
    if (result.ok) {
      console.log(`OK (${Math.round(result.size/1024)}KB)`);
      success++;
    } else {
      console.log(`FAIL (${result.status || result.error})`);
      fail++;
    }
    if (i < allDownloads.length - 1) {
      await new Promise(r => setTimeout(r, 8000));
    }
  }
  console.log(`\nDone: ${success} OK, ${fail} failed out of ${allDownloads.length}`);

  // Generate map data for timeline
  const mapDataJS = generateMapData();
  console.log('\nMap data for biblia-timeline-data.js:');
  console.log(mapDataJS);
}

function generateMapData() {
  let s = '';
  for (const m of BIBLICA_MAPS) {
    s += `${m.id}: { local: "img/maps/${m.fname}", title: "${m.title}", books: ${JSON.stringify(m.books)} }\n`;
  }
  return s;
}

main().catch(console.error);
