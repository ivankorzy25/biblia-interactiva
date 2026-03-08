// ============================================
// BIBLE IMAGES DATA - Ilustraciones Bíblicas
// Wikimedia Commons (Dominio Público)
// ============================================

const BIBLE_IMAGES = {
    // Organized by book ID -> array of images
    genesis: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Creaci%C3%B3n_de_Ad%C3%A1m_%28Miguel_%C3%81ngel%29.jpg/1200px-Creaci%C3%B3n_de_Ad%C3%A1m_%28Miguel_%C3%81ngel%29.jpg", title: "La Creación de Adán", artist: "Miguel Ángel, c. 1512", chapters: [1,2] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Michelangelo_-_Sistine_Chapel_-_adam_and_eve_expelled_from_the_garden_of_eden.jpg/1024px-Michelangelo_-_Sistine_Chapel_-_adam_and_eve_expelled_from_the_garden_of_eden.jpg", title: "Expulsión del Paraíso", artist: "Miguel Ángel, c. 1510", chapters: [3] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Nuremberg_chronicles_-_f_11r.png/800px-Nuremberg_chronicles_-_f_11r.png", title: "El Arca de Noé", artist: "Crónicas de Nuremberg, 1493", chapters: [6,7,8,9] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project.jpg/1200px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project.jpg", title: "La Torre de Babel", artist: "Pieter Bruegel el Viejo, 1563", chapters: [11] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Abraham_and_the_Three_Angels%2C_by_Gustave_Dor%C3%A9.jpg/800px-Abraham_and_the_Three_Angels%2C_by_Gustave_Dor%C3%A9.jpg", title: "Abraham y los Tres Ángeles", artist: "Gustave Doré, 1866", chapters: [12,13,14,15,16,17,18] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg/800px-Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg", title: "El Sacrificio de Isaac", artist: "Caravaggio, 1603", chapters: [22] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Rembrandt_Harmensz._van_Rijn_063.jpg/800px-Rembrandt_Harmensz._van_Rijn_063.jpg", title: "Jacob bendiciendo a los hijos de José", artist: "Rembrandt, 1656", chapters: [37,39,40,41,42,43,44,45,46,47,48,49,50] },
    ],
    exodo: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Burning_bush_%28Dor%C3%A9%29.jpg/800px-Burning_bush_%28Dor%C3%A9%29.jpg", title: "Moisés y la Zarza Ardiente", artist: "Gustave Doré, 1866", chapters: [3,4] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Nicolas_Poussin_-_The_Crossing_of_the_Red_Sea_-_WGA18314.jpg/1200px-Nicolas_Poussin_-_The_Crossing_of_the_Red_Sea_-_WGA18314.jpg", title: "El Cruce del Mar Rojo", artist: "Nicolas Poussin, 1634", chapters: [14,15] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Rembrandt_Harmensz._van_Rijn_079.jpg/800px-Rembrandt_Harmensz._van_Rijn_079.jpg", title: "Moisés con las Tablas de la Ley", artist: "Rembrandt, 1659", chapters: [19,20,24,31,32,34] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Adoration_of_the_Golden_Calf_by_Filippino_Lippi.jpg/1200px-Adoration_of_the_Golden_Calf_by_Filippino_Lippi.jpg", title: "El Becerro de Oro", artist: "Filippino Lippi, c. 1500", chapters: [32] },
    ],
    josue: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dor%C3%A9_Walls_of_Jericho.jpg/800px-Dor%C3%A9_Walls_of_Jericho.jpg", title: "La Caída de Jericó", artist: "Gustave Doré, 1866", chapters: [6] },
    ],
    jueces: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Samson_and_Delilah_by_Rubens.jpg/1024px-Samson_and_Delilah_by_Rubens.jpg", title: "Sansón y Dalila", artist: "Peter Paul Rubens, 1610", chapters: [16] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Gideon_Dor%C3%A9.jpg/800px-Gideon_Dor%C3%A9.jpg", title: "La Victoria de Gedeón", artist: "Gustave Doré, 1866", chapters: [7] },
    ],
    rut: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Julius_Schnorr_von_Carolsfeld-_Ruth_im_Feld_des_Boaz.jpg/800px-Julius_Schnorr_von_Carolsfeld-_Ruth_im_Feld_des_Boaz.jpg", title: "Rut en el Campo de Booz", artist: "Julius Schnorr von Carolsfeld, 1828", chapters: [2,3] },
    ],
    "1samuel": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/David_and_Goliath_by_Caravaggio.jpg/800px-David_and_Goliath_by_Caravaggio.jpg", title: "David y Goliat", artist: "Caravaggio, c. 1610", chapters: [17] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Rembrandt_-_David_Playing_the_Harp_before_Saul_-_WGA19tried.jpg/800px-Rembrandt_-_David_Playing_the_Harp_before_Saul_-_WGA19tried.jpg", title: "David tocando el Arpa ante Saúl", artist: "Rembrandt, c. 1656", chapters: [16,18,19] },
    ],
    "2samuel": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Rembrandt_Harmensz._van_Rijn_030.jpg/800px-Rembrandt_Harmensz._van_Rijn_030.jpg", title: "David en Oración", artist: "Rembrandt, c. 1652", chapters: [7,12] },
    ],
    "1reyes": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Judgment_of_Solomon_%28Raphael%29.jpg/1024px-Judgment_of_Solomon_%28Raphael%29.jpg", title: "El Juicio de Salomón", artist: "Rafael, 1518-19", chapters: [3] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/ElijahCarmelMontagne.jpg/800px-ElijahCarmelMontagne.jpg", title: "Elías en el Monte Carmelo", artist: "Albert H. Collings, 1870", chapters: [18] },
    ],
    daniel: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Peter_Paul_Rubens_-_Daniel_in_the_Lions%27_Den_-_WGA20204.jpg/1024px-Peter_Paul_Rubens_-_Daniel_in_the_Lions%27_Den_-_WGA20204.jpg", title: "Daniel en el Foso de los Leones", artist: "Peter Paul Rubens, 1614", chapters: [6] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Rembrandt_-_Belshazzar%27s_Feast_-_WGA19123.jpg/1024px-Rembrandt_-_Belshazzar%27s_Feast_-_WGA19123.jpg", title: "El Festín de Belsasar", artist: "Rembrandt, c. 1636", chapters: [5] },
    ],
    isaias: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Michelangelo%2C_profeti%2C_Isaiah_01.jpg/800px-Michelangelo%2C_profeti%2C_Isaiah_01.jpg", title: "El Profeta Isaías", artist: "Miguel Ángel, c. 1509", chapters: [1,6,40,53] },
    ],
    jeremias: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Rembrandt_Harmensz._van_Rijn_-_Jeremia_treurend_over_de_verwoesting_van_Jeruzalem_-_Google_Art_Project.jpg/800px-Rembrandt_Harmensz._van_Rijn_-_Jeremia_treurend_over_de_verwoesting_van_Jeruzalem_-_Google_Art_Project.jpg", title: "Jeremías Lamentando la Destrucción de Jerusalén", artist: "Rembrandt, 1630", chapters: [1,52] },
    ],
    ezequiel: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dore_woodcut_Divine_Comedy_01.jpg/800px-Dore_woodcut_Divine_Comedy_01.jpg", title: "Visión de Ezequiel", artist: "Gustave Doré, 1866", chapters: [1,37] },
    ],
    job: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/L%C3%A9on_Bonnat_-_Job.jpg/800px-L%C3%A9on_Bonnat_-_Job.jpg", title: "Job", artist: "Léon Bonnat, 1880", chapters: [1,2,38,42] },
    ],
    salmos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/King_David_Playing_the_Harp_-_Gerard_van_Honthorst_%281622%29.jpg/800px-King_David_Playing_the_Harp_-_Gerard_van_Honthorst_%281622%29.jpg", title: "El Rey David Tocando el Arpa", artist: "Gerard van Honthorst, 1622", chapters: [1,23,51,100,150] },
    ],
    mateo: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Gerard_van_Honthorst_-_Adoration_of_the_Shepherds_%281622%29.jpg/1024px-Gerard_van_Honthorst_-_Adoration_of_the_Shepherds_%281622%29.jpg", title: "Adoración de los Pastores", artist: "Gerard van Honthorst, 1622", chapters: [1,2] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Bloch-SerijBjergpraedikenen.jpg/1024px-Bloch-SerijBjergpraedikenen.jpg", title: "El Sermón de la Montaña", artist: "Carl Bloch, 1877", chapters: [5,6,7] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/WLANL_-_Pachango_-_De_Transfiguratie%2C_Rafae%CC%88l.jpg/800px-WLANL_-_Pachango_-_De_Transfiguratie%2C_Rafae%CC%88l.jpg", title: "La Transfiguración", artist: "Rafael, 1520", chapters: [17] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/1200px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg", title: "La Última Cena", artist: "Leonardo da Vinci, 1498", chapters: [26] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Cristo_crucificado.jpg/800px-Cristo_crucificado.jpg", title: "Cristo Crucificado", artist: "Diego Velázquez, 1632", chapters: [27] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Noel_Coypel_-_The_Resurrection_of_Christ.jpg/800px-Noel_Coypel_-_The_Resurrection_of_Christ.jpg", title: "La Resurrección de Cristo", artist: "Noël Coypel, 1700", chapters: [28] },
    ],
    marcos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Baptism-of-Christ-xx-Piero-della-Francesca.JPG/800px-Baptism-of-Christ-xx-Piero-della-Francesca.JPG", title: "El Bautismo de Cristo", artist: "Piero della Francesca, c. 1450", chapters: [1] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Christ_in_the_Storm_on_the_Lake_of_Galilee_%28Rembrandt%29.jpg/800px-Christ_in_the_Storm_on_the_Lake_of_Galilee_%28Rembrandt%29.jpg", title: "Cristo en la Tormenta", artist: "Rembrandt, 1633", chapters: [4] },
    ],
    lucas: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pompeo_Batoni_003.jpg/800px-Pompeo_Batoni_003.jpg", title: "El Retorno del Hijo Pródigo", artist: "Pompeo Batoni, 1773", chapters: [15] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Rembrandt_Harmensz._van_Rijn_-_The_Good_Samaritan_-_Louvre.jpg/800px-Rembrandt_Harmensz._van_Rijn_-_The_Good_Samaritan_-_Louvre.jpg", title: "El Buen Samaritano", artist: "Rembrandt, 1633", chapters: [10] },
    ],
    juan: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Duccio_di_Buoninsegna_-_The_Raising_of_Lazarus_-_Google_Art_Project.jpg/800px-Duccio_di_Buoninsegna_-_The_Raising_of_Lazarus_-_Google_Art_Project.jpg", title: "La Resurrección de Lázaro", artist: "Duccio di Buoninsegna, c. 1310", chapters: [11] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Giotto_-_Scrovegni_-_-26-_-_Entry_into_Jerusalem.jpg/800px-Giotto_-_Scrovegni_-_-26-_-_Entry_into_Jerusalem.jpg", title: "Entrada Triunfal en Jerusalén", artist: "Giotto, c. 1305", chapters: [12] },
    ],
    hechos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Caravaggio_-_La_conversione_di_San_Paolo.jpg/800px-Caravaggio_-_La_conversione_di_San_Paolo.jpg", title: "La Conversión de San Pablo", artist: "Caravaggio, 1601", chapters: [9] },
    ],
    apocalipsis: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_4._The_Four_Riders_-_WGA07119.jpg/800px-Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_4._The_Four_Riders_-_WGA07119.jpg", title: "Los Cuatro Jinetes del Apocalipsis", artist: "Alberto Durero, 1498", chapters: [6] },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_14._The_New_Jerusalem.jpg/800px-Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_14._The_New_Jerusalem.jpg", title: "La Nueva Jerusalén", artist: "Alberto Durero, 1498", chapters: [21,22] },
    ],

    // Generic images for books without specific illustrations
    _generic: {
        at: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Dead_Sea_Scroll_-_part_of_Isaiah_Scroll_%28Isa_57.17_-_59.9%29.jpg/1200px-Dead_Sea_Scroll_-_part_of_Isaiah_Scroll_%28Isa_57.17_-_59.9%29.jpg", title: "Rollos del Mar Muerto - Isaías", artist: "Dominio público" },
        nt: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Codex_Sinaiticus_Matthew_6%2C4-32.JPG/800px-Codex_Sinaiticus_Matthew_6%2C4-32.JPG", title: "Códice Sinaítico - Mateo", artist: "Siglo IV d.C." }
    }
};

if (typeof window !== 'undefined') {
    window.BIBLE_IMAGES = BIBLE_IMAGES;
}
