import { Migration } from '@mikro-orm/migrations';

export class Migration20221203042918 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table `campaign` add column `migration_error` integer not null default false;');
		this.addSql('alter table `campaign` rename column `blood_strike_server_count` to `server_count`;');
	}
}
