-- +goose Up
-- +goose NO TRANSACTION

-- anex 4 baseline
UPDATE
	contracts
SET
	tables = b.tables || (
		SELECT
			jsonb_set(b.tables, '{"baseline"}','{"rows": [["{\"en\": \"Total heat energy consumption\", \"pl\": \"Całkowite zużycie energii cieplnej\", \"ro\": \"Consumul total e energie termică\", \"au\": \"Gesamter Wärmeenergieverbrauch\", \"lv\":\"Kopējais siltumenerģijas patēriņš\", \"bg\": \"Total heat energy consumption\",\"sk\": \"Celková spotreba tepelnej energie\"}","$Q_{T,ref}$","MWh/year","","","",""],["{\"en\": \"Space heating consumption\", \"pl\": \"Zużycie na ogrzewanie pomieszczeń\", \"ro\": \"Consumul de încălzire în încăpere\", \"au\": \"Energieverbrauch für Raumwärme\", \"lv\":\"Telpu apkures patēriņš\", \"bg\": \"Space heating consumption\",\"sk\": \"Spotreba na vykurovanie priestorov\"}","$Q_{Apk,ref}$","MWh/year","","","",""],["{\"en\": \"Circulation losses\", \"pl\": \"Straty obiegowe\", \"ro\": \"Pierderi de circulaţie\", \"au\": \"Zirkulationsverluste\", \"lv\":\"Cirkulācijas zudumi\", \"bg\": \"Circulation losses\",\"sk\": \"Cirkulačné tepelné straty\"}","$Q_{cz,ref}$","MWh/year","","","",""],["{\"en\": \"Domestic hot water consumption\", \"pl\": \"Zużycie ciepłej wody użytkowej\", \"ro\": \"Consumul de apă caldă menajeră\", \"au\": \"Warmwasserverbrauch\", \"lv\":\"Mājsaimniecību karstā ūdens patēriņš\", \"bg\": \"Domestic hot water consumption\",\"sk\": \"Spotreba teplej úžitkovej vody\"}","$Q_{ku,ref}$","MWh/year","","","",""],["{\"en\": \"Energy consumption for space heating and circulation losses\", \"pl\": \"Zużycie energii na ogrzewanie pomieszczeń i na straty obiegowe\", \"ro\": \"Consumul de energie pentru încălzirea spaţiului şi pierderile de circulaţie\", \"au\": \"Energieverbrauch für Raumwärme und Zirkulationsverluste\", \"lv\":\"Enerģijas patēriņš telpu apkurei un cirkulācijas zudumi\", \"bg\": \"Energy consumption forspace heating and circulation losses\",\"sk\": \"Spotreba energie na vykurovanie priestorov a cirkulačné tepelné straty\"}","$Q_{Apk,cz,ref}$","MWh/year","","","",""],["{\"en\": \"Average indoor temperature\", \"pl\": \"Średnia temperatura wewnątrz pomieszczeń\", \"ro\": \"Temperatura medie interioară\", \"au\": \"Durchschnittliche Raumtemperatur\", \"lv\":\"Vidējā gaisa temperatūra telpās\", \"bg\": \"Average indoor temperature\",\"sk\": \"Priemerná vnútorná teplota\"}","$T_{1,ref}$","${℃}$","","","",""],["{\"en\": \"Degree days\", \"pl\": \"Stopniodni\", \"ro\": \"Degree Days\", \"au\": \"Heizgradtage\", \"lv\":\"Grādu dienas\", \"bg\": \"Degree days\",\"sk\": \" Počet dní vykurovacej sezóny (degree Days)\"}","$GDD_{ref}$","{-}","","","",""]],"title": "","columns": [{"kind": 1,"name": "","headers": null},{"kind": 1,"name": "{\"en\": \"Symbol\", \"pl\": \"Oznaczenie\", \"ro\": \"Simbol\", \"au\": \"Symbol\", \"lv\":\"Simbols\", \"bg\": \"Символ\",\"sk\": \"Symbol\"}","headers": null},{"kind": 1,"name": "{\"en\": \"Unit\", \"pl\": \"Jednostka\", \"ro\": \"Unitate\", \"au\": \"Einheit\", \"lv\":\"Vienība\", \"bg\": \"Единици\",\"sk\": \"Jednotka\"}","headers": null},{"kind": 2,"name": "{\"en\": \"$Baseyear^{n-2}$\", \"pl\": \"$Baseyear^{n-2}$\", \"ro\": \"$Baseyear^{n-2}$\", \"au\": \"$Baseyear^{n-2}$\", \"lv\":\"$Bāzes gads^{n-2}$\", \"bg\": \"$Baseyear^{n-2}$\",\"sk\": \"$Baseyear^{n-2}$\"}","headers": null},{"kind": 2,"name": "{\"en\": \"$Baseyear^{n-1}$\", \"pl\": \"$Baseyear^{n-1}$\", \"ro\": \"$Baseyear^{n-1}$\", \"au\": \"$Baseyear^{n-1}$\", \"lv\":\"$Bāzes gads^{n-1}$\", \"bg\": \"$Baseyear^{n-1}$\",\"sk\": \"$Baseyear^{n-1}$\"}","headers": null},{"kind": 2,"name": "{\"en\": \"$Baseyear^{n}$\", \"pl\": \"$Baseyear^{n}$\", \"ro\": \"$Baseyear^{n}$\", \"au\": \"$Baseyear^{n}$\", \"lv\":\"$Bāzes gads^{n}$\", \"bg\": \"$Baseyear^{n}$\",\"sk\": \"$Baseyear^{n}$\"}","headers": null},{"kind": 2,"name": "{\"en\":\"Reference\", \"pl\": \"Reference\", \"ro\": \"Reference\", \"au\": \"Reference\", \"lv\": \"Atsauce\", \"bg\": \"Reference\",\"sk\":\"Základná hodnota\"}","headers": null}]}', TRUE))
