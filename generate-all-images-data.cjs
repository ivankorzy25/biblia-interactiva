// =============================================================
// COMPREHENSIVE IMAGE DATA GENERATOR
// Combines ALL sources: Doré + Schnorr + Tissot + Hole + Existing + Maps
// Generates biblia-images-data.js with local paths + remote fallbacks
// =============================================================
const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const ART_DIR = path.join(BASE_DIR, 'img', 'art');
const MAPS_DIR = path.join(BASE_DIR, 'img', 'maps');

// Helper: check if local file exists and is valid
function hasLocal(relPath) {
  const full = path.join(BASE_DIR, relPath);
  return fs.existsSync(full) && fs.statSync(full).size > 3000;
}

// ============================================================
// 1. EXISTING PAINTINGS (already downloaded in img/art/)
// ============================================================
const EXISTING = [
  { id: "existing_genesis_2", local: "img/art/genesis_2.jpg", book: "genesis", chapters: [6,7,8,9], verseHint: 14, title: "El Arca de Noé", artist: "Edward Hicks, 1846" },
  { id: "existing_genesis_3", local: "img/art/genesis_3.jpg", book: "genesis", chapters: [11], verseHint: 4, title: "La Torre de Babel", artist: "Pieter Bruegel el Viejo, 1563" },
  { id: "existing_exodo_0", local: "img/art/exodo_0.jpg", book: "exodo", chapters: [2], verseHint: 5, title: "Moisés salvado de las aguas", artist: "Lawrence Alma-Tadema, 1904" },
  { id: "existing_exodo_2", local: "img/art/exodo_2.jpg", book: "exodo", chapters: [7,8,9,10,11,12], verseHint: 21, title: "La Séptima Plaga de Egipto", artist: "John Martin, 1823" },
  { id: "existing_exodo_3", local: "img/art/exodo_3.jpg", book: "exodo", chapters: [14,15], verseHint: 21, title: "El Cruce del Mar Rojo", artist: "Hans Jordaens III, c. 1620" },
  { id: "existing_exodo_5", local: "img/art/exodo_5.jpg", book: "exodo", chapters: [32], verseHint: 4, title: "La Adoración del Becerro de Oro", artist: "Nicolas Poussin, c. 1634" },
  { id: "existing_levitico_0", local: "img/art/levitico_0.jpg", book: "levitico", chapters: [16], verseHint: 21, title: "El Chivo Expiatorio", artist: "William Holman Hunt, 1856" },
  { id: "existing_numeros_1", local: "img/art/numeros_1.jpg", book: "numeros", chapters: [22], verseHint: 28, title: "El Asna de Balaam", artist: "Rembrandt, 1626" },
  { id: "existing_deuteronomio_0", local: "img/art/deuteronomio_0.jpg", book: "deuteronomio", chapters: [34], verseHint: 1, title: "Moisés contempla la Tierra Prometida", artist: "Frederic Edwin Church, 1846" },
  { id: "existing_josue_0", local: "img/art/josue_0.jpg", book: "josue", chapters: [6], verseHint: 20, title: "La Caída de Jericó", artist: "Gustave Doré, c. 1870" },
  { id: "existing_josue_1", local: "img/art/josue_1.jpg", book: "josue", chapters: [10], verseHint: 12, title: "Josué detiene el Sol", artist: "John Martin, 1816" },
  { id: "existing_jueces_0", local: "img/art/jueces_0.jpg", book: "jueces", chapters: [7], verseHint: 20, title: "Gedeón y sus 300 hombres", artist: "Maarten van Heemskerck, c. 1550" },
  { id: "existing_jueces_1", local: "img/art/jueces_1.jpg", book: "jueces", chapters: [16], verseHint: 19, title: "Sansón y Dalila", artist: "Peter Paul Rubens, 1610" },
  { id: "existing_rut_0", local: "img/art/rut_0.jpg", book: "rut", chapters: [2,3], verseHint: 2, title: "Rut en el Campo de Booz", artist: "Gebhard Fugel, c. 1920" },
  { id: "existing_1samuel_0", local: "img/art/1samuel_0.jpg", book: "1samuel", chapters: [16,18,19], verseHint: 23, title: "David tocando el Arpa ante Saúl", artist: "Rembrandt, c. 1656" },
  { id: "existing_1samuel_1", local: "img/art/1samuel_1.jpg", book: "1samuel", chapters: [17], verseHint: 49, title: "David y Goliat", artist: "Caravaggio, c. 1610" },
  { id: "existing_2samuel_0", local: "img/art/2samuel_0.jpg", book: "2samuel", chapters: [11], verseHint: 2, title: "Betsabé en el Baño", artist: "Rembrandt, 1654" },
  { id: "existing_1reyes_0", local: "img/art/1reyes_0.jpg", book: "1reyes", chapters: [3], verseHint: 25, title: "El Juicio de Salomón", artist: "Palazzo Farnese, c. 1560" },
  { id: "existing_1reyes_1", local: "img/art/1reyes_1.jpg", book: "1reyes", chapters: [18], verseHint: 38, title: "Elías desafía a los profetas de Baal", artist: "Ilustración bíblica, c. 1870" },
  { id: "existing_ester_0", local: "img/art/ester_0.jpg", book: "ester", chapters: [5,7], verseHint: 2, title: "Ester ante el Rey Asuero", artist: "Franciszek Smuglewicz, 1778" },
  { id: "existing_job_0", local: "img/art/job_0.jpg", book: "job", chapters: [1,2,38,42], verseHint: 1, title: "Job", artist: "Léon Bonnat, 1880" },
  { id: "existing_salmos_0", local: "img/art/salmos_0.jpg", book: "salmos", chapters: [1,23,51,100,150], verseHint: 1, title: "El Rey David Tocando el Arpa", artist: "Gerard van Honthorst, 1622" },
  { id: "existing_jeremias_0", local: "img/art/jeremias_0.jpg", book: "jeremias", chapters: [1,52], verseHint: 1, title: "Jeremías Lamentando", artist: "Rembrandt, 1630" },
  { id: "existing_lamentaciones_0", local: "img/art/lamentaciones_0.jpg", book: "lamentaciones", chapters: [1,2,3,4,5], verseHint: 1, title: "Jeremías llora sobre Jerusalén", artist: "Rembrandt, 1630" },
  { id: "existing_daniel_0", local: "img/art/daniel_0.jpg", book: "daniel", chapters: [5], verseHint: 5, title: "El Festín de Belsasar", artist: "Rembrandt, c. 1636" },
  { id: "existing_daniel_1", local: "img/art/daniel_1.jpg", book: "daniel", chapters: [6], verseHint: 16, title: "Daniel en el Foso de los Leones", artist: "Peter Paul Rubens, 1614" },
  { id: "existing_daniel_2", local: "img/art/daniel_2.jpg", book: "daniel", chapters: [3], verseHint: 25, title: "Los tres jóvenes en el Horno de Fuego", artist: "J.M.W. Turner, c. 1832" },
  { id: "existing_jonas_0", local: "img/art/jonas_0.jpg", book: "jonas", chapters: [1,2], verseHint: 17, title: "Jonás y la Ballena", artist: "Pieter Lastman, 1621" },
  { id: "existing_marcos_1", local: "img/art/marcos_1.jpg", book: "marcos", chapters: [4], verseHint: 39, title: "La Tormenta en el Mar de Galilea", artist: "Rembrandt, 1633" },
  { id: "existing_lucas_1", local: "img/art/lucas_1.jpg", book: "lucas", chapters: [10], verseHint: 34, title: "El Buen Samaritano", artist: "Rembrandt, 1638" },
  { id: "existing_lucas_2", local: "img/art/lucas_2.jpg", book: "lucas", chapters: [15], verseHint: 20, title: "El Retorno del Hijo Pródigo", artist: "Rembrandt, c. 1668" },
  { id: "existing_lucas_3", local: "img/art/lucas_3.jpg", book: "lucas", chapters: [24], verseHint: 30, title: "La Cena de Emaús", artist: "Caravaggio, 1601" },
  { id: "existing_hechos_1", local: "img/art/hechos_1.jpg", book: "hechos", chapters: [9], verseHint: 4, title: "La Conversión de Pablo", artist: "Caravaggio, 1601" },
];

