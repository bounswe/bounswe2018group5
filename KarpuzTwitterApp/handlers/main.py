from handlers.base import BaseHandler, TemplateRendering


class MainHandler(BaseHandler, TemplateRendering):
    def get(self):
        template = 'index.html'
        variables = {
            'title': "Home"
        }
        content = self.render_template(template, variables)
        self.write(content)

