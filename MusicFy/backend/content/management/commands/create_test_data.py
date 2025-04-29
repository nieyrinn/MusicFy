from django.core.management.base import BaseCommand
from django.utils import timezone
from content.models import Artist, Album, Song, Lyrics, Annotation, ContentType, Content
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = 'Creates test data for the Lyrics Platform application'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Creating test data...'))
        
        # Delete existing data
        self.stdout.write('Clearing existing data...')
        Annotation.objects.all().delete()
        Lyrics.objects.all().delete()
        Song.objects.all().delete()
        Album.objects.all().delete()
        Artist.objects.all().delete()
        Content.objects.all().delete()
        ContentType.objects.all().delete()
        
        # Create Artists
        self.stdout.write('Creating artists...')
        artists = []
        artist_data = [
            {
                'name': 'The Poetry Band',
                'description': 'A musical group known for their poetic lyrics and acoustic sound.',
                'image_url': 'https://example.com/poetry_band.jpg'
            },
            {
                'name': 'Lyric Masters',
                'description': 'Hip-hop collective focused on intricate wordplay and storytelling.',
                'image_url': 'https://example.com/lyric_masters.jpg'
            },
            {
                'name': 'Melody Makers',
                'description': 'Pop group with catchy hooks and accessible lyrics.',
                'image_url': 'https://example.com/melody_makers.jpg'
            }
        ]
        
        for data in artist_data:
            artist = Artist.objects.create(**data)
            artists.append(artist)
            self.stdout.write(f'Created artist: {artist.name}')
        
        # Create Albums
        self.stdout.write('Creating albums...')
        albums = []
        current_year = timezone.now().year
        
        for i, artist in enumerate(artists):
            for j in range(2):  # 2 albums per artist
                release_date = datetime(year=current_year-j, month=random.randint(1, 12), day=random.randint(1, 28))
                album = Album.objects.create(
                    title=f"{artist.name}'s {'Debut' if j == 0 else 'Second'} Album",
                    artist=artist,
                    release_date=release_date,
                    image_url=f'https://example.com/album_{i}_{j}.jpg'
                )
                albums.append(album)
                self.stdout.write(f'Created album: {album.title}')
        
        # Create Songs with Lyrics
        self.stdout.write('Creating songs and lyrics...')
        songs = []
        
        sample_lyrics = [
            """Verse 1:
In the shadow of the mountains tall,
I heard your distant call.
Through valleys deep and rivers wide,
In your arms, I'll confide.

Chorus:
This journey we take, hand in hand,
Across the sea and dusty land.
No matter the storms that rage above,
I'll follow the compass of our love.

Verse 2:
Stars that guide us through the night,
Illuminate our path with light.
Every step we take together,
Builds a bond that lasts forever.

[Repeat Chorus]

Bridge:
When shadows fall and hope seems lost,
Remember what we've built at any cost.
The map we've drawn with tears and joy,
Creates a world that time cannot destroy.

[Repeat Chorus]

Outro:
I'll follow the compass of our love.""",

            """Verse 1:
City lights reflect in puddles on the street,
Neon signs flicker to an urban beat.
Footsteps echo through the concrete maze,
Lost in thoughts of better days.

Chorus:
We are the children of the digital age,
Writing our stories on an endless page.
Connected yet alone in this paradox we live,
So much to take, so little to give.

Verse 2:
Screens illuminate faces in the dark,
Each swipe and click leaves an invisible mark.
We build our walls with filters and likes,
Chasing validation through the nights.

[Repeat Chorus]

Bridge:
But underneath the pixels and the code,
We're still human hearts on the same road.
Searching for meaning in a world so vast,
Creating future memories that will someday be the past.

[Repeat Chorus]

Outro:
So much to take, so little to give.
This is how we live.""",

            """Verse 1:
Morning breaks over the horizon line,
A new day begins, feeling so divine.
Coffee brewing, birds start to sing,
Wonder what today will bring.

Pre-Chorus:
One moment at a time,
One step, one climb.

Chorus:
Today is a gift, unwrap it slow,
See where the moments might go.
No need to rush, no need to run,
Enjoy the rising of the sun.

Verse 2:
Busy streets and busy minds,
Take a breath, leave stress behind.
Present moments quickly pass,
Make the good times last.

[Repeat Pre-Chorus and Chorus]

Bridge:
The clock keeps ticking, never stops,
But we decide where attention drops.
Focus on the here and now,
Happiness is learning how.

[Repeat Chorus]

Outro:
Today is a gift, unwrap it slow."""
        ]
        
        for i, album in enumerate(albums):
            for j in range(3):  # 3 songs per album
                track_number = j + 1
                minutes = random.randint(2, 4)
                seconds = random.randint(0, 59)
                duration = f"{minutes}:{seconds:02d}"
                
                song = Song.objects.create(
                    title=f"Song {track_number} - {album.title}",
                    album=album,
                    artist=album.artist,
                    track_number=track_number,
                    duration=duration
                )
                
                # Create lyrics for each song
                lyrics_index = (i + j) % len(sample_lyrics)
                lyrics = Lyrics.objects.create(
                    song=song,
                    content=sample_lyrics[lyrics_index]
                )
                
                # Create annotations for each lyrics
                # Create 2-3 annotations per song
                for k in range(random.randint(2, 3)):
                    # Find a verse or chorus section to annotate
                    lyrics_content = lyrics.content
                    sections = ["Verse", "Chorus", "Bridge"]
                    section = random.choice(sections)
                    
                    # Find the position of the section in the lyrics
                    pos = lyrics_content.find(section)
                    if pos >= 0:
                        # Find the next few lines
                        end_of_line = lyrics_content.find("\n", pos)
                        next_line = lyrics_content.find("\n", end_of_line + 1)
                        if next_line > 0:
                            start_index = pos
                            end_index = next_line
                            
                            annotation_text = f"This {section.lower()} represents {random.choice(['emotions', 'experiences', 'memories', 'hopes', 'dreams'])} of the {random.choice(['artist', 'songwriter', 'protagonist', 'character'])}. The {random.choice(['metaphor', 'imagery', 'simile', 'alliteration', 'rhythm'])} used here enhances the {random.choice(['meaning', 'feeling', 'impact', 'message'])} of the song."
                            
                            Annotation.objects.create(
                                lyrics=lyrics,
                                start_index=start_index,
                                end_index=end_index,
                                content=annotation_text
                            )
                
                songs.append(song)
                self.stdout.write(f'Created song: {song.title} with lyrics and annotations')
        
        # Create ContentTypes
        self.stdout.write('Creating content types...')
        content_types = []
        
        for type_name in ['news', 'article', 'interview', 'review']:
            content_type = ContentType.objects.create(
                name=type_name,
                description=f"Content type for {type_name} articles"
            )
            content_types.append(content_type)
            self.stdout.write(f'Created content type: {content_type.name}')
        
        # Create Content
        self.stdout.write('Creating content...')
        
        for i, content_type in enumerate(content_types):
            for j in range(3):  # 3 content items per type
                content = Content.objects.create(
                    title=f"{content_type.name.title()} {j+1}: {'About' if j==0 else 'Featuring'} {random.choice(artists).name}",
                    content=f"This is sample content for a {content_type.name} article. It would normally contain several paragraphs of text related to music, artists, and songs.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.\n\nPraesent euismod, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.",
                    content_type=content_type,
                    author=f"Writer {j+1}"
                )
                self.stdout.write(f'Created content: {content.title}')
        
        self.stdout.write(self.style.SUCCESS('Test data creation completed successfully!'))