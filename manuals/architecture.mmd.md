graph TD
    Client[Web Browser] -->|HTTP/REST JSON| API[PHP API Router<br>index.php]
    
    subgraph Frontend
        UI[React Components]
        State[React Context / Hooks]
        Router[React Router]
        I18n[i18next]
        Tailwind[Tailwind CSS v4]
        
        UI <--> State
        UI <--> Router
        UI <--> I18n
        UI --> Tailwind
    end

    Client <--> Frontend
    
    subgraph Backend
        API --> Auth[Auth Middleware]
        Auth --> Controllers[Controllers<br>tasks.php, auth.php, etc.]
        Controllers --> Models[Models / Logic]
        Models --> PDO[(PDO Interface)]
    end

    PDO --> DB_SQLite[(SQLite DB)]
    PDO -.-> DB_MySQL[(MySQL / MariaDB)]
