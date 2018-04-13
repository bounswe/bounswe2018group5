import logic
from handlers.base import BaseHandler, TemplateRendering


class CommonFollowersHandler(BaseHandler, TemplateRendering):
    def data_received(self, chunk):
        pass

    def get(self):
        user_one = self.get_argument('user_one', '')
        user_two = self.get_argument('user_two', '')

        # Prepares the request for logic function. Gives a message for any error.
        search_params = {'user_one': user_one,
                         'user_two': user_two}

        # Gets users from logic.
        common_follower_data = logic.get_common_followers_of_two_users(search_params)
        template = 'index.html'
        variables = {
            'title': "Common Followers",
            'type': 'commonfollowers',
            'users': common_follower_data['users'] if common_follower_data['response'] else [],
            'params': search_params,
            'error_message': common_follower_data['errors'] if not common_follower_data['response'] else ""
        }
        content = self.render_template(template, variables)
        self.write(content)
