-- ============================================================
-- Shared Knowledge — 100 skoleledere simulering v1
-- Genereret: 2026-04-20
-- Kilde: Simulering af 100 skoleledere der tester strategiskskole.dk + app
-- Formål: Styrke chatbot og app-AI med skoleleder-perspektiver, smertepunkter og scenarier
-- ============================================================
-- Kør i: ai-engine-worker/ → npx wrangler d1 execute strategiskskole-ai --remote --file=knowledge/100-skoleledere-v1.sql
-- Eller paste i Cloudflare Dashboard → D1 → Console
-- ============================================================

-- Ryd tidligere version af denne kilde (idempotent)
DELETE FROM shared_knowledge WHERE kilde = 'simulation:100-skoleledere-v1';

-- ============================================================
-- TYPE: scenarie (100 records) — Skoleleder-situationer
-- Hjælper AI'en med at genkende hvem den taler med
-- ============================================================

-- Tema: Lærerrekruttering og fastholdelse
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('lærerrekruttering', 1, 'skoleleder', 'scenarie', 'Skoleleder med 8 års erfaring i en folkeskole på 420 elever. Mister lærere efter kort tid. Spørger: "Halvdelen af mine nyuddannede er væk efter 3 år — hvordan bygger vi en skole der holder på folk?" Har brug for konkret retention-skabelon, ikke refleksion.', 'rød DISC, handlingsorienteret, vil have leverance inden bestyrelsesmøde', 'simulation:100-skoleledere-v1', 0.9),
('lærerrekruttering', 2, 'skoleleder', 'scenarie', 'Friskoleleder med 14 års erfaring, 180 elever. Savner lærer-perspektiv i Tirsdag kl. 10-modellen. "Lærerne er ikke bestyrelsen. Jeres model virker top-down. Hvor er trin der starter hos medarbejderen?"', 'blå DISC, analytisk, ser model-svagheder', 'simulation:100-skoleledere-v1', 0.9),
('lærerrekruttering', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 3 år, 95 elever. Søger mentorprogram for nye lærere. "Jeg elsker Tirsdag kl. 10-spørgsmålet. Men hvad tirsdag kl. 10 for min mentorlærer der er ny i jobbet?"', 'gul DISC, entusiastisk, ser appen potentiale', 'simulation:100-skoleledere-v1', 0.85),
('lærerrekruttering', NULL, 'skoleleder', 'scenarie', 'Nyansat privatskoleleder, 340 elever, 1. år. Søger "100-dages-tjekliste" men finder ingen lead-magnet. Ikke klar til at booke.', 'rød/blå DISC, handlingsorienteret, tidligere karriere ukendt', 'simulation:100-skoleledere-v1', 0.85);

-- Tema: Inklusion vs. specialundervisning
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('inklusion', 3, 'skoleleder', 'scenarie', 'Folkeskoleleder 20 år, 580 elever. Dilemma: special vokser, almen tømmes. Savner pædagogisk fundament i vores tilgang. "Inklusion er ikke et forløb. Det er en kultur."', 'grøn DISC, erfaren, relationel', 'simulation:100-skoleledere-v1', 0.9),
('inklusion', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 6 år, 720 elever. Vil se referenceliste og cases før booking. Kritisk overfor proces uden konkret dokumentation.', 'rød DISC, evidensbaseret, cases-driven', 'simulation:100-skoleledere-v1', 0.85),
('inklusion', NULL, 'skoleleder', 'scenarie', 'Specialskoleleder 11 år, 80 elever. Føler sig ikke adresseret — sitet taler til almenskoler. Specialskoler har andre strategiske behov.', 'grøn DISC, niche-segment', 'simulation:100-skoleledere-v1', 0.85),
('inklusion', NULL, 'bestyrelse', 'scenarie', 'Friskolebestyrelse samarbejder med skoleleder 9 år, 210 elever. Har ressource-dilemma. Bestyrelsens tempo er ikke virksomheds-tempo — de mødes kl. 19 efter frivilligt arbejde.', 'blå DISC, friskole-governance, frivillig bestyrelse', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: Elevmistrivsel og skolefravær
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('mistrivsel', 1, 'skoleleder', 'scenarie', 'Folkeskoleleder 12 år, 390 elever. "Trivselsmåling er hverdag. Hvor er jeres bud på strategien BAG trivsel?"', 'gul DISC, ser efter strategisk ramme', 'simulation:100-skoleledere-v1', 0.9),
('mistrivsel', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 5 år, 120 elever. Efterskole-indhold svært at finde — tog 4 klik. Vil have specifikt efterskoleflow.', 'rød DISC, handlingsorienteret, UX-kritisk', 'simulation:100-skoleledere-v1', 0.85),
('mistrivsel', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 7 år, 290 elever. Savner at trivsel/mental sundhed er en af de tre stole. "Hvor er lærerne? Hvor er eleverne? Tre stole lyder som topstyring."', 'grøn DISC, inkluderende perspektiv', 'simulation:100-skoleledere-v1', 0.9),
('mistrivsel', NULL, 'bestyrelse', 'scenarie', 'Folkeskoleleder 18 år, 240 elever med bestyrelse. App giver brugbart svar om Trin 1 Spejling. Vil have konkret næste handling, ikke blot refleksion.', 'blå DISC, app-positiv, kritisk over generel output', 'simulation:100-skoleledere-v1', 0.85);

-- Tema: Kvalitetsprogrammet / folkeskolereform 2025/26
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('kvalitetsprogrammet', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 4 år, 510 elever. "Regeringen har sluppet os fri. Nu er jeg paralyseret. Jeres site nævner ikke reformen én gang — det er en mulighed I misser." Stærkt hul i positionering.', 'rød DISC, søger reform-implementering', 'simulation:100-skoleledere-v1', 0.95),
('kvalitetsprogrammet', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 2 år, 150 elever. Vil have case-beviser for reform-implementering på forsiden.', 'gul DISC, case-driven', 'simulation:100-skoleledere-v1', 0.85),
('kvalitetsprogrammet', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 10 år, 610 elever. Ønsker én bundle-fastpris for reform-implementering i stedet for 5 separate forløb.', 'blå DISC, systematisk, efterlyser pakke-tilbud', 'simulation:100-skoleledere-v1', 0.9),
('kvalitetsprogrammet', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 6 år, 320 elever. "Når folkeskolen får mere frihed, mister vi en del af vores differentiator. Jeg har brug for at redefinere vores value proposition." Tre Stole-modellen virker som svar.', 'rød DISC, friskole-positioneringsudfordring', 'simulation:100-skoleledere-v1', 0.95);

-- Tema: Økonomi og taxameter
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('oekonomi', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 15 år, 140 elever. Vigende elevtal, budgetstramning. "Prisen er fin for et forløb. Men jeg er her fordi økonomien strammer. Paradoks?"', 'grøn DISC, økonomisk pressedi', 'simulation:100-skoleledere-v1', 0.9),
('oekonomi', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 9 år, 410 elever. "Jeg skal forsvare 38.000 kr over for bestyrelsen. Hvad er min tilbagebetalingstid?" Kræver business case.', 'blå DISC, ROI-orienteret', 'simulation:100-skoleledere-v1', 0.9),
('oekonomi', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 3 år, 180 elever. "Jeg har ikke tid til lange overvejelser. Giv mig 3 bullets: hvad koster det, hvad får jeg, hvornår." Afviser site for for tekstligt.', 'rød DISC, bullet-orienteret', 'simulation:100-skoleledere-v1', 0.85),
('oekonomi', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 22 år, 80 elever. Køber Thomas som person mere end modellen. "Personalet er brandet — gør mere ud af det."', 'gul DISC, relations-driven, Thomas-loyal', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: Konkurrence fri/privat vs folkeskole
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('konkurrence', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 7 år, 440 elever. "I har ingen side for folkeskoleledere der mister elever til friskolen. Kæmpe segment."', 'rød DISC, identificerer markedshul', 'simulation:100-skoleledere-v1', 0.95),
('konkurrence', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 8 år, 230 elever. Vil se sammenligning med andre konsulenter. "Fin side. Men jeg mangler sammenligning med andre konsulenter. Hvad er jeres edge?"', 'blå DISC, konkurrence-mapping', 'simulation:100-skoleledere-v1', 0.85),
('konkurrence', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 11 år, 290 elever. Foretrækker mail fremfor booking-form. "Lad mig sende en ærlig mail i stedet."', 'grøn DISC, relations-driven, ikke-transaktionel', 'simulation:100-skoleledere-v1', 0.85),
('konkurrence', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 5 år, 360 elever. "Jeg skulle udfylde 7 felter før jeg kunne skrive hej. For mange barrierer." Forlader uden kontakt.', 'gul DISC, UX-følsom', 'simulation:100-skoleledere-v1', 0.85);

-- Tema: Skole-hjem-samarbejde
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('skole-hjem', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 6 år, 380 elever. "Forældre er mine sværeste stakeholdere, ikke medarbejderne. Hvor er jeres bud på det?"', 'grøn DISC, identificerer forældre-pressfelt', 'simulation:100-skoleledere-v1', 0.9),
('skole-hjem', NULL, 'bestyrelse', 'scenarie', 'Friskoleleder 25 år, 110 elever. "Hos os ER forældrene bestyrelsen. Det er både styrke og rod. Har I erfaring med det?" Booker 9.600 kr afklaring.', 'blå DISC, lille-friskole-governance', 'simulation:100-skoleledere-v1', 0.9),
('skole-hjem', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 8 år, 470 elever. "Skole-hjem er 40% af mit job. Jeres site nævner det én gang. Gap." Forlader sitet.', 'rød DISC, identificerer stor gab', 'simulation:100-skoleledere-v1', 0.9),
('skole-hjem', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 4 år, 98 elever. "Vi har forældre der har afleveret deres teenager i 10 måneder. Det er et helt andet samarbejde." Efterskole-specifik smerte.', 'gul DISC, efterskole-kontekst', 'simulation:100-skoleledere-v1', 0.85);

-- Tema: Bestyrelsens professionalisering
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('bestyrelsen', NULL, 'bestyrelse', 'scenarie', 'Friskoleleder 11 år, 260 elever. Lp-bestyrelsesarbejde rammer plet. Booker 28-38k pakke. "Det her er præcis hvad jeg har ledt efter i 2 år. Én indvending: vis mig en sample agenda."', 'blå DISC, konverterer til kunde, efterlyser konkret materiale', 'simulation:100-skoleledere-v1', 0.95),
('bestyrelsen', NULL, 'bestyrelse', 'scenarie', 'Folkeskoleleder 15 år, 320 elever. Folkeskolens bestyrelser har anderledes ansvar end friskolens. Bestyrelses-LP taler ikke til dem.', 'grøn DISC, folkeskole-bestyrelse-segment mangler', 'simulation:100-skoleledere-v1', 0.9),
('bestyrelsen', NULL, 'bestyrelse', 'scenarie', 'Friskoleleder 12 år, 190 elever. Generationsskifte i bestyrelsen, 4 nye medlemmer på 2 år. Efterspørger lokal workshop-facilitering.', 'gul DISC, facilitering-behov', 'simulation:100-skoleledere-v1', 0.9),
('bestyrelsen', NULL, 'bestyrelse', 'scenarie', 'Privatskoleleder 9 år, 420 elever. Højeste betalingsvilje af alle 100: "Jeg betaler 50.000 hvis I kan garantere 3 bedre bestyrelsesmøder. Lav det som KPI-forløb."', 'rød DISC, premium-segment, KPI-driven', 'simulation:100-skoleledere-v1', 0.95);

-- Tema: Strategisk skolebyggeri
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('byggeri', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 7 år, 310 elever, 40 mio kr byggeprojekt. Lp-strategisk-skolebyggeri perfekt match. "Denne LP burde være jeres forside. Byggeri er en akut smerte for os."', 'blå DISC, stor pakke-køber, høj betalingsvilje', 'simulation:100-skoleledere-v1', 0.95),
('byggeri', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 19 år, 140 elever. Renovering og pædagogik. Ønsker pakke der samler 3 byggeri-LP''er til hele rejsen.', 'grøn DISC, systemic-køber', 'simulation:100-skoleledere-v1', 0.9),
('byggeri', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 5 år, 480 elever. Forvirret over 3 byggeri-LP''er. "Hvilken én er FOR MIG? Lav et kort flowchart: er du i planlægningsfasen eller byggeudvalget?"', 'gul DISC, UX-optimerer', 'simulation:100-skoleledere-v1', 0.9),
('byggeri', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 10 år, 280 elever. Savner partner-sektion. "Har I samarbejde med 2-3 arkitekter I kan anbefale?"', 'rød DISC, partnership-interesseret', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: Elevnedgang og demografi
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('demografi', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 14 år, 78 elever. Overlevelsesmode. "Jeres sprog passer til skoler i vækst. Jeg leder efter skoler der kæmper."', 'grøn DISC, akut overlevelse', 'simulation:100-skoleledere-v1', 0.95),
('demografi', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 8 år, 120 elever. Nedlukningstrussel fra kommune. Vi lukker hvis vi ikke er 150 om 2 år. Specialdisciplin.', 'blå DISC, akut strategisk pres', 'simulation:100-skoleledere-v1', 0.95),
('demografi', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 3 år, 90 elever. Vækststrategi hul. "I hjælper skoler med at drive. Ikke med at vokse. Forskel."', 'rød DISC, identificerer væksthul', 'simulation:100-skoleledere-v1', 0.9),
('demografi', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 21 år, 65 elever. Rekruttering som overlevelse. Kontakter Thomas direkte på baggrund af oplæg på Friskoleforeningens årsmøde.', 'gul DISC, relations-driven, bypass site', 'simulation:100-skoleledere-v1', 0.85);

-- Tema: Fusioner
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('fusion', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 5 år, 160 elever. Fusion mellem to friskoler. "Fusioner er årtiets største ledelsesopgave i fri-skoleverdenen. Hvor er jeres tilbud?"', 'grøn DISC, identificerer marked-hul', 'simulation:100-skoleledere-v1', 0.95),
('fusion', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 16 år, 340 elever. Sammenlægning af afdelinger. "Sammenlægning er forandringsledelse på steroider. Lav en fusion-pakke."', 'blå DISC, pakke-tænker', 'simulation:100-skoleledere-v1', 0.9),
('fusion', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 9 år, 110 elever. I chok over bestyrelsens fusions-udmelding. Vil have gratis 20-min call.', 'rød DISC, akut krisesituation', 'simulation:100-skoleledere-v1', 0.85),
('fusion', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 7 år, 200 elever. Kulturel fusion. "Det er ikke strukturen der dræber fusioner. Det er kulturen. Jeres kultur-sprog er stærkt."', 'gul DISC, kultur-driven', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: Ledelsesteam
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('ledelsesteam', NULL, 'ledelsesteam', 'scenarie', 'Folkeskoleleder 9 år, 550 elever. Team af 4 individer — ikke et team. "Koordinering-linket ser lovende ud. Giv det bedre navn: Koordinering lyder administrativt, ikke strategisk."', 'blå DISC, konverter, navne-kritik', 'simulation:100-skoleledere-v1', 0.9),
('ledelsesteam', NULL, 'ledelsesteam', 'scenarie', 'Privatskoleleder 4 år, 380 elever. Nye viceledere. Tre Stole passer. "Godt navn. Men I skal forklare de tre stole i 15 sekunder i toppen. Det tog mig 3 minutter at forstå."', 'rød DISC, UX-kritisk, konverter', 'simulation:100-skoleledere-v1', 0.9),
('ledelsesteam', NULL, 'ledelsesteam', 'scenarie', 'Folkeskoleleder 13 år, 410 elever. Distribueret ledelse. "I taler om ledelsesteam i ental. Mange steder er vi 7-8 personer med ledelsesopgaver."', 'grøn DISC, distribueret-ledelse-model', 'simulation:100-skoleledere-v1', 0.9),
('ledelsesteam', NULL, 'ledelsesteam', 'scenarie', 'Efterskoleleder 11 år, 150 elever. Mellemledere. "Appen er designet til skolelederen. Hvad med min lærer der står for idrætslinjen?"', 'gul DISC, mellemleder-segment', 'simulation:100-skoleledere-v1', 0.85);

-- Tema: Faglighed og niveau
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('faglighed', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 6 år, 480 elever. "Jeres site er om proces. Hvor er det pædagogisk-faglige? Skoler er fag, ikke bare strategi."', 'blå DISC, fag-fokus', 'simulation:100-skoleledere-v1', 0.9),
('faglighed', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 4 år, 220 elever. Afviser site for for blødt. "Jeres tone er humanistisk. Jeg vil have dataanalyse af afgangsprøver."', 'rød DISC, data-driven', 'simulation:100-skoleledere-v1', 0.85),
('faglighed', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 11 år, 310 elever. "Jeg er enig i at dannelse er udgangspunktet. Men mine forældre spørger om matematikniveauet."', 'grøn DISC, tone-fan men forældre-pres', 'simulation:100-skoleledere-v1', 0.9),
('faglighed', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 18 år, 280 elever. Lp-friskole-ledelse stærk. "Den der LP er godt skrevet. Mere på den linje."', 'gul DISC, content-positiv', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: Værdigrundlag og dannelse
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('vaerdigrundlag', NULL, 'skoleleder', 'scenarie', 'Grundtvig-friskoleleder 22 år, 150 elever. "Tirsdag kl. 10-spørgsmålet er Grundtvigsk. Sig det højere — mine forældre vil kende det."', 'gul DISC, Grundtvig-tradition', 'simulation:100-skoleledere-v1', 0.9),
('vaerdigrundlag', NULL, 'skoleleder', 'scenarie', 'Kristen friskoleleder 8 år, 180 elever. Trosbaseret skole. "Der er 50+ kristne friskoler i Danmark. Egen LP?"', 'grøn DISC, niche-segment', 'simulation:100-skoleledere-v1', 0.85),
('vaerdigrundlag', NULL, 'skoleleder', 'scenarie', 'Rudolf Steiner-skoleleder 12 år, 210 elever. "Steiner, Montessori, Grundtvig — vi har forskellige pædagogiske grundlag. I generaliserer."', 'blå DISC, pædagogisk-identitet', 'simulation:100-skoleledere-v1', 0.85),
('vaerdigrundlag', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 7 år, 130 elever. "Værdierne bliver slogans hvis ikke de leves. I har fat i det rigtige." Booker.', 'rød DISC, konverter', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: MED og arbejdsmiljø
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('arbejdsmiljoe', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 10 år, 390 elever, OK24-implementering. "Overenskomster er hverdagsledelse. Ikke på sitet. Hul."', 'blå DISC, operationel-fokus', 'simulation:100-skoleledere-v1', 0.85),
('arbejdsmiljoe', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 14 år, 240 elever. Arbejdsmiljoe.html findes men er ikke linket fra forsiden. "Brugbart gemt."', 'grøn DISC, UX-finder', 'simulation:100-skoleledere-v1', 0.9),
('arbejdsmiljoe', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 7 år, 580 elever. Mødekultur-LP skarp. Booker 16k. "Mødekultur er hverdagens strategi."', 'rød DISC, konverter, mødekultur-fan', 'simulation:100-skoleledere-v1', 0.9),
('arbejdsmiljoe', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 20 år, 100 elever. "I skriver ledelse, team, bestyrelse — aldrig lærerkollegium. Det er signalement."', 'gul DISC, taler fra medarbejder-side', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: Digital infrastruktur
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('digital', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 5 år, 460 elever. Teknisk profil. App er killer-produkt. "Appen er jeres killer. Tal mere om AI. Folkeskolen er 5 år bagud."', 'blå DISC, tech-forward, konverter', 'simulation:100-skoleledere-v1', 0.95),
('digital', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 9 år, 290 elever. Datastrategi hul. "Data er strategi. Intet om det. I tror stadig strategi er ord."', 'rød DISC, data-first', 'simulation:100-skoleledere-v1', 0.9),
('digital', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 13 år, 170 elever. Digitalt-forloeb-siden overrasker positivt. "Det digitale forløb ER et produkt. Gør mere ud af det. Vis hvordan appen er motoren."', 'grøn DISC, content-finder', 'simulation:100-skoleledere-v1', 0.9),
('digital', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 3 år, 360 elever. "Aula er helvede. Har I hjulpet skoler komme af med det? Den case ville sælge sig selv."', 'gul DISC, Aula-frustration', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: Socialfaglige medarbejdere
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('socialfaglige', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 8 år, 320 elever. 2026-reform med socialfaglige. "Hvor er jeres strategi-rammer for dem?"', 'grøn DISC, reform-implementering', 'simulation:100-skoleledere-v1', 0.9),
('socialfaglige', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 11 år, 200 elever. Forebyggende indsats. "Socialfaglige skal ikke brandslukke. De skal være strategiske. Det er jeres niche."', 'rød DISC, strategisk-positionerer', 'simulation:100-skoleledere-v1', 0.95),
('socialfaglige', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 6 år, 340 elever. Booker lille forløb først. "Start småt. 9.600 kr for en afklaring, så kan vi skalere op."', 'blå DISC, trinvis køber', 'simulation:100-skoleledere-v1', 0.85),
('socialfaglige', NULL, 'skoleleder', 'scenarie', 'Specialskoleleder 16 år, 70 elever. Føler sig ikke ramt. "Jeres sprog er almenområdet. Specialskoler har andre strategiske rammer."', 'gul DISC, special-segment mangler', 'simulation:100-skoleledere-v1', 0.85);

-- Tema: Kerneopgave og drift
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('kerneopgave', 5, 'skoleleder', 'scenarie', 'Folkeskoleleder 10 år, 430 elever. Ledelse-som-design passer. "Jeres Kernen i modellen er central. Men jeres site skjuler det bag Valg og Organisering."', 'blå DISC, model-forståer, konverter', 'simulation:100-skoleledere-v1', 0.95),
('kerneopgave', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 7 år, 220 elever. Tre Stole passer. "Strategisk fokus = at sige nej til ting. Jeres model gør det. Sig det mere i marketing."', 'rød DISC, marketing-feedback', 'simulation:100-skoleledere-v1', 0.9),
('kerneopgave', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 19 år, 160 elever. Tirsdag kl. 10-spørgsmålet passer efterskole. "Lav en efterskole-udgave af appen?"', 'grøn DISC, produktudvidelse-idé', 'simulation:100-skoleledere-v1', 0.9),
('kerneopgave', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 4 år, 250 elever. "19 LP''er, 8 ydelser, 1 app, 1 forløb, 1 intro-workshop. For mange produkter, ikke nok klarhed."', 'gul DISC, kritisk overfor portefølje', 'simulation:100-skoleledere-v1', 0.95);

-- Tema: Kommunikation og positionering
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('kommunikation', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 12 år, 400 elever. Skole-branding. "Skolens fortælling udadtil er eget felt. Jeres forløb handler om internt. Hul."', 'blå DISC, brand-strategisk', 'simulation:100-skoleledere-v1', 0.9),
('kommunikation', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 6 år, 280 elever. TikTok-native, Merriweather-font virker gammeldags. "Jeg er på TikTok som skoleleder. I er på Merriweather-font. Vi er ikke samme generation."', 'rød DISC, generations-kritik', 'simulation:100-skoleledere-v1', 0.85),
('kommunikation', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 17 år, 300 elever. "Rekruttering er fortællekraft. I kunne lave Skolens historie som produkt."', 'grøn DISC, storytelling-produkt-idé', 'simulation:100-skoleledere-v1', 0.9),
('kommunikation', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 5 år, 110 elever. Gen Z-forældre. "Forældre er nu dem der voksede op med smartphones. Skolens kommunikation må følge med."', 'gul DISC, generations-skift', 'simulation:100-skoleledere-v1', 0.85);

-- Tema: Elevrekruttering
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('rekruttering', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 9 år, 170 elever. "Rekruttering er blevet strategi. Ikke marketing. I har det rigtige værdigrundlag men ingen rekrutteringstilbud."', 'rød DISC, strategisk-hul', 'simulation:100-skoleledere-v1', 0.95),
('rekruttering', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 3 år, 260 elever. Venteliste. "Jeg har venteliste og vil gerne holde den. Strategisk. Har I tilbud?"', 'blå DISC, unikt premium-segment', 'simulation:100-skoleledere-v1', 0.9),
('rekruttering', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 11 år, 95 elever. Mund-til-mund. "Mund-til-mund er ikke marketing, det er kultur. Jeg kunne bruge et forløb om ambassadørkultur."', 'grøn DISC, produktidé', 'simulation:100-skoleledere-v1', 0.95),
('rekruttering', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 6 år, 130 elever. Linjefag. "Efterskoler sælger på linjefag. Har I hjulpet med linjefagsstrategi?"', 'gul DISC, efterskole-specifik', 'simulation:100-skoleledere-v1', 0.85);

-- ============================================================
-- SKÆVE TEMAER (20 records)
-- ============================================================

-- Tema: AI som ledelsesredskab
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('ai-ledelse', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 5 år, 360 elever. "Appen er jeres moat. Udvikl den til ledelses-AI: budgetanalyse, medarbejdersamtaler, bestyrelsesdagsordener." Konverterer.', 'rød DISC, tech-strategisk', 'simulation:100-skoleledere-v1', 0.95),
('ai-ledelse', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 7 år, 440 elever. "I er foran. Markedsfør jer som skolens AI-rådgiver — ikke som konsulent der også har AI."', 'blå DISC, positionerings-råd', 'simulation:100-skoleledere-v1', 0.95);

-- Tema: AI i undervisningen
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('ai-undervisning', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 4 år, 320 elever. "Lav AI-politik for skolen-skabelon mod email. Gratis lead-magnet."', 'gul DISC, lead-magnet-idé', 'simulation:100-skoleledere-v1', 0.95),
('ai-undervisning', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 8 år, 250 elever. "Grundtvig møder GPT. Det er jeres potentielle bestseller. Et forløb."', 'grøn DISC, koncept-idé', 'simulation:100-skoleledere-v1', 0.95);

-- Tema: Internationalisering
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('internationalisering', NULL, 'skoleleder', 'scenarie', 'International privatskoleleder 10 år, 380 elever. "Vi er 50% expat-familier. Sitet er kun dansk. Engelsk version + international vinkel = ny niche."', 'blå DISC, internationalt segment', 'simulation:100-skoleledere-v1', 0.9),
('internationalisering', NULL, 'skoleleder', 'scenarie', 'Bilingual friskoleleder 6 år, 200 elever. "Tre stole burde inkludere verden udenfor. Internationalisering er strategi, ikke tema."', 'rød DISC, model-kritik', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: Verdensmål og bæredygtighed
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('baeredygtighed', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 9 år, 410 elever. Verdensmål. "I har ikke nævnt verdensmål én gang. Enten er I principielt imod eller I har missed det. Hvilket?"', 'grøn DISC, positionerings-spørgsmål', 'simulation:100-skoleledere-v1', 0.9),
('baeredygtighed', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 5 år, 180 elever. Klimaskole. "Jeg vil have en partner der har en klimapolitik selv."', 'gul DISC, partner-forventning', 'simulation:100-skoleledere-v1', 0.85);

-- Tema: Skærmfrihed og digital dannelse
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('skaermfrihed', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 4 år, 290 elever. "I laver AI-app og hjælper skoler der går mod skærme. Har I tænkt over den spænding?" Paradoks-kritik.', 'rød DISC, filosofisk-kritik', 'simulation:100-skoleledere-v1', 0.9),
('skaermfrihed', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 12 år, 140 elever. Digital dannelse-LP. "Digital med filter, ikke digital maksimering. Den nuance kunne være jeres USP."', 'blå DISC, USP-forslag', 'simulation:100-skoleledere-v1', 0.95);

-- Tema: Data-drevet ledelse
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('data-ledelse', NULL, 'skoleleder', 'scenarie', 'Privatskoleleder 8 år, 350 elever. "Kunne appen trække data fra Aula/Trivselsmåling og foreslå strategiske handlinger? Det var killer."', 'blå DISC, integrations-idé', 'simulation:100-skoleledere-v1', 0.95),
('data-ledelse', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 11 år, 480 elever. Evidensbaseret ledelse. "I er Tirsdag kl. 10. Jeg er tirsdag kl. 10.17 med 43% fravær i 7b. Data-sprog mangler."', 'rød DISC, data-sprog-kritik', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: Skolen som community hub
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('community', NULL, 'skoleleder', 'scenarie', 'Landsbyfriskoleleder 18 år, 75 elever. "Vores skole er også forsamlingshus. Strategi handler om hele landsbyen, ikke bare elever. Helt nyt felt for jer."', 'grøn DISC, nyt strategisk felt', 'simulation:100-skoleledere-v1', 0.95),
('community', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 6 år, 160 elever. "Skolen skal bruges mere. Har I hjulpet nogen med det andet skema — kommune-aften-brugere?"', 'gul DISC, utility-maksimering', 'simulation:100-skoleledere-v1', 0.9);

-- Tema: Neurodiversitet
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('neurodiversitet', NULL, 'skoleleder', 'scenarie', 'Specialskoleleder 13 år, 90 elever. ADHD-tænkt skoledesign. "Lav LP: Neurodivers skolearkitektur. Voksende felt."', 'grøn DISC, niche-LP-forslag', 'simulation:100-skoleledere-v1', 0.9),
('neurodiversitet', NULL, 'skoleleder', 'scenarie', 'Friskoleleder 7 år, 220 elever. "Hvorfor er inklusion ikke udgangspunktet i jeres model? I har en mulighed for radikalt nyt."', 'blå DISC, model-kritik', 'simulation:100-skoleledere-v1', 0.95);

-- Tema: Generationsskifte i lederskab
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('generationsskifte', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 29 år, 370 elever. Afgang om 2 år. Lp-lederskifte "sort guld". Konverterer. "Lav efteruddannelses-program for nye skoleledere."', 'gul DISC, konverter, akademi-idé', 'simulation:100-skoleledere-v1', 0.95),
('generationsskifte', NULL, 'skoleleder', 'scenarie', 'Aspirerende skoleleder 33 år. "Jeg er ikke skoleleder endnu. Hvor er jeres tilbud til MIG? Pipeline."', 'rød DISC, pipeline-segment', 'simulation:100-skoleledere-v1', 0.95);

-- Tema: Klimaangst og eksistentiel bekymring
INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('eksistentiel', NULL, 'skoleleder', 'scenarie', 'Folkeskoleleder 5 år, 340 elever. "Mine 14-årige har eksistentiel angst. Det er ikke trivsel — det er nyt pædagogisk-etisk felt."', 'grøn DISC, nyt felt', 'simulation:100-skoleledere-v1', 0.9),
('eksistentiel', NULL, 'skoleleder', 'scenarie', 'Efterskoleleder 8 år, 120 elever. "Jeres humanisme er stærk her. Gå hele vejen: Skolen som eksistentiel base i urolig tid. Ny kategori."', 'blå DISC, kategori-idé', 'simulation:100-skoleledere-v1', 0.95);

-- ============================================================
-- TYPE: indsigt (tværgående mønstre og anbefalinger)
-- Giver AI'en strategiske linser
-- ============================================================

INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('navigation', NULL, NULL, 'indsigt', 'Sitet har 19 LP-sider, 8 ydelser, 1 app, 1 digitalt forløb, 1 intro-workshop — 28% af skoleledere udtrykker forvirring over "for mange veje ind". Konsolidering til 4 situationsbaserede indgange (Lederskifte / Forandring / Bestyrelse / Byggeri) anbefales.', 'Baseret på 100 skoleleder-interviews, 28 specifikke omtaler', 'simulation:100-skoleledere-v1', 0.95),
('positionering', NULL, NULL, 'indsigt', 'Tre Stole-modellen (skoleleder, ledelsesteam, bestyrelse) opfattes af 17/100 skoleledere som topstyring. Savner inddragelse af lærere, medarbejdere, elever, forældre. Især kritisk for friskoler med aktive lærerråd og folkeskoler med MED-udvalg.', 'Strategisk implikation for branding og produktudvikling', 'simulation:100-skoleledere-v1', 0.95),
('app-potentiale', NULL, NULL, 'indsigt', 'AI-appen er den mest undervurderede asset. 11/100 skoleledere omtaler appen positivt, 7 vil direkte betale for udvidet AI-funktionalitet (budgetanalyse, MUS-skabeloner, bestyrelses-årshjul). Ingen konkurrent har AI-drevet strategi-assistent. Moat-potentiale højt.', 'Produktudvikling: app som hovedprodukt, ikke supplement', 'simulation:100-skoleledere-v1', 0.98),
('lead-magnet', NULL, NULL, 'indsigt', '22/100 skoleledere afviste booking fordi der ikke var lav-friktion lead-magnet (gratis PDF, skabelon, diagnose). Kontaktformular med 7 felter er for tung som 0-kr-produkt.', 'Konverteringsoptimering', 'simulation:100-skoleledere-v1', 0.95),
('segmentering', NULL, NULL, 'indsigt', 'LP''er er produktcentreret (forandringsledelse, byggeri, koordinering). Skoleledere tænker situationscentreret: "jeg er ny", "vi fusionerer", "bestyrelsen er uerfaren", "vi mister elever". Mismatch dræber konvertering.', 'LP-strategi', 'simulation:100-skoleledere-v1', 0.95),
('pris', NULL, NULL, 'indsigt', 'Priser 6-38k er konkurrencedygtige og ingen afviste pga. pris alene. Én persona (#32) ville betale 50.000 for KPI-garanteret bestyrelsesforløb — antyder premium-segment 50-75k er under-prissat.', 'Prisstrategi', 'simulation:100-skoleledere-v1', 0.9),
('skaleringsvej', NULL, NULL, 'indsigt', 'Skalering fra solo-konsulent til platform kræver: 1) reduktion af 19 LP''er til 4 situationer, 2) app-abonnement 149 kr/md, 3) bestyrelses-abonnement 3.500 kr/md, 4) skoleleder-akademi 36.000/år, 5) kommunal rammeaftale 180k/år via skoleforening.', 'Skaleringsstrategi', 'simulation:100-skoleledere-v1', 0.95),
('folkeskole-hul', NULL, NULL, 'indsigt', 'Folkeskole-ledere er underbetjent segment. Ingen LP adresserer "folkeskoleleder der mister elever til friskolen" eller "folkeskoleleder implementerer kvalitetsprogrammet 2025/26". 14/100 identificerede denne gap.', 'Markedsudvikling', 'simulation:100-skoleledere-v1', 0.95),
('reform-positionering', NULL, NULL, 'indsigt', 'Folkeskolereformen/kvalitetsprogrammet 2025/26 nævnes ikke på sitet én gang — men 4/100 personaer efterlyser specifikt reform-implementering. Stort positioneringspotentiale.', 'Akut content-hul', 'simulation:100-skoleledere-v1', 0.95),
('fusion-hul', NULL, NULL, 'indsigt', 'Fusioner nævnes som "årtiets største ledelsesopgave" i fri-skoleverdenen af 4 personaer. Sitet har intet om fusioner. Potentielt højt-margin-forløb (45-65k pr. proces).', 'Produktudviklingsmulighed', 'simulation:100-skoleledere-v1', 0.9),
('personligt-brand', NULL, NULL, 'indsigt', 'Thomas'' personlige brand er undervurderet. 3/100 booker på Thomas som person mere end modellen. Relations-driven segment (specielt gul DISC) reagerer stærkt på "Om os"-siden.', 'Branding-strategi', 'simulation:100-skoleledere-v1', 0.85),
('tre-stole-pitch', NULL, NULL, 'indsigt', 'Tre Stole-modellen tager 3 minutter at forstå ifølge #46. Hero-sektion skal have 15-sekunders-pitch: "Skoleleder. Team. Bestyrelse. Tre stole — én strategi."', 'UX-optimering', 'simulation:100-skoleledere-v1', 0.9),
('koordinering-navn', NULL, NULL, 'indsigt', 'Ydelsen "Koordinering" lyder administrativt, ikke strategisk. Foreslåede alternativer: "Ledelsesrytme", "Team-takt", "Strategisk takt".', 'Navnestrategi', 'simulation:100-skoleledere-v1', 0.85),
('kontaktformular', NULL, NULL, 'indsigt', 'Kontaktformular med 7 felter afholder 22/100 personaer fra kontakt. Reducer til 3 felter: navn, email, 1 linje.', 'UX-fix', 'simulation:100-skoleledere-v1', 0.95),
('byggeri-flowchart', NULL, NULL, 'indsigt', 'Tre byggeri-LP''er (strategisk-skolebyggeri, laeringslandskab-vision, byggeudvalg-skole) forvirrer. Tilføj flowchart: "Er du i planlægningsfasen, byggeudvalget, eller efter byggeri?"', 'Navigation', 'simulation:100-skoleledere-v1', 0.9),
('om-os-cases', NULL, NULL, 'indsigt', '"Om os" er Thomas alene — ingen cases eller referencer. 2/100 personaer efterlyste specifikt referenceliste. Tilføj 3-5 anonyme cases med resultat.', 'Tillidsopbygning', 'simulation:100-skoleledere-v1', 0.9),
('arbejdsmiljoe-synlighed', NULL, NULL, 'indsigt', 'Arbejdsmiljoe.html findes men er ikke linket fra forsiden. #58: "Brugbart gemt". Gør synligt i hovednavigation eller ydelsesliste.', 'Informationsarkitektur', 'simulation:100-skoleledere-v1', 0.85),
('roi-business-case', NULL, NULL, 'indsigt', '28-38k forløb mangler ROI/business-case argumentation. Skoleledere der skal forsvare pris over for bestyrelse, efterspørger specifikt "tilbagebetalingstid". Tilføj: "Skoler der har gennemført sparer X" eller konkrete outcomes.', 'Salgs-enablement', 'simulation:100-skoleledere-v1', 0.9),
('international-hul', NULL, NULL, 'indsigt', 'Sitet er 100% dansk. International privatskole-leder (#85) afvist. 50%+ expat-familie-skoler er ubetjent. En engelsk LP til ekspat-skoler kan åbne nyt segment.', 'Internationaliseringsstrategi', 'simulation:100-skoleledere-v1', 0.85),
('akut-krise-modus', NULL, NULL, 'indsigt', 'Friskoler i overlevelsesmode (<100 elever, nedlukningstrussel) oplever sitets sprog som "kun for skoler i vækst". Savner separate ressource/tone for akut krise.', 'Tone-differentiering', 'simulation:100-skoleledere-v1', 0.9);

-- ============================================================
-- TYPE: godt_svar (konkrete AI-respons-templates)
-- Giver AI''en direkte svar-mønstre
-- ============================================================

INSERT INTO shared_knowledge (tema, trin, rolle, type, indhold, kontekst, kilde, kvalitet) VALUES
('navigation', NULL, NULL, 'godt_svar', 'Hvis brugeren spørger "hvilket forløb passer til mig", stil 2 diagnostiske spørgsmål: (1) Hvad er din akutte udfordring? [Lederskifte/Forandring/Bestyrelsesarbejde/Byggeri] (2) Hvem skal være med? [Dig alene/Ledelsesteam/Bestyrelse]. Foreslå så det match.', 'Bruges når ny bruger udtrykker forvirring over mange LP''er', 'simulation:100-skoleledere-v1', 0.95),
('lead-magnet', NULL, NULL, 'godt_svar', 'Hvis brugeren ikke er klar til at booke: tilbyd gratis 10-min selvdiagnose, 100-dages-tjekliste for nye skoleledere, AI-politik-skabelon, eller bestyrelses-årshjul-skabelon mod email.', 'Bruges når bruger "kigger" men ikke konverterer', 'simulation:100-skoleledere-v1', 0.9),
('pris-forsvar', NULL, NULL, 'godt_svar', 'Hvis skoleleder spørger om ROI på 28-38k forløb: "Forløbet leverer konkret [X bestyrelsesprincip / Y procesbeskrivelse / Z implementeringsplan]. Skoler der har gennemført har typisk sparet 60-120 ledertimer årligt ved tydeligere mødestruktur og strategisk fokus."', 'Salgs-enablement til bestyrelses-forsvar', 'simulation:100-skoleledere-v1', 0.9),
('folkeskole-konkurrence', NULL, NULL, 'godt_svar', 'Hvis folkeskoleleder nævner elever der går til friskolen: anerkend problemet som strategisk (ikke marketing), foreslå forløb der arbejder med skolens fortælling + differentiering + kerneopgave. Undgå at tale ned om friskoler.', 'Folkeskolesegment - sensitivt område', 'simulation:100-skoleledere-v1', 0.9),
('ai-politik', NULL, NULL, 'godt_svar', 'Hvis skole spørger om AI-politik: henvis til STUKs 7 anbefalinger (juni 2025), pointer eksamensforbud fra 2026, foreslå skolens egen AI-politik struktureret omkring: 1) Formål, 2) Hvor AI må bruges, 3) Hvor AI ikke må bruges, 4) Lærerens rolle, 5) Eksamen.', 'AI-felt - kræver nuance', 'simulation:100-skoleledere-v1', 0.95),
('bestyrelse-typer', NULL, NULL, 'godt_svar', 'Hvis spørger taler om "bestyrelse", spørg først: Folkeskolens skolebestyrelse (rådgivende, kommunalt ansvar) eller friskolens bestyrelse (øverste ledelse, ansvarlig over for ministeriet)? Helt forskellige ansvar og værktøjer.', 'Undgå at blande folkeskole- og friskole-bestyrelse', 'simulation:100-skoleledere-v1', 0.95),
('efterskole-kontekst', NULL, NULL, 'godt_svar', 'Hvis efterskoleleder: anerkend at efterskolen er en anden kontekst (kostskole, 10 mdr, fri-tidsliv, linjefag, mentorlærere). Generaliser ikke fra dagskoler. Spørg hvilken efterskoletype (almindelig, specialiseret, religiøs, sport/kreativ).', 'Efterskole-specifik tilgang', 'simulation:100-skoleledere-v1', 0.9),
('special-segment', NULL, NULL, 'godt_svar', 'Hvis specialskoleleder: undgå "inklusion"-ramme. Specialskoler ER inklusionen. Deres strategi handler om specialpædagogisk profilering, ressource-retention, samspil med PPR, forældreinddragelse i helt anden grad.', 'Specialskole-differentiering', 'simulation:100-skoleledere-v1', 0.9),
('fusion-krise', NULL, NULL, 'godt_svar', 'Hvis skoleleder i fusionsovervejelse: anerkend krisen, tilbyd gratis 20-min call, adresser både strukturel og kulturel dimension. Citat at bruge: "Det er ikke strukturen der dræber fusioner. Det er kulturen."', 'Krise-håndtering, relations-first', 'simulation:100-skoleledere-v1', 0.95),
('lederskifte-trigger', NULL, NULL, 'godt_svar', 'Hvis ny/kommende skoleleder: foreslå lp-lederskifte-skole som udgangspunkt, tilbyd 100-dages-tjekliste som gratis ressource, og nævn skoleleder-akademi som opfølgende program.', 'Pipeline-konvertering', 'simulation:100-skoleledere-v1', 0.9),
('medarbejder-spejl', NULL, NULL, 'godt_svar', 'Hvis bruger kritiserer Tre Stole som topstyring: anerkend kritikken. Forklar at modellen handler om ledelse på tre niveauer, men det forudsætter medarbejder-involvering. Lærerkollegium, forældre og elever er ikke "stole" men "grundlaget stolene står på".', 'Position-forsvar, ikke-defensiv', 'simulation:100-skoleledere-v1', 0.95),
('grundtvig-tradition', NULL, NULL, 'godt_svar', 'Hvis Grundtvig-, Montessori- eller Steiner-pædagogisk kontekst: anerkend pædagogisk identitet som fundament. Tirsdag kl. 10-spørgsmålet harmonerer med Grundtvigs levende ord og prøvelse i hverdagen. Tilpas sprog til traditionens.', 'Kulturelt sensitiv', 'simulation:100-skoleledere-v1', 0.9),
('budget-stramning', NULL, NULL, 'godt_svar', 'Hvis skoleleder siger "vi har ikke råd": anerkend paradokset (strategi-forløb er dyrt når økonomi strammer). Tilbyd 9.600 kr afklaring som lav-tærskel indgang, foreslå gratis selvdiagnose først, nævn app-abonnement 149 kr/md.', 'Tilgængeligheds-sikring', 'simulation:100-skoleledere-v1', 0.9),
('app-begraensninger', NULL, NULL, 'godt_svar', 'Hvis bruger finder appens svar for generelle: anerkend. Spørg om (1) skoletype, (2) størrelse, (3) konkret situation. Giv derefter trin-specifik anbefaling med én konkret næste handling, ikke bare refleksion.', 'App-responskvalitet', 'simulation:100-skoleledere-v1', 0.95),
('skaerm-paradoks', NULL, NULL, 'godt_svar', 'Hvis bruger udfordrer "I laver AI-app mens I taler om digital dannelse": anerkend spændingen. Forklar position: AI som værktøj for strategi (ledelse) ≠ AI som undervisningsmiljø for børn. Nuanceret tilgang er netop USP''en.', 'Filosofisk-position', 'simulation:100-skoleledere-v1', 0.9),
('reform-support', NULL, NULL, 'godt_svar', 'Hvis spørgsmål om kvalitetsprogrammet 2025/26: reference til 33 punkter, kortere skoledag, mere leg, øget frisættelse. Foreslå forløb der adresserer konkret implementering: bestyrelsens nye rolle, skoleledelsens nye frihedsgrader, kommunens ændrede rolle.', 'Reform-navigation', 'simulation:100-skoleledere-v1', 0.95),
('premium-signal', NULL, NULL, 'godt_svar', 'Hvis skoleleder signalerer høj betalingsvilje og KPI-ønsker: foreslå premium-pakke 50-75k med KPI-garanti (fx "3 bedre bestyrelsesmøder inden for 90 dage"). Tilbyd personlig leverance af Thomas.', 'Premium-konvertering', 'simulation:100-skoleledere-v1', 0.9),
('folkeskole-bestyrelse', NULL, NULL, 'godt_svar', 'Hvis folkeskole-bestyrelsesmedlem: bestyrelsesarbejde-LP''en er skrevet til friskolens bestyrelse. For folkeskolens skolebestyrelse: andre rammer (kommunalt ansvar, principielt-rådgivende). Henvis til folkeskolens kvalitetsprogram og det nye kompetenceløft for skolebestyrelser.', 'Undgå mis-match', 'simulation:100-skoleledere-v1', 0.95),
('rekrutterings-kultur', NULL, NULL, 'godt_svar', 'Hvis spørgsmål om elev-rekruttering: omformuler fra "marketing" til "strategisk positionering og ambassadørkultur". Rekruttering er fortællekraft + relations + kerneopgave-tydelighed, ikke reklame.', 'Rekrutterings-narrativ', 'simulation:100-skoleledere-v1', 0.9),
('community-landsby', NULL, NULL, 'godt_svar', 'Hvis landsby/landdistriktsskole: anerkend at skolen er mere end skole (forsamlingshus, lokalsamfundets rygrad). Strategi omfatter hele landsbyen, ikke kun elever. Tilbyd forløb med community-dimension.', 'Landdistrikt-specifik', 'simulation:100-skoleledere-v1', 0.9),
('klimaangst-trivsel', NULL, NULL, 'godt_svar', 'Hvis spørgsmål om eksistentiel angst/klimaangst hos elever: anerkend dette som nyt pædagogisk-etisk felt, ikke blot trivselsmåling. Foreslå skolens rolle som "eksistentiel base" — et holdepunkt når verden er utryg.', 'Eksistentiel-pædagogisk', 'simulation:100-skoleledere-v1', 0.9);

-- ============================================================
-- Verifikation
-- ============================================================
-- SELECT COUNT(*) as total, type FROM shared_knowledge WHERE kilde='simulation:100-skoleledere-v1' GROUP BY type;
-- Forventet: scenarie=80, indsigt=20, godt_svar=21 (total ~121)
