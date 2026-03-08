// ============================================
// BIBLE IMAGES DATA - Ilustraciones Bíblicas
// Wikimedia Commons (Dominio Público)
// URLs verificadas 2026-03-08
// ============================================

const BIBLE_IMAGES = {
    genesis: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg/960px-Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg", title: "La Creación de Adán", artist: "Miguel Ángel, c. 1512", chapters: [1,2], verseHint: 27 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Michelangelo%2C_Fall_and_Expulsion_from_Garden_of_Eden_00.jpg/960px-Michelangelo%2C_Fall_and_Expulsion_from_Garden_of_Eden_00.jpg", title: "Caída y Expulsión del Paraíso", artist: "Miguel Ángel, c. 1510", chapters: [3], verseHint: 23 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/2/23/Noahs_Ark.jpg", title: "El Arca de Noé", artist: "Edward Hicks, 1846", chapters: [6,7,8,9], verseHint: 14 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg/960px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg", title: "La Torre de Babel", artist: "Pieter Bruegel el Viejo, 1563", chapters: [11], verseHint: 4 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Frans_Francken_II_%281581-1642%29_%28studio_of%29_-_Abraham_and_Sarah_Visited_by_Three_Angels_-_1401272_-_National_Trust.jpg/960px-Frans_Francken_II_%281581-1642%29_%28studio_of%29_-_Abraham_and_Sarah_Visited_by_Three_Angels_-_1401272_-_National_Trust.jpg", title: "Abraham visitado por los Tres Ángeles", artist: "Frans Francken II, c. 1620", chapters: [12,13,14,15,16,17,18], verseHint: 2 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg/960px-Sacrifice_of_Isaac-Caravaggio_%28Uffizi%29.jpg", title: "El Sacrificio de Isaac", artist: "Caravaggio, 1603", chapters: [22], verseHint: 10 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/%C3%89glise_Saint-Sulpice_de_Paris_%C3%89glise_La_Lutte_de_Jacob_avec_l%27Ange.jpg/960px-%C3%89glise_Saint-Sulpice_de_Paris_%C3%89glise_La_Lutte_de_Jacob_avec_l%27Ange.jpg", title: "Jacob luchando con el Ángel", artist: "Eugène Delacroix, 1861", chapters: [32], verseHint: 24 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rembrandt_-_Jacob_Blessing_the_Children_of_Joseph_-_WGA19117.jpg/960px-Rembrandt_-_Jacob_Blessing_the_Children_of_Joseph_-_WGA19117.jpg", title: "Jacob bendiciendo a los hijos de José", artist: "Rembrandt, 1656", chapters: [48,49,50], verseHint: 14 },
    ],
    exodo: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/1904_Lawrence_Alma-Tadema_-_The_Finding_of_Moses.jpg/960px-1904_Lawrence_Alma-Tadema_-_The_Finding_of_Moses.jpg", title: "Moisés salvado de las aguas", artist: "Lawrence Alma-Tadema, 1904", chapters: [2], verseHint: 5 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Bourdon%2C_S%C3%A9bastien_-_Burning_bush.jpg/960px-Bourdon%2C_S%C3%A9bastien_-_Burning_bush.jpg", title: "Moisés y la Zarza Ardiente", artist: "Sébastien Bourdon, c. 1644", chapters: [3,4], verseHint: 2 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Martin%2C_John_-_The_Seventh_Plague_-_1823.jpg/960px-Martin%2C_John_-_The_Seventh_Plague_-_1823.jpg", title: "La Séptima Plaga de Egipto", artist: "John Martin, 1823", chapters: [7,8,9,10,11,12], verseHint: 21 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Hans_Jordaens_III_-_The_Crossing_of_the_Red_Sea_2013_AMS_03028_0099_111353.jpg/960px-Hans_Jordaens_III_-_The_Crossing_of_the_Red_Sea_2013_AMS_03028_0099_111353.jpg", title: "El Cruce del Mar Rojo", artist: "Hans Jordaens III, c. 1620", chapters: [14,15], verseHint: 21 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg/960px-Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg", title: "Moisés con los Diez Mandamientos", artist: "Rembrandt, 1659", chapters: [19,20,24,31,34], verseHint: 1 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/The_Adoration_of_the_Golden_Calf_%E2%80%93_Nicolas_Poussin.jpg/960px-The_Adoration_of_the_Golden_Calf_%E2%80%93_Nicolas_Poussin.jpg", title: "La Adoración del Becerro de Oro", artist: "Nicolas Poussin, c. 1634", chapters: [32], verseHint: 4 },
    ],
    levitico: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/William_Holman_Hunt_-_The_Scapegoat.jpg/960px-William_Holman_Hunt_-_The_Scapegoat.jpg", title: "El Chivo Expiatorio", artist: "William Holman Hunt, 1856", chapters: [16], verseHint: 21 },
    ],
    numeros: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Moses_and_the_Brazen_Serpent_-_Jacopo_Amigoni.jpg/960px-Moses_and_the_Brazen_Serpent_-_Jacopo_Amigoni.jpg", title: "La Serpiente de Bronce", artist: "Jacopo Amigoni, c. 1740", chapters: [21], verseHint: 9 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Balaam_Rembrandt_01.JPG/960px-Balaam_Rembrandt_01.JPG", title: "El Asna de Balaam", artist: "Rembrandt, 1626", chapters: [22], verseHint: 28 },
    ],
    deuteronomio: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Moses_Viewing_the_Promised_Land_Frederic_Edwin_Church.jpg/960px-Moses_Viewing_the_Promised_Land_Frederic_Edwin_Church.jpg", title: "Moisés contempla la Tierra Prometida", artist: "Frederic Edwin Church, 1846", chapters: [34], verseHint: 1 },
    ],
    josue: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/0/02/The_walls_of_Jericho_falling_down_%E2%80%94_Dor%C3%A9_Bible_illustration_%28Cassell%2C_c.1870%29.jpg", title: "La Caída de Jericó", artist: "Gustave Doré, c. 1870", chapters: [6], verseHint: 20 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Joshua_Commanding_the_Sun_to_Stand_Still_upon_Gibeon_%281816%29_John_Martin_-_NGA_2004.64.1.jpg/960px-Joshua_Commanding_the_Sun_to_Stand_Still_upon_Gibeon_%281816%29_John_Martin_-_NGA_2004.64.1.jpg", title: "Josué detiene el Sol", artist: "John Martin, 1816", chapters: [10], verseHint: 12 },
    ],
    jueces: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Maarten_van_Heemskerck_024.jpg", title: "Gedeón y sus 300 hombres", artist: "Maarten van Heemskerck, c. 1550", chapters: [7], verseHint: 20 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Samson_and_Delilah_by_Rubens.jpg/960px-Samson_and_Delilah_by_Rubens.jpg", title: "Sansón y Dalila", artist: "Peter Paul Rubens, 1610", chapters: [16], verseHint: 19 },
    ],
    rut: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Gebhard_Fugel_Weizenernte_mit_Ruth.jpg", title: "Rut en el Campo de Booz", artist: "Gebhard Fugel, c. 1920", chapters: [2,3], verseHint: 2 },
    ],
    "1samuel": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Saul_and_David_rembrandt.jpg/960px-Saul_and_David_rembrandt.jpg", title: "David tocando el Arpa ante Saúl", artist: "Rembrandt, c. 1656", chapters: [16,18,19], verseHint: 23 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/David_with_the_Head_of_Goliath-Caravaggio_%281610%29.jpg/960px-David_with_the_Head_of_Goliath-Caravaggio_%281610%29.jpg", title: "David y Goliat", artist: "Caravaggio, c. 1610", chapters: [17], verseHint: 49 },
    ],
    "2samuel": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Rembrandt_-_Bathsheba_at_Her_Bath_-_WGA19090.jpg/960px-Rembrandt_-_Bathsheba_at_Her_Bath_-_WGA19090.jpg", title: "Betsabé en el Baño", artist: "Rembrandt, 1654", chapters: [11], verseHint: 2 },
    ],
    "1reyes": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Fresco_of_judgment_of_Solomon_in_Palazzo_Farnese_%28Caprarola%29.jpg/960px-Fresco_of_judgment_of_Solomon_in_Palazzo_Farnese_%28Caprarola%29.jpg", title: "El Juicio de Salomón", artist: "Palazzo Farnese, c. 1560", chapters: [3], verseHint: 25 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/7/71/Elijah_challenging_the_prophets_of_Baal.jpg", title: "Elías desafía a los profetas de Baal", artist: "Ilustración bíblica, c. 1870", chapters: [18], verseHint: 38 },
    ],
    "2reyes": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/6/64/Poulakis_Theodoros-The_ascension_of_prophen_Elijah_and_scenes_from_his_life.jpg", title: "Elías sube al cielo en Carro de Fuego", artist: "Theodoros Poulakis, c. 1660", chapters: [2], verseHint: 11 },
    ],
    ester: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Esther_before_Ahasuerus%2C_Franciszek_Smuglewicz%2C_1778.jpg/960px-Esther_before_Ahasuerus%2C_Franciszek_Smuglewicz%2C_1778.jpg", title: "Ester ante el Rey Asuero", artist: "Franciszek Smuglewicz, 1778", chapters: [5,7], verseHint: 2 },
    ],
    job: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/L%C3%A9on_Bonnat_-_Job.jpg/960px-L%C3%A9on_Bonnat_-_Job.jpg", title: "Job", artist: "Léon Bonnat, 1880", chapters: [1,2,38,42], verseHint: 1 },
    ],
    salmos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gerard_van_Honthorst_-_King_David_Playing_the_Harp_-_Google_Art_Project.jpg/960px-Gerard_van_Honthorst_-_King_David_Playing_the_Harp_-_Google_Art_Project.jpg", title: "El Rey David Tocando el Arpa", artist: "Gerard van Honthorst, 1622", chapters: [1,23,51,100,150], verseHint: 1 },
    ],
    isaias: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/%27Isaiah_Sistine_Chapel_ceiling%27_by_Michelangelo_JBU36FXD.jpg/960px-%27Isaiah_Sistine_Chapel_ceiling%27_by_Michelangelo_JBU36FXD.jpg", title: "El Profeta Isaías", artist: "Miguel Ángel, c. 1509", chapters: [1,6,40,53], verseHint: 1 },
    ],
    jeremias: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rembrandt_Harmensz._van_Rijn_-_Jeremia_treurend_over_de_verwoesting_van_Jeruzalem_-_Google_Art_Project.jpg/960px-Rembrandt_Harmensz._van_Rijn_-_Jeremia_treurend_over_de_verwoesting_van_Jeruzalem_-_Google_Art_Project.jpg", title: "Jeremías Lamentando la Destrucción de Jerusalén", artist: "Rembrandt, 1630", chapters: [1,52], verseHint: 1 },
    ],
    lamentaciones: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rembrandt_Harmensz._van_Rijn_-_Jeremia_treurend_over_de_verwoesting_van_Jeruzalem_-_Google_Art_Project.jpg/960px-Rembrandt_Harmensz._van_Rijn_-_Jeremia_treurend_over_de_verwoesting_van_Jeruzalem_-_Google_Art_Project.jpg", title: "Jeremías llora sobre Jerusalén", artist: "Rembrandt, 1630", chapters: [1,2,3,4,5], verseHint: 1 },
    ],
    ezequiel: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Ezekiel%27s_vision_of_dry_bones.jpg", title: "Visión del Valle de los Huesos Secos", artist: "Ilustración bíblica, c. 1890", chapters: [1,37], verseHint: 1 },
    ],
    daniel: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Rembrandt-Belsazar.jpg/960px-Rembrandt-Belsazar.jpg", title: "El Festín de Belsasar", artist: "Rembrandt, c. 1636", chapters: [5], verseHint: 5 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Sir_Peter_Paul_Rubens_-_Daniel_in_the_Lions%27_Den_-_Google_Art_Project.jpg/960px-Sir_Peter_Paul_Rubens_-_Daniel_in_the_Lions%27_Den_-_Google_Art_Project.jpg", title: "Daniel en el Foso de los Leones", artist: "Peter Paul Rubens, 1614", chapters: [6], verseHint: 16 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/4/47/Joseph_Mallord_William_Turner_%281775-1851%29_-_Shadrach%2C_Meshach_and_Abednego_in_the_Burning_Fiery_Furnace_-_N00517_-_National_Gallery.jpg", title: "Los tres jóvenes en el Horno de Fuego", artist: "J.M.W. Turner, c. 1832", chapters: [3], verseHint: 25 },
    ],
    jonas: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Pieter_Lastman_-_Jonah_and_the_Whale_-_Google_Art_Project.jpg/960px-Pieter_Lastman_-_Jonah_and_the_Whale_-_Google_Art_Project.jpg", title: "Jonás y la Ballena", artist: "Pieter Lastman, 1621", chapters: [1,2], verseHint: 17 },
    ],
    mateo: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Gerard_van_Honthorst_-_Adoration_of_the_Shepherds_%281622%29.jpg/960px-Gerard_van_Honthorst_-_Adoration_of_the_Shepherds_%281622%29.jpg", title: "Adoración de los Pastores", artist: "Gerard van Honthorst, 1622", chapters: [1,2], verseHint: 11 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Giotto_-_Scrovegni_-_-18-_-_Adoration_of_the_Magi.jpg", title: "Adoración de los Magos", artist: "Giotto, c. 1305", chapters: [2], verseHint: 11 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Bloch-SermonOnTheMount.jpg/960px-Bloch-SermonOnTheMount.jpg", title: "El Sermón de la Montaña", artist: "Carl Bloch, 1877", chapters: [5,6,7], verseHint: 1 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Healing_of_the_Blind_Man_by_Jesus_Christ.jpg/960px-Healing_of_the_Blind_Man_by_Jesus_Christ.jpg", title: "Jesús sana al Ciego", artist: "Carl Bloch, c. 1871", chapters: [9,20], verseHint: 29 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Transfiguration_Raphael.jpg/960px-Transfiguration_Raphael.jpg", title: "La Transfiguración", artist: "Rafael, 1520", chapters: [17], verseHint: 2 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Giotto_-_Scrovegni_-_-31-_-_Kiss_of_Judas.jpg/960px-Giotto_-_Scrovegni_-_-31-_-_Kiss_of_Judas.jpg", title: "El Beso de Judas", artist: "Giotto, c. 1305", chapters: [26], verseHint: 49 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Leonardo_da_Vinci_%281452-1519%29_-_The_Last_Supper_%281495-1498%29.jpg/960px-Leonardo_da_Vinci_%281452-1519%29_-_The_Last_Supper_%281495-1498%29.jpg", title: "La Última Cena", artist: "Leonardo da Vinci, 1498", chapters: [26], verseHint: 26 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristo_crucificado.jpg/960px-Cristo_crucificado.jpg", title: "Cristo Crucificado", artist: "Diego Velázquez, 1632", chapters: [27], verseHint: 35 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Piero_della_Francesca_The_Resurrection_detail_VlRan.jpg/960px-Piero_della_Francesca_The_Resurrection_detail_VlRan.jpg", title: "La Resurrección de Cristo", artist: "Piero della Francesca, c. 1460", chapters: [28], verseHint: 6 },
    ],
    marcos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Piero%2C_battesimo_di_cristo_04.jpg/960px-Piero%2C_battesimo_di_cristo_04.jpg", title: "El Bautismo de Cristo", artist: "Piero della Francesca, c. 1450", chapters: [1], verseHint: 9 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Rembrandt_Christ_in_the_Storm_on_the_Lake_of_Galilee.jpg/960px-Rembrandt_Christ_in_the_Storm_on_the_Lake_of_Galilee.jpg", title: "Cristo en la Tormenta", artist: "Rembrandt, 1633", chapters: [4], verseHint: 39 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Jacob_Jordaens_-_The_Agony_of_Christ_in_the_Garden_of_Gethsemane.jpg/960px-Jacob_Jordaens_-_The_Agony_of_Christ_in_the_Garden_of_Gethsemane.jpg", title: "La Agonía en Getsemaní", artist: "Jacob Jordaens, c. 1650", chapters: [14], verseHint: 35 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Mantegna%2C_Andrea_-_crucifixion_-_Louvre_from_Predella_San_Zeno_Altarpiece_Verona.jpg/960px-Mantegna%2C_Andrea_-_crucifixion_-_Louvre_from_Predella_San_Zeno_Altarpiece_Verona.jpg", title: "La Crucifixión", artist: "Andrea Mantegna, 1457", chapters: [15], verseHint: 33 },
    ],
    lucas: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Angelico_Annunciation_%28Cortona%29.jpg/960px-Angelico_Annunciation_%28Cortona%29.jpg", title: "La Anunciación", artist: "Fra Angélico, c. 1433", chapters: [1], verseHint: 28 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Landscape_with_the_Good_Samaritan_-_Rembrandt.jpg/960px-Landscape_with_the_Good_Samaritan_-_Rembrandt.jpg", title: "El Buen Samaritano", artist: "Rembrandt, 1638", chapters: [10], verseHint: 34 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg/960px-Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg", title: "El Retorno del Hijo Pródigo", artist: "Rembrandt, c. 1668", chapters: [15], verseHint: 20 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Supper_at_Emmaus-Caravaggio_%281601%29.jpg/960px-Supper_at_Emmaus-Caravaggio_%281601%29.jpg", title: "La Cena de Emaús", artist: "Caravaggio, 1601", chapters: [24], verseHint: 30 },
    ],
    juan: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Rembrandt_Harmensz._van_Rijn_-_The_Raising_of_Lazarus_-_Google_Art_Project.jpg/960px-Rembrandt_Harmensz._van_Rijn_-_The_Raising_of_Lazarus_-_Google_Art_Project.jpg", title: "La Resurrección de Lázaro", artist: "Rembrandt, c. 1630", chapters: [11], verseHint: 43 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Giotto_di_Bondone_-_No._26_Scenes_from_the_Life_of_Christ_-_10._Entry_into_Jerusalem_-_WGA09206.jpg/960px-Giotto_di_Bondone_-_No._26_Scenes_from_the_Life_of_Christ_-_10._Entry_into_Jerusalem_-_WGA09206.jpg", title: "Entrada Triunfal en Jerusalén", artist: "Giotto, c. 1305", chapters: [12], verseHint: 13 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/El_Lavatorio_%28Tintoretto%29.jpg/960px-El_Lavatorio_%28Tintoretto%29.jpg", title: "Jesús lava los pies de los discípulos", artist: "Tintoretto, 1549", chapters: [13], verseHint: 5 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/The_Incredulity_of_Saint_Thomas-Caravaggio_%281601-2%29.jpg/960px-The_Incredulity_of_Saint_Thomas-Caravaggio_%281601-2%29.jpg", title: "La Incredulidad de Santo Tomás", artist: "Caravaggio, 1602", chapters: [20], verseHint: 27 },
    ],
    hechos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Giotto_di_Bondone_-_No._38_Scenes_from_the_Life_of_Christ_-_22._Ascension_-_WGA09226.jpg/960px-Giotto_di_Bondone_-_No._38_Scenes_from_the_Life_of_Christ_-_22._Ascension_-_WGA09226.jpg", title: "La Ascensión de Cristo", artist: "Giotto, c. 1305", chapters: [1], verseHint: 9 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Conversion_on_the_Way_to_Damascus-Caravaggio_%28c.1600-1%29.jpg/960px-Conversion_on_the_Way_to_Damascus-Caravaggio_%28c.1600-1%29.jpg", title: "La Conversión de San Pablo", artist: "Caravaggio, 1601", chapters: [9], verseHint: 4 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Raphael_-_Deliverance_of_Saint_Peter.jpg/960px-Raphael_-_Deliverance_of_Saint_Peter.jpg", title: "La Liberación de San Pedro", artist: "Rafael, 1514", chapters: [12], verseHint: 7 },
    ],
    romanos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Saint_Paul%2C_Rembrandt_van_Rijn_%28and_Workshop%3F%29%2C_c._1657.jpg/960px-Saint_Paul%2C_Rembrandt_van_Rijn_%28and_Workshop%3F%29%2C_c._1657.jpg", title: "El Apóstol Pablo", artist: "Rembrandt, c. 1657", chapters: [1,8,12], verseHint: 1 },
    ],
    "1corintios": [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Saint_Paul%2C_Rembrandt_van_Rijn_%28and_Workshop%3F%29%2C_c._1657.jpg/960px-Saint_Paul%2C_Rembrandt_van_Rijn_%28and_Workshop%3F%29%2C_c._1657.jpg", title: "Pablo escribe a los Corintios", artist: "Rembrandt, c. 1657", chapters: [1,13,15], verseHint: 1 },
    ],
    hebreos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Gerbrand_van_den_Eeckhout_-_De_ontmoeting_van_Abram_%28Abraham%29_en_Melchisedek%2C_de_hogepriester-koning_van_Salem_%28Genesis_14-18-24%29_-_69.44_-_Museum_of_Fine_Arts%2C_Budapest.jpg/960px-thumbnail.jpg", title: "Melquisedec y Abraham", artist: "Gerbrand van den Eeckhout, c. 1665", chapters: [7], verseHint: 1 },
    ],
    apocalipsis: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Durer_Revelation_Four_Riders.jpg/960px-Durer_Revelation_Four_Riders.jpg", title: "Los Cuatro Jinetes del Apocalipsis", artist: "Alberto Durero, 1498", chapters: [6], verseHint: 2 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Albrecht_D%C3%BCrer%2C_Saint_Michael_Fighting_the_Dragon%2C_probably_c._1496-1498%2C_NGA_58148.jpg/960px-Albrecht_D%C3%BCrer%2C_Saint_Michael_Fighting_the_Dragon%2C_probably_c._1496-1498%2C_NGA_58148.jpg", title: "San Miguel luchando contra el Dragón", artist: "Alberto Durero, c. 1498", chapters: [12], verseHint: 7 },
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/The_Apocalypse_16_The_angel_showing_Saint_John_the_New_Jerusalem_%28The_angel_with_the_key_of_the_bottomless_pit%29_PK-P-127.241.jpg/960px-The_Apocalypse_16_The_angel_showing_Saint_John_the_New_Jerusalem_%28The_angel_with_the_key_of_the_bottomless_pit%29_PK-P-127.241.jpg", title: "La Nueva Jerusalén", artist: "Alberto Durero, 1498", chapters: [21,22], verseHint: 2 },
    ],

    // Generic fallbacks
    _generic: {
        at: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/%27Isaiah_Sistine_Chapel_ceiling%27_by_Michelangelo_JBU36FXD.jpg/960px-%27Isaiah_Sistine_Chapel_ceiling%27_by_Michelangelo_JBU36FXD.jpg", title: "Profeta del Antiguo Testamento", artist: "Miguel Ángel, c. 1509" },
        nt: { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Saint_Paul%2C_Rembrandt_van_Rijn_%28and_Workshop%3F%29%2C_c._1657.jpg/960px-Saint_Paul%2C_Rembrandt_van_Rijn_%28and_Workshop%3F%29%2C_c._1657.jpg", title: "Apóstol del Nuevo Testamento", artist: "Rembrandt, c. 1657" }
    }
};

if (typeof window !== 'undefined') {
    window.BIBLE_IMAGES = BIBLE_IMAGES;
}
