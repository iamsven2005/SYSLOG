```mermaid
flowchart TD
    User[User Interface (Next.js/React)]
    Navbar[Navbar / Sidebar]
    Dashboard[Dashboard (Customizable Widgets)]
    Projects[Project Management]
    Monitoring[System Monitoring (Charts, Uptime)]
    Support[Support & Feedback]
    Files[File & Document Management]
    API[API Routes / Server Actions]
    Prisma[Prisma ORM]
    DB[(Database)]

    User --> Navbar
    User --> Dashboard
    User --> Projects
    User --> Monitoring
    User --> Support
    User --> Files

    Navbar -->|Navigation| Dashboard
    Navbar --> Projects
    Navbar --> Monitoring
    Navbar --> Support
    Navbar --> Files

    Dashboard -->|Fetch/Update Data| API
    Projects -->|CRUD, Assign, Filter| API
    Monitoring -->|Charts, Uptime| API
    Support -->|Tickets, Feedback| API
    Files -->|Upload, Share, Organize| API

    API --> Prisma
    Prisma --> DB
```