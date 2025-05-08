# 🎬📚 M&B Reviews — Movie & Book Review Web App

<div align="center">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
</div>

<div align="center">
  <h3>The ultimate platform where film fanatics and bookworms unite!</h3>
</div>

## 📋 Overview

**M&B Reviews** is a full-featured web application that allows users to discover, review, and discuss their favorite movies and books. Built with Node.js and MongoDB, this platform offers a seamless experience for entertainment enthusiasts to share their opinions and explore new content.

![M&B Reviews Screenshot](https://via.placeholder.com/800x400?text=M%26B+Reviews+Screenshot)

---

## ✨ Key Features

- **📚 Comprehensive Media Library**: Browse, search, and filter through an extensive collection of movies and books
- **⭐ Rating System**: Rate items on a 5-star scale and see community average ratings
- **💬 Interactive Comments**: Engage in discussions with other users through the commenting system
- **🔍 Powerful Search**: Find exactly what you're looking for with our intuitive search functionality
- **👤 User Accounts**: Register, login, and maintain your personal profile
- **🔒 Secure Authentication**: Protected routes ensure only authorized users can perform certain actions
- **📱 Responsive Design**: Enjoy a seamless experience across all devices
- **🖼️ Media Upload**: Add cover images to enhance visual appeal
- **🛠️ CRUD Operations**: Full create, read, update, and delete functionality for all content

---

## 🧠 Technology Stack

| Component     | Technology                                                |
|---------------|----------------------------------------------------------|
| **Backend**   | Node.js, Express.js                                       |
| **Frontend**  | EJS templates, Vanilla CSS                                |
| **Database**  | MongoDB with Mongoose ODM                                 |
| **Auth**      | Express-session                                           |
| **File Upload** | Multer                                                  |
| **Development** | Nodemon                                                 |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/torozsom/MnB-ReviewSite.git
   cd MnB-ReviewSite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Make sure MongoDB is running on your local machine
   - Create a `.env` file in the root directory (optional for custom configuration)

4. **Start the application**
   ```bash
   node index.js
   # or if you have nodemon installed
   nodemon index.js
   ```

5. **Access the application**
   - Open your browser and navigate to: http://localhost:3000

---

## 🧭 Usage Guide

### For Visitors
- Browse the homepage to see featured movies and books
- Use the search functionality to find specific titles
- View details, ratings, and comments for any item
- Register for an account to unlock additional features

### For Registered Users
- Rate movies and books on a 5-star scale
- Leave comments and engage in discussions
- Add new movies and books to the database
- Edit or delete your own contributions

---

## 📁 Project Structure

```
MnB_ReviewSite/
├── config/           # Database configuration
├── middlewares/      # Express middlewares
├── models/           # Mongoose models
├── public/           # Static assets (CSS, images)
├── routing/          # Route definitions
├── views/            # EJS templates
└── index.js          # Application entry point
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Express.js](https://expressjs.com/) - The web framework used
- [MongoDB](https://www.mongodb.com/) - The database platform
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [EJS](https://ejs.co/) - Embedded JavaScript templating
- [Multer](https://github.com/expressjs/multer) - Middleware for handling multipart/form-data

---

<div align="center">
  <p>Made with ❤️ by the M&B Reviews Team</p>
  <p>© 2025 M&B Reviews. All rights reserved.</p>
</div>
