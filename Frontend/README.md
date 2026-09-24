# Shopno Properties: Full-Stack Real Estate Web Application

**Developer:** Amir Hamza Soyeb  
**Project Status:** Live / Production  

## 📖 1. Project Overview
Shopno Properties is a complete real estate property management website. This system has two main parts:
1. **Public Website:** Regular users can browse properties, view images, locations, and read detailed descriptions.
2. **Admin Panel:** The website owner or administrator can log in using a secure password to add, edit, or delete properties.

This project is a "Full-Stack" application, meaning it includes a Frontend (what the user sees), a Backend (the server/logic), and a Database (where the information is stored).

---

## 🏗️ 2. How the System Works (Architecture)
Here is a simple breakdown of how the project operates:

* **Frontend (Vercel):** When a user visits the website link, Vercel serves the HTML, CSS, and JavaScript files to their browser.
* **Backend (Render):** The JavaScript code on the frontend makes a request (API call) to our Node.js server hosted on Render, asking for the property list.
* **Database (MongoDB):** The Render server then connects to the MongoDB database to fetch the text data (titles, locations, descriptions).
* **Cloud Storage (Cloudinary):** For images, the database does not store the actual file. When the admin uploads an image, the server sends it directly to Cloudinary. Cloudinary returns a secure image URL, which is then saved in MongoDB.

---

## 🛠️ 3. Technology Stack

| Technology | Role | Why it was used? |
| :--- | :--- | :--- |
| **HTML5 & Vanilla JS** | Frontend | To build the core structure of the website and display data dynamically. |
| **Tailwind CSS** | Styling | For rapid and responsive (mobile-friendly) UI design. |
| **Node.js & Express.js** | Backend Server | To create the API that acts as a bridge between the frontend and the database. |
| **MongoDB Atlas** | Database | A NoSQL cloud database to permanently store all property data. |
| **Cloudinary** | Image Storage | To securely host images in the cloud so they do not take up server space or get lost. |

---

## ⚙️ 4. Core Features & Logic

### A. Dynamic Homepage (`index.html`)
* **Banner Logic:** When the website loads, JavaScript searches the database for the property marked as `isBanner: true` and displays it in the top hero section.
* **Property Grid:** The remaining properties are displayed as cards below. A JavaScript `filter()` function is used to ensure the banner property is not duplicated in this list.

### B. Property Details Page (`details.html`)
* When a user clicks "View Details", the unique MongoDB ID of that property is attached to the URL (e.g., `?id=12345`).
* The details page reads this ID from the URL, sends a request to the backend, and fetches the full description and image for that specific property.

### C. Secure Admin Dashboard (`admin.html`)
* **Security:** The moment someone tries to access this page, a browser `prompt()` asks for a password. If the password is wrong, they are instantly redirected back to the homepage.
* **CRUD Operations:** The admin can Create (upload new), Read (view list), Update (edit details), and Delete properties directly from this dashboard.

---

## 🔌 5. API Endpoints
**Base Server URL:** `https://shopno-properties.onrender.com/api/properties`

| Method | Endpoint | Action | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Read All | Fetches all properties from the database to show on the frontend. |
| **GET** | `/:id` | Read One | Fetches details of a single specific property. |
| **POST** | `/` | Create | Receives new property data and images from the admin panel to save in the database. |
| **PUT** | `/:id` | Update | Edits and updates existing property data or images. |
| **DELETE** | `/:id` | Delete | Removes a specific property from both MongoDB and Cloudinary. |

---

## 🔒 6. Security & Configuration

* **CORS (Cross-Origin Resource Sharing):** CORS is enabled on the backend. This means only our specific frontend website is allowed to request data from the server, preventing hackers or other websites from stealing our data.
* **Environment Variables (.env):** Sensitive information like database passwords and Cloudinary secret keys are not written directly in the code. They are stored securely as Environment Variables in the Render dashboard. This keeps the server secure even if the GitHub repository is public.

---
*Documentation perfectly crafted for future scale and maintenance.*