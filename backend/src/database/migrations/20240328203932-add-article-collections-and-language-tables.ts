import { Migration } from "@mikro-orm/migrations";

export class Migration20240328203932_add_article_collections_and_language_tables extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "languages" ("id" uuid not null, "name" varchar(255) not null, "code" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "languages_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "article_collections" ("id" uuid not null, "featured_date" date not null, "available_articles" int not null, "total_articles" int not null, "language_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "article_collections_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "article_collections" add constraint "article_collections_language_id_foreign" foreign key ("language_id") references "languages" ("id") on update cascade;',
    );

    this.addSql('alter table "articles" drop column "featured_date";');

    this.addSql(
      'alter table "articles" add column "collection_id" uuid not null;',
    );
    this.addSql(
      'alter table "articles" add constraint "articles_collection_id_foreign" foreign key ("collection_id") references "article_collections" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "article_collections" drop constraint "article_collections_language_id_foreign";',
    );

    this.addSql(
      'alter table "articles" drop constraint "articles_collection_id_foreign";',
    );

    this.addSql('drop table if exists "languages" cascade;');

    this.addSql('drop table if exists "article_collections" cascade;');

    this.addSql('alter table "articles" drop column "collection_id";');

    this.addSql(
      'alter table "articles" add column "featured_date" date not null;',
    );
  }
}