FROM
	contracts b
	Left join projects  p 
	on b.project_id = p.id
WHERE p.country = 'Latvia';

-- anex 4 baseyear_n_2
UPDATE
	contracts
SET
	tables = b.tables || (
		SELECT
			jsonb_set(b.tables, '{"baseyear_n_2"}','{"rows": [["1","","","",""],["2","","","",""],["3","","","",""],["4","","","",""],["5","","","",""],["6","","","",""],["7","","","",""],["8","","","",""],["9","","","",""],["10","","","",""],["11","","","",""],["12","","","",""]],"title": "","columns": [{"kind": 1 ,"name": "","headers": ["{\"en\": \"Symbol\", \"pl\": \"Oznaczenie\", \"ro\": \"Simbol\", \"au\": \"Symbol\", \"lv\":\"Simbols\", \"bg\": \"Символ\",\"sk\": \"Symbol\"}", "{\"en\": \"Unit\", \"pl\": \"Jednostka\", \"ro\": \"Unitate\", \"au\": \"Einheit\", \"lv\":\"Vienība\", \"bg\": \"Единици\",\"sk\": \"Jednotka\"}"]},{"kind": 5 ,"name": "{\"en\": \"Heating days\", \"pl\": \"Liczba dni ogrzewania\", \"ro\": \"Numărul zilelor de încălzire efectivă\", \"au\": \"Anzahl Heiztage\", \"lv\":\"Apkures dienu skaits\", \"bg\": \"Брой на дни\",\"sk\": \"Počet vykurovacích dní\"}",  "headers": ["$D_{Apk}$", "{\"en\": \"Days\", \"pl\": \"Dni\", \"ro\": \"Zile\", \"au\": \"Tage\", \"lv\":\"Dienas\", \"bg\": \"Дни\",\"sk\": \"Dni\"}"]},{"kind": 7 ,"name": "{\"en\": \"Total heat energy consumption\", \"pl\": \"Całkowite zużycie energii cieplnej\", \"ro\": \"Consumul total e energie termică\", \"au\": \"Gesamter Wärmeenergieverbrauch\", \"lv\":\"Kopējais siltumenerģijas patēriņš\", \"bg\": \"Total heat energy consumption\",\"sk\": \"Celková spotreba tepelnej energie\"}",  "headers": ["$Q_{t}$", "MWh"]},{"kind": 6 ,"name": "{\"en\": \"Domestic hot water consumption\", \"pl\": \"Zużycie ciepłej wody użytkowej\", \"ro\": \"Consumul de apă caldă menajeră\", \"au\": \"Warmwasserverbrauch\", \"lv\":\"Mājsaimniecību karstā ūdens patēriņš\", \"bg\": \"Domestic hot water consumption\",\"sk\": \"Spotreba teplej úžitkovej vody\"}",  "headers": ["V", "m³"]},{"kind": 4 ,"name": "{\"en\": \"Domestic hot water temperature\", \"pl\": \"Temperatura ciepłej wody użytkowej\", \"ro\": \"Temperatura apei calde menajere\", \"au\": \"Warmwasse rtemperatur\", \"lv\":\"Mājsaimniecību karstā ūdens  temperatūra\", \"bg\": \"Domestic hot water temperature\",\"sk\": \"Teplota teplej úžitkovej vody\"}",  "headers": ["0ku", "°C"]}]}', TRUE))
