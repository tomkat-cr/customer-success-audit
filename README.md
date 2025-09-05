# Customer Success Audit Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?logo=vite)](https://vitejs.dev/)

Live Website:
[https://otobonh.github.io/customer-success-audit/](https://otobonh.github.io/customer-success-audit/)

A comprehensive self-assessment tool for evaluating and improving your Customer Success strategy. Get automated results in just 5 minutes with this interactive audit tool.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)
- [Contributing](#contributing)
- [Credits](#credits)

## Features

- 🔍 **Comprehensive Audit**: Evaluate your Customer Success strategy across multiple dimensions
- 🎯 **Actionable Insights**: Get detailed feedback and recommendations
- 📊 **Scoring System**: Quantify your CS maturity with a clear scoring system
- 🚀 **Quick Assessment**: Complete the audit in just 5 minutes
- 📧 **Results Delivery**: Receive detailed reports via email
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Technologies

- **Frontend**:
  - React 19
  - TypeScript
  - Vite
  - Tailwind CSS
  - Lucide Icons

- **Development Tools**:
  - Node.js
  - npm
  - Make
  - ESLint
  - Prettier

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/otobonh/customer-success-audit.git
   cd customer-success-audit
   ```

2. Install dependencies:
   ```bash
   make install
   ```
   or
   ```bash
   npm install
   ```

## Usage

### Development Mode

To start the development server:

```bash
make run
```

This will start the Vite development server, and you can view the application at `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
make build
```

The production-ready files will be available in the `dist` directory.

### Other Commands

- Lint the code:
  ```bash
  make lint
  ```

- Preview the production build locally:
  ```bash
  make preview
  ```

## Project Structure

```
customer-success-audit/
├── public/                 # Static files
├── src/
│   ├── assets/            # Images and other static assets
│   ├── components/        # Reusable React components
│   │   ├── CustomerSuccessAudit/  # Main audit component
│   │   ├── Footer/        # Footer component
│   │   └── Header/        # Header component
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── .gitignore             # Git ignore file
├── package.json           # Project metadata and dependencies
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Credits

This project is developed and maintained by [Omar Tobón](https://github.com/otobonh). For more information or to contribute to the project, visit [customer-success-audit](https://github.com/otobonh/customer-success-audit).
