from locust import HttpLocust, TaskSet


def index(l):
    l.client.get('/')


def error_403(l):
        resp = l.client.post('/')


def generate_interal_traffic(l):
    l.client.get('/number')


class GenerateTraffic(TaskSet):
    tasks = { error_403 : 2, index: 5, generate_interal_traffic: 5}


    def start(self):
        index(self)
        error_403(self)
        generate_interal_traffic(self)


class WebsiteUser(HttpLocust):
    task_set = GenerateTraffic
    min_wait = 5000
    max_wait = 9000
