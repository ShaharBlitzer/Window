# Project Documentation

## Goal

The system is designed to allow users to view the current state of all endpoints and the number of malicious files detected.

## Overview

The environment consists of:

- **Backend Service**: Responsible for managing the state of endpoints, processing file hash checks, and providing services to both endpoints and users.
- **Frontend Application**: Offers a user-friendly interface to display and manage the endpoint data.

- This project consists of a backend service and a frontend application designed to manage and analyze endpoint data in real-time. The system uses Docker for containerized deployment and is built with Node.js for the backend and React for the frontend.

---

## Backend Side

### Description

The backend is implemented in Node.js and handles the business logic for:

- **Managing endpoint data.**
- **Processing incoming requests** to check file hashes against a list of malicious hashes using Rest/API.
- **Provide Relevant Data to the Frontend**.
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

- **Dynamic UI**: responsive design for managing endpoints.
- **Refresh Button**: A refresh button allows users to manually call the `/show-endpoints` endpoint on the backend and refresh the displayed endpoint data.
- **Proactive Updates**: Every 20 minutes, the frontend automatically calls the `/show-endpoints` endpoint to ensure the displayed data is up-to-date.
- **Integration with Backend**: Seamlessly communicates with the backend API to fetch and display data.


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
- If a request is received and the UUID already exists (indicating this is not the first call), and the `lastCall` parameter in the new request is earlier than the existing `nextCall`, it will be treated as an irrelevant request. Consequently, the storage and UI will not be updated with the new endpoint request parameters.

---

## Additional Notes

### Endpoint Storage
#### What’s Done:
- Implemented endpoint storage using a JSON file as shared memory. This decision was based on the limitations of Node.js concerning in-memory data structures and inter-process sharing.

#### What Needs to Be Done:
- Explore and implement efficient alternatives for endpoint storage:
  - **SharedArrayBuffer** and **Atomics** for thread-safe shared memory.
  - **Message channels** to reduce reliance on file-based operations and improve performance.

### State Update Mechanism
#### What’s Done:
- Currently relies on frontend requests to update the state, enabling basic functionality.

#### What Needs to Be Done:
- Implement an optimized mechanism for state updates:
  - Maintain a variable to track the closest `nextCall` timestamp.
  - Update the variable when a request contains an earlier `nextCall` timestamp.
  - Schedule events to update the state at the appropriate time and cancel irrelevant pending events to avoid unnecessary processing.

---

## Updated Phases Table

| Phase      | Component | Feature                                       | Status   |
|------------|-----------|-----------------------------------------------|----------|
| Phase #1   | Backend   | Endpoint object and basic methods            | Done     |
| Phase #1   | Backend   | Data persistence                             | Done     |
| Phase #1   | Backend   | Multitasking using a threads with locking mechanism | Done |
| Phase #2   | Backend   | Optimized state update mechanism             | Planned  |
| Phase #2   | Backend   | Explore and implement efficient endpoint storage alternatives | Planned  |
| Phase #2   | Frontend  | Improved UI design                           | Planned  |

---
### Testing
- The project includes a `testApi.js` file for testing the `/api/check-files` endpoint. This script sends various requests to validate the API's functionality and logs the results.
- 
### Future Enhancements

- Add authentication and authorization.
- Improve file storage scalability by migrating to a database.
- Optimize locking mechanism for higher concurrency.
- Implement a state update mechanism to efficiently handle `nextCall` events and reduce performance overhead.
- Improve UI design for better usability and user experience.
