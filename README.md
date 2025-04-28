<<<<<<< HEAD
# MusicFy
=======
# Lyrics Annotator Platform

A modern web platform for viewing and annotating song lyrics, poems, news articles, and other textual content.

## Features

- 🎵 Browse songs, albums, and artists
- 📝 View lyrics with interactive annotation support
- 🔍 Search functionality across all content types
- ✏️ Create and view annotations for specific lines or phrases
- 📱 Responsive design for all devices

## Technology Stack

### Frontend
- Angular 16+
- TypeScript
- Angular Material for UI components
- SCSS for styling
- Angular Router for navigation

### Backend
- Django 4.x
- Django REST Framework
- SQLite for development (configurable for PostgreSQL in production)

## Project Structure

### Frontend (Angular)

The frontend application is built with Angular and follows a component-based architecture:

- **Components**: Reusable UI elements (home, album-list, song-list, lyrics-view, etc.)
- **Services**: Data providers that connect to the backend API
- **Models**: TypeScript interfaces for data structures
- **Routing**: Navigation between different views

### Backend (Django)

The backend is built with Django and provides a RESTful API:

- **Models**: Database schema definition (Artist, Album, Song, Lyrics, Annotation, etc.)
- **Views**: API endpoints for accessing and manipulating data
- **Serializers**: Convert between Python objects and JSON data
- **URLs**: Route definitions for the API endpoints

## Getting Started

### Prerequisites

- Node.js (v14+) and npm
- Python (v3.9+) and pip
- Angular CLI: `npm install -g @angular/cli`
- Django: `pip install django djangorestframework django-cors-headers`

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/lyrics-annotator.git
   cd lyrics-annotator
   ```

2. Setup the backend:
   ```
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver 0.0.0.0:8000
   ```

3. Setup the frontend:
   ```
   cd frontend
   npm install
   ng serve --host 0.0.0.0 --port 5000
   ```

4. Visit the application at:
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:8000/api/
   - Admin interface: http://localhost:8000/admin/

## API Endpoints

- `/api/artists/` - List and create artists
- `/api/albums/` - List and create albums
- `/api/songs/` - List and create songs
- `/api/lyrics/` - List and create lyrics
- `/api/annotations/` - List and create annotations
- `/api/search/` - Search across artists, albums, and songs

## Development Workflow

1. Run the backend and frontend development servers
2. Access the Django admin interface to add initial data
3. Navigate to the frontend application to view and interact with the content
4. Use the application features to browse, search, and annotate content

## Deployment

The application can be deployed to various platforms:

- Frontend: Vercel, Netlify, or any static hosting service
- Backend: Heroku, Digital Ocean, Railway, or any other service supporting Python/Django

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- This project was built with [Angular](https://angular.io/)
- Backend powered by [Django](https://www.djangoproject.com/)
- UI components from [Angular Material](https://material.angular.io/)
>>>>>>> 56eec552 (Implement text annotation features for lyrics and content)
