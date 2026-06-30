# MASTER PROMPT: Interactive Digital Wedding Invitation and RSVP Management System

Act as a Senior Full-Stack Web Developer, UI/UX Designer, Wedding Website Designer, Product Designer, Database Architect, and Email Automation Specialist.

Your task is to design and develop a modern, elegant, mobile-responsive, and interactive Digital Wedding Invitation System with an Admin Dashboard.

## Project Overview

Create a premium digital wedding invitation website that will be distributed through personalized email invitations. Each invited guest receives a unique invitation link containing their personal information and RSVP access.

The design theme should be:

* Elegant
* Romantic
* Minimalist Luxury
* Responsive (Desktop, Tablet, Mobile)
* Smooth animations and transitions
* Modern typography
* Soft color palette (customizable)

---

# LANDING PAGE / OPENING INVITATION

When the guest opens the invitation link:

Display a full-screen animated invitation card containing:

* Bride and Groom names
* Wedding date
* Wedding tagline or Bible verse
* Background music toggle
* Elegant animation
* Personalized guest name
* "Open Invitation" button

Example:

"Dear Mr./Ms. {{GuestName}},
You are cordially invited to celebrate our wedding."

Once the guest clicks "Open Invitation", navigate to the main wedding website.

---

# MAIN WEDDING WEBSITE

Create a one-page scrolling wedding website containing the following sections:

## 1. Hero Section

Display:

* Bride's complete name
* Groom's complete name
* Wedding date
* Wedding location
* Countdown timer
* Background music control
* Animated entrance effects

---

## 2. Image Carousel / Gallery

Create an elegant carousel containing:

* Prenup photos
* Engagement photos
* Couple photos
* Family photos

Features:

* Auto slide
* Manual navigation
* Lightbox preview
* Mobile swipe support
* Animated transitions

---

## 3. Wedding Countdown

Display:

* Days
* Hours
* Minutes
* Seconds

until the wedding ceremony.

Include:

"Days before we say I DO"

with animated countdown cards.

---

## 4. Love Story Timeline

Display:

* How we met
* First date
* Proposal
* Engagement
* Wedding journey

Use timeline animations.

---

## 5. Principal Sponsors Section

Display cards for:

### Principal Sponsors

* Ninong
* Ninang

Include:

* Photo (optional)
* Name
* Designation

---

## 6. Secondary Sponsors Section

Display categories:

### Candle Sponsors

### Veil Sponsors

### Cord Sponsors

### Ring Bearer

### Coin Bearer

### Bible Bearer

### Flower Girls

### Banner Bearers

Display names in elegant cards.

---

## 7. Wedding Ceremony Details

Display:

### Ceremony Information

* Church name
* Complete address
* Date
* Time
* Contact information

Include:

* Embedded Google Map
* Direction button
* Open in Google Maps button

---

## 8. Reception Details

Display:

### Reception Information

* Venue name
* Complete address
* Reception time
* Program timeline

Include:

* Google Maps integration
* Navigation button
* Parking information

---

## 9. Venue Maps

Create an interactive section containing:

### Church Map

### Reception Map

Features:

* Embedded Google Maps
* Open directions
* Current location navigation
* Estimated travel time

---

## 10. Wedding Attire Guide

Create separate sections for:

### Principal Sponsors

Display:

* Male attire inspiration
* Female attire inspiration
* Color palette

### Secondary Sponsors

Display:

* Required attire
* Theme colors

### Guests

Display:

* Dress code
* Color restrictions
* Inspiration gallery

Include visual cards and mood boards.

---

## 11. Wedding Program

Display event timeline:

* Arrival
* Ceremony
* Photo Session
* Reception
* Dinner
* Games
* Speeches
* Cake Cutting
* First Dance
* Closing

Use animated timeline cards.

---

## 12. RSVP / Reservation Form

Create a comprehensive RSVP form containing:

### Guest Information

* Full Name
* Email Address
* Contact Number

### Attendance

* Will Attend
* Unable to Attend

### Number of Guests

* Adults
* Children

### Meal Preference

* Beef
* Chicken
* Fish
* Vegetarian

### Special Requests

* Text area

### Transportation

* Bringing own vehicle
* Need transportation

### Message to Couple

Include:

* Validation
* Confirmation dialog
* Success page
* Email confirmation

---

# ADMIN DASHBOARD

Create a secured admin panel with authentication.

Features:

## Dashboard Analytics

Display:

* Total Invitations
* Sent Invitations
* Opened Invitations
* RSVP Confirmed
* RSVP Declined
* Pending RSVP
* Guest Count
* Attendance Analytics

---

## Guest Management

Admin can:

* Add guest
* Edit guest
* Delete guest
* Search guest
* Import Excel/CSV
* Export Excel/CSV
* Group guests
* Categorize guests

Fields:

* Guest ID
* Name
* Email
* Contact Number
* Family Group
* Invitation Status
* RSVP Status

---

## Email Invitation Management

Features:

* Send individual invitation
* Send bulk invitations
* Email templates
* Email scheduling
* Resend invitation
* Email tracking
* Open tracking

Each guest receives:

https://domain.com/invitation/{{uniqueToken}}

---

## RSVP Management

Admin can view:

* Confirmed guests
* Declined guests
* Pending guests
* Meal preferences
* Guest counts
* Companion counts
* Export reports

---

## Content Management

Admin can edit:

* Bride and Groom information
* Photos
* Gallery
* Wedding story
* Sponsors
* Venues
* Maps
* Program
* Dress code
* Countdown date

without modifying code.

---

## Reports

Generate reports for:

* RSVP summary
* Attendance summary
* Guest list
* Meal summary
* Sponsor list
* Invitation analytics

Export to:

* PDF
* Excel
* CSV

---

# TECHNICAL REQUIREMENTS

Frontend:

* Next.js
* React
* TailwindCSS
* Framer Motion
* ShadCN UI

Backend:

* Node.js
* Express.js
* REST API

Database:

* PostgreSQL
  or
* MySQL

Authentication:

* JWT
* Secure Admin Login

Email Service:

* Resend
  or
* SendGrid
  or
* Nodemailer

Storage:

* Cloudinary
  or
* AWS S3

Maps:

* Google Maps API

Additional Features:

* QR Code invitation
* Background music player
* Dark/Light mode
* SEO optimization
* Progressive Web App
* Social sharing
* Mobile-first design
* Analytics tracking
* Invitation open tracking
* RSVP reminder emails
* SMS reminder support

---

# DELIVERABLES

Generate:

1. Complete UI/UX Design
2. Information Architecture
3. Database ERD
4. Wireframes
5. Frontend Components
6. Backend API Design
7. Database Schema
8. Admin Dashboard Design
9. Email Template Design
10. Complete Source Code Structure
11. Deployment Architecture
12. Security Best Practices
13. Production Deployment Guide

The final product should look like a premium luxury wedding website comparable to high-end wedding invitation platforms.
