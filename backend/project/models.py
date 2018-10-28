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


class Project(BaseDocument):
    def schema(self):
        pass

    owner_id = StringField(max_length=100)
    freelancer_id = StringField(max_length=100)
    description = StringField(max_length=400)
    title = StringField(max_length=50)
    budget = FloatField(min_value=0)
    project_deadline = DateTimeField()
    status = IntField()  # 0 bidding period, 1 project awarded to a freelancer, 2 project completed, -1 project discarded

    meta = {'collection': 'projects'}
