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


class Annotation(BaseDocument):
    def schema(self):
        pass

    context = StringField(max_length=100)
    IRI = URLField(null=True, max_length=200)
    motivation = StringField(max_length=100)
    creator = URLField(null=True)

    @property
    def annotation_object(self):
        obj = {}
        obj['context'] = self.context
        obj['IRI'] = self.IRI
        obj['motivation'] = self.motivation
        obj['creator'] = self.creator
        obj['target'] = Target.objects.get(annotation=self)
        obj['body'] = Body.objects.get(annotation=self)
        return obj


class Body(BaseDocument):
    def schema(self):
        pass

    annotation = ReferenceField('Annotation')
    IRI = URLField(null=True, max_length=200)
    type = StringField(max_length=50, null=True)
    text = StringField(max_length=200, null=True)

    @property
    def value(self):
        info = {}
        if self.type == 'image':
            info['IRI'] = self.IRI
        elif self.type == 'text':
            info['text'] = self.text
            pass
        return info


class Target(BaseDocument):
    def schema(self):
        pass

    annotation = ReferenceField('Annotation')
    context = URLField(default='http://www.w3.org/ns/anno.jsonld', max_length=100)
    type = StringField(max_length=100, null=True)
    IRI = StringField(null=False, max_length=200)
    x = IntField(default=0)
    y = IntField(default=0)
    start = IntField(default=0)
    end = IntField(default=0)

    @property
    def selector(self):
        info = {}
        if self.type == 'image':
            info['type'] = 'imageSelector'
            info['x'] = self.x
            info['y'] = self.y
        elif self.type == 'text':
            info['type'] = 'textSelector'
            info['start'] = self.start
            info['end'] = self.end
        return info
