import logic
from handlers.base import BaseHandler, TemplateRendering

class UserTimelineHandler(BaseHandler, TemplateRendering):

    def data_received(self, chunk):
        pass

    def get(self):
        screen_name = self.get_argument('screen_name', '')

        if " " in screen_name or screen_name == "":
            self.finish({'error': "Screen name must not include whitespace or be empty."})

