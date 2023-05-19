# Cookbooker

[toasterparty.net/cookbooker](https://toasterparty.net/cookbooker)

## Vue

### Install NodeJS

```
sudo curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - && sudo apt-get install -y nodejs
sudo npm install pm2 -g
pm2 startup
```

Then run the command that was printed. For example:

```
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u toaster --hp /home/toaster
```

### Build and Run

`./tools/start-cookbooker.sh`

## Supabase

Use [this](https://supabase.com/docs/guides/self-hosting#api-keys) web tool to generate the following:

- A JWT secret to use for `POSTGRES_PASSWORD`

- A JWT secret to use for `JWT_SECRET`

- Generated token using `ANON_KEY` for `ANON_KEY`

- Generated token using `SERVICE_KEY` for `SERVICE_ROLE_KEY`

Then, create a file called `supabase/config.env` that looks like this:

```
POSTGRES_PASSWORD=<redacted>
JWT_SECRET=<redacted>
SERVICE_ROLE_KEY=<redacted>
SMTP_ADMIN_EMAIL=<redacted>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=<redacted>
SMTP_PASS=<redacted>
SMTP_SENDER_NAME=Admin
```

...but with your secrets/information.

Then run `./tools/start-supabase.sh`
