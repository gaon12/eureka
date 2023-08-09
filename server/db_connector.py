from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Car(db.Model):
    __table__ = db.Model.metadata.tables['car']
