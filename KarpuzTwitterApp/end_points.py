import tornado.web

from settings import settings
from handlers.main import MainHandler
from handlers.locationtweets import LocationTweetsLocationHandler
from handlers.favoritetweets import FavoriteTweetsHandler

end_point_list = [
    # MAIN
    (r"/", MainHandler),
    (r"/location-tweets", LocationTweetsLocationHandler),
    (r"/favorite-tweets", FavoriteTweetsHandler),

    (r"/(.*)", tornado.web.StaticFileHandler, {'path': settings['static_path']}),
]



