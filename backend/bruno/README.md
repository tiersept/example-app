# Bruno API Collection for ABN Banking API

This Bruno collection contains all the API endpoints for testing the ABN Banking API.

## Setup

1. Install [Bruno](https://www.usebruno.com/)
2. Open the `abn-banking-api.bru` file in Bruno
3. Select the `local` environment

## Environment Variables

- `baseUrl`: http://localhost:3001 (local development)

## API Endpoints

### Authentication

- **POST /login** - Authenticate user and get JWT tokens
- **POST /refresh-token** - Refresh JWT token using refresh token

### Accounts

- **GET /accounts** - Get all user accounts with balances

### Cards

- **GET /cards** - Get all user cards

### Transactions

- **GET /transactions** - Get user transactions with optional:
  - `search` - Search in description/type
  - `sort` - Sort by field (date, amount, type, description)
  - `order` - Sort order (asc, desc)
  - `page` - Page number
  - `limit` - Items per page

## Test Credentials

- **Username**: test@test.test
- **Password**: password@123

## Usage

1. Start with the **Login** request to get authentication tokens
2. Bruno automatically stores the tokens in global variables
3. Subsequent requests will use the stored `authToken`
4. Use **Refresh Token** when the JWT expires (5 minutes)

## Features

- Automatic token management
- Pre-configured test data
- All query parameters documented
- Ready for development and testing
