# Finance tracker

This project was created with the intent to keep track of my finances. This was initially done through Excel, but
after adding some features, it soon became obvious, that it was not the best tool for this purpose.

## Getting started

Please make sure you already installed at least the following on your local machine (which ideally runs on Linux):

- PHP 8.2
- A MySQL database
- Composer

Follow these steps to get the app up and running:

### 1. Install dependencies
Run the following command to install all external dependencies:

```
composer install
```

### 2. Set up environment configuration
Create a `.env` file and copy the contents of `.env.example`, and add your database credentials into it.

### 3. Generate an app key
To generate a fresh Laravel app key, execute the following command:

```bash
php artisan key:generate
```

### 4. Run migrations
To create the database, execute the following command:

```bash
# This command will wipe the database
php artisan db:wipe

# This command will create and seed the database
php artisan migrate --seed
```

**Note:** Before running `php artisan migrate --seed`, run `php artisan db:wipe`, to avoid duplicate entries.

---

Now everything is set up! You need to run the backend and frontend in two terminals:

Backend:

```bash
# Run this command inside the root of the project (/)
php artisan serve
```

Frontend:

```bash
# Run this command inside the client directory (/client)
ng serve
```
