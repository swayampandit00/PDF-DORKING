# PDF Finder Advanced - Ultra Pro Version

A cutting-edge, enterprise-grade web application for discovering and downloading PDFs using advanced Google Dorks. Features background scraping, auto-downloading, AI-enhanced queries, multi-language support, comprehensive admin panel, and full mobile API.

## 🚀 Ultra Pro Features

### 🔍 **Background Scraper**
- **Automated PDF Discovery**: Scrapes Google search results for PDF links
- **Real-time Indexing**: Stores found PDFs in database for quick access
- **Smart Filtering**: Filters legitimate PDF sources
- **Batch Processing**: Handles multiple queries simultaneously

### ⬇️ **Auto PDF Downloader**
- **One-Click Downloads**: Direct PDF download from indexed links
- **Local Storage**: Saves PDFs to secure downloads directory
- **Progress Tracking**: Download status and completion tracking
- **Error Handling**: Robust error handling for failed downloads

### 🗄️ **Database Indexing**
- **PDF Catalog**: Complete database of discovered PDFs
- **Metadata Storage**: Title, URL, download status tracking
- **Search Optimization**: Fast lookup of indexed content
- **Duplicate Prevention**: Avoids duplicate entries

### 🤖 **AI-Based Query Enhancer**
- **Intelligent Query Expansion**: Automatically enhances search terms
- **Context-Aware Suggestions**: AI-driven query improvements
- **Pattern Recognition**: Learns from successful searches
- **Multi-language Query Support**: Enhanced queries in multiple languages

### 👤 **User Profile + Preferences**
- **Personalized Settings**: Theme and language preferences per user
- **Persistent Preferences**: Settings saved across sessions
- **Profile Management**: User-specific configurations
- **Privacy Controls**: User data protection

### 🌐 **Multi-Language UI (Hindi/English Switch)**
- **Bilingual Interface**: Full Hindi and English support
- **Dynamic Language Switching**: Instant language change
- **RTL Support Ready**: Prepared for right-to-left languages
- **Localized Content**: Context-appropriate translations

### 🌙 **Advanced Dark Mode**
- **Persistent Theme**: Remembers user theme preference
- **Smooth Transitions**: Animated theme switching
- **Accessibility**: High contrast and readability
- **System Integration**: Respects system dark mode

### 📱 **Full Mobile App-Ready API**
- **RESTful Endpoints**: Complete API for mobile applications
- **JSON Responses**: Structured data for easy parsing
- **Authentication Support**: API key and session-based auth
- **Rate Limiting Ready**: Prepared for production scaling
- **Comprehensive Data**: Returns dorks, suggestions, and metadata

### 👑 **Advanced Admin Panel**
- **User Management**: View, edit, and manage all users
- **System Logs**: Complete audit trail of all activities
- **Security Settings**: Password policies, 2FA, session management
- **Template Management**: Manage email/page/component templates
- **AI Tools**: Advanced AI-powered features and settings
- **Data Exports**: Export users, logs, reports, and system data
- **Authentication Management**: Monitor sessions, login attempts, and security

## 📖 Quick Start Guide

### Prerequisites
- Python 3.8+
- pip package manager
- Git (optional)

### Installation

1. **Clone the repository** (optional):
   ```bash
   git clone <repository-url>
   cd pdf-finder-advanced
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database**:
   ```bash
   python -c "from database import init_db; init_db()"
   ```

5. **Create admin user** (optional):
   ```bash
   python -c "from database import add_user; add_user('admin@.com', 'admin123')"
   python -c "from database import add_user; add_user('swayam1@gmail.com', '1234swayam')"
   ```

6. **Run the application**:
   ```bash
   python app.py
   ```

7. **Access the application**:
   - Open browser: `http://localhost:5000`
   - Login with your credentials

## 🎯 Usage Guide

### For Regular Users

#### 1. Account Setup
- **Sign Up**: Create account with email and password
- **Login**: Use your credentials to access the system
- **Profile**: Set your preferences (theme, language)

#### 2. Basic PDF Search
1. **Enter Search Term**: Type book name or topic in the search box
2. **Generate Dorks**: Click "Search" to get 50+ Google dork links
3. **View Results**: Browse through categorized dork links
4. **Export Results**: Download in TXT, JSON, or PDF format

#### 3. Advanced Features
- **AI Enhanced Search**: Get AI-suggested search terms
- **Background Scraping**: Use scraper to find direct PDF links
- **PDF Downloads**: Download indexed PDFs with one click
- **Search History**: View and manage your search history

