CREATE TABLE `committee_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`committee_name` text NOT NULL,
	`role` text NOT NULL,
	`is_convenor` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`committee_name`) REFERENCES `committees`(`name`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `committees` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`email` text
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`contact_link` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_name_unique` ON `members` (`name`);--> statement-breakpoint
CREATE TABLE `newsletters` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`publish_date` integer NOT NULL,
	`pdf_path` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `updates` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`pub_date` integer NOT NULL,
	`author` text NOT NULL,
	`summary` text NOT NULL,
	`tags` text NOT NULL,
	`content` text NOT NULL
);