// ============================================================
// 2. GUSTAVE DORÉ - OT (112 engravings)
// ============================================================
const DORE_BASE = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
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
  "028": "6/63/028.Joseph_Makes_Himself_Known_to_His_Brothers.jpg/960px-028.Joseph_Makes_Himself_Known_to_His_Brothers.jpg",
  "029": "e/ef/029.Jacob_Goes_to_Egypt.jpg/960px-029.Jacob_Goes_to_Egypt.jpg",
  "030": "d/d1/030.The_Child_Moses_on_the_Nile.jpg/960px-030.The_Child_Moses_on_the_Nile.jpg",
  "031": "8/88/031.The_Finding_of_Moses.jpg/960px-031.The_Finding_of_Moses.jpg",
  "032": "7/7d/032.Moses_and_Aaron_before_Pharaoh.jpg/960px-032.Moses_and_Aaron_before_Pharaoh.jpg",
  "033": "8/83/033.The_Fifth_Plague._Livestock_Disease.jpg/960px-033.The_Fifth_Plague._Livestock_Disease.jpg",
  "034": "5/5f/034.The_Ninth_Plague._Darkness.jpg/960px-034.The_Ninth_Plague._Darkness.jpg",
  "035": "d/d0/035.The_Firstborn_of_Egypt_Are_Slain.jpg/960px-035.The_Firstborn_of_Egypt_Are_Slain.jpg",
  "036": "a/ae/036.The_Egyptians_Ask_Moses_to_Depart.jpg/960px-036.The_Egyptians_Ask_Moses_to_Depart.jpg",
  "037": "f/f7/037.The_Egyptians_Are_Drowned_in_the_Sea.jpg/960px-037.The_Egyptians_Are_Drowned_in_the_Sea.jpg",
  "041": "5/5e/041.Moses_Strikes_the_Rock_at_Horeb.jpg/960px-041.Moses_Strikes_the_Rock_at_Horeb.jpg",
  "041A": "4/4a/041A.Moses_Breaks_the_Tables_of_the_Law.jpg/960px-041A.Moses_Breaks_the_Tables_of_the_Law.jpg",
  "040": "4/4d/040.The_Death_of_Korah%2C_Dathan%2C_and_Abiram.jpg/960px-040.The_Death_of_Korah%2C_Dathan%2C_and_Abiram.jpg",
  "041B": "0/06/041B.The_Spies_Return_from_the_Promised_Land.jpg/960px-041B.The_Spies_Return_from_the_Promised_Land.jpg",
  "044": "b/b9/044.The_Israelites_Cross_the_Jordan_River.jpg/960px-044.The_Israelites_Cross_the_Jordan_River.jpg",
  "046": "b/bc/046.The_Walls_of_Jericho_Fall_Down.jpg/960px-046.The_Walls_of_Jericho_Fall_Down.jpg",
  "047": "2/2e/047.Joshua_Spares_Rahab.jpg/960px-047.Joshua_Spares_Rahab.jpg",
  "048": "a/ac/048.Achan_Is_Stoned.jpg/960px-048.Achan_Is_Stoned.jpg",
  "049": "b/b2/049.Joshua_Burns_the_City_of_Ai.jpg/960px-049.Joshua_Burns_the_City_of_Ai.jpg",
  "050": "d/df/050.The_Army_of_the_Amorites_Is_Destroyed.jpg/960px-050.The_Army_of_the_Amorites_Is_Destroyed.jpg",
  "051": "8/83/051.Joshua_Commands_the_Sun_to_Stand_Still.jpg/960px-051.Joshua_Commands_the_Sun_to_Stand_Still.jpg",
  "052": "5/51/052.Jael_Kills_Sisera.jpg/960px-052.Jael_Kills_Sisera.jpg",
  "053": "9/9a/053.Deborah_Praises_Jael.jpg/960px-053.Deborah_Praises_Jael.jpg",
  "054": "9/90/054.Gideon_Chooses_300_Soldiers.jpg/960px-054.Gideon_Chooses_300_Soldiers.jpg",
  "055": "1/1a/055.The_Midianites_Are_Defeated.jpg/960px-055.The_Midianites_Are_Defeated.jpg",
  "056": "1/10/056.The_Death_of_Gideon%27s_Sons.jpg/960px-056.The_Death_of_Gideon%27s_Sons.jpg",
  "057": "2/2c/057.The_Death_of_Abimelech.jpg/960px-057.The_Death_of_Abimelech.jpg",
  "058": "5/54/058.Jephthah%27s_Daughter_Comes_to_Meet_Her_Father.jpg/960px-058.Jephthah%27s_Daughter_Comes_to_Meet_Her_Father.jpg",
  "059": "9/94/059.The_Women_Mourn_with_Jephthah%27s_Daughter.jpg/960px-059.The_Women_Mourn_with_Jephthah%27s_Daughter.jpg",
  "060": "5/5c/060.Samson_Kills_a_Lion.jpg/960px-060.Samson_Kills_a_Lion.jpg",
  "061": "4/43/061.Samson_Destroys_the_Philistines_with_a_Jawbone.jpg/960px-061.Samson_Destroys_the_Philistines_with_a_Jawbone.jpg",
  "062": "2/2e/062.Samson_Carries_the_Gates_of_Gaza.jpg/960px-062.Samson_Carries_the_Gates_of_Gaza.jpg",
  "063": "d/d3/063.Samson_and_Delilah.jpg/960px-063.Samson_and_Delilah.jpg",
  "064": "5/52/064.The_Death_of_Samson.jpg/960px-064.The_Death_of_Samson.jpg",
  "065": "6/60/065.A_Levite_Finds_a_Woman%27s_Body.jpg/960px-065.A_Levite_Finds_a_Woman%27s_Body.jpg",
  "066": "1/18/066.The_Levite_Carries_the_Body.jpg/960px-066.The_Levite_Carries_the_Body.jpg",
  "067": "1/10/067.The_Benjaminites_Take_the_Virgins_of_Jabesh-gilead.jpg/960px-067.The_Benjaminites_Take_the_Virgins_of_Jabesh-gilead.jpg",
  "068": "1/10/068.Naomi_and_Her_Daughters-in-Law.jpg/960px-068.Naomi_and_Her_Daughters-in-Law.jpg",
  "069": "b/be/069.Ruth_and_Boaz.jpg/960px-069.Ruth_and_Boaz.jpg",
  "070": "5/51/070.The_Ark_Is_Returned_to_Beth-shemesh.jpg/960px-070.The_Ark_Is_Returned_to_Beth-shemesh.jpg",
  "070A": "4/48/070A.Samuel_Anoints_Saul.jpg/960px-070A.Samuel_Anoints_Saul.jpg",
  "071": "a/ab/071.The_Death_of_Agag.jpg/960px-071.The_Death_of_Agag.jpg",
  "071A": "7/73/071A.David_Slays_Goliath.jpg/960px-071A.David_Slays_Goliath.jpg",
  "072": "2/21/072.Saul_Tries_to_Kill_David.jpg/960px-072.Saul_Tries_to_Kill_David.jpg",
  "073": "1/1c/073.David_Escapes_through_a_Window.jpg/960px-073.David_Escapes_through_a_Window.jpg",
  "073A": "7/7b/073A.David_and_Jonathan.jpg/960px-073A.David_and_Jonathan.jpg",
  "074": "1/18/074.David_Shows_Saul_That_He_Could_Have_Killed_Him.jpg/960px-074.David_Shows_Saul_That_He_Could_Have_Killed_Him.jpg",
  "075": "0/03/075.Saul_and_the_Witch_of_Endor.jpg/960px-075.Saul_and_the_Witch_of_Endor.jpg",
  "076": "f/f3/076.The_Death_of_Saul.jpg/960px-076.The_Death_of_Saul.jpg",
  "077": "c/cc/077.The_Bodies_of_Saul_and_His_Sons_Are_Recovered.jpg/960px-077.The_Bodies_of_Saul_and_His_Sons_Are_Recovered.jpg",
  "078": "1/14/078.The_Soldiers_of_Ish-bosheth_and_David_Fight.jpg/960px-078.The_Soldiers_of_Ish-bosheth_and_David_Fight.jpg",
  "079": "f/f1/079.David_Attacks_the_Ammonites.jpg/960px-079.David_Attacks_the_Ammonites.jpg",
  "080": "4/40/080.The_Death_of_Absalom.jpg/960px-080.The_Death_of_Absalom.jpg",
  "081": "a/a1/081.David_Mourns_the_Death_of_Absalom.jpg/960px-081.David_Mourns_the_Death_of_Absalom.jpg",
  "082": "4/4c/082.Rizpah%27s_Kindness_toward_the_Dead.jpg/960px-082.Rizpah%27s_Kindness_toward_the_Dead.jpg",
  "083": "8/87/083.Abishai_Saves_David%27s_Life.jpg/960px-083.Abishai_Saves_David%27s_Life.jpg",
  "084": "d/d1/084.The_Judgment_of_Solomon.jpg/960px-084.The_Judgment_of_Solomon.jpg",
  "085": "4/49/085.Cutting_Cedars_for_the_Construction_of_the_Temple.jpg/960px-085.Cutting_Cedars_for_the_Construction_of_the_Temple.jpg",
  "086": "5/51/086.Solomon_Receives_the_Queen_of_Sheba.jpg/960px-086.Solomon_Receives_the_Queen_of_Sheba.jpg",
  "087": "0/04/087.King_Solomon_in_Old_Age.jpg/960px-087.King_Solomon_in_Old_Age.jpg",
  "088": "1/17/088.A_Disobedient_Prophet_Is_Killed_by_a_Lion.jpg/960px-088.A_Disobedient_Prophet_Is_Killed_by_a_Lion.jpg",
  "090": "6/64/090.The_Prophets_of_Baal_Are_Slain.jpg/960px-090.The_Prophets_of_Baal_Are_Slain.jpg",
  "092": "c/cc/092.The_Israelites_Defeat_the_Syrians.jpg/960px-092.The_Israelites_Defeat_the_Syrians.jpg",
  "093": "5/56/093.The_Death_of_Ahab.jpg/960px-093.The_Death_of_Ahab.jpg",
  "095B": "a/ad/095B.Youths_Are_Destroyed_by_Bears.jpg/960px-095B.Youths_Are_Destroyed_by_Bears.jpg",
  "096": "e/e5/096.Famine_in_Samaria.jpg/960px-096.Famine_in_Samaria.jpg",
  "097": "1/1f/097.The_Death_of_Jezebel.jpg/960px-097.The_Death_of_Jezebel.jpg",
  "098": "1/10/098.The_Remains_of_Jezebel_Are_Found.jpg/960px-098.The_Remains_of_Jezebel_Are_Found.jpg",
  "099": "f/f3/099.The_Death_of_Athaliah.jpg/960px-099.The_Death_of_Athaliah.jpg",
  "100": "e/e1/100.Lions_Devour_Foreign_Nations_in_Samaria.jpg/960px-100.Lions_Devour_Foreign_Nations_in_Samaria.jpg",
  "101": "0/0b/101.The_Army_of_Sennacherib_Is_Destroyed.jpg/960px-101.The_Army_of_Sennacherib_Is_Destroyed.jpg",
  "102": "6/65/102.Zedekiah%27s_Sons_Are_Killed_before_His_Eyes.jpg/960px-102.Zedekiah%27s_Sons_Are_Killed_before_His_Eyes.jpg",
  "103": "0/09/103.The_Ammonite_and_Moabite_Armies_Are_Destroyed.jpg/960px-103.The_Ammonite_and_Moabite_Armies_Are_Destroyed.jpg",
  "104": "a/ae/104.Cyrus_Returns_the_Vessels_of_the_Temple.jpg/960px-104.Cyrus_Returns_the_Vessels_of_the_Temple.jpg",
  "105": "a/a2/105.Rebuilding_the_Temple_Is_Begun.jpg/960px-105.Rebuilding_the_Temple_Is_Begun.jpg",
  "106": "9/98/106.Artaxerxes_Grants_Freedom_to_the_Jews.jpg/960px-106.Artaxerxes_Grants_Freedom_to_the_Jews.jpg",
  "108": "0/01/108.Nehemiah_Sees_the_Ruins_of_Jerusalem.jpg/960px-108.Nehemiah_Sees_the_Ruins_of_Jerusalem.jpg",
  "109": "7/72/109.Ezra_Reads_the_Law_to_the_People.jpg/960px-109.Ezra_Reads_the_Law_to_the_People.jpg",
  "114": "a/a6/114.Queen_Vashti_Refuses_to_Obey.jpg/960px-114.Queen_Vashti_Refuses_to_Obey.jpg",
  "115": "8/84/115.Esther_before_the_King.jpg/960px-115.Esther_before_the_King.jpg",
  "116": "d/d3/116.The_Triumph_of_Mordecai.jpg/960px-116.The_Triumph_of_Mordecai.jpg",
  "117": "5/59/117.Esther_Accuses_Haman.jpg/960px-117.Esther_Accuses_Haman.jpg",
  "118": "c/c9/118.Job_Hears_of_His_Misfortunes.jpg/960px-118.Job_Hears_of_His_Misfortunes.jpg",
  "119": "b/b3/119.Job_Speaks_with_His_Friends.jpg/960px-119.Job_Speaks_with_His_Friends.jpg",
  "120": "f/fd/120.The_Prophet_Isaiah.jpg/960px-120.The_Prophet_Isaiah.jpg",
  "121": "a/a6/121.The_Vision_of_the_Destruction_of_Babylon.jpg/960px-121.The_Vision_of_the_Destruction_of_Babylon.jpg",
  "123": "b/b3/123.The_Prophet_Jeremiah.jpg/960px-123.The_Prophet_Jeremiah.jpg",
  "123B": "3/34/123B.Baruch_Writes_Jeremiah%27s_Prophecies.jpg/960px-123B.Baruch_Writes_Jeremiah%27s_Prophecies.jpg",
  "124": "7/7b/124.The_People_Mourn_the_Destruction_of_Jerusalem.jpg/960px-124.The_People_Mourn_the_Destruction_of_Jerusalem.jpg",
  "126": "5/53/126.The_Prophet_Ezekiel.jpg/960px-126.The_Prophet_Ezekiel.jpg",
  "128": "1/16/128.Daniel_among_the_Exiles.jpg/960px-128.Daniel_among_the_Exiles.jpg",
  "130": "0/07/130.Daniel_Interprets_the_Writing_on_the_Wall.jpg/960px-130.Daniel_Interprets_the_Writing_on_the_Wall.jpg",
  "131": "3/38/131.Daniel_in_the_Lions%27_Den.jpg/960px-131.Daniel_in_the_Lions%27_Den.jpg",
  "136": "8/8c/136.The_Prophet_Amos.jpg/960px-136.The_Prophet_Amos.jpg",
  "137": "1/19/137.Jonah_Is_Spewed_Forth_by_the_Whale.jpg/960px-137.Jonah_Is_Spewed_Forth_by_the_Whale.jpg",
  "138": "3/34/138.Jonah_Preaches_to_the_Ninevites.jpg/960px-138.Jonah_Preaches_to_the_Ninevites.jpg",
  "139": "f/ff/139.Micah_Exhorts_the_Israelites.jpg/960px-139.Micah_Exhorts_the_Israelites.jpg",
};

