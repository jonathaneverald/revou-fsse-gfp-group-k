from flask import Flask
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from config.config import Config
from db import db
from models.users import UserModel
from sqlalchemy.orm import sessionmaker
from connector.mysql_connector import connection
from controllers.auth_controller import auth_blueprint, revoked_tokens
from controllers.location_controller import location_blueprint
from controllers.category_controller import category_blueprint
from controllers.seller_controller import seller_blueprint

from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"
    jwt = JWTManager(app)

    CORS(
        app,
        origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        supports_credentials=True,
        methods=["*"],
        resources={r"/*": {"origins": "*"}},
        allow_headers=["Content-Type", "Authorization", "XCSRF-Token"],
    )

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return jti in revoked_tokens

    db.init_app(app)
    Migrate(app, db)

    init_login_manager(app)
    register_blueprints(app)

    with app.app_context():
        db.create_all()
    return app


def register_blueprints(app):
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(location_blueprint)
    app.register_blueprint(category_blueprint)
    app.register_blueprint(seller_blueprint)


def init_login_manager(app):
    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        Session = sessionmaker(connection)
        s = Session()
        try:
            return s.query(UserModel).get(int(user_id))
        finally:
            s.close()


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
