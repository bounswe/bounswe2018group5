from decouple import config

from handlers.base import BaseHandler, TemplateRendering


class MainHandler(BaseHandler, TemplateRendering):
    def data_received(self, chunk):
        pass

    def get(self):
        template = 'index.html'
        variables = {
            'title': "Home",
            'type': 'home',
            'mapbox_token': config("MAPBOX_TOKEN")
        }
        content = self.render_template(template, variables)
        self.write(content)

