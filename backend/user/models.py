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
    type = IntField(min_value=0, max_value=1) # 0 for freelancer, 1 for client
    profile_image = StringField()
    gender = IntField(min_value=-1, max_value=1) # -1 male 0 other 1 female
    bio = StringField(max_length=400)

    meta = {'collection': 'users'}


class Rating(BaseDocument):
    def schema(self):
        pass

    project = ReferenceField('Project')
    rated = ReferenceField('User')
    rater = ReferenceField('User')
    comment = StringField(max_length=2000, default="")
    value = FloatField(min_value=0, max_value=5)

    meta = {'collection': 'ratings'}


class Portfolio(BaseDocument):
    def schema(self):
        pass

    title = StringField(required=True)
    description = StringField()
    user = ReferenceField('User', required=True)
    date = DateTimeField()
    project_id = StringField(blank=True, null=True)

    meta = {'collection': 'portfolios'}


class Wallet(BaseDocument):
    def schema(self):
        pass

    user = ReferenceField('User')
    balance = FloatField(min_value=0)

    meta = {'collection': 'wallets'}
