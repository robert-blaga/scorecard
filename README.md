# React + Vite + Tailwind CSS Template

A modern, responsive template for building web applications using React, Vite, and Tailwind CSS.

## Features

- ⚡️ [Vite](https://vitejs.dev/) - Lightning fast build tool
- ⚛️ [React](https://reactjs.org/) - UI library
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- 🔒 [Firebase Authentication](https://firebase.google.com/docs/auth) - User authentication
- 📱 Responsive design
- 🎯 Modern UI components
- 🔄 State management with Context API

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/your-template-name.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── pages/         # Page components
├── styles/        # Global styles
└── utils/         # Utility functions
```

## Customization

1. Update the theme colors in `tailwind.config.js`
2. Modify the layout in `src/components/layout/`
3. Add new components in `src/components/`
4. Create new pages in `src/pages/`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
