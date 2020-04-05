import os

from faker import Factory
from flask import Flask, jsonify
from flask_cors import CORS
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant

app = Flask(__name__)
fake = Factory.create()
CORS(app)


@app.route('/')
def index():
    return app.send_static_file("ui/quickstart/public/index.html")


@app.route('/token')
def token():
    # Set the Identity of this token

    # Substitute your Twilio AccountSid and ApiKey details
    account_sid = os.environ['TWILIO_ACCOUNT_SID']
    api_key = os.environ['TWILIO_API_KEY']
    api_secret = os.environ['TWILIO_API_SECRET']

    # Create an Access Token
    token = AccessToken(account_sid, api_key, api_secret)

    # Set the Identity of this token
    token.identity = fake.user_name()

    # Grant access to Video
    grant = VideoGrant(room='cool room')
    token.add_grant(grant)
    print(token.to_jwt().decode("utf-8"))
    return jsonify({'identity': token.identity, 'token': token.to_jwt().decode("utf-8")})


if __name__ == '__main__':
    app.run(debug=True)
