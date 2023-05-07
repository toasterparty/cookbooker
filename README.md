# Cookbooker

## Vue

### Install NodeJS
```
sudo curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - && sudo apt-get install -y nodejs
```

### Build and Run

```
cd cookbooker
npm install
npm run format
npm run dev
```

## Supabase

Use [this](https://supabase.com/docs/guides/self-hosting#api-keys) web tool to generate the following for `.env`:

- A JWT secret to use for `POSTGRES_PASSWORD`

- A JWT secret to use for `JWT_SECRET`

- Generated token using `ANON_KEY` for `ANON_KEY`

- Generated token using `SERVICE_KEY` for `SERVICE_ROLE_KEY`

Then, copy anon and service keys to `services/cookbooker/supabase/docker/volumes/api/kong.yml`.
