import tornado.ioloop
from tornado.options import options
import tornado.web

from settings import settings
from end_points import end_point_list


class KarpuzTwitterApp(tornado.web.Application):
    def __init__(self):
        super(KarpuzTwitterApp, self).__init__(end_point_list, **settings, autoreload=True)


def main():
    options.parse_command_line()
    app = KarpuzTwitterApp()
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