const DORE_OT = [
  ["003", "Adán y Eva expulsados del Edén", "genesis", [3], 24],
  ["004", "Caín y Abel ofrecen sacrificios", "genesis", [4], 3],
  ["005", "Caín mata a Abel", "genesis", [4], 8],
  ["006", "El mundo destruido por las aguas", "genesis", [6,7], 17],
  ["007", "El Gran Diluvio", "genesis", [7], 11],
  ["008", "Una paloma es enviada desde el Arca", "genesis", [8], 8],
  ["009", "Noé maldice a Cam", "genesis", [9], 25],
  ["010", "La Torre de Babel", "genesis", [11], 4],
  ["011", "Abraham va a la tierra de Canaán", "genesis", [12], 5],
  ["013", "Lot huye mientras arden Sodoma y Gomorra", "genesis", [19], 15],
  ["014", "Abraham envía lejos a Agar e Ismael", "genesis", [21], 14],
  ["015", "Agar e Ismael en el desierto", "genesis", [21], 15],
  ["017", "El entierro de Sara", "genesis", [23], 19],
  ["018", "Eliezer y Rebeca en el pozo", "genesis", [24], 15],
  ["019", "El encuentro de Isaac y Rebeca", "genesis", [24], 63],
  ["020", "Isaac bendice a Jacob", "genesis", [27], 27],
  ["022", "Jacob cuida los rebaños de Labán", "genesis", [29], 9],
  ["025", "Jacob y Esaú se encuentran", "genesis", [33], 4],
  ["026", "José es vendido por sus hermanos", "genesis", [37], 28],
  ["027", "José interpreta el sueño del Faraón", "genesis", [41], 25],
  ["028", "José se revela a sus hermanos", "genesis", [45], 1],
  ["029", "Jacob viaja a Egipto", "genesis", [46], 5],
  ["030", "El niño Moisés en el Nilo", "exodo", [2], 3],
  ["031", "El hallazgo de Moisés", "exodo", [2], 5],
  ["032", "Moisés y Aarón ante el Faraón", "exodo", [7], 10],
  ["033", "La quinta plaga: peste del ganado", "exodo", [9], 3],
  ["034", "La novena plaga: tinieblas", "exodo", [10], 22],
  ["035", "Los primogénitos de Egipto son muertos", "exodo", [12], 29],
  ["036", "Los egipcios piden a Moisés que se vaya", "exodo", [12], 33],
  ["037", "Los egipcios se ahogan en el mar", "exodo", [14], 27],
  ["041", "Moisés golpea la roca en Horeb", "exodo", [17], 6],
  ["041A", "Moisés rompe las Tablas de la Ley", "exodo", [32], 19],
  ["040", "La muerte de Coré, Datán y Abiram", "numeros", [16], 31],
  ["041B", "Los espías regresan de la Tierra Prometida", "numeros", [13], 23],
  ["044", "Los israelitas cruzan el río Jordán", "josue", [3], 14],
  ["046", "Las murallas de Jericó caen", "josue", [6], 20],
  ["047", "Josué perdona a Rahab", "josue", [6], 23],
  ["048", "Acán es apedreado", "josue", [7], 25],
  ["049", "Josué quema la ciudad de Hai", "josue", [8], 19],
  ["050", "El ejército de los amorreos es destruido", "josue", [10], 10],
  ["051", "Josué ordena al sol detenerse", "josue", [10], 12],
  ["052", "Jael mata a Sísara", "jueces", [4], 21],
  ["053", "Débora alaba a Jael", "jueces", [5], 24],
  ["054", "Gedeón elige 300 soldados", "jueces", [7], 5],
  ["055", "Los madianitas son derrotados", "jueces", [7], 21],
  ["056", "La muerte de los hijos de Gedeón", "jueces", [9], 5],
  ["057", "La muerte de Abimelec", "jueces", [9], 53],
  ["058", "La hija de Jefté sale a recibir a su padre", "jueces", [11], 34],
  ["059", "Las mujeres lloran con la hija de Jefté", "jueces", [11], 40],
  ["060", "Sansón mata un león", "jueces", [14], 6],
  ["061", "Sansón destruye a los filisteos con una quijada", "jueces", [15], 15],
  ["062", "Sansón carga las puertas de Gaza", "jueces", [16], 3],
  ["063", "Sansón y Dalila", "jueces", [16], 19],
  ["064", "La muerte de Sansón", "jueces", [16], 30],
  ["065", "Un levita encuentra el cuerpo de una mujer", "jueces", [19], 27],
  ["066", "El levita lleva el cuerpo", "jueces", [19], 29],
  ["067", "Los benjaminitas toman las vírgenes de Jabés", "jueces", [21], 21],
  ["068", "Noemí y sus nueras", "rut", [1], 14],
  ["069", "Rut y Booz", "rut", [2], 5],
  ["070", "El Arca es devuelta a Bet-semes", "1samuel", [6], 13],
  ["070A", "Samuel unge a Saúl", "1samuel", [10], 1],
  ["071", "La muerte de Agag", "1samuel", [15], 33],
  ["071A", "David vence a Goliat", "1samuel", [17], 49],
  ["072", "Saúl intenta matar a David", "1samuel", [18], 11],
  ["073", "David escapa por la ventana", "1samuel", [19], 12],
  ["073A", "David y Jonatán", "1samuel", [20], 41],
  ["074", "David muestra a Saúl cómo perdonó su vida", "1samuel", [24], 8],
  ["075", "Saúl y la pitonisa de Endor", "1samuel", [28], 14],
  ["076", "La muerte de Saúl", "1samuel", [31], 4],
  ["077", "Recuperan los cuerpos de Saúl y sus hijos", "1samuel", [31], 12],
  ["078", "Combate entre soldados de Is-boset y David", "2samuel", [2], 14],
  ["079", "David ataca a los amonitas", "2samuel", [10], 7],
  ["080", "La muerte de Absalón", "2samuel", [18], 9],
  ["081", "David llora la muerte de Absalón", "2samuel", [18], 33],
  ["082", "Rizpa cuida los muertos", "2samuel", [21], 10],
  ["083", "Abisai salva la vida de David", "2samuel", [21], 17],
  ["084", "El juicio de Salomón", "1reyes", [3], 25],
  ["085", "Cortan cedros para el Templo", "1reyes", [5], 6],
  ["086", "Salomón recibe a la Reina de Sabá", "1reyes", [10], 2],
  ["087", "El Rey Salomón en su vejez", "1reyes", [11], 4],
  ["088", "Un profeta desobediente es muerto por un león", "1reyes", [13], 24],
  ["090", "Los profetas de Baal son muertos", "1reyes", [18], 40],
  ["092", "Los israelitas derrotan a los sirios", "1reyes", [20], 21],
  ["093", "La muerte de Acab", "1reyes", [22], 34],
  ["095B", "Unos jóvenes son destruidos por osos", "2reyes", [2], 24],
  ["096", "Hambruna en Samaria", "2reyes", [6], 25],
  ["097", "La muerte de Jezabel", "2reyes", [9], 33],
  ["098", "Hallan los restos de Jezabel", "2reyes", [9], 35],
  ["099", "La muerte de Atalía", "2reyes", [11], 16],
  ["100", "Leones devoran naciones extranjeras en Samaria", "2reyes", [17], 25],
  ["101", "El ejército de Senaquerib es destruido", "2reyes", [19], 35],
  ["102", "Los hijos de Sedequías muertos ante sus ojos", "2reyes", [25], 7],
  ["103", "Los ejércitos amonitas y moabitas destruidos", "2cronicas", [20], 22],
  ["104", "Ciro devuelve los utensilios del Templo", "esdras", [1], 7],
  ["105", "Comienza la reconstrucción del Templo", "esdras", [3], 10],
  ["106", "Artajerjes concede libertad a los judíos", "esdras", [7], 13],
  ["108", "Nehemías observa las ruinas de Jerusalén", "nehemias", [2], 13],
  ["109", "Esdras lee la Ley al pueblo", "nehemias", [8], 5],
  ["114", "La Reina Vasti se niega a obedecer", "ester", [1], 12],
  ["115", "Ester ante el Rey", "ester", [5], 2],
  ["116", "El triunfo de Mardoqueo", "ester", [6], 11],
  ["117", "Ester acusa a Amán", "ester", [7], 6],
  ["118", "Job recibe noticias de sus desgracias", "job", [1], 14],
  ["119", "Job habla con sus amigos", "job", [2], 11],
  ["120", "El Profeta Isaías", "isaias", [1], 1],
  ["121", "Visión de la destrucción de Babilonia", "isaias", [13], 1],
  ["123", "El Profeta Jeremías", "jeremias", [1], 1],
  ["123B", "Baruc escribe las profecías de Jeremías", "jeremias", [36], 4],
  ["124", "El pueblo llora la destrucción de Jerusalén", "lamentaciones", [1], 1],
  ["126", "El Profeta Ezequiel", "ezequiel", [1], 1],
  ["128", "Daniel entre los exiliados", "daniel", [1], 6],
  ["130", "Daniel interpreta la escritura en la pared", "daniel", [5], 5],
  ["131", "Daniel en el foso de los leones", "daniel", [6], 16],
  ["136", "El Profeta Amós", "amos", [1], 1],
  ["137", "Jonás es arrojado por la ballena", "jonas", [2], 10],
  ["138", "Jonás predica a los ninivitas", "jonas", [3], 4],
  ["139", "Miqueas exhorta a los israelitas", "miqueas", [1], 1],
];

