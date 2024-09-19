# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## Project Configuration Notes

- `jsconfig.json`:
  - `"checkJs": false` is used to disable TypeScript-style checking for JavaScript files.
  - `"exclude": ["node_modules"]` ensures that the `node_modules` directory is excluded from validation.

- ESLint is set up for code linting in JavaScript files.
