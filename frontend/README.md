# URL Shortener Frontend

This is a modern frontend for the URL Shortener API, built with React, Vite, TypeScript, and Tailwind CSS.

## Features
- User registration and login (JWT-based)
- URL shortening with custom alias support
- Analytics dashboard for click statistics
- Rate limiting and error handling
- Responsive, modern UI with Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Tailwind CSS Setup
Tailwind is already configured. You can use its utility classes in your components. See `src/index.css` for the Tailwind directives.

## Project Structure
- `src/` - React components and pages
- `index.html` - Main HTML file
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

## Customization
Update the API base URL and endpoints in your service files as needed to match your backend.

---

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
