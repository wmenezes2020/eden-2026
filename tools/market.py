#!/usr/bin/env python3
import sys
import requests

def quote_yahoo(ticker):
    url=f'https://query1.finance.yahoo.com/v7/finance/quote?symbols={ticker}'
    r=requests.get(url,timeout=10)
    r.raise_for_status()
    j=r.json()
    q=j.get('quoteResponse',{}).get('result',[])
    if not q:
        return None
    return q[0]

if len(sys.argv)<2:
    print('Usage: market.py <TICKER> (e.g. PETR4.SA or AAPL)')
    sys.exit(1)

ticker=sys.argv[1]
q=quote_yahoo(ticker)
if not q:
    print('Ticker not found')
    sys.exit(1)
print(f"symbol: {q.get('symbol')}
shortName: {q.get('shortName')}
price: {q.get('regularMarketPrice')}
change: {q.get('regularMarketChange')}
changePercent: {q.get('regularMarketChangePercent')}
open: {q.get('regularMarketOpen')}
previousClose: {q.get('regularMarketPreviousClose')}
marketState: {q.get('marketState')}")
