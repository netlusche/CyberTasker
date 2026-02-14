# CyberTasker Server Update Instructions (v1.0.x → v1.1.0)

These instructions guide you through updating your existing CyberTasker server installation from version **1.0.x** to **1.1.0**, which includes the Strict Password Policy and UI enhancements.

## 1. Backup

Before proceeding, backup your current installation:
- **Database**: Export your MariaDB database.
- **Files**: Backup your `api/config.php` (or `api/db.php` if you modified it directly).

## 2. Deploy Files

1.  Upload the contents of the `dist` folder to your server's public web directory (e.g., `public_html` or `/var/www/html`). Ensure the hidden file `.htaccess` is also uploaded.
2.  **IMPORTANT**: Overwrite all files **EXCEPT** `api/config.php`.
    -   If you accidentally overwrite `api/config.php`, restore it from your backup.
    -   Verify that your `api/config.php` still contains your MariaDB credentials:
        ```php
        define('DB_TYPE', 'mysql'); // Ensure this is 'mysql'
        define('DB_HOST', 'localhost');
        define('DB_NAME', 'your_db_name');
        define('DB_USER', 'your_db_user');
        define('DB_PASS', 'your_db_password');
        ```

## 3. Database Update

The update requires a new table `system_settings` for the password policy.

1.  Open your web browser.
2.  Navigate to your installation's installer URL:
    ```
    http://your-server.com/api/install.php
    ```
3.  The script will automatically check for the new table and create it if missing. You should see a message indicating "System settings table created" or "Database Structure Updated".
4.  **Security Note**: After verification, delete `api/install.php` from your server or ensure it is protected.

## 4. Verify Update

1.  Login as an Admin.
2.  Open the **Admin Console**.
3.  Scroll to **System Policies** and verify the "Strict Password Policy" toggle is visible and working.

## Troubleshooting

-   **500 Error**: Check your server's error logs. Ensure `api/db.php` has the correct database connection logic for MySQL (it should default to MySQL if `DB_TYPE` is not 'sqlite').
-   **Toggle Not Saving**: Ensure `api/admin.php` has write access to the database (which it should if `api/config.php` is correct).
