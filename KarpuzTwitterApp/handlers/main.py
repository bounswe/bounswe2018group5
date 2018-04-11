from handlers.base import BaseHandler, TemplateRendering


class MainHandler(BaseHandler, TemplateRendering):
    def get(self):
        template = 'index.html'
        variables = {
            'title': "Home",
            'type': 'home'
        }
        content = self.render_template(template, variables)
        self.write(content)

