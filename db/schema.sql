CREATE DATABASE IF NOT EXISTS credit_score_db;
USE credit_score_db;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Loan Officer', 'Underwriter') DEFAULT 'Loan Officer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applicants table
CREATE TABLE IF NOT EXISTS applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    annual_income DECIMAL(15, 2) NOT NULL,
    employment_status ENUM('Employed', 'Self-Employed', 'Unemployed', 'Student') DEFAULT 'Employed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Credit Scores table
CREATE TABLE IF NOT EXISTS credit_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    score INT NOT NULL,
    risk_classification ENUM('Low Risk', 'Medium Risk', 'High Risk') NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    loan_amount DECIMAL(15, 2) NOT NULL,
    tenure_months INT NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    emi_amount DECIMAL(15, 2),
    decision_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);
