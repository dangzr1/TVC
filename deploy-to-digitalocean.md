# Deploying to DigitalOcean

## Option 1: Deploy using DigitalOcean App Platform

1. Create a DigitalOcean account if you don't have one: https://cloud.digitalocean.com/registrations/new

2. Install the DigitalOcean CLI (doctl) or use the web interface

3. Push your code to a Git repository (GitHub, GitLab, etc.)

4. In the DigitalOcean dashboard, click "Create" and select "Apps"

5. Connect your Git repository

6. Configure your app:
   - Select the branch to deploy
   - Set the source directory to the root of your project
   - Set the build command to `npm run build`
   - Set the run command to `npm run preview` or use a static site option
   - Add environment variables for your Supabase credentials

7. Click "Next" and then "Create Resources"

## Option 2: Deploy using DigitalOcean Droplet

1. Create a DigitalOcean account if you don't have one

2. Create a new Droplet (virtual server):
   - Choose Ubuntu as the operating system
   - Select a plan based on your needs (Basic is fine for most sites)
   - Choose a datacenter region close to your users
   - Add SSH keys for secure access
   - Click "Create Droplet"

3. Connect to your Droplet via SSH:
   ```
   ssh root@your-droplet-ip
   ```

4. Install Node.js and npm:
   ```
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

5. Install Nginx:
   ```
   sudo apt-get update
   sudo apt-get install nginx
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```

6. Clone your repository:
   ```
   git clone your-repository-url
   cd your-project-directory
   ```

7. Install dependencies and build the project:
   ```
   npm install
   npm run build
   ```

8. Configure Nginx to serve your built files:
   ```
   sudo nano /etc/nginx/sites-available/default
   ```

   Replace the content with:
   ```
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       root /path/to/your-project-directory/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

9. Test and restart Nginx:
   ```
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. Set up a domain name (optional):
    - Purchase a domain name from a registrar
    - Add an A record pointing to your Droplet's IP address

11. Set up SSL with Let's Encrypt (optional):
    ```
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com -d www.your-domain.com
    ```

## Option 3: Use DigitalOcean Spaces (Static Site Hosting)

1. Build your project locally:
   ```
   npm run build
   ```

2. Create a Space in DigitalOcean:
   - Go to the Spaces section in your DigitalOcean dashboard
   - Click "Create a Space"
   - Choose a region and name
   - Enable CDN (optional)

3. Upload your built files (from the `dist` directory) to the Space

4. Configure the Space for static site hosting:
   - Go to the Settings tab of your Space
   - Enable "Static Site Hosting"
   - Set the index document to "index.html"
   - Set the error document to "index.html" (for SPA routing)

5. Your site will be available at `https://your-space-name.region.digitaloceanspaces.com`

6. Set up a custom domain (optional):
   - Add a CNAME record pointing to your Space URL
   - Configure the Space to use your custom domain

## Integration with TempoLabs

To integrate with TempoLabs for seamless updates:

1. Use the Git tab in TempoLabs to connect to GitHub
2. Push your changes to GitHub
3. Configure DigitalOcean App Platform to deploy from your GitHub repository
4. Set up automatic deployments so when you push changes from TempoLabs to GitHub, your site is automatically updated

Don't forget to set up the same environment variables in DigitalOcean that you have in TempoLabs:
- SUPABASE_PROJECT_ID
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY