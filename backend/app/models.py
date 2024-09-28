from . import db


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.name}>'


class Flood_Alert(db.Model):
    _tablename_ = "flood_alert"
    id = db.Column(db.Integer, primary_key=True)
    event = db.Column(db.String(100), nullable=False)
    area_desc = db.Column(db.String(255), nullable=False)
    severity = db.Column(db.String(50), nullable=False)
    certainty = db.Column(db.String(50), nullable=False)
    urgency = db.Column(db.String(50), nullable=False)
    headline = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    coordinates = db.Column(db.Text, nullable=False)
    effective = db.Column(db.DateTime, nullable=False)
    expires = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"<Alert {self.event}>"
