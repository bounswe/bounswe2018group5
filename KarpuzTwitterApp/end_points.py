import tornado.web

from settings import settings
from handlers.main import MainHandler
from handlers.usertimeline import UserTimelineHandler
from handlers.locationtweets import LocationTweetsLocationHandler
from handlers.favoritetweets import FavoriteTweetsHandler
from handlers.commonfollowings import CommonFollowingsHandler
from handlers.commonfollowers import CommonFollowersHandler
from handlers.searchusers import SearchUsersHandler
from handlers.searchtweet import SearchTweetHandler

end_point_list = [
    # MAIN
    (r"/", MainHandler),
    (r"/location-tweets", LocationTweetsLocationHandler),
    (r"/favorite-tweets", FavoriteTweetsHandler),
    (r"/user-timeline", UserTimelineHandler),
    (r"/common-followings", CommonFollowingsHandler),
    (r"/common-followers", CommonFollowersHandler),
    (r"/search-users", SearchUsersHandler),
    (r"/search-tweets", SearchTweetHandler),

    (r"/(.*)", tornado.web.StaticFileHandler, {'path': settings['static_path']}),
]