FROM
	contracts b
	Left join projects  p 
	on b.project_id = p.id
WHERE p.country = 'Latvia';

-- anex 4 baseyear_n_1
UPDATE
	contracts
SET
	tables = b.tables || (
		SELECT
			jsonb_set(b.tables, '{"baseyear_n_1"}','{"rows": [["1","","","",""],["2","","","",""],["3","","","",""],["4","","","",""],["5","","","",""],["6","","","",""],["7","","","",""],["8","","","",""],["9","","","",""],["10","","","",""],["11","","","",""],["12","","","",""]],"title": "","columns": [{"kind": 1 ,"name": "","headers": ["{\"en\": \"Symbol\", \"pl\": \"Oznaczenie\", \"ro\": \"Simbol\", \"au\": \"Symbol\", \"lv\":\"Simbols\", \"bg\": \"Символ\",\"sk\": \"Symbol\"}", "{\"en\": \"Unit\", \"pl\": \"Jednostka\", \"ro\": \"Unitate\", \"au\": \"Einheit\", \"lv\":\"Vienība\", \"bg\": \"Единици\",\"sk\": \"Jednotka\"}"]},{"kind": 5 ,"name": "{\"en\": \"Heating days\", \"pl\": \"Liczba dni ogrzewania\", \"ro\": \"Numărul zilelor de încălzire efectivă\", \"au\": \"Anzahl Heiztage\", \"lv\":\"Apkures dienu skaits\", \"bg\": \"Брой на дни\",\"sk\": \"Počet vykurovacích dní\"}",  "headers": ["$D_{Apk}$", "{\"en\": \"Days\", \"pl\": \"Dni\", \"ro\": \"Zile\", \"au\": \"Tage\", \"lv\":\"Dienas\", \"bg\": \"Дни\",\"sk\": \"Dni\"}"]},{"kind": 7 ,"name": "{\"en\": \"Total heat energy consumption\", \"pl\": \"Całkowite zużycie energii cieplnej\", \"ro\": \"Consumul total e energie termică\", \"au\": \"Gesamter Wärmeenergieverbrauch\", \"lv\":\"Kopējais siltumenerģijas patēriņš\", \"bg\": \"Total heat energy consumption\",\"sk\": \"Celková spotreba tepelnej energie\"}",  "headers": ["$Q_{t}$", "MWh"]},{"kind": 6 ,"name": "{\"en\": \"Domestic hot water consumption\", \"pl\": \"Zużycie ciepłej wody użytkowej\", \"ro\": \"Consumul de apă caldă menajeră\", \"au\": \"Warmwasserverbrauch\", \"lv\":\"Mājsaimniecību karstā ūdens patēriņš\", \"bg\": \"Domestic hot water consumption\",\"sk\": \"Spotreba teplej úžitkovej vody\"}",  "headers": ["V", "m³"]},{"kind": 4 ,"name": "{\"en\": \"Domestic hot water temperature\", \"pl\": \"Temperatura ciepłej wody użytkowej\", \"ro\": \"Temperatura apei calde menajere\", \"au\": \"Warmwasse rtemperatur\", \"lv\":\"Mājsaimniecību karstā ūdens  temperatūra\", \"bg\": \"Domestic hot water temperature\",\"sk\": \"Teplota teplej úžitkovej vody\"}",  "headers": ["0ku", "°C"]}]}', TRUE))
