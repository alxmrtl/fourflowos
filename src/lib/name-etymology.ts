/**
 * Name etymology lookup for Flow Profile deep signature data.
 * Covers common English, French, and Latin-root names.
 * Returns plain-language meaning — no mythological jargon in output.
 */

interface EtymologyEntry {
  root: string;
  meaning: string; // Plain-language, actionable description of the name's core character
}

const NAMES: Record<string, EtymologyEntry> = {
  // — A —
  'alex':       { root: 'Greek alexō', meaning: 'active defender; steps in front of others to absorb what is coming. The name encodes protection as a first reflex, not an afterthought.' },
  'alexander':  { root: 'Greek Alexandros', meaning: 'defender of people; built to lead by shielding those behind them.' },
  'alexis':     { root: 'Greek alexō', meaning: 'the active protector; one who defends as a natural state.' },
  'alice':      { root: 'Old French Alice', meaning: 'noble truth-teller; one of natural dignity and directness.' },
  'amanda':     { root: 'Latin Amandus', meaning: 'worthy of love; one who is loveable at the core, not the surface.' },
  'amelia':     { root: 'Old German Amalia', meaning: 'industrious; the one for whom effort is a form of love.' },
  'andrew':     { root: 'Greek Andreas', meaning: 'the strong one; physical and moral courage as a defining quality.' },
  'anna':       { root: 'Hebrew Channah', meaning: 'grace and favor; carries what arrives freely and passes it on.' },
  'arthur':     { root: 'Celtic Artorius', meaning: 'bear-king; great, quiet, enduring authority — power without performance.' },
  'ashley':     { root: 'Old English Aesc leah', meaning: 'from the ash tree clearing; the one who creates open space in dense territory.' },
  'audrey':     { root: 'Old English Aethelthryth', meaning: 'noble strength; authority that is rooted in dignity, not force.' },
  'austin':     { root: 'Latin Augustinus', meaning: 'venerable; carries dignity naturally, without needing to announce it.' },
  'ava':        { root: 'Latin Avis', meaning: 'bird; the one who sees from altitude, moves between worlds.' },
  // — B —
  'benjamin':   { root: 'Hebrew Binyamin', meaning: 'son of the right hand; positioned for strength, built to stand beside power.' },
  'brandon':    { root: 'Old English Brōmdūn', meaning: 'from the broom-covered hill; the one who comes from high ground.' },
  'brian':      { root: 'Celtic Briain', meaning: 'high and noble; their nature is elevated without effort.' },
  'brittany':   { root: 'Latin Britannia', meaning: 'from Britain; carries an ancient lineage they may not fully recognize yet.' },
  // — C —
  'caleb':      { root: 'Hebrew Kalev', meaning: 'wholehearted; the one who gives everything to what they pursue.' },
  'cameron':    { root: 'Gaelic Cameron', meaning: 'crooked nose; has weathered difficulty and carries the mark of it. Experience over performance.' },
  'caroline':   { root: 'Latin Carolinus', meaning: 'free woman; cannot be fully contained or defined by others.' },
  'charles':    { root: 'Old German Karl', meaning: 'free man; cannot be owned or fully constrained. Sovereignty is the baseline.' },
  'chloe':      { root: 'Greek Khloē', meaning: 'blooming; always arriving into a new form, always in the act of becoming.' },
  'christian':  { root: 'Latin Christianus', meaning: 'the anointed one, set apart; carries a sense of being chosen for something.' },
  'claire':     { root: 'Latin Clara', meaning: 'clear and bright; the one who brings clarity into confusion.' },
  'christopher':{ root: 'Greek Christophoros', meaning: 'the one who carries something sacred for others.' },
  'crystal':    { root: 'Greek Krystallos', meaning: 'ice-clear; the one through whom light passes without distortion.' },
  // — D —
  'daniel':     { root: 'Hebrew Daniyel', meaning: 'answers to a higher standard; judgment that is not subject to popular opinion.' },
  'david':      { root: 'Hebrew Dawid', meaning: 'the beloved; the one others are drawn toward without being able to fully explain why.' },
  'diana':      { root: 'Latin Diana', meaning: 'the huntress; pursues with precision and doesn\'t stop until the mark is found.' },
  'dylan':      { root: 'Welsh Dillan', meaning: 'son of the sea; great depth, constant movement, always in motion beneath a surface.' },
  // — E —
  'edward':     { root: 'Old English Eadweard', meaning: 'guardian of prosperity; protects what has been built, not just what\'s visible.' },
  'eli':        { root: 'Hebrew Eli', meaning: 'ascended and uplifted; orientation is naturally toward what is higher.' },
  'eleanor':    { root: 'Old French Aliénor', meaning: 'the outsider\'s clarity; brings a perspective that insiders cannot generate.' },
  'elijah':     { root: 'Hebrew Eliyahu', meaning: 'stands for something absolute; cannot be moved from their conviction.' },
  'elizabeth':  { root: 'Hebrew Elisheba', meaning: 'consecrated to what matters; devotes themselves completely to what they hold as true.' },
  'ella':       { root: 'Old German Alja', meaning: 'brings their whole self; does not edit before arriving.' },
  'emily':      { root: 'Latin Aemilia', meaning: 'always reaching further; the rival who races against their own previous self.' },
  'emma':       { root: 'Old German Ermen', meaning: 'whole and universal; holds completeness within them.' },
  'ethan':      { root: 'Hebrew Eitan', meaning: 'strong and enduring; quiet, lasting power that outlasts louder forces.' },
  'evan':       { root: 'Welsh form of John', meaning: 'God is gracious; carries grace in the Welsh tradition.' },
  'evelyn':     { root: 'Old French Aveline', meaning: 'hazelnut tree; hidden depth and quiet nourishment.' },
  // — G —
  'gabriel':    { root: 'Hebrew Gavriel', meaning: 'strength of God; delivers what is essential to others — the messenger archetype.' },
  'george':     { root: 'Greek Georgios', meaning: 'the earth-worker; cultivates what grows slowly and cannot be rushed.' },
  'grace':      { root: 'Latin Gratia', meaning: 'grace and favor; their presence is itself a gift to the room.' },
  // — H —
  'hannah':     { root: 'Hebrew Channah', meaning: 'grace and favor; receives and extends what arrives freely.' },
  'harper':     { root: 'Old English Hearpe', meaning: 'the harp-player; medium is resonance — what moves through them moves others.' },
  'henry':      { root: 'Old German Heimrich', meaning: 'ruler of the home; builds sovereignty from the inside out.' },
  // — I —
  'isabella':   { root: 'Hebrew Elisheba', meaning: 'devoted to what matters; pledges themselves completely.' },
  'isaac':      { root: 'Hebrew Yitzchak', meaning: 'he laughs; holds lightness through difficulty — humor as a load-bearing structure.' },
  // — J —
  'jack':       { root: 'Medieval diminutive of John', meaning: 'God is gracious; the everyday carrier of what flows freely.' },
  'jackson':    { root: 'Son of Jack', meaning: 'grace-carrier\'s lineage; inherits the capacity for flow.' },
  'jacob':      { root: 'Hebrew Yaakov', meaning: 'the supplanter; takes the place they were born to occupy.' },
  'james':      { root: 'Hebrew Yaakov', meaning: 'the supplanter; moves into the role that was always theirs.' },
  'jason':      { root: 'Greek Iason', meaning: 'the healer; makes things whole — the one who integrates what was fractured.' },
  'jennifer':   { root: 'Cornish Gwenhwyfar', meaning: 'white phantom, fair one; luminous and somewhat mysterious to those around them.' },
  'jessica':    { root: 'Hebrew Yiskah', meaning: 'foresight; sees what others miss, often before they can explain why.' },
  'john':       { root: 'Hebrew Yohanan', meaning: 'God is gracious; the one through whom grace flows without resistance.' },
  'jordan':     { root: 'Hebrew Yarden', meaning: 'the descender; moves from high places down into the world of things.' },
  'joseph':     { root: 'Hebrew Yosef', meaning: 'he will add; increases what they touch — an expanding force.' },
  'julian':     { root: 'Latin Julianus', meaning: 'solar descendant; carries concentrated, warm, radiant energy.' },
  'julia':      { root: 'Latin Juliana', meaning: 'solar fire; ancient, warm, radiant energy.' },
  'justin':     { root: 'Latin Justinus', meaning: 'just and righteous; fairness is not a preference but a driving principle.' },
  // — K —
  'katherine':  { root: 'Greek Aikaterinē', meaning: 'pure; maintains an essential clarity that other things cannot cloud.' },
  'kevin':      { root: 'Irish Caoimhín', meaning: 'gentle birth; arrives softly but runs very deep.' },
  'kyle':       { root: 'Scottish Gaelic Caol', meaning: 'narrow strait; the channel through which essential things must pass.' },
  // — L —
  'lauren':     { root: 'Latin Laurentius', meaning: 'laurel-crowned; the victory has already been earned — recognition follows.' },
  'layla':      { root: 'Arabic Layla', meaning: 'night; associated with mystery, depth, and what operates beneath the visible.' },
  'leah':       { root: 'Hebrew Leah', meaning: 'the enduring one; sustains what others cannot carry for long.' },
  'liam':       { root: 'Irish Uilliam', meaning: 'resolute protector; the will to defend what matters, regardless of cost.' },
  'lily':       { root: 'Latin Lilium', meaning: 'purity and renewal; returns to an original clarity after difficulty.' },
  'logan':      { root: 'Scottish Gaelic Lagán', meaning: 'little hollow; holds space that others can shelter in.' },
  'lucas':      { root: 'Latin Lucius', meaning: 'light; the one who illuminates — makes things visible that were not.' },
  'luke':       { root: 'Greek Loukas', meaning: 'light-bringer; carries what illuminates into wherever they go.' },
  'luna':       { root: 'Latin Luna', meaning: 'the moon; light that is reflected, cyclical, and quietly powerful.' },
  'lydia':      { root: 'Greek Lydia', meaning: 'from ancient wealth; carries a richness that predates their current circumstances.' },
  // — M —
  'madison':    { root: 'English patronymic', meaning: 'inheritor of a gift given; carries something they did not have to earn.' },
  'mark':       { root: 'Latin Marcus', meaning: 'of Mars; the active force, the one who moves things rather than observing them.' },
  'mason':      { root: 'Old French Maçon', meaning: 'the stone-worker; builds permanent things with patience and precision.' },
  'matthew':    { root: 'Hebrew Mattityahu', meaning: 'gift of God; carries something given to them that they are meant to pass on.' },
  'maya':       { root: 'Sanskrit Maya', meaning: 'illusion and magic; works with perception itself — shapes how reality is experienced.' },
  'melissa':    { root: 'Greek Melissa', meaning: 'the bee; industrious and creates sweetness — transforms work into something sustaining.' },
  'mia':        { root: 'Form of Maria', meaning: 'the beloved; draws love naturally, without strategy.' },
  'michael':    { root: 'Hebrew Mikael', meaning: 'who is like God; sets an uncommon standard and holds it regardless.' },
  'mila':       { root: 'Slavic', meaning: 'gracious and dear; the one others are glad to be near.' },
  // — N —
  'natalie':    { root: 'Latin Natalia', meaning: 'born at the threshold; associated with arrivals and new beginnings.' },
  'nathan':     { root: 'Hebrew Natan', meaning: 'the generous one; what they have, they give.' },
  'nicholas':   { root: 'Greek Nikolaos', meaning: 'victory of the people; leads toward collective rather than individual triumph.' },
  'noah':       { root: 'Hebrew Noach', meaning: 'rest and comfort; creates sanctuary in the middle of turbulence.' },
  'nora':       { root: 'Irish Nóra', meaning: 'honor; the one others look to when they need to know what integrity looks like.' },
  // — O —
  'olivia':     { root: 'Latin Oliva', meaning: 'olive tree; cultivates peace over the long term — what they build outlasts the season.' },
  'oliver':     { root: 'Latin Olivarius', meaning: 'peace-cultivator; plants things that take decades to bear fruit.' },
  'owen':       { root: 'Welsh Owain', meaning: 'well-born; carries a natural nobility that does not depend on recognition.' },
  // — P —
  'patrick':    { root: 'Latin Patricius', meaning: 'the nobleman; carries the lineage of inherited dignity.' },
  'paul':       { root: 'Latin Paulus', meaning: 'the small one; power that exceeds its apparent scale — do not underestimate.' },
  'penelope':   { root: 'Greek Penelopē', meaning: 'the weaver; builds and unbuilds with patience — the process is the point.' },
  'peter':      { root: 'Greek Petros', meaning: 'the rock; the foundation on which things are built and can be relied upon.' },
  // — R —
  'rachel':     { root: 'Hebrew Rachel', meaning: 'gentle and enduring; soft on the surface, sustaining underneath.' },
  'rebecca':    { root: 'Hebrew Rivkah', meaning: 'the captivating one; holds attention without forcing it.' },
  'rene':       { root: 'Latin Renatus', meaning: 'reborn and born again; structurally built for cycles of ending and re-emergence. The phoenix middle name — does not remain in ash.' },
  'riley':      { root: 'Irish Raghallaigh', meaning: 'courageous; moves forward despite — the momentum is structural, not chosen.' },
  'richard':    { root: 'Old German Rikhard', meaning: 'powerful ruler; authority that comes from inner strength, not position.' },
  'robert':     { root: 'Old High German Hrodebert', meaning: 'bright fame; the brilliance becomes widely known because it is real.' },
  'ryan':       { root: 'Irish Riain', meaning: 'little king; royalty in all proportions — authority without needing the throne.' },
  // — S —
  'samantha':   { root: 'Hebrew Shemuel combined form', meaning: 'heard by God; the inner voice is clear and the signal comes through.' },
  'samuel':     { root: 'Hebrew Shemuel', meaning: 'heard by God; attuned to inner signal before external confirmation.' },
  'sarah':      { root: 'Hebrew Sara', meaning: 'princess; innate authority and nobility — does not have to be granted.' },
  'savannah':   { root: 'Spanish Sabana', meaning: 'treeless plain; open vistas and unobstructed seeing — what is coming is visible early.' },
  'scarlett':   { root: 'Old French Escarlate', meaning: 'the cloth-dyer; brings color, warmth, and intensity into what would be gray.' },
  'scott':      { root: 'Old English Scottas', meaning: 'the wanderer; carries a homeland while moving — roots that travel.' },
  'sean':       { root: 'Irish Seán', meaning: 'God is gracious; grace expressed in an Irish cadence — direct and warm.' },
  'sebastian':  { root: 'Greek Sebastianos', meaning: 'venerable and revered; commands natural respect without demanding it.' },
  'sophia':     { root: 'Greek Sophia', meaning: 'wisdom; understanding is a natural state, not something arrived at through study.' },
  'stephen':    { root: 'Greek Stephanos', meaning: 'the crown; the authority has already been earned — recognition is the formality.' },
  'stephanie':  { root: 'Greek Stephanos', meaning: 'crowned; earned authority worn as something natural.' },
  // — T —
  'thomas':     { root: 'Aramaic Toma', meaning: 'the twin; carries two natures simultaneously — the inner and outer rarely perfectly match.' },
  'tyler':      { root: 'Old French Tailleur', meaning: 'the tile-layer; shapes the surface others walk on — the work is underneath everything.' },
  // — V —
  'vanessa':    { root: 'Literary creation by Jonathan Swift', meaning: 'the invented self; carries a quality of having authored their own identity.' },
  'victoria':   { root: 'Latin Victoria', meaning: 'victory; oriented toward triumph as a natural direction of travel.' },
  // — W —
  'william':    { root: 'Old German Willahelm', meaning: 'resolute protector; holds what matters against whatever comes.' },
  // — Z —
  'zoey':       { root: 'Greek Zōē', meaning: 'life itself; carries aliveness into every room they enter.' },
};

const SURNAMES: Record<string, EtymologyEntry> = {
  'adams':      { root: 'Son of Adam (Hebrew Adamah)', meaning: 'earth-lineage; inheritor of the grounded, material nature — built from what is real.' },
  'anderson':   { root: 'Son of Andrew', meaning: 'strong one\'s lineage; inheritor of physical and moral courage.' },
  'baker':      { root: 'Old English Bæcere', meaning: 'the bread-maker; transforms raw material into something sustaining for others.' },
  'barnes':     { root: 'Old English Bern', meaning: 'the barn-keeper; stores and preserves what has been harvested — the memory of the season.' },
  'bell':       { root: 'Old French Belle / Old English Bell', meaning: 'the bell-ringer or the beautiful one; calls attention and resonance.' },
  'bennett':    { root: 'Latin Benedictus', meaning: 'the blessed one; under favor — things arrive more easily than they should.' },
  'brooks':     { root: 'Old English Brōc', meaning: 'the stream; moves through landscapes smoothly, finds the path of least resistance.' },
  'brown':      { root: 'Old English Brūn', meaning: 'the dark one; depth and groundedness — not surface, but substance.' },
  'butler':     { root: 'Old French Boteillier', meaning: 'the wine steward; manages what is valuable and knows when to present it.' },
  'campbell':   { root: 'Gaelic Caimbeul', meaning: 'crooked mouth; finds the sideways truth — the indirect approach that lands harder.' },
  'carter':     { root: 'Old English Cartare', meaning: 'the cart driver; moves things from where they are to where they\'re needed.' },
  'clark':      { root: 'Old English Clerc', meaning: 'scholar and keeper of records; the one who holds the knowledge.' },
  'cole':       { root: 'Old English Cola', meaning: 'charcoal; the concentrated, transformed, enduring form of what once burned — heat stored.' },
  'coleman':    { root: 'Irish Colmán', meaning: 'little dove; brings peace through a quiet, steady presence.' },
  'collins':    { root: 'Son of Colin (from Nicholas)', meaning: 'people\'s victory lineage; inheritor of the one who wins for the collective.' },
  'cook':       { root: 'Old English Coc', meaning: 'the cook; transforms raw ingredients into nourishment — the alchemist of sustenance.' },
  'cooper':     { root: 'Old English Coupere', meaning: 'the barrel-maker; creates containers that hold what others produce.' },
  'cruz':       { root: 'Spanish Cruz', meaning: 'the cross; stands at the intersection of things — where paths meet.' },
  'davis':      { root: 'Son of David', meaning: 'beloved\'s lineage; inherits the quality of being drawn toward.' },
  'diaz':       { root: 'Son of Diego (from James)', meaning: 'supplanter\'s lineage; inheritor of the one who takes the place that was always theirs.' },
  'dubois':     { root: 'French Du Bois', meaning: 'from the wood; emerges from deep, ancient, and largely unseen places.' },
  'edwards':    { root: 'Son of Edward', meaning: 'guardian of prosperity; inheritor of the one who protects what has been built.' },
  'ellis':      { root: 'Welsh form of Elijah', meaning: 'the absolute standard; lineage of the one who stands for what is unconditionally true.' },
  'evans':      { root: 'Son of Evan (Welsh John)', meaning: 'grace in the Welsh tradition; inheritor of what flows freely.' },
  'fisher':     { root: 'Old English Fiscere', meaning: 'the fisher; draws hidden things to the surface — finds what is not yet visible.' },
  'flores':     { root: 'Spanish Flores', meaning: 'flowers; brings life and color into what would otherwise be uniform.' },
  'ford':       { root: 'Old English Ford', meaning: 'the river crossing; helps others get from one side to the other — the bridge-builder.' },
  'foster':     { root: 'Old English Forsestre', meaning: 'forest guardian; tends wild, living things that take time to understand.' },
  'garcia':     { root: 'Basque/Spanish', meaning: 'the bear; primal, quiet, and enduring power — not to be mistaken for softness.' },
  'gibson':     { root: 'Son of Gib (from Gilbert)', meaning: 'bright-pledge lineage; inheritor of the one who gave their word and kept it.' },
  'gomez':      { root: 'Son of Gome (from Gothic Guma)', meaning: 'man-lineage; carries a direct, uncomplicated strength.' },
  'gonzalez':   { root: 'Son of Gonzalo', meaning: 'battle-saved lineage; the survivor\'s inheritance — strength proven under pressure.' },
  'graham':     { root: 'Old English Graeham', meaning: 'gray homestead; practical, subdued, enduring — not flashy but present for the long game.' },
  'green':      { root: 'Old English Grēne', meaning: 'dweller near growth; lives close to what is alive and developing.' },
  'griffin':    { root: 'Welsh Gruffudd', meaning: 'strong lord; combines strength and authority as a single expression.' },
  'gutierrez':  { root: 'Son of Gutierre (from Gothic Waldhari)', meaning: 'rule of the army lineage; inheritor of command and organized force.' },
  'hall':       { root: 'Old English Heall', meaning: 'from the manor; holds space for many — the one in whose presence others gather.' },
  'hamilton':   { root: 'Old English Hamill-tun', meaning: 'from the crooked hill; builds on unusual terrain — makes use of what others pass by.' },
  'harris':     { root: 'Son of Harry (from Henry)', meaning: 'home-ruler\'s lineage; inheritor of domestic sovereignty — the one who holds the house.' },
  'harrison':   { root: 'Son of Harry', meaning: 'home-ruler\'s progeny; the sovereignty passes through the line.' },
  'hayes':      { root: 'Old English Hæg', meaning: 'the hedged enclosure; creates and holds clear boundaries — knows what is inside and outside.' },
  'henderson':  { root: 'Son of Henry', meaning: 'home-ruler\'s lineage; inheritor of the one who governs from within.' },
  'hernandez':  { root: 'Son of Hernando', meaning: 'brave traveler\'s lineage; inheritor of adventurous courage across distance.' },
  'hill':       { root: 'Old English Hyll', meaning: 'from the hill; elevated view by nature — sees what those at ground level cannot.' },
  'howard':     { root: 'Old English Hereward', meaning: 'army guardian; protects the collective, not just the individual.' },
  'jackson':    { root: 'Son of Jack', meaning: 'grace-carrier\'s progeny; the next generation of what flows freely.' },
  'jenkins':    { root: 'Welsh Jenkin', meaning: 'small grace-carrier; the diminutive version carries the same quality in a more concentrated form.' },
  'johnson':    { root: 'Son of John', meaning: 'grace-carrier\'s lineage; inheritor of what flows freely and without obstruction.' },
  'jones':      { root: 'Welsh form of John', meaning: 'grace in the Welsh tradition; the everyday bearer of what arrives freely.' },
  'jordan':     { root: 'Hebrew Yarden', meaning: 'descender; moves from high places into the world — brings the elevated down to where it can be used.' },
  'kelly':      { root: 'Irish Ceallach', meaning: 'bright-headed; clarity and brilliance in thought as a characteristic quality.' },
  'kim':        { root: 'Korean Kim', meaning: 'gold; the one of highest value and purity — what is refined, not merely raw.' },
  'king':       { root: 'Old English Cyning', meaning: 'ruler; born to govern — authority that is structural, not achieved.' },
  'lambert':    { root: 'Old German Lantbert', meaning: 'land-bright; illuminates a territory — makes what is local radiant.' },
  'leblanc':    { root: 'French Le Blanc', meaning: 'the white one; brings clarity and light into what is clouded.' },
  'lee':        { root: 'Old English Leah', meaning: 'the meadow; comes from open, peaceful ground — space as an inheritance.' },
  'lefebvre':   { root: 'French Le Fèvre', meaning: 'the craftsman and smith; shapes what others use — the one behind the tools.' },
  'leroy':      { root: 'French Le Roi', meaning: 'the king; carries royal authority in the name itself — regal without needing the crown.' },
  'lewis':      { root: 'Old French Louis', meaning: 'the known fighter; renown that comes from action, not announcement.' },
  'lopez':      { root: 'Son of Lope (Latin Lupus)', meaning: 'wolf lineage; the hunter\'s progeny — precision and patience as inherited gifts.' },
  'martin':     { root: 'Latin Martinus', meaning: 'of Mars; the warrior energy in the surname — the one who moves things, who acts.' },
  'martel':     { root: 'Old French martellus (Latin)', meaning: 'hammer; the forger who drives stakes and shapes reality through repeated, directed force. Charles Martel held the line at Tours (732 AD) when everything was at stake. The surname carries the one who stays when others break.' },
  'martinez':   { root: 'Son of Martin', meaning: 'the warrior lineage; inheritor of the one who acts and moves things.' },
  'marshall':   { root: 'Old French Mareschal', meaning: 'the horse-manager; handles powerful, wild forces and makes them useful.' },
  'mason':      { root: 'Old French Maçon', meaning: 'the stone-worker; builds permanent things with patience and precision.' },
  'mcdonald':   { root: 'Son of Donald (Gaelic Domhnall)', meaning: 'world-ruler\'s lineage; inheritor of the one who governs at the largest scale.' },
  'miller':     { root: 'Old English Mylenweard', meaning: 'keeper of the mill; processes what others bring — the transformer in the middle.' },
  'mitchell':   { root: 'Hebrew Mikael', meaning: 'the uncommon standard; lineage of the one who held a line others could not.' },
  'moore':      { root: 'Old English Mōr', meaning: 'from the moor; at home in open, wild, uncultivated territory — needs room.' },
  'morales':    { root: 'Spanish Morales', meaning: 'mulberry trees; grows abundantly in wild places, without cultivation.' },
  'morgan':     { root: 'Welsh Morcant', meaning: 'sea-born; comes from vast, deep origin — there is more beneath than is visible.' },
  'morin':      { root: 'French Morin', meaning: 'from the moor; at home in open, wild, unstructured territory.' },
  'morris':     { root: 'Latin Mauritius', meaning: 'ancient and exotic depth; carries something from far away that the immediate context cannot fully contain.' },
  'murphy':     { root: 'Irish Murchadh', meaning: 'the sea warrior; the fighter who comes from depth — force sourced from below.' },
  'myers':      { root: 'Old French Mire', meaning: 'the physician; tends to what is broken — healing lineage.' },
  'nelson':     { root: 'Son of Neil (Irish Niall)', meaning: 'champion\'s lineage; inheritor of the fighter\'s spirit and competitive drive.' },
  'nguyen':     { root: 'Vietnamese Nguyễn', meaning: 'musical instrument strings; carries resonance — what they express moves through others.' },
  'ortega':     { root: 'Spanish Ortega', meaning: 'nettle; the one who stings when handled carelessly — not to be taken lightly.' },
  'ortiz':      { root: 'Son of Orti (from Fortun)', meaning: 'fortunate lineage; the one who has inherited a quality of being met halfway by circumstances.' },
  'owens':      { root: 'Son of Owen', meaning: 'well-born lineage; the natural nobility passes through the line.' },
  'parker':     { root: 'Old French Parcier', meaning: 'keeper of the park; tends and protects a bounded territory — the careful guardian.' },
  'perez':      { root: 'Son of Pedro (Latin Petrus)', meaning: 'rock lineage; built on what is solid and permanent — the foundation is in the name.' },
  'perry':      { root: 'Old French Perrier', meaning: 'pear tree grower; cultivates patience for slow fruit — knows good things take time.' },
  'petit':      { root: 'French Petit', meaning: 'small; power that is concentrated, not sprawling — do not be deceived by the scale.' },
  'phillips':   { root: 'Son of Philip (Greek Philippos)', meaning: 'lover-of-horses lineage; inheritor of wild, fast energy — something untameable in the blood.' },
  'pierre':     { root: 'French form of Petrus', meaning: 'the rock; solid, permanent, foundational — what is built on them holds.' },
  'price':      { root: 'Welsh ap Rhys', meaning: 'son of ardor; inheritor of passionate, enthusiastic energy.' },
  'ramos':      { root: 'Spanish Ramos', meaning: 'branches; extends in multiple directions from a single, deep root.' },
  'reed':       { root: 'Old English Rēad', meaning: 'red; or from the reedy marsh — at home in liminal, in-between territory.' },
  'reyes':      { root: 'Spanish Reyes', meaning: 'kings; carries royal energy in the surname — the inheritance of governance.' },
  'reynolds':   { root: 'Son of Reynold (Germanic Raginald)', meaning: 'counsel of the gods lineage; inheritor of wisdom that comes from a higher source.' },
  'richard':    { root: 'Old German Rikhard', meaning: 'powerful ruler; authority through inner strength, not position.' },
  'rivera':     { root: 'Spanish Rivera', meaning: 'the riverbank; lives at the edge between worlds — the threshold place.' },
  'roberts':    { root: 'Son of Robert', meaning: 'bright-fame\'s lineage; inheritor of visible brilliance.' },
  'robinson':   { root: 'Son of Robin (from Robert)', meaning: 'bright-fame\'s progeny; the brilliance passes through.' },
  'rodriguez':  { root: 'Son of Rodrigo (Germanic Hrōdric)', meaning: 'famous ruler\'s lineage; inheritor of renown and command.' },
  'rogers':     { root: 'Son of Roger (Germanic Hrōdger)', meaning: 'famous spear lineage; inheritor of precise, directed force.' },
  'ross':       { root: 'Gaelic Ros', meaning: 'the headland; stands at the point where land meets sea — between the solid and the vast.' },
  'rousseau':   { root: 'French Rousseau', meaning: 'little red one; concentrated, fiery energy in a compact form.' },
  'russell':    { root: 'Old French Roussel', meaning: 'little red one; small, concentrated, and combustible.' },
  'sanchez':    { root: 'Son of Sancho (Latin Sanctus)', meaning: 'the holy one\'s lineage; carries a sacred inheritance that may not be fully recognized.' },
  'sanders':    { root: 'Son of Alexander', meaning: 'defender-of-people lineage; inheritor of the protective force as a structural quality.' },
  'scott':      { root: 'Old English Scottas', meaning: 'the wanderer; carries a homeland while moving — roots that travel with them.' },
  'simmons':    { root: 'Son of Simon (Hebrew Shimon)', meaning: 'the hearing one\'s lineage; inheritor of the one who truly listens.' },
  'smith':      { root: 'Old English Smythe', meaning: 'the forge-worker; shapes metal and matter — makes what others use to make things.' },
  'stewart':    { root: 'Old English Stigweard', meaning: 'the house guardian; tends and manages what matters — the steward archetype.' },
  'sullivan':   { root: 'Irish Súilleabháin', meaning: 'dark-eyed; penetrating, watchful perception — misses very little.' },
  'taylor':     { root: 'Old French Tailleur', meaning: 'the cutter and shaper; makes what others wear — shapes the presentation of the world.' },
  'thomas':     { root: 'Aramaic Toma', meaning: 'the twin; carries two natures simultaneously — the lineage of the double.' },
  'thompson':   { root: 'Son of Thomas', meaning: 'twin\'s lineage; inherits the dual-nature — two things simultaneously true.' },
  'torres':     { root: 'Spanish Torres', meaning: 'towers; the one who rises and sees from height — elevated perspective as a structural quality.' },
  'turner':     { root: 'Old French Torneor', meaning: 'the lathe-worker; shapes through rotation — transformation through sustained circular motion.' },
  'walker':     { root: 'Old English Wealcere', meaning: 'cloth-walker; moves through what others have made — the one who processes the world.' },
  'wallace':    { root: 'Old Norman Wallace', meaning: 'the foreigner; always carries an outside perspective — the insider who is never fully inside.' },
  'west':       { root: 'Old English West', meaning: 'from the west; the direction of endings and the new beginnings that follow.' },
  'white':      { root: 'Old English Hwīt', meaning: 'the light one; carries and reflects brightness — clarity as a lineage.' },
  'williams':   { root: 'Son of William', meaning: 'resolute protector\'s lineage; inheritor of the will to defend what matters.' },
  'wilson':     { root: 'Son of William', meaning: 'resolute protector\'s lineage; the will to hold the line passes through.' },
  'wood':       { root: 'Old English Wudu', meaning: 'from the forest; at home in depth and mystery — the surface is rarely the whole story.' },
  'woods':      { root: 'Old English Wudu', meaning: 'forest-dweller; multiple trees, layered depth — complexity as a natural state.' },
  'wright':     { root: 'Old English Wryhta', meaning: 'the craftsman; makes things with their hands — the builder archetype.' },
  'young':      { root: 'Old English Geong', meaning: 'the young one; perpetual freshness — returns to a beginning state after every cycle.' },
};

export function getNameEtymology(name: string): EtymologyEntry | null {
  return NAMES[name.toLowerCase()] ?? SURNAMES[name.toLowerCase()] ?? null;
}

export function formatNameSignature(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const lines: string[] = [];

  for (const part of parts) {
    const entry = getNameEtymology(part);
    if (entry) {
      lines.push(`${part} (${entry.root}): ${entry.meaning}`);
    }
  }

  if (lines.length === 0) return '';

  let output = lines.join('\n');

  // Add synthesis if multiple name parts found
  if (lines.length >= 2) {
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const firstEntry = getNameEtymology(firstName);
    const lastEntry = getNameEtymology(lastName);
    if (firstEntry && lastEntry) {
      output += `\n\nName taken whole: the one who ${firstEntry.meaning.split(';')[0].toLowerCase()}, who carries the ${lastEntry.root.split(' ').pop()?.toLowerCase() ?? 'surname'}'s quality of ${lastEntry.meaning.split(';')[0].toLowerCase()}.`;
    }
  }

  return output;
}
