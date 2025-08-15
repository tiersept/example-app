# ABN Assignment

## Project startup

1. Make sure you set the right node version. We use NVM as our node manager In the root directory run.

```bash
nvm use
```

2. Let's install all our dependencies. In the root directory run...

```bash
npm install
```

3. Let's start our api

```bash
npm run dev:api
```

We can then visit [http://localhost:3001/api-docs/](http://localhost:3001/api-docs/) to view our swagger documentation.

4. In a seperate terminal, let's launch our Expo Go for development

```bash
npm run dev:mobile
```

## Util commands

### Run tests

Runs test in workspaces

```bash
npm run test
```

### Generate types from api

Make sure the api up.
This will generate the types into a `/lib/types/schema.ts` file so we can consume it.

```bash
npm run generate-types
```

## Backend
- http://localhost:3001/api-docs/ for swagger docs
- Setup up Bruno for easy api debugging, documentation and interaction
- 'Monorepo' setup
- Backend definition and documentation to OpenApi spec
- Type generation from downloaded swagger.json in shared lib `npm run generate-types`

## Frontend

- React Native Expo
- Keep design and feel as close to native for reliablity
- Theme provider setup
- React query implementation with type safety using `openapi-react-query`
- Make the refresh token call before hitting a 401.
- Currency util based on app settings
- Ability to change currency in settings **NOTE** This just changes the formatting, and does not include exchange rates for demo purposes.
- Some basic unit test for `currency.ts` and `post-refresh-token.ts`

### Home screen

- Total balance overview
- Pull to refresh
- Refresh on active tab

### Account detail screen

- Flatlist for list optimization
- Pull to refresh
- Infinite query
- Filter transactions by account id

### Settings screen

- Option to change currency preference
- Sign out button

### Todos;

Due to time constraints and the scale of this project i've left some parts out and focused on the above. My main goal was to keep type safety throughout the flow of data and keep the UI simple.

- CI/CD
- Didn't consumer `/cards`
- Localization setup
- Properly set up env files
- Clean up styles consistently, some inline styles