FROM
	contracts b
	Left join projects  p 
	on b.project_id = p.id
WHERE p.country = 'Latvia';

-- anex 4 baseyear_n
UPDATE
	contracts
SET
	tables = b.tables || (
		SELECT
			jsonb_set(b.tables, '{"baseyear_n"}','{"rows": [["1","","","",""],["2","","","",""],["3","","","",""],["4","","","",""],["5","","","",""],["6","","","",""],["7","","","",""],["8","","","",""],["9","","","",""],["10","","","",""],["11","","","",""],["12","","","",""]],"title": "","columns": [{"kind": 1 ,"name": "","headers": ["{\"en\": \"Symbol\", \"pl\": \"Oznaczenie\", \"ro\": \"Simbol\", \"au\": \"Symbol\", \"lv\":\"Simbols\", \"bg\": \"Символ\",\"sk\": \"Symbol\"}", "{\"en\": \"Unit\", \"pl\": \"Jednostka\", \"ro\": \"Unitate\", \"au\": \"Einheit\", \"lv\":\"Vienība\", \"bg\": \"Единици\",\"sk\": \"Jednotka\"}"]},{"kind": 5 ,"name": "{\"en\": \"Heating days\", \"pl\": \"Liczba dni ogrzewania\", \"ro\": \"Numărul zilelor de încălzire efectivă\", \"au\": \"Anzahl Heiztage\", \"lv\":\"Apkures dienu skaits\", \"bg\": \"Брой на дни\",\"sk\": \"Počet vykurovacích dní\"}",  "headers": ["$D_{Apk}$", "{\"en\": \"Days\", \"pl\": \"Dni\", \"ro\": \"Zile\", \"au\": \"Tage\", \"lv\":\"Dienas\", \"bg\": \"Дни\",\"sk\": \"Dni\"}"]},{"kind": 7 ,"name": "{\"en\": \"Total heat energy consumption\", \"pl\": \"Całkowite zużycie energii cieplnej\", \"ro\": \"Consumul total e energie termică\", \"au\": \"Gesamter Wärmeenergieverbrauch\", \"lv\":\"Kopējais siltumenerģijas patēriņš\", \"bg\": \"Total heat energy consumption\",\"sk\": \"Celková spotreba tepelnej energie\"}",  "headers": ["$Q_{t}$", "MWh"]},{"kind": 6 ,"name": "{\"en\": \"Domestic hot water consumption\", \"pl\": \"Zużycie ciepłej wody użytkowej\", \"ro\": \"Consumul de apă caldă menajeră\", \"au\": \"Warmwasserverbrauch\", \"lv\":\"Mājsaimniecību karstā ūdens patēriņš\", \"bg\": \"Domestic hot water consumption\",\"sk\": \"Spotreba teplej úžitkovej vody\"}",  "headers": ["V", "m³"]},{"kind": 4 ,"name": "{\"en\": \"Domestic hot water temperature\", \"pl\": \"Temperatura ciepłej wody użytkowej\", \"ro\": \"Temperatura apei calde menajere\", \"au\": \"Warmwasse rtemperatur\", \"lv\":\"Mājsaimniecību karstā ūdens  temperatūra\", \"bg\": \"Domestic hot water temperature\",\"sk\": \"Teplota teplej úžitkovej vody\"}",  "headers": ["0ku", "°C"]}]}', TRUE))
FROM
	contracts b
	Left join projects  p 
	on b.project_id = p.id
WHERE p.country = 'Latvia';

-- anex 4 baseconditions_n_2
UPDATE
	contracts