#### 4. Settings & Preferences
- **Theme Toggle**: Switch between light/dark modes
- **Language Switch**: Change between English and Hindi
- **Profile Management**: Update your account settings

### For Administrators

#### Admin Access
- Login with admin credentials: `admin@.com` / `admin123` or `swayam1@gmail.com` / `1234swayam`
- Access admin panel: `http://localhost:5000/admin`

#### Admin Dashboard
- **Overview**: System statistics and analytics
- **User Management**: View, edit, delete users
- **System Logs**: Monitor all user activities
- **Security Settings**: Configure authentication policies
- **Template Management**: Manage system templates
- **AI Tools**: Access advanced AI features
- **Data Exports**: Export system data and reports
- **Authentication**: Monitor sessions and security events

#### Key Admin Features

##### User Management (`/admin/users`)
- View all registered users
- Search and filter users
- Edit user profiles
- Delete inactive users
- View user activity logs

##### System Logs (`/admin/logs`)
- Search through all system logs
- Filter by date, user, or action
- Export log data
- Monitor suspicious activities

##### Security Settings (`/admin/settings`)
- **General**: Basic system configuration
- **Security**: Password policies and authentication
- **Email**: SMTP and notification settings
- **API**: API keys and integrations
- **Backup**: Database and file backups
- **Maintenance**: System maintenance tasks

##### Template Management (`/admin/templates`)
- Create and edit email templates
- Manage page layouts and components
- Version control for templates
- Bulk template operations

##### AI Tools (`/admin/ai-tools`)
- **Dork Generator**: AI-powered query generation
- **Content Analyzer**: Analyze search results
- **Search Optimizer**: Optimize search strategies
- **Report Generator**: Generate detailed reports
- **AI Settings**: Configure AI parameters

##### Data Exports (`/admin/exports`)
- **Data Export**: Export database tables
- **Report Export**: Generate system reports
- **User Export**: Export user data
- **Log Export**: Export system logs
- **Bulk Export**: Complete system backup

##### Authentication Management (`/admin/auth`)
- **Active Sessions**: Monitor user sessions
- **Login Attempts**: Track login success/failure
- **Security Settings**: Configure security policies
- **Password Policy**: Set password requirements
- **2FA Management**: Configure two-factor authentication

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the image
docker build -t pdf-finder-advanced .

# Run the container
docker run -p 5000:5000 -v $(pwd)/downloads:/app/downloads pdf-finder-advanced
```

### Docker Compose (Advanced)

```yaml
version: '3.8'
services:
  pdf-finder:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./downloads:/app/downloads
      - ./data.db:/app/data.db
    environment:
      - FLASK_ENV=production
```

## 📡 API Documentation

### Authentication
Most API endpoints require authentication. Use session cookies or include authentication headers.

### Core Endpoints

#### Search PDFs
```http
GET /api/search?book=python+programming
```

**Response**:
```json
{
  "book": "python programming",
  "dorks": {
    "Google PDF": "https://www.google.com/search?q=filetype%3Apdf+%22python+programming%22",
    "Index Of": "https://www.google.com/search?q=intitle%3A%22index+of%22+%22python+programming%22+pdf"
  },
  "ai_suggestions": ["python free pdf", "python programming tutorial"],
  "enhanced_queries": ["python filetype:pdf", "python programming pdf download"],
  "total_dorks": 50,
  "timestamp": "2025-12-31T12:00:00Z"
}
```

#### User History
```http
GET /api/user/history
Authorization: Required (Session)
```

**Response**:
```json
{
  "history": ["python programming", "machine learning", "data science"],
  "total_searches": 15,
  "last_search": "2025-12-31T11:30:00Z"
}
```

#### Scrape PDFs
```http
GET /api/scrape?book=python+programming
Authorization: Required (Session)
```

**Response**:
```json
{
  "scraped_pdfs": [
    {"title": "Python Programming Guide", "url": "https://example.com/python.pdf"},
    {"title": "Advanced Python", "url": "https://example.com/advanced-python.pdf"}
  ],
  "count": 2,
  "indexed": true
}
```

#### Download PDF
```http
GET /download_pdf/<pdf_id>
Authorization: Required (Session)
```

#### System Statistics
```http
GET /api/stats
Authorization: Required (Admin)
```

**Response**:
```json
{
  "total_users": 150,
  "total_searches": 2340,
  "indexed_pdfs": 890,
  "active_sessions": 25,
  "system_health": "good"
}
```

### Admin API Endpoints

#### User Management
```http
GET /admin/api/users
POST /admin/api/users
PUT /admin/api/users/<user_id>
DELETE /admin/api/users/<user_id>
```

#### System Logs
```http
GET /admin/api/logs
POST /admin/api/logs/search
```

#### Export Data
```http
POST /admin/api/export/users
POST /admin/api/export/logs
POST /admin/api/export/reports
```

## 🛠️ Technical Details

### Backend Architecture
- **Flask Framework**: Lightweight WSGI web application framework
- **SQLite Database**: Robust relational database with indexing
- **Session Management**: Secure server-side session handling
- **File Upload/Download**: Secure file handling with validation

### Frontend Technologies
- **Bootstrap 5**: Responsive CSS framework
- **JavaScript ES6+**: Modern client-side scripting
- **Chart.js**: Interactive data visualizations
- **DataTables**: Advanced table functionality
- **Font Awesome**: Comprehensive icon library

### Database Schema
```sql
-- Users table
CREATE TABLE users (
    email TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search history
CREATE TABLE history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    book TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email)
);

