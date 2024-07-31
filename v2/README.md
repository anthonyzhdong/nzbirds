on macOS using homebrew
brew update
brew install mysql

brew services start mysql

mysql -u root 

npm run start

# Birds of Aotearoa API

This project is an Express.js application that provides a RESTful API for managing a collection of birds and their conservation statuses. The application connects to a MySQL database and includes routes for creating, reading, updating, and deleting bird records.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Running the Application](#running-the-application)
5. [API Endpoints](#api-endpoints)
6. [File Upload](#file-upload)
7. [Error Handling](#error-handling)

## Prerequisites

- Node.js
- npm
- MySQL
- Homebrew (for macOS users)

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/anthonyzhdong/nzbirds.git
   cd nzbirds/v2
    ```
2. **Install Dependencies**
    ```
    npm install
    ```

3. **Setup MySQL Using Homebrew (macOS users)**
    ```
    brew update
    brew install mysql
    brew services start mysql
    ```

## Database Setup

1. **Start MySQL**
    ```
    mysql -u root
    ```

2. **Run db_setup.sql in the sql folder**

    ```
    -- create database
    DROP TABLE IF EXISTS Photos;
    DROP TABLE IF EXISTS Bird;
    DROP TABLE IF EXISTS ConservationStatus;
    DROP DATABASE ASGN2;

    CREATE DATABASE ASGN2;
    USE ASGN2;

    -- create tables

    CREATE TABLE ConservationStatus (
        status_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        status_name VARCHAR(255) NOT NULL,
        status_colour CHAR(7) NOT NULL
    );

    CREATE TABLE Bird(
        bird_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        primary_name VARCHAR(255) NOT NULL,
        english_name VARCHAR(255) NOT NULL,
        scientific_name VARCHAR(255) NOT NULL,
        order_name VARCHAR(255) NOT NULL,
        family VARCHAR(255) NOT NULL,
        weight INT NOT NULL,
        length INT NOT NULL,
        status_id INT NOT NULL,
        CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES ConservationStatus(status_id)
    );

    CREATE TABLE Photos(
        bird_id INT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        photographer VARCHAR(255) NOT NULL,
        CONSTRAINT fk_bird_id FOREIGN KEY (bird_id) REFERENCES Bird(bird_id)
    );
    ```

3. **Populate the database by running db_setup.sql in the sql folder**

## Running the Application

1. **Start the Application**
    ```
    npm run start
    ```

2. **Access the Application**

    Open your browser and navigate to http://localhost:3000


# finish documentation tomorrow and remove bash documentation from other git projects


