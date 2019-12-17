import csv, requests
from urllib.parse import quote_plus

places = {}
with open('places.csv', 'r') as f:
    reader = csv.reader(f, delimiter=',')
    next(reader)
    for row in reader:
        if ';' in row[4]:
            row[4] = row[4].replace(';', '')
        if '\n' in row[4]:
            row[4] = row[4].replace('\n', ' ')
        if row[4] == 'test':
            continue
        places[(row[2])] = row[4]

apikey = ''

URL_BASE = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?'\
    'inputtype=textquery'\
    '&fields=formatted_address,name,geometry'\
    '&key={}'.format(apikey)

i = 0
geocoded = []
with open('geocoded_address.csv', 'w') as f:
    csvwriter = csv.writer(f, delimiter=',')
    for name, address in places.items():
        print(address)
        r=requests.get(URL_BASE, params={'input':address})
        data = r.json().get('candidates')
        if data:
            data = data[0]
            new_address = data.get('formatted_address')
            geometry = data.get('geometry').get('location')
            new_name = data.get('name')
            csvwriter.writerow([new_address, address, name, new_name, geometry])
        else:
            csvwriter.writerow(['BRAK', address, name, 'BRAK', 'BRAK'])

