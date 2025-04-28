from django.db.models import Q
from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Artist, Album, Song, Lyrics, Annotation, ContentType, Content
from .serializers import (
    ArtistSerializer, AlbumSerializer, SongSerializer, LyricsSerializer,
    AnnotationSerializer, ContentTypeSerializer, ContentSerializer
)

# Artist views
class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    
    @action(detail=True, methods=['get'])
    def albums(self, request, pk=None):
        artist = self.get_object()
        albums = Album.objects.filter(artist=artist)
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def songs(self, request, pk=None):
        artist = self.get_object()
        songs = Song.objects.filter(artist=artist)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

# Album views
class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    
    @action(detail=True, methods=['get'])
    def songs(self, request, pk=None):
        album = self.get_object()
        songs = Song.objects.filter(album=album)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

# Song views
class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    
    @action(detail=True, methods=['get'])
    def lyrics(self, request, pk=None):
        song = self.get_object()
        try:
            lyrics = Lyrics.objects.get(song=song)
            serializer = LyricsSerializer(lyrics)
            return Response(serializer.data)
        except Lyrics.DoesNotExist:
            return Response(
                {"detail": "Lyrics not found for this song."}, 
                status=status.HTTP_404_NOT_FOUND
            )

# Lyrics views
class LyricsViewSet(viewsets.ModelViewSet):
    queryset = Lyrics.objects.all()
    serializer_class = LyricsSerializer
    
    @action(detail=True, methods=['get'])
    def annotations(self, request, pk=None):
        lyrics = self.get_object()
        annotations = Annotation.objects.filter(lyrics=lyrics)
        serializer = AnnotationSerializer(annotations, many=True)
        return Response(serializer.data)

# Annotation views
class AnnotationViewSet(viewsets.ModelViewSet):
    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer

# Content Type views
class ContentTypeViewSet(viewsets.ModelViewSet):
    queryset = ContentType.objects.all()
    serializer_class = ContentTypeSerializer

# Content views
class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    
    def get_queryset(self):
        queryset = Content.objects.all()
        content_type = self.request.query_params.get('type', None)
        
        if content_type:
            queryset = queryset.filter(content_type__name=content_type)
            
        return queryset

# Search views
class SearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response(
                {"detail": "Search query is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Search in artists, albums, and songs
        artists = Artist.objects.filter(name__icontains=query)
        albums = Album.objects.filter(
            Q(title__icontains=query) | Q(artist__name__icontains=query)
        )
        songs = Song.objects.filter(
            Q(title__icontains=query) | 
            Q(artist__name__icontains=query) |
            Q(album__title__icontains=query)
        )
        
        result = {
            'artists': ArtistSerializer(artists, many=True).data,
            'albums': AlbumSerializer(albums, many=True).data,
            'songs': SongSerializer(songs, many=True).data
        }
        
        return Response(result)

# Search specific entity types
class SearchSongsView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response(
                {"detail": "Search query is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        songs = Song.objects.filter(
            Q(title__icontains=query) | 
            Q(artist__name__icontains=query) |
            Q(album__title__icontains=query)
        )
        
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

class SearchAlbumsView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response(
                {"detail": "Search query is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        albums = Album.objects.filter(
            Q(title__icontains=query) | Q(artist__name__icontains=query)
        )
        
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)

class SearchArtistsView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response(
                {"detail": "Search query is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        artists = Artist.objects.filter(name__icontains=query)
        
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data)
