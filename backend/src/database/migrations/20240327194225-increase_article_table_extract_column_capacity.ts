import { Migration } from "@mikro-orm/migrations";

export class Migration20240327194225_increase_article_table_extract_column_capacity extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "articles" alter column "extract" type varchar(3000) using ("extract"::varchar(3000));',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "articles" alter column "extract" type varchar(255) using ("extract"::varchar(255));',
    );
  }
}
