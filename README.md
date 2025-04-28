# MusicFy

MusicFy is a web platform designed to provide information about music artists, their albums, and the songs they’ve created. Users can explore artist profiles, view the list of their albums, and dive into song annotations that explain parts of song lyrics, offering deeper understanding and insight into the music.

## Features
- **Artists**: View the short information about music artists.
- **Music Territory**: Browse the albums and songs released by artists.
- **Song Annotations**: Explore explanations and meanings behind song lyrics..

## Tech Stack
- **Frontend**: Angular
- **Backend**: Django

## Development Process
The development of MusicFy began with setting up the backend using Django. I started by creating the models, serializers, views for artists, albums, and songs. Once the models were in place, I created the API endpoints to serve data to the frontend.
After the backend was set up, I moved on to the frontend development using Angular. I built components for displaying artist profiles, albums, and song annotations. The frontend communicates with the backend through API calls to fetch data and display it dynamically. Throughout the development, I focused on ensuring that the user interface was clean, while also ensuring that the data was correctly fetched and displayed. I spent time troubleshooting and debugging issues, particularly with date formatting, display animating and ensuring that the song annotations were correctly associated with the songs.

## Challenges
One of the main challenges I encountered was fetching and displaying date information from the backend API correctly. The data wasn’t coming through as expected, which led to some debugging. After adjusting both the frontend and backend, I was able to ensure the correct format was displayed.

## Why I Chose This Tech Stack
I chose Angular and Django because I had already experience with both technologies. Angular provides a clean and efficient way to build single-page applications, while Django offers a nice backend framework with rapid API development capabilities. This combination help me to create a functional platform with a good user experience.

### Backend (Django)
1. **Clone the repository**:
   ```bash
   git clone https://github.com/nieyrinn/MusicFy.git
   ```
2. **Navigate into the backend directory**:
   ```bash
   cd Musicfy/backend
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Apply migrations** to set up the database:
   ```bash
   python manage.py migrate
   ```
5. **Run the Django development server**:
   ```bash
   python manage.py runserver
   ```
   The backend should now be running on `http://localhost:8000`.

### Frontend (Angular)
1. **Navigate into the frontend directory**:
   ```bash
   cd Musicfy/frontend
   ```
2. **Install the necessary dependencies**:
   ```bash
   npm install
   ```
3. **Run the Angular development server**:
   ```bash
   ng serve
   ```
   The frontend should now be accessible at `http://localhost:4200`.
