# Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Excellent Node.js support
- Automatic deployments from GitHub
- Built-in environment variable management
- Free tier available

**Steps:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign up with GitHub
4. Click "New Project"
5. Import your repository
6. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `SESSION_SECRET`: A random secret key
   - `NODE_ENV`: production
7. Click "Deploy"

### Option 2: Railway

**Why Railway?**
- Great for full-stack apps
- Built-in MongoDB support
- Easy database management

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in the dashboard
6. Deploy automatically

### Option 3: Render

**Why Render?**
- Free tier available
- Easy setup
- Good for Node.js apps

**Steps:**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Set environment variables
6. Deploy

### Option 4: Heroku

**Why Heroku?**
- Traditional choice
- Good documentation
- Add-ons available

**Steps:**
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set MONGODB_URI=your-uri`
4. Deploy: `git push heroku main`

## 🔧 Environment Variables Setup

### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/water-tpt
SESSION_SECRET=your-super-secret-key-here
NODE_ENV=production
```

### Optional Variables:
```
PORT=3000
```

## 📊 Database Setup

### MongoDB Atlas (Recommended for production):
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get your connection string
6. Add it to your environment variables

### Local MongoDB:
- Install MongoDB locally
- Use: `MONGODB_URI=mongodb://localhost:27017/water-tpt`

## 🚨 Important Notes

1. **File Uploads**: Make sure your hosting platform supports file uploads
2. **Database**: Use MongoDB Atlas for production
3. **Environment Variables**: Never commit `.env` files
4. **Security**: Use strong session secrets
5. **HTTPS**: Most platforms provide HTTPS automatically

## 🔍 Troubleshooting

### Common Issues:
1. **Database Connection**: Check your MongoDB URI
2. **File Uploads**: Ensure the platform supports multer
3. **Environment Variables**: Make sure all required vars are set
4. **Port**: Some platforms use different ports

### Debug Steps:
1. Check application logs
2. Verify environment variables
3. Test database connection
4. Check file permissions

## 📝 Post-Deployment

1. Test all functionality
2. Set up monitoring
3. Configure backups
4. Update DNS if needed
5. Set up SSL certificates

## 🎯 Recommended: Vercel

For your application, I recommend **Vercel** because:
- ✅ Excellent Node.js support
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ Built-in environment management
- ✅ Free tier
- ✅ Fast global CDN
