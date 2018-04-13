import tornado.web
import json

from jinja2 import Environment, FileSystemLoader, TemplateNotFound

from settings import settings


class JinjaCustomFilter:
    @classmethod
    def debug(cls, text):
        print(str(text))
        return


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


class BaseHandler(tornado.web.RequestHandler, TemplateRendering):
    def data_received(self, chunk):
        pass

    def write_error(self, status_code, **kwargs):
        template = 'HTTP500.html'
        variables = {}
        content = self.render_template(template, variables)
        self.write(content)