from rest_framework import serializers
from .models import Artist, Album, Song, Lyrics, Annotation, ContentType, Content

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ['id', 'name', 'description', 'image_url']

class AlbumSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)

    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'release_date', 'image_url']

class SongSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    album = AlbumSerializer(read_only=True)

    class Meta:
        model = Song
        fields = ['id', 'title', 'artist', 'album', 'track_number', 'duration']

class LyricsSerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)

    class Meta:
        model = Lyrics
        fields = ['id', 'song', 'content']

class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = ['id', 'lyrics_id', 'start_index', 'end_index', 'content', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        """
        Check that start_index is before end_index and that they are within
        the bounds of the lyrics content.
        """
        if data['start_index'] >= data['end_index']:
            raise serializers.ValidationError("end_index must be greater than start_index")
        
        if 'lyrics_id' in data:
            try:
                lyrics = Lyrics.objects.get(id=data['lyrics_id'])
                if data['end_index'] > len(lyrics.content):
                    raise serializers.ValidationError("Annotation indices are out of bounds")
            except Lyrics.DoesNotExist:
                raise serializers.ValidationError("Referenced lyrics do not exist")
        
        return data

class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = ['id', 'name', 'description']

class ContentSerializer(serializers.ModelSerializer):
    content_type = ContentTypeSerializer(read_only=True)

    class Meta:
        model = Content
        fields = ['id', 'title', 'content', 'content_type', 'author', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
