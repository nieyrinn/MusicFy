from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'artists', views.ArtistViewSet)
router.register(r'albums', views.AlbumViewSet)
router.register(r'songs', views.SongViewSet)
router.register(r'lyrics', views.LyricsViewSet)
router.register(r'annotations', views.AnnotationViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.SearchView.as_view(), name='search'),
    path('search/songs/', views.SearchSongsView.as_view(), name='search-songs'),
    path('search/albums/', views.SearchAlbumsView.as_view(), name='search-albums'),
    path('search/artists/', views.SearchArtistsView.as_view(), name='search-artists'),
]
