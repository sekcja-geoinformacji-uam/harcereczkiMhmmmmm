import csv, requests
from urllib.parse import quote_plus

places = {}
with open('data/places.csv', 'r') as f:
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

apikey = 'AIzaSyDSriI6SN8bT5iRzF-o59DgOue-Tf9_J00'

URL_BASE = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?'\
    'inputtype=textquery'\
    '&fields=formatted_address,name,geometry'\
    '&key={}'.format(apikey)

#  i = 0
geocoded = []
with open('data/geocoded_address.csv', 'w') as f:
    csvwriter = csv.writer(f, delimiter=',')
    csvwriter.writerow(['stara nazwa', 'stary adres', 'nowy adres', 'nowa nazwa', 'x', 'y'])
    for name, address in places.items():
        print(address)
        r = requests.get(URL_BASE, params={'input':address})
        data = r.json().get('candidates')
        if data:
            data = data[0]
            new_address = data.get('formatted_address', 'BRAK')
            geometry = data.get('geometry').get('location')
            if geometry:
              x = geometry.get('lat')
              y = geometry.get('lng')
            new_name = data.get('name', 'BRAK')
            csvwriter.writerow([new_address, address, name, new_name, geometry])
            continue
        r=requests.get(URL_BASE, params={'input':name})
        data = r.json().get('candidates')
        if data: 
          data = data[0]
          new_address = data.get('formatted_address')
          geometry = data.get('geometry').get('location')
          if geometry:
              x = geometry.get('lat')
              y = geometry.get('lng')
          new_name = data.get('name', 'BRAK')
          csvwriter.writerow([new_address, address, name, new_name, geometry])
          continue
        csvwriter.writerow(['BRAK', address, name, 'BRAK', 'BRAK'])
