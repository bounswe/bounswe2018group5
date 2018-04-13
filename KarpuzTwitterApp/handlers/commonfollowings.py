import logic
from handlers.base import BaseHandler, TemplateRendering


class CommonFollowingsHandler(BaseHandler, TemplateRendering):
    """Handler for searching tweets with location and query."""
    def data_received(self, chunk):
        pass

    def get(self):
        user_one = self.get_argument('user_one', '')
        user_two = self.get_argument('user_two', '')

        # Prepares the request for logic function. Gives a message for any error.
        search_params = {'user_one': user_one,
                         'user_two': user_two}

        # Gets users from logic.
        users = logic.get_common_followings_of_two_user(search_params)
        template = 'index.html'
        variables = {
            'title': "Common Followings",
            'type': 'commonfollowings',
            'users': users if users['response'] else [],
            'params': search_params,
            'error_message': users['errors'] if not users['response'] else ""
        }
        content = self.render_template(template, variables)
        self.write(content)
