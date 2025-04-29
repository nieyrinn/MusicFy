from django.db import models
from django.utils import timezone

class Artist(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='albums')
    release_date = models.DateField()
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.artist.name}"

    class Meta:
        ordering = ['-release_date', 'title']

class Song(models.Model):
    title = models.CharField(max_length=255)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='songs')
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='songs')
    track_number = models.PositiveIntegerField(blank=True, null=True)
    duration = models.CharField(max_length=10, help_text="Format: MM:SS")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.artist.name}"

    class Meta:
        ordering = ['album', 'track_number', 'title']

class Lyrics(models.Model):
    song = models.OneToOneField(Song, on_delete=models.CASCADE, related_name='lyrics')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lyrics for {self.song.title}"

    class Meta:
        verbose_name_plural = "Lyrics"

class Annotation(models.Model):
    lyrics = models.ForeignKey(Lyrics, on_delete=models.CASCADE, related_name='annotations')
    start_index = models.PositiveIntegerField()
    end_index = models.PositiveIntegerField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Annotation for {self.lyrics.song.title} ({self.start_index}:{self.end_index})"

    class Meta:
        ordering = ['lyrics', 'start_index']

class ContentType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Content(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name='contents')
    author = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.content_type.name})"

    class Meta:
        ordering = ['-created_at']
