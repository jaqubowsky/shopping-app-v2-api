# FakeStore Api

Backend part of a FakeStore App

[Live Demo](https://boisterous-pastelito-fa5201.netlify.app) :point_left:

[Frontend repository](https://github.com/jaqubowsky/shopping-app-v2)

## Endpoints

### Docs

| Description                 | URL                           |
| --------------------------- | ----------------------------- |
| See swagger docs            | /api-docs                     |

### Users

| Description                 | Method | URL                           |
| --------------------------- | ------ | ----------------------------- |
| Register                    | POST   | /api/users/register           |
| Login                       | POST   | /api/users/login              |
| Check if user is logged in  | GET    | /api/users/logged-in          |
| Get current user products   | GET    | /protected/api/users/products |
| Get other user profile      | GET    | /api/users/:id                |
| Delete profile              | DELETE | /protected/api/users/:id      |

### Products

| Description       | Method | URL                        |
| ---------------- | ------ | --------------------------  |
| Create product   | POST   | /protected/api/products     |
| Update product   | PUT    | /protected/api/posts/feed   |
| Get all products | GET    | /api/products/all           |
| Get one product  | GET    | /protected/api/products/:id |
| Delete product   | DELETE | /protected/api/products/:id |


### Cart

| Description       | Method | URL                         |
| ----------------- | ------ | --------------------------- |
| Get cart items    | GET    | /protected/api/cart/:postId |
| Add to cart       | POST   | /protected/api/cart/:id     |
| Delete from cart  | DELETE | /protected/api/cart/:id     |

## Technologies used

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org)
- [Prisma](https://www.prisma.io)
- [JWT](https://jwt.io/)
- [Google Cloud Storage](https://www.npmjs.com/package/@google-cloud/storage?activeTab=readme)

## Getting started

### Clone repository

```
git clone git@github.com:jaqubowsky/shopping-app-v2-api.git
cd shopping-app-v2-api
```

### Set up environment variables

```
TRUST_ORIGIN="<Trusted origin or URL of the client application>"
DATABASE_URL="<URL or connection string for the PostgreSQL database>"
JWT_SECRET="<Secret used to sign JSON Web Tokens>"
GCLOUD_PROJECT_ID="<Google Cloud Project ID>"
GCLOUD_STORAGE_BUCKET="<Name of the Google Cloud Storage bucket>"
GCLOUD_APPLICATION_CREDENTIALS="<Path or filename of the Google Cloud service account credentials JSON file>"
```

### Install packages and start server

```
npm i
npm run build
npm start
```
### Authentication

For users authentication I used JWT tokens which are stored on the sessionStorage
