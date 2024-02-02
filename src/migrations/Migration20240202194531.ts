import { Migration } from '@mikro-orm/migrations';

export class Migration20240202194531 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `transaction` (`reference` integer not null primary key autoincrement, `date` datetime not null, `amount` decimal(16,2) not null, `type` char(8) not null, `category` varchar(64) not null, `user_email` varchar(52) not null, unique (`reference`));',
    );
  }
}
