# Parchment

A web-based document editor and document storage. Blazing fast and highly extensible. https://chickenscratch.now.sh

## Running yourself
0. [Vercel account (or anywhere else you can deploy Next.JS applications)](https://vercel.com/)
1. [MongoDB database](https://www.mongodb.com/)
2. [Magic SDK publishable and secret key (for authentication)](https://magic.link/)
3. [Cryptographically random string encoded in base64 for the JWT secret](https://github.com/panva/jose/blob/main/docs/functions/_util_generate_secret_.generatesecret.md#readme)

Once you've got all that, click the "Deploy to Vercel" button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FKalissaac%2Fchickenscratch&env=MONGODB_URI,MONGODB_DB,NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY,MAGIC_SECRET_KEY,NEXT_PUBLIC_SERVER_URL,JWT_SECRET&envDescription=Instructions%20on%20where%20to%20obtain%20each%20value&envLink=https%3A%2F%2Fgithub.com%2FKalissaac%2Fchickenscratch%23running-yourself)

Or, for other platforms or in development, here's what your environment variables should look like:
```sh
.env
--------------------------
MONGODB_URI=
MONGODB_DB=data
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=
MAGIC_SECRET_KEY=
NEXT_PUBLIC_SERVER_URL=<Your full server URL> or http://localhost:3000
JWT_SECRET=
```
