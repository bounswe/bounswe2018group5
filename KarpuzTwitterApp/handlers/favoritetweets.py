from requests import get
from handlers.base import BaseHandler, TemplateRendering
from utils.TwitterService import TwitterService


class FavoriteTweetsHandler(BaseHandler,TemplateRendering):

    def data_received(self, chunk):
        pass

    def get(self):
        name = self.get_argument('name', '')
        count = self.get_argument('count', 10)

        search_params = {'screen_name': name}

        if type(count) is not int and not count.isdigit():
            self.finish({'error': "Count must be integer"})
        else:
            count = int(count)
            if count not in [10, 20, 30]:
                self.finish({'error': "Count type must be in [10, 20, 30]"})
            else:
                search_params['count'] = count

        search_url = '{}1.1/favorites/list.json'.format(TwitterService().get_base_url())
        search_response = get(search_url, headers=TwitterService().get_request_headers(), params=search_params)
        tweets = search_response.json()

        if search_response.status_code != 200:
            error = "error"
        else:
            error = ""

        template = 'index.html'
        variables = {
            'title': "Favorite Tweets",
            'type': 'favoritetweets',
            'screen_name': name,
            'error': error,
            'tweets': tweets
        }
        content = self.render_template(template, variables)
        self.write(content)