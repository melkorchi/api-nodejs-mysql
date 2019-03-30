-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  sam. 30 mars 2019 à 12:18
-- Version du serveur :  5.7.19
-- Version de PHP :  7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `jo2024`
--

-- --------------------------------------------------------

--
-- Structure de la table `sites`
--

DROP TABLE IF EXISTS `sites`;
CREATE TABLE IF NOT EXISTS `sites` (
  `ID_SITE` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` char(100) DEFAULT NULL,
  `COMMUNE` char(100) DEFAULT NULL,
  `LONGITUDE` decimal(10,5) DEFAULT NULL,
  `LATTITUDE` decimal(10,5) DEFAULT NULL,
  PRIMARY KEY (`ID_SITE`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `sites`
--

INSERT INTO `sites` (`ID_SITE`, `NAME`, `COMMUNE`, `LONGITUDE`, `LATTITUDE`) VALUES
(1, 'Stade de France', 'Saint-Denis', '2.4427', '48.81499'),
(2, 'Stand de tir du Bourget', 'Le Bourget', '2.425377', '48.936752'),
(3, 'Tour Eiffel', 'Paris', '2.29448', '48.85837'),
(4, 'Trocadéro', 'Paris', '2.28636', '48.86327'),
(5, 'Bercy Accor Hotel Arena', 'Paris', '2.37858', '48.83854');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
