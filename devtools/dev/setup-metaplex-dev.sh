# echo "[INFO] Cleaning older cache folder for metaplex"
rm -rf ./.cache/devnet-temp
echo "[INFO] Uploading all resources"
ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts upload ./nfts-sources --env devnet --keypair ~/.config/solana/candyfactory-devnet.json
echo "[INFO] Creating candy machine"
ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts create_candy_machine --env devnet --keypair ~/.config/solana/candyfactory-devnet.json --price 0.3 > ./logs/dev/candy-machine-log.txt
echo "[INFO] Setting minting start date (goLiveDate)"
ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts update_candy_machine -d "26 Oct 2021 23:32:00 GMT" --env devnet --keypair ~/.config/solana/candyfactory-devnet.json > ./logs/dev/candy-machine-start-date.txt