// ============================================================
// 3. GUSTAVE DORÉ - NT (22 engravings)
// ============================================================
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

// ============================================================
// 4. SCHNORR VON CAROLSFELD (130 woodcuts)
// ============================================================
const SCHNORR = [
  ["schnorr_008", "008", "La Caída - Adán y Eva", "genesis", [3], 6],
  ["schnorr_009", "009", "La Confrontación tras la Caída", "genesis", [3], 11],
  ["schnorr_010", "010", "Expulsión del Edén", "genesis", [3], 24],
  ["schnorr_011", "011", "Adán, Eva y su Familia", "genesis", [4], 1],
  ["schnorr_012", "012", "Caín y Abel ofrecen sacrificios", "genesis", [4], 3],
  ["schnorr_013", "013", "Caín mata a Abel", "genesis", [4], 8],
  ["schnorr_014", "014", "Caín funda la ciudad de Enoc", "genesis", [4], 17],
  ["schnorr_015", "015", "Los días de Noé", "genesis", [6], 5],
  ["schnorr_016", "016", "El Arca de Noé", "genesis", [7], 7],
  ["schnorr_017", "017", "El Diluvio", "genesis", [7], 17],
  ["schnorr_018", "018", "Noé sale del Arca", "genesis", [8], 18],
  ["schnorr_020", "020", "Noé maldice a Cam", "genesis", [9], 25],
  ["schnorr_021", "021", "La Torre de Babel", "genesis", [11], 4],
  ["schnorr_023", "023", "Abram y Melquisedec", "genesis", [14], 18],
  ["schnorr_024", "024", "Abram deja Harán", "genesis", [12], 4],
  ["schnorr_026", "026", "Huida de Sodoma y Gomorra", "genesis", [19], 15],
  ["schnorr_027", "027", "Agar e Ismael son expulsados", "genesis", [21], 14],
  ["schnorr_029", "029", "Rebeca en el pozo", "genesis", [24], 15],
  ["schnorr_030", "030", "Isaac y Rebeca se encuentran", "genesis", [24], 63],
  ["schnorr_031", "031", "Isaac bendice a Jacob", "genesis", [27], 27],
  ["schnorr_033", "033", "Jacob encuentra a Raquel", "genesis", [29], 10],
  ["schnorr_034", "034", "Jacob trabaja para Labán", "genesis", [29], 20],
  ["schnorr_035", "035", "Jacob huye de Labán", "genesis", [31], 17],
  ["schnorr_037", "037", "Reunión de Jacob y Esaú", "genesis", [33], 4],
  ["schnorr_038", "038", "Los ismaelitas compran a José", "genesis", [37], 28],
  ["schnorr_039", "039", "José y la esposa de Potifar", "genesis", [39], 12],
  ["schnorr_040", "040", "José interpreta los sueños del Faraón", "genesis", [41], 25],
  ["schnorr_041", "041", "José promovido en Egipto", "genesis", [41], 40],
  ["schnorr_042", "042", "José se revela a sus hermanos", "genesis", [45], 3],
  ["schnorr_043", "043", "Reunión de Jacob y José", "genesis", [46], 29],
  ["schnorr_044", "044", "Esclavitud y matanza de inocentes", "exodo", [1], 16],
  ["schnorr_045", "045", "Moisés es encontrado", "exodo", [2], 5],
  ["schnorr_046", "046", "Moisés mata a un egipcio", "exodo", [2], 12],
  ["schnorr_048", "048", "Varas convertidas en serpientes", "exodo", [7], 10],
  ["schnorr_049", "049", "La Pascua y muerte de los primogénitos", "exodo", [12], 29],
  ["schnorr_050", "050", "El Faraón libera a los hebreos", "exodo", [12], 31],
  ["schnorr_051", "051", "El cántico de María", "exodo", [15], 20],
  ["schnorr_052", "052", "Maná y agua de la roca", "exodo", [16,17], 4],
  ["schnorr_053", "053", "Batalla contra los amalecitas", "exodo", [17], 11],
  ["schnorr_055", "055", "El becerro de oro", "exodo", [32], 4],
  ["schnorr_056", "056", "El juicio tras el becerro de oro", "exodo", [32], 27],
  ["schnorr_058", "058", "Los espías regresan con frutos", "numeros", [13], 23],
  ["schnorr_059", "059", "La rebelión de Coré", "numeros", [16], 31],
  ["schnorr_062", "062", "El asna de Balaam", "numeros", [22], 28],
  ["schnorr_063", "063", "La elección de Josué", "numeros", [27], 18],
  ["schnorr_064", "064", "Moisés contempla la Tierra Prometida", "deuteronomio", [34], 1],
  ["schnorr_065", "065", "Entierro de Moisés", "deuteronomio", [34], 5],
  ["schnorr_066", "066", "Rahab y los espías", "josue", [2], 4],
  ["schnorr_067", "067", "Cruce del Jordán", "josue", [3], 14],
  ["schnorr_069", "069", "La batalla de Jericó", "josue", [6], 20],
  ["schnorr_070", "070", "La caída de Hai", "josue", [8], 19],
  ["schnorr_071", "071", "El sol se detiene", "josue", [10], 12],
  ["schnorr_072", "072", "Los reyes capturados", "josue", [10], 22],
  ["schnorr_073", "073", "Repartición de la herencia tribal", "josue", [13], 7],
  ["schnorr_074", "074", "Jael y Sísara", "jueces", [4], 22],
  ["schnorr_076", "076", "Gedeón elige sus soldados", "jueces", [7], 5],
  ["schnorr_077", "077", "Muerte de Abimelec", "jueces", [9], 53],
  ["schnorr_078", "078", "La hija de Jefté", "jueces", [11], 34],
  ["schnorr_079", "079", "Sansón mata un león", "jueces", [14], 6],
  ["schnorr_080", "080", "Sansón mata mil filisteos", "jueces", [15], 15],
  ["schnorr_081", "081", "Sansón y Dalila", "jueces", [16], 19],
  ["schnorr_082", "082", "Muerte de Sansón", "jueces", [16], 30],
  ["schnorr_083", "083", "Los benjaminitas toman esposas de Siló", "jueces", [21], 21],
  ["schnorr_084", "084", "Noemí, Rut y Orfa", "rut", [1], 14],
  ["schnorr_085", "085", "Booz encuentra a Rut", "rut", [2], 5],
  ["schnorr_088", "088", "Muerte de Elí", "1samuel", [4], 18],
  ["schnorr_089", "089", "Samuel unge a Saúl", "1samuel", [10], 1],
  ["schnorr_090", "090", "Dios rechaza a Saúl", "1samuel", [15], 26],
  ["schnorr_091", "091", "David es elegido", "1samuel", [16], 12],
  ["schnorr_092", "092", "David y Goliat", "1samuel", [17], 49],
  ["schnorr_093", "093", "Saúl ataca a David", "1samuel", [18], 11],
  ["schnorr_094", "094", "David y Jonatán", "1samuel", [20], 41],
  ["schnorr_095", "095", "David perdona la vida de Saúl", "1samuel", [24], 8],
  ["schnorr_096", "096", "David y Abigaíl", "1samuel", [25], 23],
  ["schnorr_097", "097", "Saúl y la adivina de Endor", "1samuel", [28], 14],
  ["schnorr_098", "098", "Muerte de Saúl", "1samuel", [31], 4],
  ["schnorr_099", "099", "David ungido como rey", "2samuel", [2], 4],
  ["schnorr_100", "100", "David lleva el Arca a Jerusalén", "2samuel", [6], 14],
  ["schnorr_101", "101", "David y Betsabé", "2samuel", [11], 2],
  ["schnorr_102", "102", "Natán confronta a David", "2samuel", [12], 7],
  ["schnorr_103", "103", "El hijo de David muere", "2samuel", [12], 18],
  ["schnorr_104", "104", "Simei maldice a David", "2samuel", [16], 5],
  ["schnorr_105", "105", "Muerte de Absalón", "2samuel", [18], 9],
  ["schnorr_106", "106", "David derrama el agua", "2samuel", [23], 16],
  ["schnorr_108", "108", "Salomón es coronado rey", "1reyes", [1], 39],
  ["schnorr_109", "109", "La sabiduría de Salomón", "1reyes", [3], 25],
  ["schnorr_110", "110", "Construcción del Templo", "1reyes", [5], 5],
  ["schnorr_111", "111", "La Reina de Sabá", "1reyes", [10], 2],
  ["schnorr_112", "112", "La idolatría de Salomón", "1reyes", [11], 4],
  ["schnorr_113", "113", "Roboam y Jeroboam", "1reyes", [12], 16],
  ["schnorr_115", "115", "Elías resucita al hijo de la viuda", "1reyes", [17], 22],
  ["schnorr_116", "116", "Matanza de los profetas de Baal", "1reyes", [18], 40],
  ["schnorr_118", "118", "Muerte de Acab", "1reyes", [22], 34],
  ["schnorr_120", "120", "Eliseo resucita al hijo de la sunamita", "2reyes", [4], 34],
  ["schnorr_121", "121", "Muerte de Jezabel", "2reyes", [9], 33],
  ["schnorr_122", "122", "Jerusalén liberada de Senaquerib", "2reyes", [19], 35],
  ["schnorr_123", "123", "Hallazgo del Libro de la Ley", "2reyes", [22], 8],
  ["schnorr_124", "124", "Caída de Jerusalén", "2reyes", [25], 9],
  ["schnorr_125", "125", "Regreso del exilio", "esdras", [1], 5],
  ["schnorr_126", "126", "Reconstrucción del Templo", "esdras", [3], 10],
  ["schnorr_128", "128", "Esdras lee el Libro de la Ley", "nehemias", [8], 3],
  ["schnorr_129", "129", "La coronación de Ester", "ester", [2], 17],
  ["schnorr_130", "130", "Mardoqueo es honrado", "ester", [6], 11],
  ["schnorr_131", "131", "Mensajeros llegan a Job", "job", [1], 14],
  ["schnorr_132", "132", "La aflicción de Job", "job", [2], 7],
  ["schnorr_133", "133", "La restauración de Job", "job", [42], 10],
  ["schnorr_140", "140", "El llamado de Jeremías", "jeremias", [1], 5],
  ["schnorr_141", "141", "El lamento de Jeremías", "lamentaciones", [1], 1],
  ["schnorr_143", "143", "Daniel interpreta la escritura en la pared", "daniel", [5], 25],
  ["schnorr_160", "160", "Daniel en el foso de los leones", "daniel", [6], 16],
  ["schnorr_163", "163", "La Visitación", "lucas", [1], 39],
  ["schnorr_164", "164", "Nombramiento de Juan el Bautista", "lucas", [1], 63],
  ["schnorr_166", "166", "Los pastores visitan al niño", "lucas", [2], 16],
  ["schnorr_168", "168", "Simeón y Ana", "lucas", [2], 28],
  ["schnorr_169", "169", "La visita de los Reyes Magos", "mateo", [2], 11],
  ["schnorr_171", "171", "Huida a Egipto", "mateo", [2], 14],
  ["schnorr_172", "172", "Matanza de los inocentes", "mateo", [2], 16],
  ["schnorr_173", "173", "El joven Jesús en el Templo", "lucas", [2], 46],
  ["schnorr_174", "174", "Juan el Bautista", "mateo", [3], 1],
  ["schnorr_178", "178", "Los primeros discípulos", "juan", [1], 40],
  ["schnorr_179", "179", "Las bodas de Caná", "juan", [2], 1],
  ["schnorr_180", "180", "Purificación del Templo", "juan", [2], 15],
  ["schnorr_181", "181", "Nicodemo", "juan", [3], 1],
  ["schnorr_182", "182", "La mujer samaritana en el pozo", "juan", [4], 7],
  ["schnorr_183", "183", "Jesús sana a un paralítico", "marcos", [2], 3],
  ["schnorr_184", "184", "La hija de Jairo", "marcos", [5], 41],
  ["schnorr_186", "186", "El Sermón del Monte", "mateo", [5], 1],
  ["schnorr_187", "187", "Muerte de Juan el Bautista", "marcos", [6], 27],
  ["schnorr_189", "189", "Jesús perdona a la mujer adúltera", "juan", [8], 11],
  ["schnorr_190", "190", "Jesús duerme en la barca", "marcos", [4], 38],
  ["schnorr_193", "193", "Alimentación de los cinco mil", "mateo", [14], 19],
  ["schnorr_196", "196", "María y Marta", "lucas", [10], 38],
  ["schnorr_197", "197", "Parábola del buen samaritano", "lucas", [10], 30],
  ["schnorr_198", "198", "Parábola del hijo pródigo", "lucas", [15], 11],
  ["schnorr_199", "199", "El rico y Lázaro", "lucas", [16], 19],
  ["schnorr_202", "202", "Jesús resucita a Lázaro", "juan", [11], 43],
  ["schnorr_205", "205", "La entrada triunfal en Jerusalén", "mateo", [21], 8],
  ["schnorr_207", "207", "La Última Cena", "mateo", [26], 26],
  ["schnorr_208", "208", "Jesús en Getsemaní", "mateo", [26], 36],
  ["schnorr_209", "209", "El arresto de Jesús", "mateo", [26], 47],
  ["schnorr_210", "210", "Jesús ante Caifás", "mateo", [26], 57],
  ["schnorr_211", "211", "Pedro niega a Jesús", "mateo", [26], 69],
  ["schnorr_213", "213", "Pilato entrega a Jesús", "mateo", [27], 24],
  ["schnorr_214", "214", "Muerte de Judas Iscariote", "mateo", [27], 5],
  ["schnorr_215", "215", "Jesús carga la cruz", "mateo", [27], 32],
  ["schnorr_217", "217", "La sepultura de Jesús", "mateo", [27], 59],
  ["schnorr_222", "222", "El camino a Emaús", "lucas", [24], 15],
  ["schnorr_223", "223", "Tomás el incrédulo", "juan", [20], 27],
  ["schnorr_224", "224", "La pesca milagrosa", "juan", [21], 6],
  ["schnorr_227", "227", "Sanación del mendigo tullido", "hechos", [3], 6],
  ["schnorr_228", "228", "Lapidación de Esteban", "hechos", [7], 58],
  ["schnorr_229", "229", "El eunuco etíope", "hechos", [8], 30],
  ["schnorr_232", "232", "Pablo y Bernabé en Listra", "hechos", [14], 11],
  ["schnorr_233", "233", "Pablo en el Areópago", "hechos", [17], 22],
  ["schnorr_235", "235", "Pablo llega a Roma", "hechos", [28], 14],
];

// ============================================================
// 5. TISSOT PAINTINGS (169 - loaded from file)
// ============================================================
// Load Tissot data (eval because the file has encoding quirks with require)
const _tissotSrc = fs.readFileSync(path.join(__dirname, '..', 'tissot_paintings.js'), 'utf-8');
const _tissotMatch = _tissotSrc.match(/const TISSOT_PAINTINGS\s*=\s*(\[[\s\S]*?\n\]);/);
let TISSOT_PAINTINGS = [];
if (_tissotMatch) {
  TISSOT_PAINTINGS = eval(_tissotMatch[1]);
  console.log(`Loaded ${TISSOT_PAINTINGS.length} Tissot paintings`);
} else {
  console.error('WARNING: Could not parse TISSOT_PAINTINGS');
}

// ============================================================
// 6. WILLIAM HOLE (8 paintings)
// ============================================================
const HOLE = [
  ["hole_001", "Joseph_and_Mary_arrive_at_Bethlehem.jpg", "José y María llegan a Belén", "lucas", [2], 4],
  ["hole_014", "The_Sermon_on_the_Mount_-_William_Brassey_Hole.jpg", "El Sermón del Monte", "mateo", [5], 1],
  ["hole_009", "Hole_calming_a_storm.jpg", "Jesús calma la tempestad", "marcos", [4], 39],
  ["hole_010", "Hole_Feeding_the_multitude.jpg", "Alimentación de la multitud", "mateo", [14], 19],
  ["hole_020", "Entry_into_Jerusalem_-_William_Brassey_Hole.jpg", "Entrada triunfal en Jerusalén", "mateo", [21], 8],
  ["hole_017", "William_Hole_Jesus_Casts_Out_The_Money_Changers.jpg", "Jesús expulsa a los cambistas", "juan", [2], 15],
  ["hole_023", "JesusPilate.jpg", "Jesús ante Pilato", "mateo", [27], 11],
  ["hole_026", "The_submission_of_Coniah_to_Nebuchadnezzar_-_W.B._Hole.jpg", "Conías ante Nabucodonosor", "2reyes", [24], 12],
];

// ============================================================
// 7. BIBLICA OPEN BIBLE MAPS (28 maps)
// ============================================================
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

// ============================================================
// GENERATE biblia-images-data.js
// ============================================================
function generate() {
  const allImages = [];

  // 1. Existing paintings
  for (const img of EXISTING) {
    allImages.push({
      id: img.id,
      src: img.local,
      remoteSrc: null,
      book: img.book,
      chapters: img.chapters,
      verseHint: img.verseHint,
      title: img.title,
      artist: img.artist,
      collection: "classic"
    });
  }

  // 2. Doré OT
  for (const [num, title, book, chapters, verseHint] of DORE_OT) {
    const localPath = `img/art/dore/dore_${num}.jpg`;
    const urlSuffix = DORE_URLS[num];
    allImages.push({
      id: `dore_${num}`,
      src: hasLocal(localPath) ? localPath : null,
      remoteSrc: urlSuffix ? DORE_BASE + urlSuffix : null,
      book, chapters, verseHint, title,
      artist: "Gustave Doré, c. 1866",
      collection: "dore"
    });
  }

  // 3. Doré NT
  for (const [id, wikiFile, title, book, chapters, verseHint] of DORE_NT) {
    const ext = wikiFile.endsWith('.png') ? 'png' : 'jpg';
    const localPath = `img/art/dore/${id}.${ext}`;
    allImages.push({
      id,
      src: hasLocal(localPath) ? localPath : null,
      remoteSrc: `https://upload.wikimedia.org/wikipedia/commons/${wikiFile}`,
      book, chapters, verseHint, title,
      artist: "Gustave Doré, c. 1866",
      collection: "dore"
    });
  }

  // 4. Schnorr
  for (const [id, num, title, book, chapters, verseHint] of SCHNORR) {
    const localPath = `img/art/schnorr/${id}.png`;
    allImages.push({
      id,
      src: hasLocal(localPath) ? localPath : null,
      remoteSrc: null, // Will be resolved via API at download time
      book, chapters, verseHint, title,
      artist: "Julius Schnorr von Carolsfeld, 1860",
      collection: "schnorr",
      _wikiFile: `Schnorr_von_Carolsfeld_Bibel_in_Bildern_1860_${num}.png`
    });
  }

  // 5. Tissot
  for (const [id, thumbPath, title, book, chapters, verseHint] of TISSOT_PAINTINGS) {
    const localExt = thumbPath.endsWith('.png') ? 'png' : 'jpg';
    const localPath = `img/art/tissot/${id}.${localExt}`;
    // Tissot thumbs are relative to commons base
    const remoteSrc = thumbPath.startsWith('thumb/')
      ? `https://upload.wikimedia.org/wikipedia/commons/${thumbPath}`
      : `https://upload.wikimedia.org/wikipedia/commons/thumb/${thumbPath}`;
    allImages.push({
      id,
      src: hasLocal(localPath) ? localPath : null,
      remoteSrc,
      book, chapters, verseHint, title,
      artist: "James Tissot, c. 1896",
      collection: "tissot"
    });
  }

  // 6. William Hole
  for (const [id, wikiFile, title, book, chapters, verseHint] of HOLE) {
    const ext = wikiFile.endsWith('.png') ? 'png' : 'jpg';
    const localPath = `img/art/hole/${id}.${ext}`;
    allImages.push({
      id,
      src: hasLocal(localPath) ? localPath : null,
      remoteSrc: null, // Resolved via API
      book, chapters, verseHint, title,
      artist: "William Brassey Hole, c. 1906",
      collection: "hole",
      _wikiFile: wikiFile
    });
  }

  // ---- MAPS ----
  const allMaps = [];
  for (const map of BIBLICA_MAPS) {
    const localPath = `img/maps/${map.fname}`;
    allMaps.push({
      id: map.id,
      src: hasLocal(localPath) ? localPath : null,
      remoteSrc: map.url,
      title: map.title,
      books: map.books,
      type: "map"
    });
  }

  // Stats
  const totalImages = allImages.length;
  const localImages = allImages.filter(i => i.src).length;
  const remoteImages = allImages.filter(i => !i.src && i.remoteSrc).length;
  const totalMaps = allMaps.length;
  const localMaps = allMaps.filter(m => m.src).length;

  console.log(`\n=== IMAGE DATA SUMMARY ===`);
  console.log(`Total illustrations: ${totalImages}`);
  console.log(`  Local (downloaded): ${localImages}`);
  console.log(`  Remote fallback:    ${remoteImages}`);
  console.log(`  No source yet:      ${totalImages - localImages - remoteImages}`);
  console.log(`Total maps: ${totalMaps} (local: ${localMaps})`);
  console.log(`Grand total: ${totalImages + totalMaps}\n`);

  // Book coverage
  const bookSet = new Set();
  allImages.forEach(i => bookSet.add(i.book));
  allMaps.forEach(m => m.books.forEach(b => bookSet.add(b)));
  console.log(`Books covered: ${bookSet.size}`);

  // Clean internal fields before output
  const cleanImages = allImages.map(({ _wikiFile, ...rest }) => rest);

  // Build BIBLE_IMAGES dictionary (legacy format for biblia-context.js)
  // Format: { bookId: [ {local, url, title, artist, chapters, verseHint} ] }
  const bibleImagesDict = {};
  for (const img of allImages) {
    if (!img.src && !img.remoteSrc) continue; // Skip images with no source
    if (!bibleImagesDict[img.book]) bibleImagesDict[img.book] = [];
    bibleImagesDict[img.book].push({
      local: img.src || null,
      url: img.remoteSrc || null,
      title: img.title,
      artist: img.artist,
      chapters: img.chapters,
      verseHint: img.verseHint
    });
  }

  // Build BIBLE_MAPS dictionary (legacy format)
  const bibleMapsDict = {};
  for (const map of allMaps) {
    if (!map.src && !map.remoteSrc) continue;
    for (const book of map.books) {
      if (!bibleMapsDict[book]) bibleMapsDict[book] = [];
      bibleMapsDict[book].push({
        local: map.src || null,
        url: map.remoteSrc || null,
        title: map.title
      });
    }
  }

  // Generate JS file
  const output = `// =============================================================
// BIBLIA IMAGES DATA - Auto-generated
// ${totalImages} illustrations + ${totalMaps} maps = ${totalImages + totalMaps} total
// Sources: Doré (${DORE_OT.length + DORE_NT.length}), Schnorr (${SCHNORR.length}), Tissot (${TISSOT_PAINTINGS.length}), Hole (${HOLE.length}), Classic (${EXISTING.length})
// Generated: ${new Date().toISOString()}
// =============================================================

// Legacy format used by biblia-context.js
const BIBLE_IMAGES = ${JSON.stringify(bibleImagesDict, null, 2)};

// Legacy maps format
const BIBLE_MAPS_BY_BOOK = ${JSON.stringify(bibleMapsDict, null, 2)};

// Flat array format (new)
const BIBLIA_IMAGES = ${JSON.stringify(cleanImages, null, 2)};

const BIBLIA_MAPS = ${JSON.stringify(allMaps, null, 2)};

// Helper: get images for a book+chapter
function getImagesForChapter(book, chapter) {
  return BIBLIA_IMAGES.filter(img =>
    img.book === book && img.chapters.includes(chapter) && (img.src || img.remoteSrc)
  );
}

// Helper: get maps for a book
function getMapsForBook(book) {
  return BIBLIA_MAPS.filter(m => m.books.includes(book) && (m.src || m.remoteSrc));
}

// Helper: get image URL (local preferred, remote fallback)
function getImageUrl(img) {
  return img.src || img.remoteSrc || null;
}
`;

  const outPath = path.join(BASE_DIR, 'biblia-images-data.js');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.log(`Written: ${outPath}`);
  console.log(`File size: ${Math.round(fs.statSync(outPath).size / 1024)}KB`);
}

generate();
