# Finance tracker

This project was created with the intent to keep track of my finances. This was initially done through Excel, but
after adding some features, it soon became obvious, that it was not the best tool for this purpose.

## Getting started

Please make sure you already installed at least the following on your local machine (which ideally runs on Linux):

- PHP 8.2
- A MySQL database
- Composer

Follow these steps to get the app up and running:

### 1. Create a new mysql database and a user with all priviliges 

Before you proceed, make sure to create a new MySQL database and a user with all privileges for that database. The database name, username, and password will be used in the application configuration.

### 2. Install dependencies
Run the following command to install all external dependencies:

```
composer install
```

### 3. Set up environment configuration
Create a `.env` file and copy the contents of `.env.example`, and add your database credentials into it.

Make sure to update the `.env` file with your database connection details. Use the following template as an example:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=YOUR_DATABASE_NAME
DB_USERNAME=YOUR_USERNAME
DB_PASSWORD=YOUR_PASSWORD
```

### 4. Generate an app key
To generate a fresh Laravel app key, execute the following command:

```bash
php artisan key:generate
```

### 5. Run migrations
To create the database, execute the following command:

```bash
# This command will wipe the database
php artisan db:wipe

# This command will create and seed the database
php artisan migrate --seed
```

**Note:** Before running `php artisan migrate --seed`, run `php artisan db:wipe`, to avoid duplicate entries.

---
### 6. Run the Backend and Frontend

Now that everything is set up, you need to start both the backend and the frontend. Use two separate terminal windows for each.

#### **Backend Setup**

1. In the root directory of the project (`/`), start the backend server:

   ```bash
   php artisan serve
   ```

#### **Frontend Setup**

1. Navigate to the `client` folder:

   ```bash
   cd client
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

Both the backend and frontend should now be running and accessible.
