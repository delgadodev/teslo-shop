# Descripción

Teslo-Shop es un proyecto de comercio electrónico que desarrollé para aprender y practicar diversas tecnologías modernas. En este proyecto utilicé:

Next.js: para crear una aplicación web rápida y eficiente.
Server Actions: para manejar las interacciones del servidor de manera eficiente.
Prisma: como ORM para gestionar la base de datos de manera sencilla y segura.
PostgreSQL: como sistema de gestión de base de datos relacional.
Teslo-Shop me permitió adquirir experiencia práctica en el desarrollo de aplicaciones web robustas y escalables, integrando tecnologías de frontend y backend de manera efectiva.

Desarrollo siguiendo las enseñanzas de https://fernando-herrera.com/course/nextjs-framework-react/



## Correr en dev


1. Clonar el repositorio.
2. Crear una copia del ```.env.template``` y renombrarlo a ```.env``` y cambiar las variables de entorno.
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Correr las migraciones de Primsa ```npx prisma migrate dev```
6. Ejecutar seed ```npm run seed```
7. Correr el proyecto ```npm run dev```




## Correr en prod
