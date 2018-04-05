import tornado.web
import json

from jinja2 import Environment, FileSystemLoader, TemplateNotFound

from settings import settings


class JinjaCustomFilter:
    @classmethod
    def debug(cls, text):
        print(str(text))
        return


class BaseHandler(tornado.web.RequestHandler):
    def write_error(self, status_code, **kwargs):
        self.write(json.dumps({'error': "Unexpected Error!"}))


class TemplateRendering:
    @classmethod
    def render_template(cls, template_name, variables={}):
        env = Environment(loader=FileSystemLoader(settings['template_path']))
        jcf = JinjaCustomFilter()
        env.filters['debug'] = jcf.debug
        try:
            template = env.get_template(template_name)
        except TemplateNotFound:
            raise TemplateNotFound(template_name)

        content = template.render(variables)
        return content