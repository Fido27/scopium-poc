#!/usr/bin/env zsh

# To directly run the servers
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
uvicorn api.app:app &
npm run dev
#pm run build
#pm run start
