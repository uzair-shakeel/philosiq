@echo off
echo Setting up cross-origin authentication fix...

echo Creating .env.local file...
copy .env.local.example .env.local

echo Installing required dependencies...
npm install next-auth@latest bcryptjs

echo Creating .env.development file for port 3001...
(
echo NEXTAUTH_URL=http://localhost:3001
echo NEXTAUTH_SECRET=your-secret-key-change-in-production
echo NEXT_PUBLIC_SITE_URL=http://localhost:3001
echo ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://philosiq.vercel.com,https://philosiq.vercel.app
) > .env.development

echo Done! You can now run the application on port 3001 with:
echo npm run dev -- -p 3001

echo Or deploy to Vercel with these environment variables configured.
echo.
echo Press any key to exit...
pause > nul 