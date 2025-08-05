# NexusEvnt (Server)

## Description

This is a web-based platform that allows users, both Organizers and Attendees to:


- Organizers: Create, manage and promote events.
- Attendees: Browse, book and receive updates about events.


## Key Features:


- Event creation with customizable details.
- Secure booking system integrated with payments.
- Real-time updates and notifications for attendees.


## Goal:


Streamline event management while improving attendee experiences.


## API Features

- RESTful API
- Authentication & Authorization (JWT, OAuth, etc.)
- Database Integration (MongoDB/MySQL/Redis)
- Error Handling & Logging
- Environment Configuration Support

## HOW TO SETUP THE SERVER


### CLONE THE GITHUB REPOSITORY AND IT'S DEPENDENCIES
```bash
git clone https://github.com/NexusEvnt/nexusevnt
cd nexusevnt
npm install
```

### INSTALL AND START REDIS-CLI
```bash
sudo apt update && sudo apt install redis-tools
sudo apt install redis-server
sudo service redis-server start
```

### CONFIGURATION
Create a **.env** file in the root directory and add your environment variables:

```bash
PORT=3300

NODE_ENV_MODE="dev"

MONGO_URI="demo"

CLIENT_URL="http://localhost:3000"

ACCESS_TOKEN_SECRET=""
REFRESH_TOKEN_SECRET=""

STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

### CREATE ACCESS TOKEN AND REFRESH TOKEN   
**OpenSSL (Recommended)**
```bash
openssl rand -hex 32
```
This generated a 64-character hex-encoded string (256-bit secret).

**Using UUID**
```bash
uuidgen | tr -d '-'
```
This produced a 32-character UUID without hyphens.

### CREATING A STRIPE ACCOUNT AND GETTING API KEYS
**1. Create a Stripe Account**     
1. Go to [Stripe's official website](https://stripe.com/).
2. Click Sign Up and fill in your details (email, name, password).
3. Verify your email and log in to your Stripe Dashboard.   

**2. Activate Your Stripe Account**    
1. Click on Start Activation in the dashboard.
2. Provide business details (name, country, bank details, etc.).
3. Once completed, Stripe will enable live payments.   

**3. Get API Keys**     
1. In the Stripe Dashboard, go to Developers > API Keys.
2. Copy the following:
    - STRIPE_SECRET_KEY (used in the backend)
    - STRIPE_PUBLISHABLE_KEY (used in the frontend and backend)     

**4. Get Webhook Secret**   
1. Install Stripe CLI if you haven’t:
```yaml
curl -fsSL https://stripe.com/install.sh | bash
```
2. Authenticate CLI with your account:
```yaml
stripe login
```
3. Start listening for webhooks:
```yaml
stripe listen --forward-to localhost:3300/webhook
```
4. It will return a Webhook Secret, copy it:
```yaml
Webhook signing secret: whsec_xxx...
```
5. Use this as your STRIPE_WEBHOOK_SECRET.      

Now, your .env file should look like this:

```ini
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### RUNNING THE SERVER
**Developement Server**
```bash
npm run dev
```

**Production Server**
```bash
npm start
```

&nbsp;

## API ENDPOINTS
### User Authentication

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| POST   | `/api/register` | Register a new user  |
| POST   | `/api/login`    | Authenticate user    |
| POST   | `/api/logout`   | Logout user          |
| GET    | `/refresh`      | Refresh Access Token |


### Organizer Management

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| GET    | `/api/organizers`    | Fetch all Organizers      |
| GET    | `/api/organizer/:id` | Get Organizers details    |
| PUT    | `/api/organizer/:id` | Update Organizers details |
| DELETE | `/api/organizer/:id` | Delete an Organizers      |


### Attendee Management

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/attendees`    | Fetch all Attendees     |
| GET    | `/api/attendee/:id` | Get Attendee details    |
| PUT    | `/api/attendee/:id` | Update Attendee details |
| DELETE | `/api/attendee/:id` | Delete an Attendee      |


### Event Management

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| POST   | `/api/create-event`      | Create an Event      |
| GET    | `/api/events`            | Get all Events       |
| GET    | `/api/events/:event_id`  | Get an Event details |
| PUT    | `/api/events/:event_id`  | Update an Event      |
| DELETE | `/api/events/:event_id`  | Delete an Event |


### Ticket Management

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/api/create-ticket`  | Create a Ticket      |
| GET    | `/api/tickets`        | Get all Tickets      |
| GET    | `/ticket/:ticket_id`  | Gt a Ticket details |
| PUT    | `/ticket/:ticket_id`  | Update a Ticket      |
| DELETE | `/ticket/:ticket_id`  | Delete a Ticket      |


### Other Features

| Method | Endpoint   | Description         |
| ------ | ---------- | ------------------- |
| GET    | `/webhook` | Testing for payment |


### AUTHORS


Fortune Iheanacho - [Github Link](https://github.com/orgs/NexusEvnt/people/na-cho-dev)  
Keith Juma - [Github Link](https://github.com/orgs/NexusEvnt/people/TaiKeith)  
Angie Monnye - [Github Link](https://github.com/orgs/NexusEvnt/people/Grey550)  
Grace Bamidele - [Github Link](https://github.com/orgs/NexusEvnt/people/Gracy222)                                                                                     
