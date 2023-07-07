import { Migration } from '@mikro-orm/migrations';

export class Migration20230706221415 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table `campaign` add column `parsers` json null;');
	}
}
