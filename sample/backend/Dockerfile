FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y python-pip

RUN pip install Flask requests

EXPOSE 6000

ADD backend_service.py /backend_service.py

CMD ["python backend_service.py"]

ENTRYPOINT ["/bin/bash", "-c"]
