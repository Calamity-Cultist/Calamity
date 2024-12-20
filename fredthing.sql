-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 20, 2024 at 03:42 PM
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
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `image` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `out_of_order` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`image`, `title`, `description`, `price`, `out_of_order`) VALUES
('../product/images/proMang.png', 'Mango Juice - Rp 15.000', 'Fresh and sweet mango juice made from ripe mangoes', 'Rp 15.000', 0),
('../product/images/proAvo.png', 'Avocado Juice - Rp 20.000', 'Creamy and nutritious avocado juice blend', 'Rp 20.000', 0),
('../product/images/proSour.png', 'Soursop Juice - Rp 15.000', 'Exotic soursop juice with a unique tropical taste', 'Rp 15.000', 1),
('../product/images/proMix.png', 'Mix Juice - Rp 25.000', 'A refreshing blend of mixed tropical fruits', 'Rp 25.000', 1),
('../product/images/proCal.png', 'Calamity Special - Rp 30.000', 'Our signature blend of premium fruits and herbs', 'Rp 30.000', 0),
('../product/images/proApp.png', 'Apple Juice - Rp 18.000', 'Pure and refreshing apple juice', 'Rp 18.000', 0),
('../product/images/proThai.png', 'Thailongtea - Rp 20.000', 'Authentic Thai tea with a rich, creamy taste', 'Rp 20.000', 0),
('../product/images/proMonk.png', 'Monk Fruit Juice - Rp 23.000', 'Naturally sweetened monk fruit juice blend', 'Rp 23.000', 0),
('../product/images/proHerb.png', 'Herbal Green Tea - Rp 13.000', 'Healthy blend of green tea and natural herbs', 'Rp 13.000', 0);

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
(2, 'ryan', '$2a$10$UtMlOPyWUPuYbLuRg6GG/.kxRp0CgeU8GHX5SI9Jr4v8bvnF5p7Fy', 'admin'),
(5, 'jevin', '$2a$10$ZXfCXAPoUsWVPmIcVYzjKuV/OIduSRkxpHcra3hNm0ysX3ihxAaSO', 'client'),
(6, 'robby', '$2a$10$xawXDldESalvVM.LknIgzepq2KTjt5CY4PWC5PHEK5Yej3CwJ7.JO', 'client'),
(7, 'hardy', '$2a$10$To86qb1yMA7RR1NS2Fd9se3HlT./e2TK4EVLedAmigDNjy0/JmSZ.', 'client'),
(8, 'asdasdsad', '$2a$10$kMTXqFlBaNuC4UZyPlvRWOWWSbl6iPN3Zhyf40Om2OE.cc8YZvEhS', 'client');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
