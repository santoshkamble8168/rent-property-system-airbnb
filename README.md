# Full Stack Airbnb Clone with Next.js 13 

![Full Stack Airbnb Clone with Next.js 13](https://res.cloudinary.com/dy1dl6rb9/image/upload/v1693127392/airbnb-clone_b5er6v.png)

[Demo Click here](https://airbnb-online-rent-property-system-v1.vercel.app/)

### Tech stack
- React
- Next.js 13 
- typescript
- Tailwindcss
- Prisma
- MongoDB
- NextAuth 2023
- zustand: frontend state managment library
- cloudinary: to store images

### Node version 14.x


### Cloning the repository

```shell
git clone https://github.com/santoshkamble8168/rent-property-system-airbnb
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_SECRET=
```

### Configure your providers 
1. Google
2. Github

### Setup Prisma

```shell
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
```