import { useState, useRef, useEffect } from "react";

// ── FARVER ────────────────────────────────────────────────
const C = { navy: "#1A3A5C", blue: "#2E6DA4", light: "#D5E8F0", gold: "#C8A84B", gray: "#5A5A5A", bg: "#f7f9fb", warm: "#f4ede4" };

// ── TRIN-SEKVENS: Åbning → 6×(Model + Humant) → Afslutning = 14 trin ──
const STEPS = [
  { id: "aabning", nr: 0, type: "aabning", navn: "Åbning", label: "Åbning", farve: C.blue, spørgsmål: "Hvad bringer du med ind i rummet?", kontekst: "Inden vi begynder — hvad fylder, og hvad håber du at få ud af dette?" },
  { id: "t1-model", nr: 1, type: "model", navn: "Spejling", label: "1. Spejling", farve: C.blue, spørgsmål: "Hvad er det vi egentlig står i?", kontekst: "Se virkeligheden klart — ikke som vi ønsker den." },
  { id: "t1-human", nr: 1, type: "human", navn: "Usikkerhed", label: "Usikkerhed", farve: C.gold, spørgsmål: "Hvad bærer du med dig — som du ikke siger højt?", kontekst: "Det menneskelige rum — her er plads til det der fylder." },
  { id: "t2-model", nr: 2, type: "model", navn: "Klarhed", label: "2. Klarhed", farve: C.blue, spørgsmål: "Hvad er problemet bag problemet?", kontekst: "Find den egentlige diagnose bag symptomerne." },
  { id: "t2-human", nr: 2, type: "human", navn: "Sårbarhed", label: "Sårbarhed", farve: C.gold, spørgsmål: "Hvad koster det at se klart?", kontekst: "Det menneskelige rum — ærlighed kræver sårbarhed." },
  { id: "t3-model", nr: 3, type: "model", navn: "Valg", label: "3. Valg", farve: C.blue, spørgsmål: "Hvad vælger vi — og hvad vælger vi fra?", kontekst: "At sige ja er kun meningsfuldt, hvis vi også siger nej." },
  { id: "t3-human", nr: 3, type: "human", navn: "Mod", label: "Mod", farve: C.gold, spørgsmål: "Hvad koster det at vælge — og hvad koster det ikke at gøre det?", kontekst: "Det menneskelige rum — modige valg kræver noget af os." },
  { id: "t4-model", nr: 4, type: "model", navn: "Struktur", label: "4. Struktur", farve: C.blue, spørgsmål: "Hvordan organiserer vi os?", kontekst: "Design de rammer der gør strategien mulig." },
  { id: "t4-human", nr: 4, type: "human", navn: "Tillid", label: "Tillid", farve: C.gold, spørgsmål: "Hvad bygger vi rammerne på — kontrol eller tillid?", kontekst: "Det menneskelige rum — rammer fortæller noget om relationer." },
  { id: "t5-model", nr: 5, type: "model", navn: "Kernen", label: "5. Kernen", farve: C.blue, spørgsmål: "Kan vi se det i praksis tirsdag kl. 10?", kontekst: "Prøven: kan strategien mærkes i hverdagen?" },
  { id: "t5-human", nr: 5, type: "human", navn: "Ærlighed", label: "Ærlighed", farve: C.gold, spørgsmål: "Hvad ser vi — som vi ikke taler om?", kontekst: "Det menneskelige rum — sandheden kræver mod." },
  { id: "t6-model", nr: 6, type: "model", navn: "Forankring", label: "6. Forankring", farve: C.blue, spørgsmål: "Hvordan holder vi det levende?", kontekst: "Strategier dør ikke af modstand — de dør af glemsel." },
  { id: "t6-human", nr: 6, type: "human", navn: "Udholdenhed", label: "Udholdenhed", farve: C.gold, spørgsmål: "Hvad kræver det at holde fast — når hverdagen vender tilbage?", kontekst: "Det menneskelige rum — forandring kræver udholdenhed." },
  { id: "afslutning", nr: 7, type: "afslutning", navn: "Afslutning", label: "Afslutning", farve: C.navy, spørgsmål: "Hvad tager vi med herfra — og hvad gør vi i morgen?", kontekst: "Vi samler op: erkendelser, beslutninger og konkrete næste skridt." },
];

const ROLLER = [
  { key: "skoleleder", label: "Skoleleder", icon: "🏫", desc: "Arbejd med din personlige ledelsesopgave" },
  { key: "ledelsesteam", label: "Ledelsesteam", icon: "👥", desc: "Styrk jeres fælles retning og klarhed" },
  { key: "bestyrelse", label: "Bestyrelse", icon: "🏛️", desc: "Skærp bestyrelsens strategiske rolle" },
];

// ── PROCESKORT DATA ───────────────────────────────────────
const AABNING = {
  forside: "Før vi begynder — hvad bringer I med ind i rummet?",
  aabning: ["Hvad fylder hos jer lige nu?", "Hvad håber I at gå herfra med?", "Hvad er den vigtigste ting, I har brug for at blive klogere på i dag?"],
  ramme: ["Vi arbejder med virkelige situationer — ikke cases", "Der er ingen rigtige svar — men der er skarpere spørgsmål", "Vi arbejder os gennem modellens trin — ét ad gangen", "Hvert trin har et output, der fører videre til det næste"],
  erkendelse: "Et fælles afsæt: hvad er vi her for, og hvad vil vi arbejde med?",
};

