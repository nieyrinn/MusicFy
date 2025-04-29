from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Artist, Album, Song, Lyrics, Annotation

class LyricsPlatformAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.artist = Artist.objects.create(
            name="Test Artist",
            description="Test artist description"
        )
        
        self.album = Album.objects.create(
            title="Test Album",
            artist=self.artist,
            release_date="2023-01-01"
        )
        
        self.song = Song.objects.create(
            title="Test Song",
            artist=self.artist,
            album=self.album,
            track_number=1,
            duration="3:45"
        )
        
        self.lyrics = Lyrics.objects.create(
            song=self.song,
            content="This is a test song lyrics\nWith multiple lines\nFor testing annotation features"
        )
        
        self.annotation = Annotation.objects.create(
            lyrics=self.lyrics,
            start_index=10,
            end_index=14,
            content="This explains the word 'test'"
        )

    def test_get_artists(self):
        url = reverse('artist-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Artist')

    def test_get_albums(self):
        url = reverse('album-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Album')

    def test_get_songs(self):
        url = reverse('song-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Song')

    def test_get_lyrics(self):
        url = reverse('song-lyrics', kwargs={'pk': self.song.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], self.lyrics.content)

    def test_get_annotations(self):
        url = reverse('lyrics-annotations', kwargs={'pk': self.lyrics.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], "This explains the word 'test'")

    def test_search(self):
        url = reverse('search') + '?q=test'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['artists']), 1)
        self.assertEqual(len(response.data['albums']), 1)
        self.assertEqual(len(response.data['songs']), 1)
