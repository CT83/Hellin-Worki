import requests
from faker import Faker

fake = Faker()


def test_create_del_room():
    r_name = fake.user_name()
    username = fake.user_name()
    data = {'identity': username,
            'room': r_name}
    print(data)
    url = "http://localhost:5000/" + "token-room"

    r = requests.post(url=url, json=data)
    assert r.status_code == 200
    assert r.json()['identity'] == username
    assert len(r.json()['token']) > 10

    data = {'identity': username,
            'room': r_name}
    url = "http://localhost:5000/" + "delete-room"

    r = requests.post(url=url, json=data)
    assert r.status_code == 200


def test_delete_all_room():
    url = "http://localhost:5000/" + "delete-all-rooms"
    r = requests.post(url=url)
    assert r.status_code == 200
    assert r.json()['msg'] == "All Rooms were deleted!"
