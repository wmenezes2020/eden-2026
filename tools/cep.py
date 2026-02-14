#!/usr/bin/env python3
import sys, requests
if len(sys.argv)<2:
    print('Usage: cep.py <cep>')
    sys.exit(1)
cep=sys.argv[1].replace('-','')
url=f'https://viacep.com.br/ws/{cep}/json/'
resp=requests.get(url,timeout=10)
resp.raise_for_status()
data=resp.json()
if 'erro' in data:
    print('CEP not found')
else:
    print(f"logradouro: {data.get('logradouro')}
bairro: {data.get('bairro')}
localidade: {data.get('localidade')}
uf: {data.get('uf')}
cep: {data.get('cep')}")
