import json
import os
import random
import string

import tornado.ioloop
import tornado.options
import tornado.web
from jinja2 import Environment, FileSystemLoader, TemplateNotFound

settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), "templates"),
    static_path=os.path.join(os.path.dirname(__file__), "static"),
    xsrf_cookies=False,
)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/index", MainHandler),
            (r"/", MainHandler),
            (r"/(.*)", tornado.web.StaticFileHandler, {'path': settings['static_path']}),
        ]
        super(Application, self).__init__(handlers, **settings)


class TemplateRendering:
    def render_template(self, template_name, variables={}):
        env = Environment(loader=FileSystemLoader(settings['template_path']))
        try:
            template = env.get_template(template_name)
        except TemplateNotFound:
            raise TemplateNotFound(template_name)

        content = template.render(variables)
        return content


class MainHandler(TemplateRendering):
    def get(self):
        template = 'index.html'
        variables = {
            'title': "a"
        }
        content = self.render_template(template, variables)
        self.write(content)

def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(8484)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
