import random


def handle_uploaded_file(f):
    name = f.name
    if " " in name:
        name = name.replace(" ", "_")
    with open(name, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
