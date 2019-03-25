CREATE DATABASE todolist;

-- Table tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL,
  `task` varchar(200) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
 
ALTER TABLE `tasks` ADD PRIMARY KEY (`id`);
ALTER TABLE `tasks` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Populate table

INSERT INTO `tasks` (`id`, `task`, `status`, `created_at`) VALUES
(1, 'Find bugs', 1, '2016-04-10 23:50:40'),
(2, 'Review code', 1, '2016-04-10 23:50:40'),
(3, 'Fix bugs', 1, '2016-04-10 23:50:40'),
(4, 'Refactor Code', 1, '2016-04-10 23:50:40'),
(5, 'Push to prod', 1, '2016-04-10 23:50:50');

-- Table users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `avatar` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
 
ALTER TABLE `users` ADD PRIMARY KEY (`id`);
ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Populate table

INSERT INTO `users` (`firstname`, `lastname`, `email`, `password`, `avatar`, `status`) VALUES
('Mohammed', 'El korchi', 'logimek@gmail.com', 'test', 'avatar.png', 1),

--Table events
CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `discipline_id` int(11) NOT NULL,
  `epreuve` varchar(100) NOT NULL,
  `event_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
 
ALTER TABLE `users` ADD PRIMARY KEY (`id`);
ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Get all events
SELECT e.ID_EVENT, d.NAME as discipline, p.name as participant, e.EPREUVE, e.EVENT_DATE FROM `events` AS e
INNER JOIN discipline AS d
ON e.ID_EVENT = d.ID_DISCIPLINE
INNER JOIN event_has_pays AS ehp
ON e.ID_EVENT = ehp.ID_EVENT
INNER JOIN pays AS p
ON ehp.ID_PAYS = p.ID_PAYS