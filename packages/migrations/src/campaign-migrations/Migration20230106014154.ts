import { Migration } from '@mikro-orm/migrations';

export class Migration20230106014154 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table `link` add column `name` text null;');
		this.addSql('alter table `link` add column `manual` integer not null default false;');
	}
}
