#!/usr/bin/env python3
import asyncio
from aiohttp import web
import subprocess
import os

LINPHONE_CMD = '/usr/bin/linphonec'

async def handle_status(request):
    return web.json_response({'status':'ok','msg':'Linphone wrapper ready'})

async def handle_dial(request):
    data = await request.json()
    number = data.get('number')
    if not number:
        return web.json_response({'error':'no number'}, status=400)
    # simple call via linphonec
    proc = await asyncio.create_subprocess_exec(LINPHONE_CMD, '-c', '/root/linphone-service/linphone.cfg', '-s', number, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return web.json_response({'result':'dialing','pid':proc.pid})

async def init_app():
    app = web.Application()
    app.router.add_get('/status', handle_status)
    app.router.add_post('/dial', handle_dial)
    return app

if __name__=='__main__':
    web.run_app(init_app(), host='127.0.0.1', port=8085)
