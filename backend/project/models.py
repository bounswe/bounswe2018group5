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

    owner = ReferenceField('User')
    freelancer = ReferenceField('User')
    description = StringField(max_length=2000)
    title = StringField(max_length=50)
    budget = FloatField(min_value=0)
    milestones = DictField(null=True)
    attachments = ListField(default=[])
    tags = ListField(ReferenceField('SemanticTag'), default=[])
    status = IntField()  # 0 bidding period, 1 project awarded to a freelancer, 2 project completed, -1 project discarded

    meta = {'collection': 'projects',
            'indexes': [
                {'fields': ['$title', '$description'],
                 'default_language': 'english',
                 'weights': {'title': 10, 'description': 2}
                 }
            ]}


class Bid(BaseDocument):
    def schema(self):
        pass

    project = ReferenceField('Project')
    freelancer = ReferenceField('User')
    note = StringField(max_length=2000, default="")
    offer = FloatField(min_value=0)
    status = IntField(default=0)  # 0 bidding period, 1 won, 2 lost, -1 discarded

    meta = {'collection': 'bids'}


class Milestone(BaseDocument):
    def schema(self):
        pass

    project = ReferenceField('Project')
    detail = StringField(max_length=2000, default="", blank=True)
    name = StringField(max_length=200)
    deadline = DateTimeField()
    status = IntField(default=0)  # -1 discarded 0 ongoing, 1 in review, 2 changes requested, 3 done
    attachments = ListField(default=[])
    is_final = BooleanField(default=False)

    meta = {'collection': 'milestones'}


class SemanticTag(BaseDocument):
    def schema(self):
        pass

    wikidata_id = StringField(unique=True)
    label = StringField()
    description = StringField()
    relations = ListField(default=[])

    meta = {'collection': 'tags'}


class TagRelation(BaseDocument):
    def schema(self):
        pass

    tag1 = ReferenceField(SemanticTag)
    tag2 = ReferenceField(SemanticTag)
    value = FloatField()

    meta = {'collection': 'tag_relations'}
