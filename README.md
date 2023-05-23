# Imgger ![Project Status](https://img.shields.io/badge/status-in%20progress-yellow)
You can check our app by clicking link: https://imgger.smallhost.pl/

This is a web application built with Django, GraphQL API, React and PostgreSQL. The purpose of this app is to provide users with a platform to upload, view, and share images with others.

![](https://i.imgur.com/YG9kjhs.gif)

## Table of contents
* [General info](#pysquad)
* [Features](#features)
* [Technologies](#technologies)
* [Installation](#installation)
* [Usage](#usage)

## Features
- User registration and authentication.
- Ability to upload and view images.
- Ability to create, edit, and delete Posts.
- GraphQL API for efficient data retrieval and manipulation.
- React for a dynamic and responsive user interface.
- PostgreSQL for data storage and retrieval.

## Technologies:
1. Django
2. GraphQL
3. React
4. PostgreSQL
5. Firebase
6. Mailhog
7. Docker

## Installation
1. Clone the repository to your local machine using the command: 
```
git clone https://github.com/Arrturo/PySquad.git
```
2. Navigate to the project directory using the command: 
```
cd PySquad
```
3. Build the Docker image using the command: 
```
docker-compose build
```
4. Start the application using the command: 
```
docker-compose up
```
The application should now be running and accessible at http://localhost:8000/ (backend) and http://localhost:3000/ (frontend)

## Usage
The PySquad application provides the following functionality:
* User registration and login
* Uploading images
* Viewing images
* Sharing images with others
* Adding comments to images

To use the application, create an account and start uploading images. You can then view your uploaded images and share them with others by copying the image link. Other users can view and comment on your images.
