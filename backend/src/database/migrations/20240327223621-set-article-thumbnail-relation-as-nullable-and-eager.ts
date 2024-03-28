import { Migration } from "@mikro-orm/migrations";

export class Migration20240327223621_set_article_thumbnail_relation_as_nullable_and_eager extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "articles" drop constraint "articles_thumbnail_id_foreign";',
    );

    this.addSql(
      'alter table "articles" alter column "thumbnail_id" drop default;',
    );
    this.addSql(
      'alter table "articles" alter column "thumbnail_id" type uuid using ("thumbnail_id"::text::uuid);',
    );
    this.addSql(
      'alter table "articles" alter column "thumbnail_id" drop not null;',
    );
    this.addSql(
      'alter table "articles" add constraint "articles_thumbnail_id_foreign" foreign key ("thumbnail_id") references "thumbnails" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "articles" drop constraint "articles_thumbnail_id_foreign";',
    );

    this.addSql(
      'alter table "articles" alter column "thumbnail_id" drop default;',
    );
    this.addSql(
      'alter table "articles" alter column "thumbnail_id" type uuid using ("thumbnail_id"::text::uuid);',
    );
    this.addSql(
      'alter table "articles" alter column "thumbnail_id" set not null;',
    );
    this.addSql(
      'alter table "articles" add constraint "articles_thumbnail_id_foreign" foreign key ("thumbnail_id") references "thumbnails" ("id") on update cascade;',
    );
  }
}
