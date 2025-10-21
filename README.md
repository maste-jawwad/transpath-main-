# Water TPT - Transpath Admin Panel

A Node.js/Express application for managing the Transpath project with admin panel functionality.

## Features

- Admin panel for managing people, projects, and updates
- MongoDB database integration
- File upload capabilities
- Authentication system
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your database connection and other settings.

4. Start the application:
   ```bash
   npm start
   ```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret key for sessions
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Deployment Options

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

### Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

### Render
1. Connect your GitHub repository to Render
2. Set environment variables
3. Deploy as a Web Service

### Heroku
1. Install Heroku CLI
2. Create a new Heroku app
3. Set environment variables
4. Deploy with `git push heroku main`

## Database Setup

Make sure to set up your MongoDB database and update the `MONGODB_URI` in your environment variables.

## File Structure

```
BRWD2/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── vercel.json           # Vercel deployment config
├── Procfile              # Heroku deployment config
├── config/               # Configuration files
├── controller/           # Route controllers
├── middleware/           # Custom middleware
├── model/               # Database models
├── routes/              # Route definitions
├── public/              # Static assets
└── views/               # EJS templates
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC
