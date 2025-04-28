from django.contrib import admin
from .models import Artist, Album, Song, Lyrics, Annotation, ContentType, Content

class AlbumInline(admin.TabularInline):
    model = Album
    extra = 0

class SongInline(admin.TabularInline):
    model = Song
    extra = 0

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    inlines = [AlbumInline]

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'release_date', 'created_at')
    list_filter = ('artist', 'release_date')
    search_fields = ('title', 'artist__name')
    inlines = [SongInline]

class LyricsInline(admin.StackedInline):
    model = Lyrics
    extra = 0

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album', 'track_number', 'duration')
    list_filter = ('artist', 'album')
    search_fields = ('title', 'artist__name', 'album__title')
    inlines = [LyricsInline]

class AnnotationInline(admin.TabularInline):
    model = Annotation
    extra = 0

@admin.register(Lyrics)
class LyricsAdmin(admin.ModelAdmin):
    list_display = ('song', 'created_at', 'updated_at')
    search_fields = ('song__title', 'content')
    inlines = [AnnotationInline]

@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    list_display = ('id', 'lyrics', 'start_index', 'end_index', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'lyrics__song__title')

@admin.register(ContentType)
class ContentTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')

@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'content_type', 'author', 'created_at')
    list_filter = ('content_type', 'created_at')
    search_fields = ('title', 'content', 'author')
