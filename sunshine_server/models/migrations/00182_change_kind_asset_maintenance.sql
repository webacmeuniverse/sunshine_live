-- +goose Up
-- +goose NO TRANSACTION

UPDATE
	contracts
SET
	tables = tables || (
		SELECT
			jsonb_set(tables, '{"asset_maintenance"}','{"rows": [["", "", "", "", "", ""]], "title": "", "columns": [{"kind": 9, "name": "{\"en\": \"Activity\", \"pl\": \"Działalność\", \"ro\": \"Activitate\", \"au\": \"Aktivität\", \"lv\":\"Darbība\", \"bg\": \"Дейност\",\"sk\": \"Činnosť\"}", "headers": null}, {"kind": 1, "name": "{\"en\": \"Responsible\", \"pl\": \"Odpowiedzialny\", \"ro\": \"Responsabil\", \"au\": \"Verantwortlich\", \"lv\":\"Atbildīgs\", \"bg\": \"Отговорен\",\"sk\": \"Zodpovedný\"}", "headers": null}, {"kind": 1, "name": "{\"en\": \"Planned date\", \"pl\": \"Planowana data\", \"ro\": \"Data planificată\", \"au\": \"Geplanter Termin\", \"lv\":\"Plānotais datums\", \"bg\": \"Планирана дата\",\"sk\": \"Plánovaný dátum\"}", "headers": null}, {"kind": 1, "name": "{\"en\": \"Done date\", \"pl\": \"Zrobić datę\", \"ro\": \"Data făcută\", \"au\": \"Fertiges Datum\", \"lv\":\"Veikts datums\", \"bg\": \"Дата на завършване\",\"sk\": \"Hotový dátum\"}", "headers": null}, {"kind": 1, "name": "{\"en\": \"Status\", \"pl\": \"Status\", \"ro\": \"stare\", \"au\": \"Status\", \"lv\":\"Statuss\", \"bg\": \"Статус\",\"sk\": \"Postavenie\"}", "headers": null}, {"kind": 1, "name": "{\"en\": \"Comments\", \"pl\": \"Uwagi\", \"ro\": \"Comentarii\", \"au\": \"Kommentare\", \"lv\":\"Komentāri\", \"bg\": \"Коментари\",\"sk\": \"Pripomienky\"}", "headers": null}]}', TRUE));

-- +goose Down

UPDATE
	contracts
SET
	tables = tables - 'asset_maintenance';
