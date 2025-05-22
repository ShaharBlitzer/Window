# Project Documentation

## Overview

This project consists of a backend service and a frontend application designed to manage and analyze endpoint data in real-time. The system uses Docker for containerized deployment and is built with Node.js for the backend and React for the frontend.

---

## Backend Side

### Description

The backend is implemented in Node.js and handles the business logic for:

- **Managing endpoint data.**
- **Processing incoming requests** to check file hashes against a list of malicious hashes.
- **Persisting data** to a JSON file for durability.

### Features

- **Endpoint Management**:
  - Add, update, and retrieve all endpoints data.
  - Use a lock mechanism to ensure consistency when multiple requests access the shared data.

- **File Hash Checking**:
  - Compare file hashes to a list of known malicious hashes and return results.

- **REST API**:
  - `api/check-files`: Endpoint for submitting file hash checks.
  - `/show-endpoints`: Endpoint for retrieving all endpoints. This endpoint is primarily used by the frontend to fetch and update endpoint data, including state changes.

- **Dockerized Deployment**: Simplifies setup and ensures consistent environments.

### Directory Structure

```plaintext
backend/
├── app.js             # Entry point for the backend
├── routes/            # API route handlers
├── services/          # Business logic and utilities
├── utils/             # Helper functions
├── data/              # Persistent storage (endpoints.json)
├── Dockerfile         # Docker configuration for backend
```

### Running the Backend

1. Ensure you have Docker installed.
2. Navigate to the `backend/` directory.
3. Build and run the container:

   ```bash
   docker build -t backend .
   docker run -p 5000:5000 backend
   ```

4. The backend will be accessible at [http://localhost:5000](http://localhost:5000).

---

## Frontend Side

### Description

The frontend provides a user interface for interacting with the backend services. It allows users to:

- View and manage endpoint data.

### Features

- **Dynamic UI**: design for managing endpoints.
- **Integration with Backend**: Seamlessly communicates with the backend API to fetch and display data.
- **Dockerized Deployment**: Ensures easy setup and consistent environment.

### Directory Structure

```plaintext
frontend/
├── public/            # Static files
├── src/               # React components and logic
├── Dockerfile         # Docker configuration for frontend
```

### Running the Frontend

1. Navigate to the `frontend/` directory.
2. Build and run the container:

   ```bash
   docker build -t frontend .
   docker run -p 3000:3000 frontend
   ```

3. The frontend will be accessible at [http://localhost:3000](http://localhost:3000).

---

## Principles

### Key Concepts

- **Data Consistency**: The backend uses a locking mechanism to ensure that concurrent operations on endpoint data are consistent.
- **Stateless API**: The backend adheres to RESTful principles, making it stateless and scalable.
- **Containerization**: Docker is used for both the backend and frontend to simplify deployment and maintain consistency.


## Inputs and Assumptions

### Inputs

#### File Hash Check Request:
- **UUID**: Unique identifier for the endpoint.
- **File Hashes**: Array of file hashes to check against malicious hashes.
- **Next Call**: Timestamp for the next scheduled check, which needs to be provided in UTC.

#### Endpoint Data:
- **UUID**: Unique identifier.
- **State**: Current state of the endpoint.
- **Next Call**: Scheduled next check timestamp.
- **Malicious Count**: Number of malicious files detected.

### Assumptions

- File hashes provided are unique strings (no two strings can be identical to each other).
-  An error will not halt the application; instead, all errors will be logged in the `error.log` file.
- The response for `check-files` requests is a list containing the malicious files detected.
- The state of an endpoint will be marked as `invalid` if the current time exceeds `nextCall + EXPIRED_TIME`

---

## Additional Notes

- Originally, I planned to implement endpoint storage using an in-memory data structure. However, due to process isolation in Node.js and the reference-based behavior of JavaScript objects, sharing data structures between processes proved to be impractical. As a workaround, I utilized a JSON file as a shared memory solution. While functional, this approach incurs performance costs because of frequent file I/O operations. Looking ahead, I aim to explore more efficient alternatives, such as leveraging frameworks or tools that enable shared data structures across threads—like SharedArrayBuffer and Atomics—or implementing message channels to minimize reliance on file-based operations.

- State Update Mechanism
The current state update mechanism relies on frontend requests, which is not considered best practice. In the future, I plan to implement an optimized mechanism to manage state updates more effectively.This would involve maintaining a variable that tracks the closest nextCall timestamp. When a request is received, the system would check whether the nextCall date in the request is earlier than the currently tracked closest timestamp. If so, the system would update the variable accordingly and schedule an event to update the state at the new nextCall time. Additionally, any previously pending events that are no longer relevant would be canceled to avoid unnecessary processing.


### Future Enhancements

- Add authentication and authorization.
- Improve file storage scalability by migrating to a database.
- Optimize locking mechanism for higher concurrency.