-- User preferences
CREATE TABLE user_preferences (
    email TEXT PRIMARY KEY,
    theme TEXT DEFAULT 'dark',
    lang TEXT DEFAULT 'en',
    FOREIGN KEY (email) REFERENCES users(email)
);

-- PDF index
CREATE TABLE pdf_index (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    title TEXT,
    downloaded INTEGER DEFAULT 0,
    filename TEXT,
    indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Security Features
- **Input Validation**: All user inputs sanitized and validated
- **Password Hashing**: Secure password storage (implement bcrypt in production)
- **Session Security**: HTTPOnly, Secure, SameSite cookies
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: Request rate limiting to prevent abuse
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

### Performance Optimizations
- **Database Indexing**: Optimized queries with proper indexing
- **Caching Ready**: Prepared for Redis/memcached integration
- **Lazy Loading**: Components loaded on demand
- **Minified Assets**: Optimized CSS and JavaScript delivery
- **CDN Ready**: Static assets can be served from CDN

## 🔧 Configuration

### Environment Variables
```bash
# Flask Configuration
FLASK_ENV=development|production
FLASK_DEBUG=0|1
SECRET_KEY=your-secret-key-here

# Database Configuration
DATABASE_URL=sqlite:///data.db

# Email Configuration (for future features)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Security Configuration
SESSION_TIMEOUT=480  # minutes
MAX_LOGIN_ATTEMPTS=5
PASSWORD_MIN_LENGTH=8
```

### Application Settings
Access admin panel → Settings to configure:
- General system settings
- Security policies
- Email configuration
- API settings
- Backup configuration
- Maintenance options

## 🐛 Troubleshooting

### Common Issues

#### Application won't start
```bash
# Check Python version
python --version

# Check if dependencies are installed
pip list

# Check for port conflicts
netstat -ano | findstr :5000
```

#### Database errors
```bash
# Reinitialize database
python -c "from database import init_db; init_db()"

# Check database file
ls -la data.db
```

#### Permission errors
```bash
# Fix downloads directory permissions
chmod 755 downloads/
```

#### Admin access issues
```bash
# Create admin user
python -c "from database import add_user; add_user('admin@.com', 'admin123')"
```

### Debug Mode
Run with debug mode for detailed error information:
```bash
FLASK_DEBUG=1 python app.py
```

## 🚀 Deployment

### Production Deployment

1. **Use production WSGI server**:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

2. **Use environment variables** for configuration

3. **Set up reverse proxy** (nginx/apache)

4. **Enable SSL/TLS** certificates

5. **Configure firewall** and security groups

6. **Set up monitoring** and logging

### Cloud Deployment

#### Heroku
```bash
# Create requirements.txt with gunicorn
echo "gunicorn==23.0.0" >> requirements.txt

# Create Procfile
echo "web: gunicorn app:app" > Procfile

# Deploy
git push heroku main
```

#### AWS/DigitalOcean
- Use Docker deployment
- Configure load balancer
- Set up auto-scaling
- Configure backups

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create Pull Request

### Development Guidelines
- Follow PEP 8 style guidelines
- Write comprehensive tests
- Update documentation
- Use meaningful commit messages
- Test on multiple browsers

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Flask web framework
- UI powered by Bootstrap 5
- Icons by Font Awesome
- Charts by Chart.js

---

**Built with ❤️ for researchers, students, and knowledge seekers worldwide.**

*Last updated: December 31, 2025*