FROM python:3
# EXPOSE 8000
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ADD . /code
WORKDIR /code
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install --upgrade pip
COPY . .
CMD [ "python", "backend/manage.py", "runserver" ]