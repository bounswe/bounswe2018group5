import logic
from handlers.base import BaseHandler, TemplateRendering


class SearchUsersHandler(BaseHandler, TemplateRendering):
    """Handler for searching tweets with location and query."""
    def data_received(self, chunk):
        pass

    def get(self):
        q = self.get_argument('query', '')

        # Gets tweets from logic.
        user_response = logic.search_users(q)
        template = 'index.html'
        variables = {
            'title': "Search Users",
            'type': 'searchusers',
            'users': user_response,
        }
        content = self.render_template(template, variables)
        self.write(content)
