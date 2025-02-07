# URL Shortener Backend

The URL Shortener Backend project provides a RESTful API to shorten URLs, manage user authentication, and track analytics. Follow the instructions below to get started.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Using the Application](#using-the-application)
- [Project Components](#project-components)
- [Contributing](#contributing)
- [License](#license)

---

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [MongoDB](https://www.mongodb.com/)

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/url-shortener-backend.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd url-shortener-backend
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

---

## Configuration

1. **Create a [.env](http://_vscodecontentref_/1) File**

   In the root directory, create a [.env](http://_vscodecontentref_/2) file and add the following environment variables (adjust values as needed):

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/urlshortener
   JWT_SECRET=your_jwt_secret
   ```

---

## Running the Project

1. **Start MongoDB**

   Ensure your MongoDB server is running. If installed locally, you can start it using:

   ```bash
   mongod
   ```

2. **Run the Application**

   For development mode with automatic reload (using nodemon):

   ```bash
   npm run dev
   ```

   Or start normally:

   ```bash
   npm start
   ```

3. **Access the Application**

   Open your browser and navigate to:  
   [http://localhost:5000](http://localhost:5000)

---

## Using the Application

### URL Shortening

- **Create a Shortened URL**

  Send a POST request to `/api/urls` with a JSON body containing the original URL and optional custom alias.

  **Example Request Body:**

  ```json
  {
    "originalUrl": "https://example.com",
    "customAlias": "example" // optional
  }
  ```

- **Redirection**

  When a user accesses the shortened URL, the server automatically redirects to the original URL.

### User Authentication

- **Registration**

  Send a POST request to `/api/auth/register` with the username, password, and optionally email.

- **Login**

  Send a POST request to `/api/auth/login` with the username and password to receive a JWT token. This token must be provided (in the `Authorization` header) when accessing protected endpoints.

### Analytics

- **Retrieve Click Statistics**

  Send a GET request to `/api/analytics/:shortId` to retrieve analytics (click statistics) for a shortened URL.  
   _Example: `/api/analytics/example`_

### Rate Limiting and Caching

- The project implements rate limiting and caching to improve performance and prevent abuse.
- If you exceed the rate limit, you will receive a "Too many requests" response.

---

## Project Components

1. **Database Interaction**

   - Uses MongoDB to store URL mappings, user details, and analytics.
   - Mongoose is used as the Object Data Modeling (ODM) library.

2. **API Endpoints**

   - **URL Routes**: `/api/urls`
   - **Authentication Routes**: `/api/auth`
   - **Analytics Routes**: `/api/analytics`

3. **Middleware**

   - **Authentication Middleware**: Secures endpoints by verifying JWT tokens.
   - **Rate Limiting Middleware**: Prevents request abuse.
   - **Caching Middleware**: Improves performance by caching responses.

4. **Error Handling**

   - Comprehensive error handling ensures issues are logged and detailed error messages are returned in responses.

5. **Testing**
   - Unit and integration tests are included to ensure the code works as expected.
   - Use tools like Jest and Supertest for testing the API endpoints.

---

## Contributing

Contributions are welcome! To contribute, please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---

## Enhanced Authorization and Login System Details

This section explains in detail how the authorization and login components work in the URL Shortener Backend project.

### User Registration and Login

1. **Registration Process**

   - **Endpoint:** `/api/auth/register`
   - **Required Fields:** username, password (optionally email)
   - **Process:**  
     The server creates a new user record, securely hashes the password, and stores the user information. Upon successful registration, a confirmation response is sent to the client.

     ### Example: User Registration

You can register a new user by sending a POST request to [http://localhost:5000/api/auth/register](http://localhost:5000/api/auth/register) with the following JSON payload:

```json
{
  "username": "Ash",
  "password": "test@123",
  "email": "SaiHarsha@gmail.com"
}
```

**Expected Response:**

```json
{
  "message": "User registered successfully"
}
```

2. **Login Process**
   - **Endpoint:** `/api/auth/login`
   - **Required Fields:** username and password
   - **Validation:**  
     The server verifies credentials by comparing the submitted password (after hashing) with the stored hash.
   - **Token Issuance:**  
     On successful authentication, a JSON Web Token (JWT) is generated and returned to the user for accessing protected endpoints.

### Login Process

- **Endpoint:** `/api/auth/login`
- **Required Fields:** username and password
- **Validation:**  
  The server verifies credentials by comparing the submitted password (after hashing) with the stored hash.
- **Token Issuance:**  
  On successful authentication, a JSON Web Token (JWT) is generated and returned to the user for accessing protected endpoints.

#### Example: User Login

Send a POST request to [http://localhost:5000/api/auth/login](http://localhost:5000/api/auth/login) with the following JSON payload:

```json
{
  "username": "Ash",
  "password": "test@123"
}
```

**Expected Response:**

```json
{
  "token": "<Auth_Token>"
}
```

Include the returned token in the `Authorization` header for all subsequent requests that require authentication:

```
Authorization: Bearer your_jwt_token_here
```

### Create a Shortened URL

Send a POST request to `http://localhost:5000/api/urls` with a JSON payload. For example:

**Headers**

```json
{
  "Authorization": "Bearer <Auth_Token>"
}
```

**Request:**

```json
{
  "originalUrl": "https://example.com",
  "customAlias": "example" // optional
}
```

**Response:**

```json
{
  "message": "Short URL created",
  "data": {
    "expirationDate": null,
    "_id": "67a5f8c4876d3f644406b319",
    "originalUrl": "https://example.com",
    "shortId": "example",
    "clickHistory": [],
    "__v": 0
  }
}
```

## How Redirection Works

When you visit [http://localhost:5000/api/urls/example](http://localhost:5000/api/urls/example), the application looks up the "example" alias. It then retrieves the original URL associated with that alias, in this case, **https://example.com/**, and responds with a redirection. This means your browser is automatically forwarded to the original URL without further action on your part. The redirection is typically handled with an HTTP 302 status code, although implementations may vary.

## Analytics Routes

### Retrieve Click Statistics

- **Endpoint:**  
  GET [http://localhost:5000/api/analytics](http://localhost:5000/api/analytics)

- **Headers:**  
  Include your JWT token in the Authorization header:

  ```
  Authorization: Bearer <Auth_Token>
  ```

- **Sample Response:**
  ```json
  [
    {
      "originalUrl": "https://example.com",
      "shortId": "example",
      "totalClicks": 2
    }
  ]
  ```
  This endpoint returns an array of analytics objects with details about each shortened URL.

### JSON Web Token (JWT) in Authorization

- **Token Structure:**  
  A JWT is composed of:

  - **Header:** Specifies the token type (JWT) and the signing algorithm.
  - **Payload:** Contains claims like user identification and token expiration details.
  - **Signature:** Ensures token integrity by validating that it has not been tampered with.

- **Using the JWT:**  
  The token must be included in the `Authorization` header when making requests to secured endpoints, for example:

  ```
  Authorization: Bearer your_jwt_token_here
  ```

- **Token Expiration:**  
  JWTs have an expiration period defined in their payload. Once expired, users need to re-authenticate to receive a new token.

### Securing API Endpoints

- **Middleware Function:**  
  Protected endpoints use middleware to validate the JWT before granting access:

  - The middleware checks for a valid token in the request headers.
  - If missing or invalid, it returns an error response to the user.

- **Access Control:**  
  Only requests with a valid JWT can access resources like creating shortened URLs or viewing analytics, ensuring that only authenticated users perform sensitive operations.

### Best Practices for Security

- **Use HTTPS:**  
  Encrypt communication between the client and server to protect credentials and tokens.
- **Secure Storage:**  
  Keep sensitive data like passwords and JWT secret keys in secure, environment-protected variables.
- **Regular Token Rotation:**  
  Implement token expiration and encourage regular re-authentication to minimize the risk from compromised tokens.

This robust setup helps ensure that only authenticated users can access and manipulate the URL shortener's resources.
