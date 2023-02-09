# Online Booking System for Car Rentals

## Problem Statement
Design a web application to allow users to rent cars anywhere in the world.

### What is a Car Rental Booking System?
A car rental reservation system is an online booking tool created for individuals, car operators, and for firms to hire cars on a small to large scale. Customers can quickly book cars on this secure platform and administrators can manage the rental car fleets. Getting a rental car helps people get around when they don't have access to their car or don't own a car at all.

### Project Objectives
- To create a web-based system that enables customers to register and book cars online and helps the company run its vehicle rental operations successfully.
- To have a user dashboard for logged-in users and an admin dashboard for admins/managers.
- Users must be able to see available cars and rent any of the available cars after they log in and fill in their necessary details.
- The dashboard should also show the rental period chosen by the user while renting the car.
- Admins can add/edit/delete any of the cars available for rent.
- All non-logged-in users can browse the cars available for renting and see relevant info for any specific car.
- The project should have a clean UI and be easy to use.

### Functional and Non-Functional Requirements
#### Functional Requirements
1. User Registration: Users can register for the application by filling out the necessary details.
2. Online Reservations: Users can log in to make a reservation or an online booking.
3. Dashboard: The admin can see all information such as the total number of cars, number of cars available to rent, number of cars booked/rented, and information of the person who booked/rented the car.
4. User Account: Registered users have access to the user area where they can see their bookings (both past and future).

#### Non-Functional Requirements
1. Security: The system should have a certain level of security so that not anyone can access sensitive information and passwords should be properly encrypted in case of a data breach.
2. Robustness: If the user's system crashes, a backup of the user data must be stored on remote database servers to enable recovery.
3. Performance: The application must be lightweight and the UI should be fast and responsive.

### Use Case Table
Authentication System | Register, Login, Logout | User and Admin
Search Form | Search/Find cars | User
Chat Form | Send Message | User
Monitor Total Bookings | | Admin
Booking Status | Check personal Booking | User and Admin
Manage Users, Cars, and Bookings | | Admin

### Database
The project uses MongoDB, a cross-platform document-oriented database program classified as a NoSQL database. The database will store all the necessary information about the users, cars, and bookings.
