from flask import Flask
from dotenv import load_dotenv
from connector.mysql_connector import connection
from config.config import Config
from db import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    return app
