# Todo App with Auth, Lists & Calendar

A modern, full-stack todo application featuring user authentication, multiple lists, task management, and a calendar view. Built with a red and black design system.

## 🚀 Features

### Core Functionality
- ✅ Add, edit, delete, and complete tasks
- ✅ Task filtering (All, Active, Completed)
- ✅ Task counter and progress tracking
- ✅ Persistent storage with SQLite database

### User Management
- 🔐 User registration and login with bcrypt password hashing
- 📊 Session-based authentication with 7-day persistence
- 👤 Isolated user data — each user has their own lists and tasks

### Multiple Lists
- 📋 Create and manage multiple todo lists
- 🔄 Switch between lists seamlessly
- 🗑️ Delete lists with cascade deletion of tasks

### Calendar Integration
- 📅 Monthly calendar view with event management
- 🎨 Color-coded events
- 📆 Click dates to view and manage events
- 🔄 Navigate between months

### Design System
- 🎨 Modern red and black color scheme
- 📱 Responsive design with custom CSS variables
- ✨ Smooth animations and transitions
- 🔤 Google Fonts integration (Bebas Neue + DM Sans)

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, responsive design
- **Vanilla JavaScript** - No frameworks, modular architecture

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework with session management
- **SQLite** - Database with better-sqlite3 driver
- **bcrypt** - Password hashing
- **connect-sqlite3** - Session storage

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   # or
   node server/index.js
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### First Time Setup
1. Visit `http://localhost:3000`
2. Register a new account or login if you have one
3. The app automatically creates a default "My Tasks" list

### Managing Tasks
- **Add tasks:** Type in the input field and press Enter or click "Add"
- **Complete tasks:** Click the task text to toggle completion
- **Edit tasks:** Click the ✎ button to edit task text
- **Delete tasks:** Click the ✕ button to remove tasks
- **Filter tasks:** Use All/Active/Completed buttons to filter the view

### Managing Lists
- **Create lists:** Type a list name in the sidebar input and press Enter or click +
- **Switch lists:** Click any list in the sidebar to switch to it
- **Delete lists:** Click ✕ next to a list name (confirms deletion of all tasks)

### Using the Calendar
- **Switch to Calendar:** Click the "📅 Calendar" tab
- **Navigate months:** Use ← → buttons to change months
- **View events:** Click any date to see events for that day
- **Add events:** Type an event title in the day panel and click "Add"
- **Delete events:** Click ✕ next to any event

## 🏗️ Project Structure

```
todo-app/
├── index.html              # Main HTML with auth screen, tabs, and layouts
├── style.css               # Complete styling with CSS variables and animations
├── app.js                  # Core app logic, task management, tab switching
├── api.js                  # Fetch API wrappers for all backend endpoints
├── auth.js                 # Authentication UI and session management
├── lists.js                # List sidebar management and switching
├── calendar.js             # Calendar rendering and event management
├── ui.js                   # Task rendering and DOM manipulation
├── storage.js              # Retired (replaced by API calls)
├── package.json            # NPM dependencies and scripts
├── server/
│   ├── index.js            # Express app setup, middleware, route mounting
│   ├── db.js               # SQLite connection and database schema
│   ├── database.db         # Auto-generated SQLite database file
│   ├── sessions.db         # Session storage database
│   ├── routes/
│   │   ├── auth.js         # Authentication endpoints (register/login/logout)
│   │   ├── lists.js        # List CRUD operations
│   │   ├── tasks.js        # Task CRUD operations
│   │   └── events.js       # Calendar event CRUD operations
│   └── middleware/
│       └── requireAuth.js  # Session authentication guard
└── progress/
    └── steps_completed.md  # Development progress tracking (200 steps)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Check current session
- `POST /api/auth/logout` - Logout user

### Lists
- `GET /api/lists` - Get all lists for current user
- `POST /api/lists` - Create new list
- `DELETE /api/lists/:id` - Delete list

### Tasks
- `GET /api/tasks?list_id=X` - Get tasks for specific list
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task (text or done status)
- `DELETE /api/tasks/:id` - Delete task

### Events
- `GET /api/events?year=YYYY&month=MM` - Get events for month
- `POST /api/events` - Create new event
- `DELETE /api/events/:id` - Delete event

## 🎨 Design System

| Variable | Value | Purpose |
|----------|-------|---------|
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-surface` | `#111111` | Card/panel background |
| `--color-surface-alt` | `#1a1a1a` | Input fields, task rows |
| `--color-border` | `#2a2a2a` | Borders and dividers |
| `--color-red` | `#e63030` | Primary accent color |
| `--color-red-dark` | `#b51f1f` | Hover/pressed states |
| `--color-red-glow` | `rgba(230,48,48,0.15)` | Focus rings, highlights |
| `--color-text` | `#f0f0f0` | Primary text |
| `--color-text-muted` | `#666666` | Secondary text, placeholders |
| `--color-done` | `#181818` | Completed task background |
| `--font-display` | `'Bebas Neue'` | Headings |
| `--font-body` | `'DM Sans'` | Body text |
| `--radius` | `6px` | Border radius |
| `--transition` | `0.2s ease` | Animation timing |

## 📝 Development Notes

This project was built in 200 incremental steps across 5 modules:

1. **Base Todo App** - Core functionality with local storage
2. **OpenCode CLI Experiments** - Refactoring and code organization
3. **Task Filters & Resume Practice** - Filtering and session persistence
4. **Red & Black Redesign** - Complete visual overhaul
5. **Auth, Lists & Calendar** - Full-stack backend integration

Each step includes detailed instructions and verification criteria. The `progress/steps_completed.md` file tracks all completed work.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions:
- Check the `progress/steps_completed.md` for detailed implementation notes
- Review the API endpoints and database schema
- Ensure all dependencies are installed correctly

---

**Built with ❤️ using modern web technologies**