SET
	tables = b.tables || (
		SELECT
			jsonb_set(b.tables, '{"baseconditions_n_2"}','{"rows": [["1","","","",""],["2","","","",""],["3","","","",""],["4","","","",""],["5","","","",""],["6","","","",""],["7","","","",""],["8","","","",""],["9","","","",""],["10","","","",""],["11","","","",""],["12","","","",""]],"title": "","columns": [{"kind": 1,"name": "", "headers": ["{\"en\": \"Symbol\", \"pl\": \"Oznaczenie\", \"ro\": \"Simbol\", \"au\": \"Symbol\", \"lv\":\"Simbols\", \"bg\": \"Символ\",\"sk\": \"Symbol\"}", "{\"en\": \"Unit\", \"pl\": \"Jednostka\", \"ro\": \"Unitate\", \"au\": \"Einheit\", \"lv\":\"Vienība\", \"bg\": \"Единици\",\"sk\": \"Jednotka\"}"]},{"kind": 5,"name": "{\"en\": \"Heating days\", \"pl\": \"Liczba dni ogrzewania\", \"ro\": \"Numărul zilelor de încălzire efectivă\", \"au\": \"Anzahl Heiztage\", \"lv\":\"Apkures dienu skaits\", \"bg\": \"Брой на дни\",\"sk\": \"Počet vykurovacích dní\"}", "headers": ["$D_{Apk}$", "{\"en\": \"Days\", \"pl\": \"Dni\", \"ro\": \"Zile\", \"au\": \"Tage\", \"lv\":\"Dienas\", \"bg\": \"Дни\",\"sk\": \"Dni\"}"]},{"kind": 4,"name": "{\"en\": \"Outdoor temperature\", \"pl\": \"Temperatura zewnętrzna\", \"ro\": \"Temperatură exterioară\", \"au\": \"Außentemperatur\", \"lv\":\"Ārējā gaisa temperatūra\", \"bg\": \"Средна температура на външния въздух\",\"sk\": \"Vonkajšia teplota\"}", "headers": ["$T_{1}$", "°C"]},{"kind": 4,"name": "{\"en\": \"Average indoor temperature\", \"pl\": \"Średnia temperatura zewnętrzna\", \"ro\": \"Temperatura medie interioară\", \"au\": \"Durchschnittliche Raumtemperatur\", \"lv\":\"Vidējā gaisa temperatūra telpās\", \"bg\": \"Средна обемна температура на помещенията\",\"sk\": \"Priemerná vnútorná teplota\"}", "headers": ["$T_{3}$", "°C"]},{"kind": 5,"name": "{\"en\": \"Degree Days\", \"pl\": \"Stopniodni\", \"ro\": \"Numărul zilelor ce necestită încălzire\", \"au\": \"Heizgradtage\", \"lv\":\"Grādu dienas\", \"bg\": \"Денградуси\",\"sk\": \"Počet dní vykurovacej sezóny\"}", "headers": ["GDD", "-"]}]}', TRUE))
FROM
	contracts b
	Left join projects  p 
	on b.project_id = p.id
WHERE p.country = 'Latvia';

-- anex 4 baseconditions_n_1
UPDATE
	contracts
