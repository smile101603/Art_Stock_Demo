# Deploy to Vercel

This guide will help you deploy Art Stock Hub to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with your GitHub/GitLab/Bitbucket account

3. **Import your repository**
   - Click "Import Project"
   - Select your repository
   - Vercel will auto-detect it's a Vite project

4. **Configure project settings**
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **For production deployment**
   ```bash
   vercel --prod
   ```

## Configuration

The project includes a `vercel.json` file with the following configuration:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **SPA Routing**: All routes redirect to `index.html` for React Router

## Environment Variables

If you need to add environment variables:

1. Go to your project settings in Vercel Dashboard
2. Navigate to "Environment Variables"
3. Add your variables (e.g., API keys, database URLs)
4. Redeploy your application

## Custom Domain

To add a custom domain:

1. Go to your project settings in Vercel Dashboard
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Build Settings

The project is configured with:
- **Node.js Version**: Auto-detected (recommended: 18.x or higher)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Troubleshooting

### Build fails
- Check that all dependencies are in `package.json`
- Ensure Node.js version is 18+ in Vercel settings
- Check build logs in Vercel Dashboard

### Routes not working
- The `vercel.json` includes SPA routing configuration
- All routes should redirect to `index.html` automatically

### Environment variables
- Make sure to add environment variables in Vercel Dashboard
- Redeploy after adding new variables

## Post-Deployment

After deployment, your app will be available at:
- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app` (for each branch/PR)

## Continuous Deployment

Vercel automatically deploys:
- Every push to `main` branch → Production
- Every push to other branches → Preview deployment
- Every pull request → Preview deployment

## Support

For issues or questions:
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