const AFSLUTNING = {
  forside: "Hvad tager vi med herfra — og hvad gør vi i morgen?",
  aabning: ["Hvad er den vigtigste erkendelse fra i dag?", "Hvad har vi besluttet — og hvem gør hvad?", "Hvad var overraskende — eller svært?", "Hvad har vi brug for at vende tilbage til?"],
  ramme: ["Hvert trin har givet et konkret output", "Handlingerne starter i morgen — ikke 'snart'", "Vi mødes igen tirsdag kl. 10 — med status på det vi aftalte"],
  erkendelse: "Vi ved, hvad vi gør — og vi ved, hvem der gør hvad.",
};

const MODEL_KORT = {
  skoleleder: [
    { forside: "Hvad er det, jeg faktisk står i som skoleleder?", aabning: ["Hvad er det for en situation, jeg står i lige nu?", "Hvad kalder tydeligt på min opmærksomhed?", "Hvor mister jeg retning eller overblik?"], skaerpelse: ["Hvad gør jeg i dag — som ikke skaber retning?", "Hvornår bliver jeg uklar i min ledelse?", "Hvad undgår jeg at tage fat på?"], perspektiv: ["Hvad kalder situationen på af ledelse?", "Hvad er min opgave — og hvad er ikke min?", "Hvad gør jeg anderledes fra i morgen?"], erkendelse: "Et klart billede af situationen og skolelederens opgave." },
    { forside: "Hvad er det egentlige problem — ikke symptomet?", aabning: ["Hvad holder mig faktisk tilbage?", "Hvad forsøger jeg at løse — igen og igen?", "Hvad binder problemerne sammen?"], skaerpelse: ["Hvad er symptomet — og hvad er problemet bag?", "Hvad ville klarhed gøre muligt?", "Hvad undgår jeg at sige højt?"], perspektiv: ["Hvad kræver det at finde egentlig klarhed?", "Hvad kan ingen se tydeligere end jeg?", "Hvad ville ændre sig, hvis jeg var klar?"], erkendelse: "En præcis formulering af det egentlige problem." },
    { forside: "Hvad er mit ledelsesmæssige valg?", aabning: ["Hvad er de reelle muligheder?", "Hvad trækker mig i forskellige retninger?", "Hvad viger jeg uden om?"], skaerpelse: ["Hvad siger jeg ja til — med min tid?", "Hvad er jeg nødt til at sige nej til?", "Hvad koster det ikke at vælge?"], perspektiv: ["Hvad kræver valget af mig som leder?", "Hvad er konsekvensen for teamet?", "Hvad ville jeg fortryde?"], erkendelse: "Et tydeligt og ansvarligt ledelsesvalg." },
    { forside: "Har jeg designet de rigtige rammer?", aabning: ["Hvad er den nuværende struktur til for?", "Hvad fungerer — og hvad ikke?", "Hvem er strukturen designet for?"], skaerpelse: ["Hvilke møder skaber retning — og hvilke er vane?", "Hvad er for meget — og hvad mangler?", "Hvad ville jeg ændre fra scratch?"], perspektiv: ["Hvad kalder strukturen på af ledelse?", "Hvad skal designes — og hvad frigives?", "Hvad ændrer jeg først?"], erkendelse: "En klar forståelse af, hvad der skal redesignes." },
    { forside: "Er strategien til stede tirsdag kl. 10?", aabning: ["Hvad sker der faktisk i vores møder?", "Hvad siger dagsordenen om prioriteringerne?", "Hvad siger stemningen om kulturen?"], skaerpelse: ["Hvad beslutter vi — og hvad udskydes?", "Hvad er alle enige om at undgå?", "Hvornår mærkes strategien?"], perspektiv: ["Hvad kalder det på af ledelse?", "Hvad er mit ansvar?", "Hvad gør jeg anderledes næste tirsdag?"], erkendelse: "Et ærligt billede af, om strategien lever." },
    { forside: "Hvad gør jeg, for at det holder?", aabning: ["Hvad er mit ansvar for at holde strategien levende?", "Hvad gør jeg allerede — og hvad har jeg glemt?", "Hvad er tegnet på, at det holder?"], skaerpelse: ["Hvad dør stille — fordi ingen holder fast?", "Hvornår tjekker jeg op — og hvornår ikke?", "Hvad er der kun brug for, at jeg gør?"], perspektiv: ["Hvad er min forankringsrolle?", "Hvad er tegnet på, at strategien lever?", "Hvad gør jeg konkret for at holde det levende?"], erkendelse: "Et forpligtende billede af min forankringsrolle." },
  ],
  ledelsesteam: [
    { forside: "Hvad er det, vi faktisk står i sammen?", aabning: ["Hvad er situationen, vi befinder os i fælles?", "Hvornår håndterer vi situationer forskelligt?", "Hvornår overlader vi noget uden aftale?"], skaerpelse: ["Hvad gør vi, som ikke skaber klarhed?", "Hvad undgår vi at tale om?", "Hvornår er vi for enige — eller for utydelige?"], perspektiv: ["Hvad kalder situationen på af fælles ledelse?", "Hvad er vores fælles opgave?", "Hvad gør vi anderledes fra næste uge?"], erkendelse: "Et klart billede af teamets fælles opgave." },
    { forside: "Hvad er det, vi ikke får talt om?", aabning: ["Hvilke mønstre ser vi gentage sig?", "Hvad ligger bag uroen hos medarbejderne?", "Hvad ser vi, som vi ikke har delt?"], skaerpelse: ["Hvornår nøjes vi med at håndtere?", "Hvilken samtale har vi undgået?", "Hvad ved vi — men har ikke gjort fælles?"], perspektiv: ["Hvad er den fælles opgave, der viser sig?", "Hvad kræver det at handle?", "Hvad er den første fælles handling?"], erkendelse: "En fælles erkendelse af den egentlige opgave." },
    { forside: "Hvad prioriterer vi — og hvad holder vi op med?", aabning: ["Hvad er vores fælles topprioritet?", "Hvad ville vi stoppe, hvis vi turde?", "Hvad gør vi, fordi det forventes?"], skaerpelse: ["Hvornår lader vi alle køre deres eget?", "Hvad sker der, når vi ikke er enige?", "Hvad undgår vi at vælge fra?"], perspektiv: ["Hvad ville medarbejderne mærke?", "Hvad kræver det at stå sammen?", "Hvad kommunikerer vi — og hvornår?"], erkendelse: "En fælles prioritering, der styrker det hele." },
    { forside: "Hvordan organiserer vi os for det valgte?", aabning: ["Hvordan fordeler vi ansvaret?", "Hvilke rutiner understøtter retningen?", "Hvad skal ledelsesmøderne handle om?"], skaerpelse: ["Hvornår arbejder vi i hinandens felter?", "Hvilken rutine ville vi droppe?", "Hvad sker der, når organiseringen ikke matcher?"], perspektiv: ["Hvad ville medarbejderne mærke?", "Hvilken aftale laver vi om roller?", "Hvad ændrer I fælles først?"], erkendelse: "Klare roller og mønstre for opfølgning." },
    { forside: "Kan vi se vores fælles retning i hverdagen?", aabning: ["Kan man se, at vi har en fælles retning?", "Hvad ville vi opdage tirsdag kl. 10?", "Hvad fortæller medarbejdernes spørgsmål?"], skaerpelse: ["Hvornår er planen kun fælles i ledelsesmøderne?", "Hvad gør vi forskelligt, som forvirrer?", "Hvornår dækker vi over uklarhed?"], perspektiv: ["Hvad ville medarbejderne mærke?", "Hvad gør vi anderledes fra i morgen?", "Hvor justerer vi først?"], erkendelse: "Strategi der lever i hverdagen." },
    { forside: "Hvordan sikrer vi, at beslutningerne lever?", aabning: ["Hvad gør vi i næste uge for at følge op?", "Hvordan holder vi hinanden fast?", "Hvordan kommunikerer vi beslutningerne?"], skaerpelse: ["Hvornår har vi besluttet noget, der døde stille?", "Hvad sker der, når én falder tilbage?", "Hvad er vores største risiko?"], perspektiv: ["Hvad mærker medarbejderne om en måned?", "Hvornår mødes vi næste gang?", "Hvad aftaler vi konkret?"], erkendelse: "Konkrete aftaler og fælles ansvar." },
  ],
  bestyrelse: [
    { forside: "Hvad er det, vi faktisk står i som bestyrelse?", aabning: ["Hvad hører vi fra forældre og omverden?", "Hvornår er vi usikre på vores rolle?", "Hvad er vi i tvivl om ift. ledelsen?"], skaerpelse: ["Hvad gør vi, som skaber uklarhed?", "Hvad reagerer vi på i stedet for at sætte retning?", "Hvornår er vi for detaljerede eller for passive?"], perspektiv: ["Hvad kalder situationen på?", "Hvad er vores opgave — og hvad er det ikke?", "Hvad tager vi med herfra?"], erkendelse: "Et klart billede af bestyrelsens opgave." },
    { forside: "Hvad ser vi ikke — som vi burde se?", aabning: ["Hvad fortæller tallene os egentlig?", "Hvad ved vi for lidt om?", "Hvad ville vi opdage bag referaterne?"], skaerpelse: ["Hvornår accepterer vi for glatte svar?", "Hvad spørger vi aldrig om?", "Hvornår er vi for langt fra virkeligheden?"], perspektiv: ["Hvad er bestyrelsens opgave her?", "Hvad kræver det at spørge ind uden at overtage?", "Hvad spørger vi ledelsen om?"], erkendelse: "En skarpere forståelse af skolens situation." },
    { forside: "Hvad beslutter vi — og hvad lader vi ligge?", aabning: ["Hvad er det vigtigste, bestyrelsen kan beslutte?", "Hvad beder vi ledelsen om, som modarbejder fokus?", "Hvad ville vi sige nej til?"], skaerpelse: ["Hvad hører til bestyrelsens bord?", "Hvornår drøfter vi i stedet for at beslutte?", "Hvad koster det, at vi ikke vælger?"], perspektiv: ["Hvad ville ledelsen mærke?", "Hvad kræver valget af os?", "Hvad kommunikerer vi?"], erkendelse: "En tydelig bestyrelsesprioritering." },
    { forside: "Har vi en struktur der skaber værdi?", aabning: ["Hvad er vores møder til for?", "Hvad handler de om — og hvad burde de?", "Hvad savner vi i organiseringen?"], skaerpelse: ["Hvornår handler møderne om drift?", "Hvad er for meget — og hvad for lidt?", "Hvad ville vi ændre forfra?"], perspektiv: ["Hvad ville ledelsen mærke?", "Hvad ændrer vi i mødestrukturen?", "Hvad er den vigtigste ændring?"], erkendelse: "En bestyrelsesstruktur der skaber værdi." },
    { forside: "Kan vi mærke bestyrelsens aftryk?", aabning: ["Hvad ville vi se en tirsdag kl. 10?", "Hvad ved medarbejderne om vores prioriteringer?", "Hvornår satte bestyrelsen sidst aftryk?"], skaerpelse: ["Hvad sker der mellem møderne?", "Hvornår er vi kun en formalitet?", "Hvad ville medarbejderne sige?"], perspektiv: ["Hvad kan bestyrelsen gøre uden at overtage?", "Hvad er tegnet på, at vi gør forskel?", "Hvad gør vi fra næste møde?"], erkendelse: "Bestyrelsesarbejde der mærkes." },
    { forside: "Hvordan forankrer vi bestyrelsens arbejde?", aabning: ["Hvad er vores opfølgningsstruktur?", "Hvornår evaluerer vi os selv?", "Hvad gør vi, når nye medlemmer kommer?"], skaerpelse: ["Hvad dør stille, fordi ingen følger op?", "Hvad gør vi med gode intentioner?", "Hvornår bliver beslutninger til handling?"], perspektiv: ["Hvad er tegnet på en velfungerende bestyrelse?", "Hvad er vores vigtigste aftale?", "Hvem holder os fast?"], erkendelse: "En forpligtende forankring af bestyrelsens rolle." },
  ],
};

