import { Migration } from '@mikro-orm/migrations';

export class Migration20230407200639 extends Migration {
	async up(): Promise<void> {
		this.addSql("alter table `host_meta` add column `shape` text not null default 'circle';");
		this.addSql('alter table `host_meta` add column `color` text null;');

		this.addSql("alter table `beacon_meta` add column `shape` text not null default 'circle';");
		this.addSql('alter table `beacon_meta` add column `color` text null;');

		this.addSql("alter table `server_meta` add column `shape` text not null default 'hexagonUp';");
		this.addSql('alter table `server_meta` add column `color` text null;');
	}
}
