# 🚜 Farm Equipment Booking Platform

Welcome to the Farm Equipment Booking Platform! This is a simple, premium-feeling web application designed to connect farmers with heavy-duty agricultural tools, tractors, harvesting machinery, and high-tech spraying equipment on an on-demand basis.

## 🌾 What is this?
At its core, this platform acts as a digital tractor-sharing service (think "Uber for Farm Equipment"). It provides an easy-to-navigate mobile-first dashboard where a user can browse various utility vehicles and machinery by category, input their farm size (in acres) and required dates, and instantly book that equipment to be scheduled for their farm.

The entire interface is built strictly with the end-user (farmers) in mind, heavily prioritizing large interactive touch zones, minimalist aesthetics, and clear, distraction-free navigation.

## 🤝 How it Helps Farmers
In modern agriculture, the cost of purchasing advanced machinery (like Combine Harvesters, specialized Seed Drills, or Spraying Drones) outright is prohibitively expensive for most small-to-medium scale farmers. 

This platform elegantly bridges that gap by providing:
- **Financial Flexibility**: Farmers no longer need to take on massive debt to purchase high-tech machinery. They simply rent it per-hour based exclusively on their acreage.
- **Timely Access**: During narrow harvest windows, having immediate access to nearby Rotavators and Tractors avoids crop degradation and ensures the highest possible yield.
- **Data & History Synchronization**: The application intelligently keeps track of active and past bookings so farmers can budget effectively and stay organized with exactly what machine is scheduled to arrive at their village.
- **Simple Tech Flow**: Complicated technical hurdles are stripped away. Login requires just a secure 10-digit mobile number authentication to bring you right into the booking screen.

---

## 🛠️ Setup & Local Execution

Ready to deploy or test the agricultural booking software locally? Follow these steps!

### 1. Clone the Repository
Open up your terminal/command prompt and clone down this project repository to your local system:
```bash
git clone https://github.com/arunkoduri5/test.git
cd farm-equipment-booking
``` *(Note: Replace the GitHub link with your actual repo link once published).*

### 2. Install the Required Backend Packages
This platform is powered by a snappy `Node.js` backend API and a lightweight `SQLite3` database. Before starting, initialize and download the underlying packages:
```bash
npm install
```
*(This will automatically pull down the necessary `express` and `sqlite3` packages into your workspace).*

### 3. Start the Server and Initialize Database
Because the database runs cleanly inline with the runtime, there are zero complex SQL setups required. The moment you start the server, it will actively build your database schema and safely pre-populate the inventory items!

Start the local server by running:
```bash
npm start
```
*or directly via node: `node server.js`*

### 4. Jump In!
Once your terminal successfully reads **`Server is running on http://localhost:3000`**, open your favorite modern web browser and navigate directly to:
[http://localhost:3000](http://localhost:3000)

Your platform is fully live! Enter a test number, select a tractor, process a booking, and watch your SQLite database seamlessly track everything via the Account page.
