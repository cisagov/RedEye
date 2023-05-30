import { Migration } from '@mikro-orm/migrations';

export class Migration20230530231628 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table `campaign` add column `parser` text null;');
		this.addSql('alter table `campaign` add column `parsing_paths` json null;');
	}
}
