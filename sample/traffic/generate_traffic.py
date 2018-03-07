from locust import HttpLocust, TaskSet


def index(l):
    l.client.get('/')


class GenerateTraffic(TaskSet):
    tasks = { index: 2 }


    def start(self):
        index(self)


class WebsiteUser(HttpLocust):
    task_set = GenerateTraffic
    min_wait = 5000
    max_wait = 9000
