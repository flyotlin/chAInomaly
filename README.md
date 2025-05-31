# Chain Anomaly Detector

Detect anomaly on specified chain

訓練一個 AI 模型，偵測是否有異常行為。

自己弄一個 ui 在 blockscout api 的基礎上，加上各種 ai 輔助功能，之後甚至能將這些功能移植到 blockscout 實際的 ui 上。

- ai 統整
- ai 說明該 transaction
- 視覺化轉帳交易關係
- 透過 machine learning 進行簡單的 clustering

## Architecture

## Features

1. Select a chain
2. Select an address

For a given address on a chain

- Analyze
- Show all transactions
- A graph showing the from/to relations
- A chat with llm analyzing the transactions directly (gemini api)


more: 0xacD03D601e5bB1B275Bb94076fF46ED9D753435A
less: 0x5505B741eD5B0fF10748b9f31dC29eb89e305715
