import json
import os

from faker import Factory
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_redis import FlaskRedis
from flask_socketio import SocketIO, emit
from twilio.base.exceptions import TwilioRestException
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant
from twilio.rest import Client

app = Flask(__name__)
fake = Factory.create()
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
app.config['REDIS_URL'] = os.getenv('REDISTOGO_URL', 'redis://localhost:6379')
redis_client = FlaskRedis(app)

# Substitute your Twilio AccountSid and ApiKey details
account_sid = os.environ['TWILIO_ACCOUNT_SID']
api_key = os.environ['TWILIO_API_KEY']
api_secret = os.environ['TWILIO_API_SECRET']
auth_token = os.environ['TWILIO_AUTH_TOKEN']
master_token = AccessToken(account_sid, api_key, api_secret)
master_client = Client(account_sid, auth_token)


@app.route('/')
def index():
    return app.send_static_file("ui/quickstart/public/index.html")


@app.route('/token-room', methods=['POST'])
def token_room():
    identity = request.get_json()['identity']
    room_name = request.get_json()['room']

    token = AccessToken(account_sid, api_key, api_secret)
    client = Client(account_sid, auth_token)

    try:
        room = client.video.rooms.create(
            enable_turn=True,
            type='peer-to-peer',
            unique_name=room_name
        )
    except TwilioRestException as e:
        room = client.video.rooms.list(unique_name=room_name, limit=1)[0]
        if not room:
            raise AttributeError("Room Could not be created!")

    token.identity = identity
    grant = VideoGrant(room=room.unique_name)
    token.add_grant(grant)
    token_s = str(token.to_jwt().decode("utf-8"))
    return jsonify({'identity': identity, 'token': token_s})


@app.route('/delete-room', methods=['POST'])
def delete_room():
    room_name = request.get_json()['room']
    client = Client(account_sid, auth_token)
    room = client.video.rooms(room_name).update(status='completed')
    return jsonify({
        'msg': "{} was deleted!".format(room.unique_name)
    })


@app.route('/delete-all-rooms', methods=['POST'])
def delete_all_rooms():
    rooms = master_client.video.rooms.list(status='in-progress')
    for record in rooms:
        master_client.video.rooms(record.sid).update(status='completed')
    return jsonify({
        'msg': "All Rooms were deleted!"
    })


@socketio.on('register')
def test_message(message):
    room_name = message['data']['roomName']
    user = message['data']['username']
    rooms_users_dict = json.loads(redis_client.get('rooms_users') or "{}")
    users_room = rooms_users_dict.get(room_name, [])
    users_room.append(user)
    rooms_users_dict[room_name] = list(set(users_room))
    redis_client.set('rooms_users', json.dumps(rooms_users_dict))
    bef = rooms_users_dict[room_name]
    emit('user-registered', {'users': bef,}, broadcast=True)


@socketio.on('call')
def test_message(message):
    print("incoming calls")
    emit('calls', {'data': message['data']}, broadcast=True)


@socketio.on('my broadcast event')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)


@socketio.on('connect', )
def test_connect():
    pass


@socketio.on('disconnect')
def test_disconnect():
    pass


if __name__ == '__main__':
    socketio.run(debug=True, port=5000, app=app)
