// ============================================
// BIBLE IMAGES DATA - Ilustraciones Bíblicas
// Wikimedia Commons (Dominio Público)
// ============================================

const BIBLE_IMAGES = {
    // Organized by book ID -> array of images
    genesis: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Creaci%C3%B3n_de_Ad%C3%A1m_%28Miguel_%C3%81ngel%29.jpg/1200px-Creaci%C3%B3n_de_Ad%C3%A1m_%28Miguel_%C3%81ngel%29.jpg", title: "La Creación de Adán", artist: "Miguel Ángel, c. 1512", chapters: [1,2], verseHint: 27 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Michelangelo_-_Sistine_Chapel_-_adam_and_eve_expelled_from_the_garden_of_eden.jpg/1024px-Michelangelo_-_Sistine_Chapel_-_adam_and_eve_expelled_from_the_garden_of_eden.jpg", title: "Expulsión del Paraíso", artist: "Miguel Ángel, c. 1510", chapters: [3], verseHint: 23 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Nuremberg_chronicles_-_f_11r.png/800px-Nuremberg_chronicles_-_f_11r.png", title: "El Arca de Noé", artist: "Crónicas de Nuremberg, 1493", chapters: [6,7,8,9], verseHint: 14 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project.jpg/1200px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project.jpg", title: "La Torre de Babel", artist: "Pieter Bruegel el Viejo, 1563", chapters: [11], verseHint: 4 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Abraham_and_the_Three_Angels%2C_by_Gustave_Dor%C3%A9.jpg/800px-Abraham_and_the_Three_Angels%2C_by_Gustave_Dor%C3%A9.jpg", title: "Abraham y los Tres Ángeles", artist: "Gustave Doré, 1866", chapters: [12,13,14,15,16,17,18], verseHint: 2 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg/800px-Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg", title: "El Sacrificio de Isaac", artist: "Caravaggio, 1603", chapters: [22], verseHint: 10 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Gustave_Dor%C3%A9_-_Jacob_Wrestling_with_the_Angel.jpg/800px-Gustave_Dor%C3%A9_-_Jacob_Wrestling_with_the_Angel.jpg", title: "Jacob luchando con el Ángel", artist: "Gustave Doré, 1855", chapters: [32], verseHint: 24 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Rembrandt_Harmensz._van_Rijn_063.jpg/800px-Rembrandt_Harmensz._van_Rijn_063.jpg", title: "Jacob bendiciendo a los hijos de José", artist: "Rembrandt, 1656", chapters: [37,39,40,41,42,43,44,45,46,47,48,49,50], verseHint: 3 },
    ],
    exodo: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Dor%C3%A9_-_The_Finding_of_Moses.jpg/800px-Dor%C3%A9_-_The_Finding_of_Moses.jpg", title: "Moisés salvado de las aguas", artist: "Gustave Doré, 1866", chapters: [2], verseHint: 5 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Burning_bush_%28Dor%C3%A9%29.jpg/800px-Burning_bush_%28Dor%C3%A9%29.jpg", title: "Moisés y la Zarza Ardiente", artist: "Gustave Doré, 1866", chapters: [3,4], verseHint: 2 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Dor%C3%A9_-_The_Plague_of_Darkness.jpg/800px-Dor%C3%A9_-_The_Plague_of_Darkness.jpg", title: "La Plaga de Tinieblas", artist: "Gustave Doré, 1866", chapters: [7,8,9,10,11,12], verseHint: 21 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Nicolas_Poussin_-_The_Crossing_of_the_Red_Sea_-_WGA18314.jpg/1200px-Nicolas_Poussin_-_The_Crossing_of_the_Red_Sea_-_WGA18314.jpg", title: "El Cruce del Mar Rojo", artist: "Nicolas Poussin, 1634", chapters: [14,15], verseHint: 21 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Rembrandt_Harmensz._van_Rijn_079.jpg/800px-Rembrandt_Harmensz._van_Rijn_079.jpg", title: "Moisés con las Tablas de la Ley", artist: "Rembrandt, 1659", chapters: [19,20,24,31,32,34], verseHint: 1 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Adoration_of_the_Golden_Calf_by_Filippino_Lippi.jpg/1200px-Adoration_of_the_Golden_Calf_by_Filippino_Lippi.jpg", title: "El Becerro de Oro", artist: "Filippino Lippi, c. 1500", chapters: [32], verseHint: 4 },
    ],
    levitico: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tissot_The_Scapegoat.jpg/800px-Tissot_The_Scapegoat.jpg", title: "El Chivo Expiatorio", artist: "James Tissot, c. 1900", chapters: [16], verseHint: 21 },
    ],
    numeros: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Tissot_The_Grapes_of_Canaan.jpg/800px-Tissot_The_Grapes_of_Canaan.jpg", title: "Los Espías con las Uvas de Canaán", artist: "James Tissot, c. 1900", chapters: [13], verseHint: 23 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/The_Brazen_Serpent_%28Gustave_Dor%C3%A9%29.jpg/800px-The_Brazen_Serpent_%28Gustave_Dor%C3%A9%29.jpg", title: "La Serpiente de Bronce", artist: "Gustave Doré, 1866", chapters: [21], verseHint: 9 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Rembrandt_-_Balaam%27s_Ass_-_Mus%C3%A9e_Cognacq-Jay.jpg/800px-Rembrandt_-_Balaam%27s_Ass_-_Mus%C3%A9e_Cognacq-Jay.jpg", title: "El Asna de Balaam", artist: "Rembrandt, 1626", chapters: [22], verseHint: 28 },
    ],
    deuteronomio: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Death_of_Moses_%28Dor%C3%A9%29.jpg/800px-Death_of_Moses_%28Dor%C3%A9%29.jpg", title: "Moisés contempla la Tierra Prometida", artist: "Gustave Doré, 1866", chapters: [34], verseHint: 1 },
    ],
    josue: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Dor%C3%A9_Bible_-_Joshua_crossing_Jordan.jpg/800px-Dor%C3%A9_Bible_-_Joshua_crossing_Jordan.jpg", title: "Josué cruzando el Jordán", artist: "Gustave Doré, 1866", chapters: [3,4], verseHint: 14 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dor%C3%A9_Walls_of_Jericho.jpg/800px-Dor%C3%A9_Walls_of_Jericho.jpg", title: "La Caída de Jericó", artist: "Gustave Doré, 1866", chapters: [6], verseHint: 20 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/John_Martin_-_Joshua_Commanding_the_Sun_to_Stand_Still_upon_Gibeon.jpg/1024px-John_Martin_-_Joshua_Commanding_the_Sun_to_Stand_Still_upon_Gibeon.jpg", title: "Josué detiene el Sol", artist: "John Martin, 1816", chapters: [10], verseHint: 12 },
    ],
    jueces: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Gideon_Dor%C3%A9.jpg/800px-Gideon_Dor%C3%A9.jpg", title: "La Victoria de Gedeón", artist: "Gustave Doré, 1866", chapters: [7], verseHint: 20 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Samson_and_Delilah_by_Rubens.jpg/1024px-Samson_and_Delilah_by_Rubens.jpg", title: "Sansón y Dalila", artist: "Peter Paul Rubens, 1610", chapters: [16], verseHint: 19 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Samsonslaying.jpg/800px-Samsonslaying.jpg", title: "Sansón destruye el Templo", artist: "Gustave Doré, 1866", chapters: [16], verseHint: 30 },
    ],
    rut: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Julius_Schnorr_von_Carolsfeld-_Ruth_im_Feld_des_Boaz.jpg/800px-Julius_Schnorr_von_Carolsfeld-_Ruth_im_Feld_des_Boaz.jpg", title: "Rut en el Campo de Booz", artist: "Julius Schnorr von Carolsfeld, 1828", chapters: [2,3], verseHint: 2 },
    ],
    "1samuel": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Hannah_and_Samuel.jpg/800px-Hannah_and_Samuel.jpg", title: "Ana presenta a Samuel", artist: "Frank W. W. Topham, 1898", chapters: [1,2], verseHint: 28 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Rembrandt_-_David_Playing_the_Harp_before_Saul_-_WGA19tried.jpg/800px-Rembrandt_-_David_Playing_the_Harp_before_Saul_-_WGA19tried.jpg", title: "David tocando el Arpa ante Saúl", artist: "Rembrandt, c. 1656", chapters: [16,18,19], verseHint: 23 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/David_and_Goliath_by_Caravaggio.jpg/800px-David_and_Goliath_by_Caravaggio.jpg", title: "David y Goliat", artist: "Caravaggio, c. 1610", chapters: [17], verseHint: 49 },
    ],
    "2samuel": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Rembrandt_Harmensz._van_Rijn_030.jpg/800px-Rembrandt_Harmensz._van_Rijn_030.jpg", title: "David en Oración", artist: "Rembrandt, c. 1652", chapters: [7,12], verseHint: 13 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Rembrandt_Bathsheba_at_Her_Bath_%281654%29.jpg/800px-Rembrandt_Bathsheba_at_Her_Bath_%281654%29.jpg", title: "Betsabé en el Baño", artist: "Rembrandt, 1654", chapters: [11], verseHint: 2 },
    ],
    "1reyes": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Judgment_of_Solomon_%28Raphael%29.jpg/1024px-Judgment_of_Solomon_%28Raphael%29.jpg", title: "El Juicio de Salomón", artist: "Rafael, 1518-19", chapters: [3], verseHint: 25 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Tissot_Solomon_Dedicates_the_Temple_at_Jerusalem.jpg/800px-Tissot_Solomon_Dedicates_the_Temple_at_Jerusalem.jpg", title: "Salomón dedica el Templo", artist: "James Tissot, c. 1900", chapters: [8], verseHint: 22 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/ElijahCarmelMontagne.jpg/800px-ElijahCarmelMontagne.jpg", title: "Elías en el Monte Carmelo", artist: "Albert H. Collings, 1870", chapters: [18], verseHint: 38 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Washington_Allston_-_Elijah_in_the_Desert_-_Google_Art_Project.jpg/1024px-Washington_Allston_-_Elijah_in_the_Desert_-_Google_Art_Project.jpg", title: "Elías alimentado por el Ángel", artist: "Washington Allston, 1818", chapters: [19], verseHint: 5 },
    ],
    "2reyes": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Benjamin_West_-_Elijah_taken_up_in_a_Chariot_of_Fire_-_Google_Art_Project.jpg/800px-Benjamin_West_-_Elijah_taken_up_in_a_Chariot_of_Fire_-_Google_Art_Project.jpg", title: "Elías sube al cielo en un Carro de Fuego", artist: "Benjamin West, c. 1800", chapters: [2], verseHint: 11 },
    ],
    ester: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Chasseriau_Esther.jpg/800px-Chasseriau_Esther.jpg", title: "Ester se presenta ante el Rey", artist: "Théodore Chassériau, 1841", chapters: [5], verseHint: 2 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Rembrandt_-_Ahasuerus_and_Haman_at_the_Feast_of_Esther_-_WGA19121.jpg/800px-Rembrandt_-_Ahasuerus_and_Haman_at_the_Feast_of_Esther_-_WGA19121.jpg", title: "El Banquete de Ester", artist: "Rembrandt, 1660", chapters: [7], verseHint: 6 },
    ],
    job: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/L%C3%A9on_Bonnat_-_Job.jpg/800px-L%C3%A9on_Bonnat_-_Job.jpg", title: "Job", artist: "Léon Bonnat, 1880", chapters: [1,2,38,42], verseHint: 1 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/William_Blake_-_Illustrations_of_the_Book_of_Job%2C_plate_14.jpg/800px-William_Blake_-_Illustrations_of_the_Book_of_Job%2C_plate_14.jpg", title: "Job y sus amigos", artist: "William Blake, 1825", chapters: [2,3,4,5], verseHint: 11 },
    ],
    salmos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/King_David_Playing_the_Harp_-_Gerard_van_Honthorst_%281622%29.jpg/800px-King_David_Playing_the_Harp_-_Gerard_van_Honthorst_%281622%29.jpg", title: "El Rey David Tocando el Arpa", artist: "Gerard van Honthorst, 1622", chapters: [1,23,51,100,150], verseHint: 1 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Cornelis_de_Vos_-_David_and_the_numbering_of_the_people.jpg/800px-Cornelis_de_Vos_-_David_and_the_numbering_of_the_people.jpg", title: "David orando", artist: "Cornelis de Vos, c. 1620", chapters: [51,32,38], verseHint: 1 },
    ],
    proverbios: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/King_Solomon_in_Old_Age.jpg/800px-King_Solomon_in_Old_Age.jpg", title: "El Rey Salomón en su Vejez", artist: "Gustave Doré, 1866", chapters: [1,8,31], verseHint: 1 },
    ],
    eclesiastes: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Ecclesiastes_Vanitas%2C_Pieter_Claesz.jpg/800px-Ecclesiastes_Vanitas%2C_Pieter_Claesz.jpg", title: "Vanitas - Todo es Vanidad", artist: "Pieter Claesz, 1630", chapters: [1,12], verseHint: 2 },
    ],
    cantares: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Gustave_Moreau_-_Song_of_Songs_%28Cantique_des_Cantiques%29_-_Google_Art_Project.jpg/800px-Gustave_Moreau_-_Song_of_Songs_%28Cantique_des_Cantiques%29_-_Google_Art_Project.jpg", title: "Cantar de los Cantares", artist: "Gustave Moreau, 1893", chapters: [1,2,4,8], verseHint: 1 },
    ],
    isaias: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Michelangelo%2C_profeti%2C_Isaiah_01.jpg/800px-Michelangelo%2C_profeti%2C_Isaiah_01.jpg", title: "El Profeta Isaías", artist: "Miguel Ángel, c. 1509", chapters: [1,6,40,53], verseHint: 1 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Raphael_-_Isaie_%28cropped%29.jpg/800px-Raphael_-_Isaie_%28cropped%29.jpg", title: "Isaías con el Ángel", artist: "Rafael, c. 1512", chapters: [6], verseHint: 1 },
    ],
    jeremias: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Rembrandt_Harmensz._van_Rijn_-_Jeremia_treurend_over_de_verwoesting_van_Jeruzalem_-_Google_Art_Project.jpg/800px-Rembrandt_Harmensz._van_Rijn_-_Jeremia_treurend_over_de_verwoesting_van_Jeruzalem_-_Google_Art_Project.jpg", title: "Jeremías Lamentando la Destrucción de Jerusalén", artist: "Rembrandt, 1630", chapters: [1,52], verseHint: 1 },
    ],
    lamentaciones: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Rembrandt_Harmensz._van_Rijn_-_Jeremia_treurend_over_de_verwoesting_van_Jeruzalem_-_Google_Art_Project.jpg/800px-Rembrandt_Harmensz._van_Rijn_-_Jeremia_treurend_over_de_verwoesting_van_Jeruzalem_-_Google_Art_Project.jpg", title: "Jeremías llora sobre Jerusalén", artist: "Rembrandt, 1630", chapters: [1,2,3,4,5], verseHint: 1 },
    ],
    ezequiel: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Ezekiel%27s_Vision_-_Dor%C3%A9.jpg/800px-Ezekiel%27s_Vision_-_Dor%C3%A9.jpg", title: "Visión de Ezequiel: el Valle de los Huesos Secos", artist: "Gustave Doré, 1866", chapters: [1,37], verseHint: 1 },
    ],
    daniel: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Rembrandt_-_Belshazzar%27s_Feast_-_WGA19123.jpg/1024px-Rembrandt_-_Belshazzar%27s_Feast_-_WGA19123.jpg", title: "El Festín de Belsasar", artist: "Rembrandt, c. 1636", chapters: [5], verseHint: 5 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Peter_Paul_Rubens_-_Daniel_in_the_Lions%27_Den_-_WGA20204.jpg/1024px-Peter_Paul_Rubens_-_Daniel_in_the_Lions%27_Den_-_WGA20204.jpg", title: "Daniel en el Foso de los Leones", artist: "Peter Paul Rubens, 1614", chapters: [6], verseHint: 16 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Shadrach%2C_Meshach%2C_and_Abednego_in_the_Furnace.jpg/800px-Shadrach%2C_Meshach%2C_and_Abednego_in_the_Furnace.jpg", title: "Los tres jóvenes en el Horno de Fuego", artist: "Simeon Solomon, 1863", chapters: [3], verseHint: 25 },
    ],
    jonas: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Pieter_Lastman_-_Jonah_and_the_Whale_-_Google_Art_Project.jpg/800px-Pieter_Lastman_-_Jonah_and_the_Whale_-_Google_Art_Project.jpg", title: "Jonás y la Ballena", artist: "Pieter Lastman, 1621", chapters: [1,2], verseHint: 17 },
    ],
    mateo: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Gerard_van_Honthorst_-_Adoration_of_the_Shepherds_%281622%29.jpg/1024px-Gerard_van_Honthorst_-_Adoration_of_the_Shepherds_%281622%29.jpg", title: "Adoración de los Pastores", artist: "Gerard van Honthorst, 1622", chapters: [1,2], verseHint: 11 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Giotto_-_Scrovegni_-_-18-_-_Adoration_of_the_Magi.jpg/800px-Giotto_-_Scrovegni_-_-18-_-_Adoration_of_the_Magi.jpg", title: "Adoración de los Magos", artist: "Giotto, c. 1305", chapters: [2], verseHint: 11 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Bloch-SerijBjergpraedikenen.jpg/1024px-Bloch-SerijBjergpraedikenen.jpg", title: "El Sermón de la Montaña", artist: "Carl Bloch, 1877", chapters: [5,6,7], verseHint: 1 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Carl_Bloch_-_Healing_of_the_Blind_Man.jpg/800px-Carl_Bloch_-_Healing_of_the_Blind_Man.jpg", title: "Jesús sana al Ciego", artist: "Carl Bloch, c. 1871", chapters: [9,20], verseHint: 29 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/WLANL_-_Pachango_-_De_Transfiguratie%2C_Rafae%CC%88l.jpg/800px-WLANL_-_Pachango_-_De_Transfiguratie%2C_Rafae%CC%88l.jpg", title: "La Transfiguración", artist: "Rafael, 1520", chapters: [17], verseHint: 2 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Giotto_-_Scrovegni_-_-31-_-_Kiss_of_Judas.jpg/800px-Giotto_-_Scrovegni_-_-31-_-_Kiss_of_Judas.jpg", title: "El Beso de Judas", artist: "Giotto, c. 1305", chapters: [26], verseHint: 49 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg/1200px-%C3%9Altima_Cena_-_Da_Vinci_5.jpg", title: "La Última Cena", artist: "Leonardo da Vinci, 1498", chapters: [26], verseHint: 26 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Cristo_crucificado.jpg/800px-Cristo_crucificado.jpg", title: "Cristo Crucificado", artist: "Diego Velázquez, 1632", chapters: [27], verseHint: 35 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Noel_Coypel_-_The_Resurrection_of_Christ.jpg/800px-Noel_Coypel_-_The_Resurrection_of_Christ.jpg", title: "La Resurrección de Cristo", artist: "Noël Coypel, 1700", chapters: [28], verseHint: 6 },
    ],
    marcos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Baptism-of-Christ-xx-Piero-della-Francesca.JPG/800px-Baptism-of-Christ-xx-Piero-della-Francesca.JPG", title: "El Bautismo de Cristo", artist: "Piero della Francesca, c. 1450", chapters: [1], verseHint: 9 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Christ_in_the_Storm_on_the_Lake_of_Galilee_%28Rembrandt%29.jpg/800px-Christ_in_the_Storm_on_the_Lake_of_Galilee_%28Rembrandt%29.jpg", title: "Cristo en la Tormenta", artist: "Rembrandt, 1633", chapters: [4], verseHint: 39 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Bloch-InGethsemane.jpg/800px-Bloch-InGethsemane.jpg", title: "Jesús en Getsemaní", artist: "Carl Bloch, 1879", chapters: [14], verseHint: 35 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Andrea_Mantegna_-_The_Crucifixion_-_WGA13964.jpg/1024px-Andrea_Mantegna_-_The_Crucifixion_-_WGA13964.jpg", title: "La Crucifixión", artist: "Andrea Mantegna, 1457", chapters: [15], verseHint: 33 },
    ],
    lucas: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Murillo_immbread.jpg/800px-Murillo_immread.jpg", title: "La Anunciación", artist: "Bartolomé Esteban Murillo, 1660", chapters: [1], verseHint: 28 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pompeo_Batoni_003.jpg/800px-Pompeo_Batoni_003.jpg", title: "El Retorno del Hijo Pródigo", artist: "Pompeo Batoni, 1773", chapters: [15], verseHint: 20 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Rembrandt_Harmensz._van_Rijn_-_The_Good_Samaritan_-_Louvre.jpg/800px-Rembrandt_Harmensz._van_Rijn_-_The_Good_Samaritan_-_Louvre.jpg", title: "El Buen Samaritano", artist: "Rembrandt, 1633", chapters: [10], verseHint: 34 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Emmaus_Caravaggio.jpg/800px-Emmaus_Caravaggio.jpg", title: "La Cena de Emaús", artist: "Caravaggio, 1601", chapters: [24], verseHint: 30 },
    ],
    juan: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Carl_Bloch_-_Healing_of_the_Blind_Man.jpg/800px-Carl_Bloch_-_Healing_of_the_Blind_Man.jpg", title: "Jesús sana al Ciego de Nacimiento", artist: "Carl Bloch, c. 1871", chapters: [9], verseHint: 6 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Duccio_di_Buoninsegna_-_The_Raising_of_Lazarus_-_Google_Art_Project.jpg/800px-Duccio_di_Buoninsegna_-_The_Raising_of_Lazarus_-_Google_Art_Project.jpg", title: "La Resurrección de Lázaro", artist: "Duccio di Buoninsegna, c. 1310", chapters: [11], verseHint: 43 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Giotto_-_Scrovegni_-_-26-_-_Entry_into_Jerusalem.jpg/800px-Giotto_-_Scrovegni_-_-26-_-_Entry_into_Jerusalem.jpg", title: "Entrada Triunfal en Jerusalén", artist: "Giotto, c. 1305", chapters: [12], verseHint: 13 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Christ_Washing_the_Feet_of_the_Apostles%2C_Meister_des_Hausbuches.jpg/800px-Christ_Washing_the_Feet_of_the_Apostles%2C_Meister_des_Hausbuches.jpg", title: "Jesús lava los pies de los discípulos", artist: "Maestro del Libro de la Casa, c. 1475", chapters: [13], verseHint: 5 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/The_Incredulity_of_Saint_Thomas_by_Caravaggio.jpg/800px-The_Incredulity_of_Saint_Thomas_by_Caravaggio.jpg", title: "La Incredulidad de Santo Tomás", artist: "Caravaggio, 1602", chapters: [20], verseHint: 27 },
    ],
    hechos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Giotto_-_Scrovegni_-_-38-_-_Ascension.jpg/800px-Giotto_-_Scrovegni_-_-38-_-_Ascension.jpg", title: "La Ascensión de Cristo", artist: "Giotto, c. 1305", chapters: [1], verseHint: 9 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Caravaggio_-_La_conversione_di_San_Paolo.jpg/800px-Caravaggio_-_La_conversione_di_San_Paolo.jpg", title: "La Conversión de San Pablo", artist: "Caravaggio, 1601", chapters: [9], verseHint: 4 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Raphael_-_The_Liberation_of_Saint_Peter.jpg/800px-Raphael_-_The_Liberation_of_Saint_Peter.jpg", title: "La Liberación de San Pedro", artist: "Rafael, 1514", chapters: [12], verseHint: 7 },
    ],
    romanos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Rembrandt_-_Apostle_Paul_-_WGA19120.jpg/800px-Rembrandt_-_Apostle_Paul_-_WGA19120.jpg", title: "El Apóstol Pablo", artist: "Rembrandt, c. 1657", chapters: [1,8,12], verseHint: 1 },
    ],
    "1corintios": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Rembrandt_-_Apostle_Paul_-_WGA19120.jpg/800px-Rembrandt_-_Apostle_Paul_-_WGA19120.jpg", title: "Pablo escribe a los Corintios", artist: "Rembrandt, c. 1657", chapters: [1,13,15], verseHint: 1 },
    ],
    hebreos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Melchizedek_and_Abraham%2C_Rubens.jpg/800px-Melchizedek_and_Abraham%2C_Rubens.jpg", title: "Melquisedec y Abraham", artist: "Peter Paul Rubens, c. 1625", chapters: [7], verseHint: 1 },
    ],
    apocalipsis: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_4._The_Four_Riders_-_WGA07119.jpg/800px-Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_4._The_Four_Riders_-_WGA07119.jpg", title: "Los Cuatro Jinetes del Apocalipsis", artist: "Alberto Durero, 1498", chapters: [6], verseHint: 2 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_11._St_Michael_Fighting_the_Dragon_-_WGA07126.jpg/800px-Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_11._St_Michael_Fighting_the_Dragon_-_WGA07126.jpg", title: "San Miguel luchando contra el Dragón", artist: "Alberto Durero, 1498", chapters: [12], verseHint: 7 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_1._St_John%27s_Vision_of_Christ_and_the_Seven_Candlesticks_-_WGA07117.jpg/800px-Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_1._St_John%27s_Vision_of_Christ_and_the_Seven_Candlesticks_-_WGA07117.jpg", title: "Cristo entre los Siete Candeleros", artist: "Alberto Durero, 1498", chapters: [1], verseHint: 13 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_14._The_New_Jerusalem.jpg/800px-Albrecht_D%C3%BCrer_-_The_Revelation_of_St_John_-_14._The_New_Jerusalem.jpg", title: "La Nueva Jerusalén", artist: "Alberto Durero, 1498", chapters: [21,22], verseHint: 2 },
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
