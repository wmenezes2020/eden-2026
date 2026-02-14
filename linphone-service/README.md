Linphone Service

This directory contains the SIP client wrapper and service scaffolding.

Files:
- service.py: aiohttp-based control API to register, dial, answer, hangup.
- linphone_wrapper.sh: helper to run linphonec commands.
- linphone.service: systemd unit to run the service.

Status: scaffolding created. Service not yet started. Provide SIP credentials to register.
