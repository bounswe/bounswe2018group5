import os
from tornado.options import define, options

define("port", default=8080, help="run on the given port", type=int)

settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), "templates"),
    static_path=os.path.join(os.path.dirname(__file__), "static"),
    xsrf_cookies=False,
)