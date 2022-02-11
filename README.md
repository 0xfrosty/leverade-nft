# LEVERADE NFT

Smart contracts and related scripts for LEVERADE NFT collections.

# Usage

If you're using Node 17 and face the following issue with any of the commands below:

```
Error HH604: Error running JSON-RPC server: error:0308010C:digital envelope routines::unsupported
```

Please run Node with the option `openssl-legacy-provider`, e.g.

```
npx --node-options=--openssl-legacy-provider hardhat help
```

## Deploy collection

```
$ npx hardhat help deploy
```
```
Usage: hardhat [GLOBAL OPTIONS] deploy --name <STRING> --symbol <STRING> --uri <STRING>

OPTIONS:

  --name        Token name
  --symbol      Token symbol
  --uri         Base metadata URI

deploy: Deploy LeveradeNFT contract for a new collection
```

## Mint tokens

```
$ npx hardhat help mint
```
```
Usage: hardhat [GLOBAL OPTIONS] mint --contract <STRING> --supply <STRING> --to <STRING>

OPTIONS:

  --contract    LeveradeNFT contract address
  --supply      Number of tokens to mint
  --to          Recipient address of minted tokens

mint: Mint tokens from a LeveradeNFT contract
```

## Transfer ownership

The owner of the contract can execute privileged functions on it, e.g. minting a new token. The deployer of the
contract is initially the owner too, but ownership can be transferred using this task. Note that a marketplace like
OpenSea uses the deployer address to determine who can edit their collection page (but collaborators can be added).

```
$ npx hardhat help transfer-ownership
```
```
Usage: hardhat [GLOBAL OPTIONS] transfer-ownership --contract <STRING> --to <STRING>

OPTIONS:

  --contract    LeveradeNFT contract address
  --to          New contract owner

transfer-ownership: Transfer ownership of a LeveradeNFT contract
```

## Update base URI

```
$ npx hardhat help set-uri
```

```
Usage: hardhat [GLOBAL OPTIONS] set-uri --contract <STRING> --uri <STRING>

OPTIONS:

  --contract	LeveradeNFT contract address
  --uri     	New base URI

set-uri: Set base URI to retrieve token metadata
```

# Collections

## RFEN

### Copa Reina 2022

#### Contract addresses

| Polygon Mumbai                             | Polygon Matic |
|--------------------------------------------|---------------|
| 0xF35908524C9273F9C24380D506504388B8789564 |               |

#### Deploy

```
npx --node-options=--openssl-legacy-provider hardhat --network mumbai deploy --name "Copa Reina Waterpolo España 2022" --symbol CRWE22 --uri https://metadata.leverade.network/rfen/copa-reina-22/
```

#### Mint

```
npx --node-options=--openssl-legacy-provider hardhat --network mumbai mint --contract 0xF35908524C9273F9C24380D506504388B8789564 --supply 1 --to 0xfcdA1d6Bed08FCde27Ab01D25987B6521B51aAe3
```

#### Transfer ownership

```
npx --node-options=--openssl-legacy-provider hardhat --network mumbai transfer-ownership --contract 0xF35908524C9273F9C24380D506504388B8789564 --to 0xfcdA1d6Bed08FCde27Ab01D25987B6521B51aAe3
```

# Additional tasks

Try running some of the following Hardhat tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
