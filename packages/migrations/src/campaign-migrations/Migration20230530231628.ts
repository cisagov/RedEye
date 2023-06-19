import { Migration } from '@mikro-orm/migrations';

export class Migration20230530231628 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table `host_meta` add column `os_version` text null;');

		this.addSql('drop index `server_parsing_path_unique`;');
		this.addSql('create unique index `server_name_unique` on `server` (`name`);');

		this.addSql(
			'alter table `beacon_meta` add column `process` text null constraint `beacon_meta_source_id_foreign` references `log_entry` (`id`) on update cascade on delete set null;'
		);
		this.addSql('alter table `beacon_meta` add column `port` integer null;');
	}
}
