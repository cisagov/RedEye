import { Migration } from '@mikro-orm/migrations';

export class Migration20221209003757 extends Migration {
	async up(): Promise<void> {
		this.addSql('PRAGMA foreign_keys = OFF;');
		this.addSql(
			'CREATE TABLE `_knex_temp_alter240` (`id` text NOT NULL, `os` text NULL, `ip` text NULL, `type` text NULL, `host_id` text NOT NULL, CONSTRAINT `host_meta_host_id_foreign` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`) ON UPDATE CASCADE, PRIMARY KEY (`id`), CONSTRAINT `host_meta_host_id_foreign` FOREIGN KEY (`host_id`) REFERENCES `host` (`id`) ON DELETE cascade ON UPDATE cascade);'
		);
		this.addSql('INSERT INTO "_knex_temp_alter240" SELECT * FROM "host_meta";');
		this.addSql('DROP TABLE "host_meta";');
		this.addSql('ALTER TABLE "_knex_temp_alter240" RENAME TO "host_meta";');
		this.addSql('CREATE INDEX `host_meta_host_id_index` on `host_meta` (`host_id`);');
		this.addSql('CREATE UNIQUE INDEX `host_meta_os_ip_host_id_unique` on `host_meta` (`os`, `ip`, `host_id`);');
		this.addSql('PRAGMA foreign_keys = ON;');

		this.addSql('PRAGMA foreign_keys = OFF;');
		this.addSql(
			"CREATE TABLE `_knex_temp_alter687` (`id` text NOT NULL, `type` text check (`type` in ('http', 'https', 'smb', 'dns')) NOT NULL CHECK (`type` in('http' , 'https' , 'smb' , 'dns')) DEFAULT 'http', `server_id` text NOT NULL, CONSTRAINT `server_meta_server_id_foreign` FOREIGN KEY (`server_id`) REFERENCES `server` (`id`) ON UPDATE CASCADE, PRIMARY KEY (`id`));"
		);
		this.addSql('INSERT INTO "_knex_temp_alter687" SELECT * FROM "server_meta";');
		this.addSql('DROP TABLE "server_meta";');
		this.addSql('ALTER TABLE "_knex_temp_alter687" RENAME TO "server_meta";');
		this.addSql('CREATE UNIQUE INDEX `server_meta_server_id_unique` on `server_meta` (`server_id`);');
		this.addSql('PRAGMA foreign_keys = ON;');
	}
}
