import logic
from handlers.base import BaseHandler, TemplateRendering


class LocationTweetsLocationHandler(BaseHandler, TemplateRendering):
    """Handler for searching tweets with location and query."""
    def data_received(self, chunk):
        pass

    def get(self):
        geocode = self.get_argument('geocode', '')
        print(geocode)
        q = self.get_argument('query', '')
        result_type = self.get_argument('result_type', 'recent')
        count = self.get_argument('count', 25)

        # Prepares the request for logic function. Gives a message for any error.
        search_params = {'q': q}
        if geocode == '' or len(geocode.split(',')) < 3 or 'km' not in geocode.split(',')[2]:
            self.finish({'error': "GeoCode must include three values lat/long/distance. Distance must include km."})
        else:
            search_params['geocode'] = geocode

        try:
            float(geocode.split(',')[0])
            float(geocode.split(',')[1])
        except ValueError:
            self.finish({'error': "GeoCode must include three values lat/long/distance. Distance must include km."})

        if result_type not in ['popular', 'recent', 'mixed']:
            self.finish({'error': "Result type must be in ['popular', 'recent', 'mixed']"})
        else:
            search_params['result_type'] = result_type

        if type(count) is not int and not count.isdigit():
            self.finish({'error': "Count must be integer"})
        else:
            count = int(count)
            if count not in [25, 50, 100]:
                self.finish({'error': "Count type must be in [25, 50, 100]"})
            else:
                search_params['count'] = count

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
