# express app

## meta-info
- this is implemented with Typescript
- please run `npm install --save-dev` prior to any development when
    - pulling from origin
    - cloning the repo

## developing
- **DO NOT DIRECTLY** edit the following files:
    - tsconfig.json
    - package.json
    - package-lock.json
- because this uses Typsecript, it must be compiled to plain javascript
    - run `npm run build` to compile Typescript files into a single `index.js` in the `dist` directory
    - to run locally, `node dist/index.js`