import { Migration } from '@mikro-orm/migrations';

export class Migration20221203020658 extends Migration {
	async up(): Promise<void> {
		this.addSql('PRAGMA foreign_keys = OFF;');
		this.addSql(
			'CREATE TABLE `_knex_temp_alter577` (`id` text NOT NULL, `os` text NULL, `ip` text NULL, `type` text NULL, `host_id` text NOT NULL, CONSTRAINT `host_meta_host_id_foreign` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`) ON UPDATE CASCADE, PRIMARY KEY (`id`), CONSTRAINT `host_meta_host_id_foreign` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`) ON DELETE cascade ON UPDATE cascade);'
		);
		this.addSql('INSERT INTO "_knex_temp_alter577" SELECT * FROM "host_meta";;');
		this.addSql('DROP TABLE "host_meta";');
		this.addSql('ALTER TABLE "_knex_temp_alter577" RENAME TO "host_meta";');
		this.addSql('CREATE INDEX `host_meta_host_id_index` on `host_meta` (`host_id`);');
		this.addSql('CREATE UNIQUE INDEX `host_meta_os_ip_host_id_unique` on `host_meta` (`os`, `ip`, `host_id`);');
		this.addSql('PRAGMA foreign_keys = ON;');

		this.addSql('PRAGMA foreign_keys = OFF;');
		this.addSql(
			'CREATE TABLE `_knex_temp_alter509` (`id` text NOT NULL, `parsing_rule` text NULL, `attack_ids` text NULL, `input_id` text NULL, `input_text` text NOT NULL, `beacon_id` text NULL, `operator_id` text NULL, `command_failed` integer NOT NULL DEFAULT null, CONSTRAINT `command_input_id_foreign` FOREIGN KEY (`input_id`) REFERENCES `log_entry` (`id`) ON DELETE CASCADE, CONSTRAINT `command_beacon_id_foreign` FOREIGN KEY (`beacon_id`) REFERENCES `beacon` (`id`) ON DELETE CASCADE, CONSTRAINT `command_operator_id_foreign` FOREIGN KEY (`operator_id`) REFERENCES `operator` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`id`));'
		);
		this.addSql('INSERT INTO "_knex_temp_alter509" SELECT * FROM "command";;');
		this.addSql('DROP TABLE "command";');
		this.addSql('ALTER TABLE "_knex_temp_alter509" RENAME TO "command";');
		this.addSql('CREATE UNIQUE INDEX `command_input_id_unique` on `command` (`input_id`);');
		this.addSql('CREATE INDEX `command_beacon_id_index` on `command` (`beacon_id`);');
		this.addSql('CREATE INDEX `command_operator_id_index` on `command` (`operator_id`);');
		this.addSql('PRAGMA foreign_keys = ON;');

		this.addSql('PRAGMA foreign_keys = OFF;');
		this.addSql(
			"CREATE TABLE `_knex_temp_alter552` (`id` text NOT NULL, `type` text check (`type` in ('http', 'https', 'smb', 'dns')) NOT NULL CHECK (`type` in('http' , 'https' , 'smb' , 'dns')) DEFAULT 'http', `server_id` text NOT NULL, CONSTRAINT `server_meta_server_id_foreign` FOREIGN KEY (`server_id`) REFERENCES `server` (`id`) ON UPDATE CASCADE, PRIMARY KEY (`id`));"
		);
		this.addSql('INSERT INTO "_knex_temp_alter552" SELECT * FROM "server_meta";;');
		this.addSql('DROP TABLE "server_meta";');
		this.addSql('ALTER TABLE "_knex_temp_alter552" RENAME TO "server_meta";');
		this.addSql('CREATE UNIQUE INDEX `server_meta_server_id_unique` on `server_meta` (`server_id`);');
		this.addSql('PRAGMA foreign_keys = ON;');
	}
}
