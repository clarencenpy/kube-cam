FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y python-pip

RUN pip install Flask requests

EXPOSE 5000

ADD frontend_service.py /frontend_service.py

CMD ["python frontend_service.py"]

ENTRYPOINT ["/bin/bash", "-c"]
