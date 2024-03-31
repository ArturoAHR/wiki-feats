import { Migration } from "@mikro-orm/migrations";

export class Migration20240327193831_increase_thumbnail_table_url_column_capacity extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "thumbnails" alter column "url" type varchar(500) using ("url"::varchar(500));',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "thumbnails" alter column "url" type varchar(255) using ("url"::varchar(255));',
    );
  }
}
