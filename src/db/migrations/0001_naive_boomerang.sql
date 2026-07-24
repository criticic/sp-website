PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_committees` (
	`name` text PRIMARY KEY NOT NULL,
	`description` text,
	`email` text
);
--> statement-breakpoint
INSERT INTO `__new_committees`("name", "description", "email") SELECT "name", "description", "email" FROM `committees`;--> statement-breakpoint
DROP TABLE `committees`;--> statement-breakpoint
ALTER TABLE `__new_committees` RENAME TO `committees`;--> statement-breakpoint
PRAGMA foreign_keys=ON;