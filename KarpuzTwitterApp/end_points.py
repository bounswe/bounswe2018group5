import tornado.web

from settings import settings
from handlers.main import MainHandler
from handlers.locationtweets import LocationTweetsLocationHandler

end_point_list = [
    # MAIN
    (r"/", MainHandler),
    (r"/location-tweets", LocationTweetsLocationHandler),

    (r"/(.*)", tornado.web.StaticFileHandler, {'path': settings['static_path']}),
]



