from mongoengine import *
from datetime import datetime


class BaseDocument(Document):
    meta = {
        'abstract': True
    }

    # last updated timestamp
    updated_at = DateTimeField(default=datetime.now)

    # timestamp of when entry was created
    created_at = DateTimeField(default=datetime.now)

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = datetime.now()
        self.updated_at = datetime.now()
        return super(BaseDocument, self).save(*args, **kwargs)

    def to_dict(self):
        return self.schema().dump(self).data

    def schema(self):
        raise NotImplementedError


class User(BaseDocument):
    def schema(self):
        pass
    full_name = StringField()
    username = StringField(unique=True)
    email = EmailField(unique=True)
    password = StringField()
    type = BinaryField() #0 for freelancer, 1 for client
    profile_image = StringField()
    gender = LongField(min_value=-1, max_value=1)
    bio = StringField(max_length=400)

    meta = {'collection': 'users'}
