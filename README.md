# Mhumsap - International Food Management System 🍲

**ITCS223 Introduction to Web Development Final Project**  
Faculty of Information and Communication Technology, Mahidol University (Section 3)

---

## 📌 Project Overview
Mhumsap is a robust full-stack web application designed for efficient restaurant menu and inventory management. The platform serves as a digital gateway where general users can explore international cuisines, while administrators benefit from a secure, centralized dashboard to manage the system's data in real-time.

---

## ✨ Key Features

### 👤 For General Users
- **Dynamic Product Catalog:** Browse the entire menu with data fetched directly from the database.
- **Advanced Search & Multi-Criteria Filtering:** Discover food items by keywords or categories (e.g., Thai, Japanese, Italian, Dessert).
- **Product Detail View:** Access comprehensive information for each item, including high-resolution imagery and descriptions.
- **Responsive Design:** Optimized interface for a seamless experience across different devices.

### 🔑 For Administrators (Back-office)
- **Secure Authentication:** Integrated Signup and Login system with specific email validation (strictly requires `@gmail.com`).
- **Inventory Management Dashboard:** A dedicated hub for overseeing all product records.
- **Full CRUD Support:**
  - **Insert:** Add new products with live image URL previews.
  - **Update:** Modify existing records (price, stock, details) via interactive modals.
  - **Delete:** Safely remove products from the system.
- **Auth Guard:** Protected routes to ensure administrative tools are only accessible to authenticated users.

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **API Testing:** Postman

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (Latest version recommended)
- [MySQL Server](https://www.mysql.com/)

---

### 2. Installation (Dependencies)

Clone the repository and install the necessary Node.js packages:

```bash
git clone https://github.com/your-username/mhumsap-project.git
cd mhumsap-project
npm install
```
### 3. Database Configuration

1.  **Launch** your MySQL management tool (e.g., MySQL Workbench).  
2.  **Create** a new database named `mhumsap`.  
3.  **Import** the provided `.sql` schema file located in the project directory.  

Update the database connection credentials in your `server.js` file:

```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "your_mysql_username",     
  // Replace with your MySQL username
  password: "your_mysql_password", 
  // Replace with your MySQL password
  database: "mhumsap"
});
````

### 4. Running the Application

1. **Start** the backend server by running the following command in your terminal:
```bash
node server.js
```
2. **Access** the application:
Open your web browser
Go to: http://localhost:3000
---
2.**Access the application:
Open your web browser
Go to: http://localhost:3000
---
### 5. Team Members (Section 3)

| Student ID | Name | Role |
| :--- | :--- | :--- |
| **6788013** | **Vootichote Chammunkong** | Full-stack Developer / Project Lead |
| 6788064 | Nuttanun Muanraksa | Backend Developer |
| 6788074 | Soonthana Ongsoi | Frontend Developer |
| 6788081 | Chalisa Pattanaprateep | UI/UX Designer / Developer |
| 6788141 | Sarisa Vanichviroon | QA Engineer / Documentation |