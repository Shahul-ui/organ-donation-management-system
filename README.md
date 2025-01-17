# organ-donation-management-system

Mysql Database Codes for this Project

CREATE DATABASE organ_donation_system;

USE organ_donation_system;

CREATE TABLE donors (
    donor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    blood_group VARCHAR(10),
    organ_donated VARCHAR(100),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    donation_date DATE
);

CREATE TABLE recipients (
    recipient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    blood_group VARCHAR(10),
    organ_required VARCHAR(100),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    registration_date DATE
);

SELECT * FROM donors;

SELECT * FROM recipients;

-- Insert donor data
INSERT INTO donors (name, age, blood_group, organ_donated, contact_number, email, address, donation_date)
VALUES
  ('John Doe', 35, 'O+', 'Kidney', '1234567890', 'johndoe@example.com', '123 Street, City', '2025-01-01'),
  ('Jane Smith', 28, 'A-', 'Liver', '0987654321', 'janesmith@example.com', '456 Avenue, City', '2025-01-02');

-- Insert recipient data
INSERT INTO recipients (name, age, blood_group, organ_required, contact_number, email, address, registration_date)
VALUES
  ('Alice Johnson', 40, 'O+', 'Kidney', '1231231234', 'alice@example.com', '789 Road, City', '2025-01-03'),
  ('Bob Brown', 50, 'B-', 'Heart', '5675675678', 'bob@example.com', '321 Lane, City', '2025-01-04');

-- Update a donor's contact number
UPDATE donors
SET contact_number = '9876543210'
WHERE donor_id = 1;  -- Assuming 'donor_id' is the primary key

-- Update a recipient's address
UPDATE recipients
SET address = 'Updated Road, New City'
WHERE recipient_id = 2;  -- Assuming 'recipient_id' is the primary key

-- Truncate (delete all data) from the 'donors' table
TRUNCATE TABLE donors;
