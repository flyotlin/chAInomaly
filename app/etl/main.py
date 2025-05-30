import requests
import pandas as pd


URL = 'https://celo-alfajores.blockscout.com/api/v2/transactions?filter=validated'


def main():
    res = requests.get(URL).json()
    df = pd.DataFrame(res['items'])
    print(df.head())


if __name__ == "__main__":
    main()
