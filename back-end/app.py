from flask import Flask
from flask_migrate import Migrate  
from config.config import Config
from db import db
from models.users import UserModel
from sqlalchemy.orm import sessionmaker
from flask_login import LoginManager 
from connector.mysql_connector import connection 

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    login_manager = LoginManager()
    Migrate(app, db)
    
    @login_manager.user_loader
    def load_user(user_id):
        Session = sessionmaker(connection)
        s = Session()
        return s.query(UserModel).get(int(user_id))
    
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)