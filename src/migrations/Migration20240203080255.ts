import { Migration } from '@mikro-orm/migrations';

export class Migration20240203080255 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `transaction` (`reference` text not null, `user_email` text not null, `date` datetime not null, `amount` integer not null, `type` text not null, `category` text not null, primary key (`reference`, `user_email`));');
  }

}