SET
	tables = b.tables || (
		SELECT
			jsonb_set(b.tables, '{"baseconditions_n_1"}','{"rows": [["1","","","",""],["2","","","",""],["3","","","",""],["4","","","",""],["5","","","",""],["6","","","",""],["7","","","",""],["8","","","",""],["9","","","",""],["10","","","",""],["11","","","",""],["12","","","",""]],"title": "","columns": [{"kind": 1,"name": "", "headers": ["{\"en\": \"Symbol\", \"pl\": \"Oznaczenie\", \"ro\": \"Simbol\", \"au\": \"Symbol\", \"lv\":\"Simbols\", \"bg\": \"Символ\",\"sk\": \"Symbol\"}", "{\"en\": \"Unit\", \"pl\": \"Jednostka\", \"ro\": \"Unitate\", \"au\": \"Einheit\", \"lv\":\"Vienība\", \"bg\": \"Единици\",\"sk\": \"Jednotka\"}"]},{"kind": 5,"name": "{\"en\": \"Heating days\", \"pl\": \"Liczba dni ogrzewania\", \"ro\": \"Numărul zilelor de încălzire efectivă\", \"au\": \"Anzahl Heiztage\", \"lv\":\"Apkures dienu skaits\", \"bg\": \"Брой на дни\",\"sk\": \"Počet vykurovacích dní\"}", "headers": ["$D_{Apk}$", "{\"en\": \"Days\", \"pl\": \"Dni\", \"ro\": \"Zile\", \"au\": \"Tage\", \"lv\":\"Dienas\", \"bg\": \"Дни\",\"sk\": \"Dni\"}"]},{"kind": 4,"name": "{\"en\": \"Outdoor temperature\", \"pl\": \"Temperatura zewnętrzna\", \"ro\": \"Temperatură exterioară\", \"au\": \"Außentemperatur\", \"lv\":\"Ārējā gaisa temperatūra\", \"bg\": \"Средна температура на външния въздух\",\"sk\": \"Vonkajšia teplota\"}", "headers": ["$T_{1}$", "°C"]},{"kind": 4,"name": "{\"en\": \"Average indoor temperature\", \"pl\": \"Średnia temperatura zewnętrzna\", \"ro\": \"Temperatura medie interioară\", \"au\": \"Durchschnittliche Raumtemperatur\", \"lv\":\"Vidējā gaisa temperatūra telpās\", \"bg\": \"Средна обемна температура на помещенията\",\"sk\": \"Priemerná vnútorná teplota\"}", "headers": ["$T_{3}$", "°C"]},{"kind": 5,"name": "{\"en\": \"Degree Days\", \"pl\": \"Stopniodni\", \"ro\": \"Numărul zilelor ce necestită încălzire\", \"au\": \"Heizgradtage\", \"lv\":\"Grādu dienas\", \"bg\": \"Денградуси\",\"sk\": \"Počet dní vykurovacej sezóny\"}", "headers": ["GDD", "-"]}]}', TRUE))
FROM
	contracts b
	Left join projects  p 
	on b.project_id = p.id
WHERE p.country = 'Latvia';

-- anex 4 baseconditions_n
UPDATE
	contracts
SET
	tables = b.tables || (
		SELECT
			jsonb_set(b.tables, '{"baseconditions_n"}','{"rows": [["1","","","",""],["2","","","",""],["3","","","",""],["4","","","",""],["5","","","",""],["6","","","",""],["7","","","",""],["8","","","",""],["9","","","",""],["10","","","",""],["11","","","",""],["12","","","",""]],"title": "","columns": [{"kind": 1,"name": "", "headers": ["{\"en\": \"Symbol\", \"pl\": \"Oznaczenie\", \"ro\": \"Simbol\", \"au\": \"Symbol\", \"lv\":\"Simbols\", \"bg\": \"Символ\",\"sk\": \"Symbol\"}", "{\"en\": \"Unit\", \"pl\": \"Jednostka\", \"ro\": \"Unitate\", \"au\": \"Einheit\", \"lv\":\"Vienība\", \"bg\": \"Единици\",\"sk\": \"Jednotka\"}"]},{"kind": 5,"name": "{\"en\": \"Heating days\", \"pl\": \"Liczba dni ogrzewania\", \"ro\": \"Numărul zilelor de încălzire efectivă\", \"au\": \"Anzahl Heiztage\", \"lv\":\"Apkures dienu skaits\", \"bg\": \"Брой на дни\",\"sk\": \"Počet vykurovacích dní\"}", "headers": ["$D_{Apk}$", "{\"en\": \"Days\", \"pl\": \"Dni\", \"ro\": \"Zile\", \"au\": \"Tage\", \"lv\":\"Dienas\", \"bg\": \"Дни\",\"sk\": \"Dni\"}"]},{"kind": 4,"name": "{\"en\": \"Outdoor temperature\", \"pl\": \"Temperatura zewnętrzna\", \"ro\": \"Temperatură exterioară\", \"au\": \"Außentemperatur\", \"lv\":\"Ārējā gaisa temperatūra\", \"bg\": \"Средна температура на външния въздух\",\"sk\": \"Vonkajšia teplota\"}", "headers": ["$T_{1}$", "°C"]},{"kind": 4,"name": "{\"en\": \"Average indoor temperature\", \"pl\": \"Średnia temperatura zewnętrzna\", \"ro\": \"Temperatura medie interioară\", \"au\": \"Durchschnittliche Raumtemperatur\", \"lv\":\"Vidējā gaisa temperatūra telpās\", \"bg\": \"Средна обемна температура на помещенията\",\"sk\": \"Priemerná vnútorná teplota\"}", "headers": ["$T_{3}$", "°C"]},{"kind": 5,"name": "{\"en\": \"Degree Days\", \"pl\": \"Stopniodni\", \"ro\": \"Numărul zilelor ce necestită încălzire\", \"au\": \"Heizgradtage\", \"lv\":\"Grādu dienas\", \"bg\": \"Денградуси\",\"sk\": \"Počet dní vykurovacej sezóny\"}", "headers": ["GDD", "-"]}]}', TRUE))
