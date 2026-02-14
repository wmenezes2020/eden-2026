#!/bin/bash
CFG=/root/linphone-service/linphone.cfg
if [ ! -f "$CFG" ]; then
  echo "[proxy]
reg=0
" > "$CFG"
fi
# Usage: linphone_wrapper.sh dial <number>
cmd="$1"
if [ "$cmd" = "dial" ]; then
  shift
  /usr/bin/linphonec -c "$CFG" -s "$1"
fi
