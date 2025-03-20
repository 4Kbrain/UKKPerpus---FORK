
# 📚 Perpustakaan - Library Management System

<div align="center">
  <img src="https://github.com/storedesign/image-store/blob/main/logo.png?raw=true" alt="Library Cat Mascot" width="200" />
</div>

## Overview

Perpustakaan is a modern, user-friendly library management system built with Nuxt.js and Prisma. It provides a comprehensive solution for managing book collections, user memberships, borrowing processes, and administrative tasks.

## Features

- 📖 Complete book catalog management
- 👥 User management system with membership tracking
- 📅 Book borrowing and return process
- 📊 Admin dashboard with statistics
- 🔍 Advanced search functionality
- 🔔 Announcement system
- 📝 Report generation
- 💸 Fine management for late returns

## Screenshots

<div align="center">
  <img src="https://github.com/storedesign/image-store/blob/main/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-03-20%20231912.png?raw=true" alt="Landing Page" width="45%" />
  <img src="https://github.com/storedesign/image-store/blob/main/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-03-20%20232119.png?raw=true" alt="Login Page" width="45%" />
  <br /><br />
  <img src="https://github.com/storedesign/image-store/blob/main/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-03-20%20232352.png?raw=true" alt="Home Page" width="45%" />
  <img src="https://github.com/storedesign/image-store/blob/main/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-03-20%20232428.png?raw=true" alt="Dashboard" width="45%" />
</div>

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MySQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/4Kbrain/UKKPerpus---FORK.git
cd UKKPerpus
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up your environment variables by creating a `.env` file in the project root:
```
DATABASE_URL="mysql://username:password@localhost:3307/db_perpustakaan_ukk"
NUXT_AUTH_BASE_URL="localhost:3000/api/auth"
AUTH_SECRET="your-secret-key-here"
# Generate a secret key using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Initialize the database and run migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

6. Visit `http://localhost:3000` in your browser

## Usage Guide

### For Library Members

1. **Registration**: Create a new account from the registration page
2. **Browsing Books**: Explore the catalog using the search and filter options
3. **Borrowing Books**: 
   - Select a book you want to borrow
   - Click the "Borrow" button
   - Confirm the borrowing period
4. **Managing Your Account**:
   - View currently borrowed books
   - Check due dates and any applicable fines
   - Update your profile information

### For Administrators

1. **Managing Books**:
   - Add new books to the catalog with complete information
   - Update book details and availability status
   - Remove books from circulation when necessary
   
2. **User Management**:
   - Approve new user registrations
   - Manage user roles and permissions
   - Handle account suspensions if needed
   
3. **Loan Processing**:
   - Process book checkouts and returns
   - Override due dates when necessary
   - Manage reservation queues
   
4. **Report Generation**:
   - Generate usage statistics
   - Track popular books and user activity
   - Monitor overdue books and fines

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify your MySQL server is running on port 3307
   - Check that the database name matches `db_perpustakaan_ukk`
   - Ensure your database credentials are correct in the `.env` file

2. **TypeScript Errors**:
   - Some files may show TypeScript errors (red underlines) in your IDE
   - These are expected and won't affect the application's functionality
   - We're continuously working to resolve these issues

3. **Prisma Migration Issues**:
   - If you encounter problems with migrations, try:
   ```bash
   npx prisma migrate reset
   npx prisma generate
   npx prisma migrate dev
   ```

## License

**License:** [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)

Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)

Copyright (c) 2025 Aditya Dwi Nugroho

You are free to:
- Share — copy and redistribute the material in any medium or format.

Under the following terms:
- **Attribution** — You must give appropriate credit.
- **NonCommercial** — You may not use the material for commercial purposes.
- **NoDerivatives** — If you remix, transform, or build upon the material, you may **not** distribute the modified material.

[![CC BY-NC-ND 4.0][cc-by-nc-nd-image]][cc-by-nc-nd]

[cc-by-nc-nd]: https://creativecommons.org/licenses/by-nc-nd/4.0/
[cc-by-nc-nd-image]: https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png

📜 For more details: https://creativecommons.org/licenses/by-nc-nd/4.0/

## Contributing

Contributions are welcome! Please ensure you respect the license terms when contributing.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues and Support

If you encounter any issues or have suggestions for improvements, please feel free to reach out or [open an issue](https://github.com/AdityaDwiNugroho/UKKPerpus/issues). Our friendly library cat is always happy to help! 😺

## Contact

Aditya Dwi Nugroho - [@ProgrammerADN](https://x.com/ProgrammerADN) - aditadit120420@gmail.com

Project Link: [https://github.com/AdityaDwiNugroho/UKKPerpus](https://github.com/AdityaDwiNugroho/UKKPerpus)

---

<div align="center">
  <img src="https://github.com/storedesign/image-store/blob/main/dance-cat.gif?raw=true" alt="Library Cat Mascot" width="100" />
  <p>Made with ❤️ and a little help from our library cat!</p>
</div>
