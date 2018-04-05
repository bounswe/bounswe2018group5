import tornado.web

from settings import settings
from handlers.main import MainHandler

end_point_list = [
    # MAIN
    (r"/", MainHandler),

    (r"/(.*)", tornado.web.StaticFileHandler, {'path': settings['static_path']}),
]



