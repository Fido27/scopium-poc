import json
import random

import pandas as pd

# from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

df = pd.read_csv("./api/data.csv")


def start():
    started = "FastAPI is Success"
    print(started)


@asynccontextmanager
async def lifespan(app: FastAPI):
    start()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"Hello": "World"}


months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

@app.get("/pai/")
def logic(amount, sliderval):
    amount = int(amount)
    sliderval = int(sliderval)

    aPercent = sliderval
    amountA = (amount * aPercent) / 100
    amountB = amount - amountA

    row_index = random.randrange(1, len(df) - 249)
    
    cpA = df.iloc[row_index]["A"]
    spA = df.iloc[row_index + 248]["A"]
    gainsA = amountA * (spA / cpA)

    cpB = df.iloc[row_index]["B"]
    spB = df.iloc[row_index + 248]["B"]
    gainsB = amountB * (spB / cpB)

    gains = gainsA + gainsB
    gains_percent = (gains / amount) * 100

    return json.dumps(
        {
            "date": df.iloc[row_index]["Date"],
            "cpA": cpA,
            "spA": spA,
            "cpB": cpB,
            "spB": spB,
            "gains": gains,
            "gains_percent": gains_percent,
        }
    )
