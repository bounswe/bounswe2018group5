import logic
from handlers.base import BaseHandler, TemplateRendering


class SearchTweetHandler(BaseHandler, TemplateRendering):
    """Handler for searching tweets with location and query."""
    def data_received(self, chunk):
        pass

    def get(self):
        q = self.get_argument('query', '')
        # Gets tweets from logic.
        twitter_response = logic.search_tweets(q)
        template = 'index.html'
        variables = {
            'title': "Search Tweets",
            'type': 'searchtweets',
            'tweets': twitter_response['tweets'] if twitter_response['response'] else [],
            'error_message': twitter_response['errors'] if not twitter_response['response'] else ""
        }
        content = self.render_template(template, variables)
        self.write(content)
