# AutoZone Deployment Guide

## Overview
This guide covers deploying AutoZone to Vercel (frontend) and Railway (database), along with production configuration.

## Prerequisites
- GitHub repository with your AutoZone code
- Vercel account
- Railway account
- AWS account (for S3 image storage)

## 1. Database Setup (Railway)

### Create Railway Project
1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Copy the connection string

### Database Connection String Format
```
postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require
```

### Apply Database Migrations
```bash
# Set your database URL
export DATABASE_URL="your-railway-connection-string"

# Apply migrations
npm run supabase:migrate:prod

# Or manually apply SQL files
npm run db:bootstrap
```

## 2. Frontend Deployment (Vercel)

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Environment Variables for Vercel
Set these in your Vercel project dashboard:

```env
# Database
DATABASE_URL=your-railway-postgres-url

# NextAuth
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app

# Image Storage
IMAGE_STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name
AWS_S3_REGION=us-east-1

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Payments
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 3. Image Storage Configuration

### Option A: AWS S3 (Recommended)
1. Create S3 bucket
2. Configure CORS policy:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-domain.vercel.app"],
    "ExposeHeaders": []
  }
]
```
3. Set bucket to public (for public images)
4. Configure environment variables

### Option B: PostgreSQL (Alternative)
- Images stored as base64 in database
- Good for small images (< 1MB)
- Not recommended for production with many images

### Option C: Local Storage
- Only for development
- Not suitable for production

## 4. Production Configuration

### Update next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-domain.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'your-s3-bucket.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Add other domains as needed
    ],
  },
  // ... rest of config
}
```

### Remove Development Dependencies
```bash
# Remove test dependencies
npm uninstall jest @testing-library/react @testing-library/jest-dom cypress

# Remove development scripts from package.json
```

### Environment File Structure
Create `.env.local` for local development:
```env
DATABASE_URL=postgresql://localhost:5432/autozone
NEXTAUTH_SECRET=local-secret-key
NEXTAUTH_URL=http://localhost:3000
IMAGE_STORAGE_TYPE=local
```

## 5. Database Migration Commands

### Apply All Migrations
```bash
npm run db:bootstrap
```

### Apply Specific Migrations
```bash
npm run db:apply:migrations
npm run db:apply:seeds
```

### Seed Production Data
```bash
npm run db:seed:comprehensive
```

## 6. Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] Environment variables configured in Vercel
- [ ] Image uploads working (test with S3 or database)
- [ ] Admin dashboard accessible
- [ ] Product management working
- [ ] Orders can be created
- [ ] Payment integration configured
- [ ] SSL certificate working
- [ ] Performance monitoring enabled

## 7. Monitoring & Maintenance

### Database Monitoring
- Monitor Railway database usage
- Set up alerts for high CPU/memory usage
- Regular backup verification

### Application Monitoring
- Vercel analytics
- Error tracking (Sentry recommended)
- Performance monitoring

### Security
- Regular dependency updates
- Environment variable rotation
- Database access monitoring

## 8. Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify DATABASE_URL in Vercel
- Check Railway database status
- Verify SSL mode in connection string

**Image Upload Fails**
- Check S3 credentials
- Verify bucket permissions
- Check CORS configuration

**Admin Dashboard Not Loading**
- Verify NEXTAUTH_SECRET
- Check database permissions
- Verify admin user exists

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

## 9. Cost Optimization

### Railway
- Monitor database usage
- Use development instances for testing
- Consider pausing unused projects

### AWS S3
- Use lifecycle policies for old images
- Monitor storage and request costs
- Consider CloudFront for CDN

### Vercel
- Monitor bandwidth usage
- Use appropriate plan for your needs
- Optimize image sizes and formats