const HUMAN_KORT = {
  skoleleder: [
    { label: "Usikkerhed", forside: "Hvad bærer du med dig — som du ikke siger højt?", aabning: ["Hvor føler du dig alene med ansvaret?", "Hvad er du usikker på — men lader som om du har styr på?", "Hvad ville du sige, hvis du turde?"], skaerpelse: ["Hvad koster det at bære usikkerheden alene?", "Hvornår bliver du en anden leder, end du vil være?", "Hvad sker der, når usikkerheden ikke bliver sagt?"], perspektiv: ["Hvad ville ændre sig, hvis usikkerheden fik plads?", "Hvad har du brug for fra dem du arbejder med?", "Hvad siger du højt her — som du ikke har sagt før?"], erkendelse: "Åbenhed om det der fylder — som grundlag for ærlig dialog." },
    { label: "Sårbarhed", forside: "Hvad koster det at se klart?", aabning: ["Hvornår er det lettere ikke at vide?", "Hvad risikerer du ved at sige det, du ser?", "Hvad sker der, når nogen siger noget ærligt?"], skaerpelse: ["Hvem betaler prisen, når vi ikke tør se klart?", "Hvornår bliver loyalitet en hindring for ærlighed?", "Hvad sker der, når vi undgår de rigtige spørgsmål?"], perspektiv: ["Hvad ville det betyde, hvis I turde se klart — sammen?", "Hvornår er sårbarhed en forudsætning for god ledelse?", "Hvad har I brug for af hinanden?"], erkendelse: "Tillid til at sige det, vi ser — også når det er svært." },
    { label: "Mod", forside: "Hvad koster det at vælge — og hvad koster det ikke at gøre det?", aabning: ["Hvem skuffer du, når du vælger tydeligt?", "Hvad er du bange for at tabe?", "Hvad ville du vælge med opbakning?"], skaerpelse: ["Hvem betaler prisen for din manglende beslutning?", "Hvornår er 'vi tager den til næste gang' et fravalg?", "Hvad sker der med respekten, når valget udebliver?"], perspektiv: ["Hvad gør modige valg ved et fællesskab?", "Hvad er det valg, du har udsat?", "Hvad har du brug for af de andre for at turde?"], erkendelse: "Erkendelse af hvad modet kræver — og hvad det giver." },
    { label: "Tillid", forside: "Hvad bygger vi rammerne på — kontrol eller tillid?", aabning: ["Hvornår skaber vi strukturer af tillid — og hvornår af mistillid?", "Hvad siger organiseringen om det, vi tror om hinanden?", "Hvad sker der, når rammerne er uklare?"], skaerpelse: ["Hvornår bruger vi struktur som skjold mod det menneskelige?", "Hvad sker der med relationer, når alt bliver processer?", "Hvornår er fravær af struktur fravær af omsorg?"], perspektiv: ["Hvad ville det betyde, hvis strukturerne var bygget på tillid?", "Hvornår har en god ramme givet frihed?", "Hvad har I brug for af hinanden?"], erkendelse: "Bevidsthed om hvad rammerne gør ved mennesker." },
    { label: "Ærlighed", forside: "Hvad ser vi — som vi ikke taler om?", aabning: ["Hvad ved alle — men ingen siger?", "Hvad ville vi se, hvis vi turde?", "Hvornår er der forskel på det, vi siger, og det vi gør?"], skaerpelse: ["Hvem betaler prisen, når vi ikke er ærlige?", "Hvad sker der med tilliden, når afstanden vokser?", "Hvornår er vi mere optagede af at beskytte os selv?"], perspektiv: ["Hvad ville ændre sig, hvis vi talte om det, vi ser?", "Hvad siger I til hinanden nu — som I ikke har sagt før?", "Hvad tager du ansvar for at sige?"], erkendelse: "Mod til at tale om virkeligheden." },
    { label: "Udholdenhed", forside: "Hvad kræver det at holde fast — når hverdagen vender tilbage?", aabning: ["Hvad er det sværeste ved at holde fast i forandring?", "Hvad har du brug for fra andre?", "Hvornår er det okay at tvivle?"], skaerpelse: ["Hvad sker der med mennesker, der hele tiden skal forandre sig?", "Hvornår presser vi mere på — i stedet for at anerkende?", "Hvad koster det, når vi ikke giver plads til træthed?"], perspektiv: ["Hvad giver dig energi til at fortsætte?", "Hvad tager du med herfra?", "Hvad gør du anderledes fra i morgen — for at passe på dig selv?"], erkendelse: "En realistisk erkendelse af hvad forandring kræver." },
  ],
  ledelsesteam: [
    { label: "Usikkerhed", forside: "Hvad bærer du med dig — som du ikke siger højt?", aabning: ["Hvor føler du dig alene med ansvaret?", "Hvad er du usikker på?", "Hvad ville du sige, hvis du turde?"], skaerpelse: ["Hvad koster det at bære usikkerheden alene?", "Hvornår bliver du en anden leder?", "Hvad sker der, når usikkerheden ikke siges?"], perspektiv: ["Hvad ville ændre sig, hvis usikkerheden fik plads?", "Hvad har du brug for?", "Hvad siger du højt her?"], erkendelse: "Åbenhed som grundlag for ærlig dialog." },
    { label: "Sårbarhed", forside: "Hvad koster det at se klart?", aabning: ["Hvornår er det lettere ikke at vide?", "Hvad risikerer du ved at sige det?", "Hvad sker der, når nogen er ærlig?"], skaerpelse: ["Hvem betaler prisen?", "Hvornår hindrer loyalitet ærlighed?", "Hvad sker der, når vi undgår spørgsmålene?"], perspektiv: ["Hvad ville det betyde, hvis I turde se klart?", "Hvornår er sårbarhed en forudsætning?", "Hvad har I brug for af hinanden?"], erkendelse: "Tillid til at sige det, vi ser." },
    { label: "Mod", forside: "Hvad koster det at vælge?", aabning: ["Hvem skuffer du?", "Hvad er du bange for at tabe?", "Hvad ville du vælge med opbakning?"], skaerpelse: ["Hvem betaler prisen?", "Hvornår er udsættelse et fravalg?", "Hvad sker der med respekten?"], perspektiv: ["Hvad gør modige valg?", "Hvad har du udsat?", "Hvad har du brug for?"], erkendelse: "Hvad modet kræver — og hvad det giver." },
    { label: "Tillid", forside: "Kontrol eller tillid?", aabning: ["Hvornår tillid — hvornår mistillid?", "Hvad siger organiseringen om hinanden?", "Hvad sker der med uklare rammer?"], skaerpelse: ["Hvornår er struktur et skjold?", "Hvad sker der, når alt er processer?", "Hvornår er fravær af struktur fravær af omsorg?"], perspektiv: ["Hvad ville tillidsbaserede strukturer betyde?", "Hvornår har rammer givet frihed?", "Hvad har I brug for?"], erkendelse: "Rammer bygget på tillid — ikke kontrol." },
    { label: "Ærlighed", forside: "Hvad ser vi — som vi ikke taler om?", aabning: ["Hvad ved alle?", "Hvad ville vi se?", "Hvornår er der forskel på ord og handling?"], skaerpelse: ["Hvem betaler prisen?", "Hvad sker der med tilliden?", "Hvornår beskytter vi os selv?"], perspektiv: ["Hvad ville ændre sig?", "Hvad siger I nu?", "Hvad tager du ansvar for?"], erkendelse: "Mod til at tale om virkeligheden." },
    { label: "Udholdenhed", forside: "Hvad kræver det at holde fast?", aabning: ["Hvad er det sværeste?", "Hvad har du brug for?", "Hvornår er det okay at tvivle?"], skaerpelse: ["Hvad sker der med mennesker i forandring?", "Hvornår presser vi mere?", "Hvad koster manglende plads til træthed?"], perspektiv: ["Hvad giver energi?", "Hvad tager du med?", "Hvad gør du for dig selv?"], erkendelse: "Hvad forandring kræver." },
  ],
  bestyrelse: [
    { label: "Det menneskelige rum", forside: "Hvad bærer du med dig — som du ikke siger højt?", aabning: ["Hvor føler du dig alene?", "Hvad er du usikker på?", "Hvad ville du sige?"], skaerpelse: ["Hvad koster usikkerheden?", "Hvornår bliver du en anden?", "Hvad sker der, når det ikke siges?"], perspektiv: ["Hvad ville ændre sig?", "Hvad har du brug for?", "Hvad siger du højt her?"], erkendelse: "Åbenhed som grundlag for dialog." },
    { label: "Det menneskelige rum", forside: "Hvad koster det at se klart?", aabning: ["Hvornår er det lettere ikke at vide?", "Hvad risikerer du?", "Hvad sker der med ærlighed?"], skaerpelse: ["Hvem betaler prisen?", "Hvornår hindrer loyalitet?", "Hvad sker der over tid?"], perspektiv: ["Hvad ville ærligt samarbejde betyde?", "Hvornår er sårbarhed nødvendig?", "Hvad har I brug for?"], erkendelse: "Tillid til at sige det, vi ser." },
    { label: "Det menneskelige rum", forside: "Hvad koster det at vælge?", aabning: ["Hvem skuffer du?", "Hvad er du bange for?", "Hvad ville du vælge?"], skaerpelse: ["Hvem betaler prisen?", "Hvornår er udsættelse fravalg?", "Hvad sker der med respekten?"], perspektiv: ["Hvad gør modige valg?", "Hvad har du udsat?", "Hvad har du brug for?"], erkendelse: "Hvad modet kræver." },
    { label: "Det menneskelige rum", forside: "Kontrol eller tillid?", aabning: ["Hvornår tillid — hvornår mistillid?", "Hvad siger organiseringen?", "Hvad med uklare rammer?"], skaerpelse: ["Hvornår er struktur et skjold?", "Hvad med relationer og processer?", "Hvornår er fravær af struktur fravær af omsorg?"], perspektiv: ["Hvad ville tillid betyde?", "Hvornår har rammer givet frihed?", "Hvad har I brug for?"], erkendelse: "Bevidsthed om rammer og mennesker." },
    { label: "Det menneskelige rum", forside: "Hvad ser vi — som vi ikke taler om?", aabning: ["Hvad ved alle?", "Hvad ville vi se?", "Hvornår er der forskel?"], skaerpelse: ["Hvem betaler prisen?", "Hvad med tilliden?", "Hvornår beskytter vi os selv?"], perspektiv: ["Hvad ville ændre sig?", "Hvad siger I nu?", "Hvad tager du ansvar for?"], erkendelse: "Mod til virkeligheden." },
    { label: "Det menneskelige rum", forside: "Hvad kræver det at holde fast?", aabning: ["Hvad er det sværeste?", "Hvad har du brug for?", "Hvornår er tvivl okay?"], skaerpelse: ["Hvad sker der med mennesker?", "Hvornår presser vi?", "Hvad koster manglende plads?"], perspektiv: ["Hvad giver energi?", "Hvad tager du med?", "Hvad gør du for dig selv?"], erkendelse: "Hvad forandring kræver." },
  ],
};

