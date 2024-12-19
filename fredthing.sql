-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 19, 2024 at 01:16 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fredthing`
--

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `icon`, `title`, `description`) VALUES
(1, 'fas fa-gamepad', 'NFT Games', 'I plan on making my own NFT game where everyone can meet each other, trading stuff , playing together using my own made crypto token.'),
(2, 'fas fa-graduation-cap', 'Lulus UIB', 'Saya kuliah di Universitas Internasional Batam dan mengambil jurusan Teknologi Informasi because i like to mess around with computer stuff.'),
(3, 'fas fa-circle-question', 'Coming Soon', 'Coming Soon , When im interested in more things.');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) DEFAULT 'client'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', '$2a$12$XOJrHuTJ5vC2w.rfv8MsQ.KY1sMxV42jFBAvPD3a4QI7mNseErf8u', 'admin'),
(2, 'ryan', '$2a$10$UtMlOPyWUPuYbLuRg6GG/.kxRp0CgeU8GHX5SI9Jr4v8bvnF5p7Fy', 'client'),
(3, 'ryan2', '$2a$10$8DDBJD9PQ0ScxN1vVNlrVeRZ1oS.vKx9fnsfOQwVV4iamyFfbHVg.', 'client'),
(4, 'ryan3', '$2a$10$IjKOpN/gsX57i2kVRA2qVe/LsN.vXcg1pIT.BuiTaFuP4MHiB.ZDK', 'client'),
(5, 'jevin', '$2a$10$ZXfCXAPoUsWVPmIcVYzjKuV/OIduSRkxpHcra3hNm0ysX3ihxAaSO', 'client'),
(6, 'robby', '$2a$10$xawXDldESalvVM.LknIgzepq2KTjt5CY4PWC5PHEK5Yej3CwJ7.JO', 'client');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
