#!/usr/bin/env python3
import sys, requests, datetime

if len(sys.argv)<3:
    print('Usage: weather.py <lat> <lon> [hours=24]')
    sys.exit(1)
lat=sys.argv[1]
lon=sys.argv[2]
hours=int(sys.argv[3]) if len(sys.argv)>3 else 24
url=f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m,precipitation,weathercode,windspeed_10m&timezone=auto"
resp=requests.get(url,timeout=10)
resp.raise_for_status()
data=resp.json()
now=datetime.datetime.now()
print(f"Source: Open-Meteo (open-meteo.com) - fetched at {now.isoformat()}")
# Print current hour
hourly=data.get('hourly',{})
times=hourly.get('time',[])
temps=hourly.get('temperature_2m',[])
prec=hourly.get('precipitation',[])
wind=hourly.get('windspeed_10m',[])
for i,t in enumerate(times[:hours]):
    print(f"{t}: temp={temps[i]}°C precip={prec[i]}mm wind={wind[i]} km/h")