function getKortForStep(step, rolle) {
  if (step.type === "aabning") return AABNING;
  if (step.type === "afslutning") return AFSLUTNING;
  const idx = step.nr - 1;
  if (step.type === "model") return MODEL_KORT[rolle]?.[idx];
  if (step.type === "human") return HUMAN_KORT[rolle]?.[idx];
  return null;
}

// ── ROLLE-VÆLGER ──────────────────────────────────────────
function RollePicker({ onSelect }) {
  const [hover, setHover] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(170deg, ${C.navy} 0%, ${C.blue} 50%, ${C.light} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 20, padding: "48px 40px", maxWidth: 520, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(26,58,92,0.25)" }}>
        <div style={{ fontSize: 13, color: C.blue, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Strategiskskole.dk</div>
        <h1 style={{ fontFamily: "'Merriweather', serif", fontSize: 26, color: C.navy, margin: "0 0 6px", fontWeight: 700, lineHeight: 1.3 }}>
          Tirsdag kl. 10-modellen<sup style={{ fontSize: 14 }}>®</sup>
        </h1>
        <p style={{ color: C.gray, fontSize: 15, margin: "0 0 36px", lineHeight: 1.5 }}>
          Strategi, der kan mærkes i praksis
        </p>
        <p style={{ color: C.navy, fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Vælg din rolle:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ROLLER.map((r, i) => (
            <button key={r.key} onClick={() => onSelect(r.key)}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: hover === i ? C.navy : "white", color: hover === i ? "white" : C.navy, border: `1.5px solid ${C.navy}20`, borderRadius: 12, cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{r.label}</div>
                <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{r.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <p style={{ marginTop: 32, color: "#bbb", fontSize: 11 }}>Strategi, der kan mærkes i praksis</p>
      </div>
    </div>
  );
}

// ── TRIN TABS ─────────────────────────────────────────────
function TrinTabs({ aktivt, setAktivt, beskedCount }) {
  return (
    <div style={{ display: "flex", gap: 2, padding: "0 12px", overflowX: "auto", background: "white", borderBottom: `1px solid ${C.light}` }}>
      {STEPS.map((s, i) => {
        const er = aktivt === i;
        const done = (beskedCount[s.id] || 0) >= 4;
        const isHuman = s.type === "human";
        return (
          <button key={s.id} onClick={() => setAktivt(i)} style={{
            padding: "10px 10px", border: "none", cursor: "pointer",
            background: "transparent", borderBottom: er ? `3px solid ${s.farve}` : "3px solid transparent",
            color: er ? s.farve : C.gray, fontWeight: er ? 700 : 500, fontSize: 11,
            whiteSpace: "nowrap", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 4,
            fontStyle: isHuman ? "italic" : "normal", opacity: er ? 1 : isHuman ? 0.7 : 0.85,
          }}>
            {isHuman ? (
              <span style={{ width: 18, height: 18, borderRadius: "50%", fontSize: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? C.gold : er ? `${C.gold}30` : "#f0ebe4", color: done ? "white" : C.gold }}>♡</span>
            ) : (
              <span style={{ width: 18, height: 18, borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? s.farve : er ? s.farve : "#e5e7eb", color: done || er ? "white" : C.gray }}>
                {s.type === "aabning" ? "→" : s.type === "afslutning" ? "←" : done ? "✓" : s.nr}
              </span>
            )}
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ── PROCESKORT DRAWER ─────────────────────────────────────
function KortDrawer({ open, onClose, kort, step }) {
  if (!kort) return null;
  const isHuman = step.type === "human";
  const accent = isHuman ? C.gold : C.blue;
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 90 }} />}
      <div style={{ position: "fixed", top: 0, right: open ? 0 : -380, width: 360, height: "100vh", background: isHuman ? C.warm : "white", zIndex: 100, boxShadow: open ? "-8px 0 30px rgba(0,0,0,0.12)" : "none", transition: "right 0.3s ease", overflowY: "auto", padding: open ? "24px 20px" : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: accent, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            {isHuman ? `Det menneskelige rum` : step.type === "aabning" ? "Åbningskort" : step.type === "afslutning" ? "Afslutningskort" : `Proceskort — Trin ${step.nr}`}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.gray }}>✕</button>
        </div>
        <div style={{ fontFamily: "'Merriweather', serif", fontSize: 17, color: C.navy, fontWeight: 700, lineHeight: 1.4, marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${accent}` }}>
          {kort.forside}
        </div>
        <Sec label="Åbning" items={kort.aabning} color={accent} />
        {kort.skaerpelse && <Sec label="Skærpelse" items={kort.skaerpelse} color={accent} />}
        {kort.perspektiv && <Sec label="Perspektiv" items={kort.perspektiv} color={accent} />}
        {kort.ramme && <Sec label="Ramme" items={kort.ramme} color={accent} />}
        <div style={{ background: isHuman ? "rgba(255,255,255,0.6)" : C.light, borderRadius: 10, padding: 16, marginTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Erkendelse</div>
          <div style={{ fontSize: 14, color: C.navy, fontStyle: "italic", lineHeight: 1.5 }}>{kort.erkendelse}</div>
        </div>
      </div>
    </>
  );
}

function Sec({ label, items, color }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 10 }}>{label}</div>
      {items.map((q, i) => <div key={i} style={{ fontSize: 13, color: C.gray, lineHeight: 1.6, marginBottom: 8, paddingLeft: 14, borderLeft: `2px solid ${color}40` }}>{q}</div>)}
    </div>
  );
}

function Boble({ rolle, content }) {
  const ai = rolle === "assistant";
  return (
    <div style={{ display: "flex", justifyContent: ai ? "flex-start" : "flex-end", marginBottom: 14 }}>
      <div style={{ maxWidth: "85%", padding: "14px 18px", borderRadius: ai ? "18px 18px 18px 4px" : "18px 18px 4px 18px", background: ai ? "white" : C.navy, color: ai ? "#333" : "white", fontSize: 14, lineHeight: 1.7, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", whiteSpace: "pre-wrap" }}>{content}</div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────
export default function App() {
  const [rolle, setRolle] = useState(null);
  const [aktivt, setAktivt] = useState(0);
  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState({});
  const [input, setInput] = useState("");
  const [kortOpen, setKortOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [chats, loading]);

  if (!rolle) return <RollePicker onSelect={setRolle} />;

  const step = STEPS[aktivt];
  const key = `${rolle}-${step.id}`;
  const msgs = chats[key] || [];
  const beskedCount = {};
  STEPS.forEach(s => { beskedCount[s.id] = (chats[`${rolle}-${s.id}`] || []).length; });
  const rolleInfo = ROLLER.find(r => r.key === rolle);
  const kort = getKortForStep(step, rolle);
  const isHuman = step.type === "human";

  const getDemoReply = (msg, msgCount) => {
    const k = kort;
    if (!k) return "Kan du fortælle mere?";
    if (msgCount <= 1) {
      const q = k.skaerpelse?.[0] || k.ramme?.[0] || "Hvad ser du, når du kigger på din situation?";
      return `Det er et godt udgangspunkt.\n\n${isHuman ? "Lad mig spørge ind til det, der fylder:" : "Lad mig skærpe det:"} ${q}\n\nTag dig tid.`;
    }
    if (msgCount <= 3) {
      const q = k.skaerpelse?.[1] || k.perspektiv?.[0] || "Hvad kræver det af dig?";
      return `Tak for den refleksion.\n\n${q}\n\nHvad dukker op, når du tænker over det?`;
    }
    if (msgCount <= 5) {
      const q = k.perspektiv?.[1] || k.perspektiv?.[0] || "Hvad vil du gøre anderledes?";
      return `Nu tegner der sig et billede.\n\n${q}\n\nFormuler det som en konkret handling.`;
    }
    return `Du har arbejdet dig godt ind i dette.\n\nDin erkendelse: ${k.erkendelse}\n\nDu er klar til næste trin, eller du kan blive og uddybe.`;
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    const cur = chats[key] || [];
    setChats(p => ({ ...p, [key]: [...(p[key] || []), { role: "user", content: msg }] }));
    setLoading(true);
    let reply;
    try {
      const resp = await fetch("https://strategi-chat.strategiskskole.workers.dev/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, source: "forloeb", session_id: sessions[key] || null, trin: step.nr, rolle, mode: "forberedelse" }),
      });
      const data = await resp.json();
      reply = data.reply || data.answer;
      if (data.session_id) setSessions(p => ({ ...p, [key]: data.session_id }));
    } catch {}
    if (!reply) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 600));
      reply = getDemoReply(msg, cur.length);
    }
    setChats(p => ({ ...p, [key]: [...(p[key] || []), { role: "assistant", content: reply }] }));
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", background: isHuman ? C.warm : C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", transition: "background 0.3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />

      <header style={{ background: C.navy, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "white", flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Merriweather', serif", fontSize: 16, fontWeight: 700 }}>Tirsdag kl. 10<sup style={{ fontSize: 9 }}>®</sup></div>
          <div style={{ fontSize: 10, opacity: 0.6 }}>Strategi, der kan mærkes i praksis</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, opacity: 0.7 }}>{rolleInfo.icon} {rolleInfo.label}</span>
          <button onClick={() => setRolle(null)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Skift</button>
        </div>
      </header>

      <TrinTabs aktivt={aktivt} setAktivt={setAktivt} beskedCount={beskedCount} />

      <div style={{ background: isHuman ? `linear-gradient(135deg, ${C.gold}, ${C.gold}dd)` : `linear-gradient(135deg, ${step.farve}, ${C.navy})`, padding: "16px 20px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.8, marginBottom: 3 }}>
            {isHuman ? `Det menneskelige rum — ${step.navn}` : step.type === "aabning" ? "Åbning" : step.type === "afslutning" ? "Afslutning" : `Trin ${step.nr} — ${step.navn}`}
          </div>
          <div style={{ fontFamily: "'Merriweather', serif", fontSize: 16, fontWeight: 600 }}>{step.spørgsmål}</div>
        </div>
        {kort && (
          <button onClick={() => setKortOpen(true)} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
            {isHuman ? "Humant kort" : "Proceskort"}
          </button>
        )}
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px 20px 10px" }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: isHuman ? `${C.gold}20` : C.light, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14, color: isHuman ? C.gold : C.navy }}>
              {isHuman ? "♡" : step.type === "aabning" ? "→" : step.type === "afslutning" ? "←" : step.nr}
            </div>
            <div style={{ fontFamily: "'Merriweather', serif", fontSize: 17, color: C.navy, fontWeight: 700, marginBottom: 8 }}>{step.navn}</div>
            <div style={{ fontSize: 14, color: C.gray, lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>{step.kontekst}</div>
            <div style={{ marginTop: 16, fontSize: 13, color: "#aaa" }}>Skriv dit første svar for at begynde.</div>
          </div>
        )}
        {msgs.map((m, i) => <Boble key={i} rolle={m.role} content={m.content} />)}
        {loading && <div style={{ display: "flex", marginBottom: 14 }}><div style={{ background: "white", padding: "14px 20px", borderRadius: "18px 18px 18px 4px", color: "#aaa", fontSize: 14 }}>Tænker...</div></div>}
      </div>

      <div style={{ padding: "12px 20px 16px", background: "white", borderTop: `1px solid ${C.light}`, display: "flex", gap: 10, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} placeholder="Skriv din refleksion..."
          style={{ flex: 1, padding: "14px 16px", borderRadius: 12, border: "1.5px solid #d1d5db", fontSize: 15, outline: "none", fontFamily: "'Open Sans', sans-serif" }} />
        <button onClick={send} disabled={loading || !input.trim()} style={{ background: input.trim() && !loading ? (isHuman ? C.gold : C.navy) : "#d1d5db", color: "white", border: "none", borderRadius: 12, padding: "14px 24px", fontWeight: 700, fontSize: 15, cursor: input.trim() && !loading ? "pointer" : "default", transition: "all 0.2s", flexShrink: 0 }}>Send</button>
      </div>

      <KortDrawer open={kortOpen} onClose={() => setKortOpen(false)} kort={kort} step={step} />
    </div>
  );
}