FROM
	contracts b
	Left join projects  p 
	on b.project_id = p.id
WHERE p.country = 'Latvia';

-- anex 4 monitoring_phase_table
UPDATE
	contracts
SET
	tables = b.tables || (
		SELECT
			jsonb_set(b.tables, '{"monitoring_phase_table"}','{
"rows": [
["1", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["1", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["2", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["3", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["4", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["5", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["6", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["7", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["8", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["9", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["10", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["11", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["13", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["14", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["15", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["16", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["17", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["18", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["19", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"January\", \"pl\": \"Styczeń\", \"ro\": \"Ianuarie\", \"au\": \"Januar\", \"lv\":\"Janvāris\", \"bg\": \"Януари\",\"sk\": \"January\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"February\", \"pl\": \"Luty\", \"ro\": \"Februarie\", \"au\": \"Februar\", \"lv\":\"Februāris\", \"bg\": \"Февруару\",\"sk\": \"February\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"March\", \"pl\": \"Marzec\", \"ro\": \"Martie\", \"au\": \"März\", \"lv\":\"Marts\", \"bg\": \"Март\",\"sk\": \"March\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"April\", \"pl\": \"Kwiecień\", \"ro\": \"Aprilie\", \"au\": \"April\", \"lv\":\"Aprīlis\", \"bg\": \"Април\",\"sk\": \"April\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"May\", \"pl\": \"Maj\", \"ro\": \"Mai\", \"au\": \"Mai\", \"lv\":\"Maijs\", \"bg\": \"Май\",\"sk\": \"May\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"June\", \"pl\": \"Czerwiec\", \"ro\": \"Iunie\", \"au\": \"Juni\", \"lv\":\"Jūnijs\", \"bg\": \"Юни\",\"sk\": \"June\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"July\", \"pl\": \"Lipiec\", \"ro\": \"Iulie\", \"au\": \"Juli\", \"lv\":\"Jūlijs\", \"bg\": \"Юли\",\"sk\": \"July\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"August\", \"pl\": \"Sierpień\", \"ro\": \"August\", \"au\": \"August\", \"lv\":\"Augusts\", \"bg\": \"Август\",\"sk\": \"August\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"September\", \"pl\": \"Wrzesień\", \"ro\": \"Septembrie\", \"au\": \"September\", \"lv\":\"Septembris\", \"bg\": \"Септември\",\"sk\": \"September\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"October\", \"pl\": \"Październik\", \"ro\": \"Octombrie\", \"au\": \"Oktober\", \"lv\":\"Oktobris\", \"bg\": \"Октомври\",\"sk\": \"October\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"November\", \"pl\": \"Listopad\", \"ro\": \"Noiembrie\", \"au\": \"November\", \"lv\":\"Novembris\", \"bg\": \"Ноември\",\"sk\": \"November\"}", "", "", "", "", "", "", ""],
["20", "{\"en\": \"December\", \"pl\": \"Grudzień\", \"ro\": \"Decembrie\", \"au\": \"Dezember\", \"lv\":\"Decembris\", \"bg\": \"Декември\",\"sk\": \"December\"}", "", "", "", "", "", "", ""]
],
"title": "",
"columns": [
{"kind": 5,"name": "{\"en\": \"Year\", \"pl\": \"Rok\", \"ro\": \"An\", \"au\": \"Jahr\", \"lv\":\"Gadā\", \"bg\": \"Година\",\"sk\": \"Year\"}", "headers": ["{\"en\": \"Symbol\", \"pl\": \"Oznaczenie\", \"ro\": \"Simbol\", \"au\": \"Symbol\", \"lv\":\"Simbols\", \"bg\": \"Символ\",\"sk\": \"Symbol\"}", "{\"en\": \"Unit\", \"pl\": \"Jednostka\", \"ro\": \"Unitate\", \"au\": \"Einheit\", \"lv\":\"Vienība\", \"bg\": \"Единици\",\"sk\": \"Unit\"}"]},
{"kind": 1,"name": "{\"en\": \"Month\", \"pl\": \"Miesiąc\", \"ro\": \"Lună\", \"au\": \"Monat\", \"lv\":\"Mēnesī\", \"bg\": \"Месец\",\"sk\": \"Mesiac \"}", "headers": ["{\"en\": \"Symbol\", \"pl\": \"Oznaczenie\", \"ro\": \"Simbol\", \"au\": \"Symbol\", \"lv\":\"Simbols\", \"bg\": \"Символ\",\"sk\": \"Symbol\"}", "{\"en\": \"Unit\", \"pl\": \"Jednostka\", \"ro\": \"Unitate\", \"au\": \"Einheit\", \"lv\":\"Vienība\", \"bg\": \"Единици\",\"sk\": \"Unit\"}"]},
{"kind": 5,"name": "{\"en\": \"Heating days\", \"pl\": \"Liczba dni ogrzewania\", \"ro\": \"Numărul zilelor de încălzire efectivă\", \"au\": \"Anzahl Heiztage\", \"lv\":\"Apkures dienu skaits\", \"bg\": \"Брой на дни\",\"sk\": \"Heating days\"}", "headers": ["$D_{Apk}$", "{\"en\": \"Days\", \"pl\": \"Dni\", \"ro\": \"Zile\", \"au\": \"Tage\", \"lv\":\"Dienas\", \"bg\": \"Дни\",\"sk\": \"Days\"}"]},
{"kind": 7,"name": "{\"en\": \"Total heat energy consumption\", \"pl\": \"Całkowite zużycie energii cieplnej\", \"ro\": \"Consumul total e energie termică\", \"au\": \"Gesamter Wärmeenergieverbrauch\", \"lv\":\"Kopējais siltumenerģijas patēriņš\", \"bg\": \"Total heat energy consumption\",\"sk\": \"Total heat energy consumption\"}", "headers": ["$Q_{t}$", "MWh"]},
{"kind": 6,"name": "{\"en\": \"Domestic hot water consumption\", \"pl\": \"Zużycie ciepłej wody użytkowej\", \"ro\": \"Consumul de apă caldă menajeră\", \"au\": \"Warmwasserverbrauch\", \"lv\":\"Mājsaimniecību karstā ūdens patēriņš\", \"bg\": \"Domestic hot water consumption\",\"sk\": \"Domestic hot water consumption\"}", "headers": ["V", "m³"]},
{"kind": 4,"name": "{\"en\": \"Domestic hot water temperature\", \"pl\": \"Temperatura ciepłej wody użytkowej\", \"ro\": \"Temperatura apei calde menajere\", \"au\": \"Warmwasse rtemperatur\", \"lv\":\"Mājsaimniecību karstā ūdens  temperatūra\", \"bg\": \"Domestic hot water temperature\",\"sk\": \"Domestic hot water temperature\"}", "headers": ["0ku", "°C"]},
{"kind": 0,"name": "Measured by", "headers": ["", ""]},
{"kind": 0,"name": "Measured date", "headers": ["date", "date"]},
{"kind": 5,"name": "Savings deviations", "headers": ["", ""]}
]
}', TRUE))
FROM
	contracts b
	Left join projects  p 
	on b.project_id = p.id
WHERE p.country = 'Latvia';

-- +goose Down
SELECT 1;
