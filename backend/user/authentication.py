import jwt
from datetime import datetime

myMap = {"abc": 1}


def generate_token(user):
    token = jwt.encode({'id': str(user.id), 'role': user.type}, 'top_secret', algorithm='HS256')
    myMap[token] = int(datetime.now().timestamp())
    return token


def is_authenticated(token):
    previous_req = myMap[token] if token in myMap else 0
    if (int(datetime.now().timestamp()) - previous_req) > 600:
        if token in myMap:
            del myMap[token]
        return False
    myMap[token] = int(datetime.now().timestamp())
    return True
