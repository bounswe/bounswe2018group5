import logic
from handlers.base import BaseHandler, TemplateRendering


class LocationTweetsLocationHandler(BaseHandler, TemplateRendering):
    """Handler for searching tweets with location and query."""
    def data_received(self, chunk):
        pass

    def get(self):
        geocode = self.get_argument('geocode', '')
        q = self.get_argument('query', '')
        result_type = self.get_argument('result_type', 'recent')
        count = self.get_argument('count', 25)

        search_params = {
            'q': q,
            'geocode': geocode,
            'result_type': result_type,
            'count': count
        }

        # Gets tweets from logic.
        twitter_response = logic.get_tweets_with_location_and_query(search_params)
        template = 'index.html'
        variables = {
            'title': "Location Tweets",
            'type': 'locationtweets',
            'tweets': twitter_response['tweets'] if twitter_response['response'] else [],
            'error_message': twitter_response['errors'] if not twitter_response['response'] else ""
        }
        content = self.render_template(template, variables)
        self.write(content)
