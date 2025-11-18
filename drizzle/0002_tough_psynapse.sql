CREATE TABLE `artistTags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`description` text,
	`icon` varchar(64),
	`color` varchar(7),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `artistTags_id` PRIMARY KEY(`id`),
	CONSTRAINT `artistTags_name_unique` UNIQUE(`name`)
);
