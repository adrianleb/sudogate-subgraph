import {RegisterPoolCall} from '../generated/SudoGate/SudoGate';
import {BoughtNFT, SoldNFT, SentNFT, FailedToRug, RugAlarm} from '../generated/SudoRug/SudoRug';
import { Actor, NFTContract, NFT, NFTActivity, RugActivity, SudoPool } from '../generated/schema'


export function handleRegisterPool(call: RegisterPoolCall): void {
  let actor1 = Actor.load(call.from.toHex());

  if (actor1 === null) {
    actor1 = new Actor(call.from.toHex());
    actor1.save();
  };

  let pool = new SudoPool(call.inputs.sudoswapPool.toHexString());
  pool.actor = actor1.id;
  pool.save()
}

export function handleRugFail(event: FailedToRug): void {
  let actor1 = Actor.load(event.params.rugger.toHexString());

  if (actor1 === null) {
    actor1 = new Actor(event.params.rugger.toHexString());
    actor1.save();
  }

  let rug_activity = new RugActivity(event.transaction.hash.toHexString());
  rug_activity.actor = actor1.id;
  rug_activity.timestamp = event.block.timestamp;
  rug_activity.success = false;
  rug_activity.transaction_hash = event.transaction.hash.toHexString();
  rug_activity.save();
}

export function handleRugSuccess(event: RugAlarm): void {
  let actor1 = Actor.load(event.params.rugger.toHexString());

  if (actor1 === null) {
    actor1 = new Actor(event.params.rugger.toHexString());
    actor1.save();
  }

  let rug_activity = new RugActivity(event.transaction.hash.toHexString());
  rug_activity.actor = actor1.id;
  rug_activity.timestamp = event.block.timestamp;
  rug_activity.success = true;
  rug_activity.transaction_hash = event.transaction.hash.toHexString();
  rug_activity.num_tokens = event.params.numTokens;
  rug_activity.value = event.params.ethInWei;
  rug_activity.save();
}


export function handleNFTBuy(event: BoughtNFT): void {
  let contract = NFTContract.load(event.params.nft.toHexString());

  let tokenID = event.params.nft
  .toHexString()
  .concat(":".concat(event.params.tokenID.toHexString()));

  let token = NFT.load(tokenID);

  if (contract === null) {
    contract = new NFTContract(event.params.nft.toHexString());
    contract.save();
  }

  if (token === null) {
    token = new NFT(tokenID);
    token.contract = contract.id;
    token.token_id = event.params.tokenID;
    token.save();
  }

  let activity = new NFTActivity(event.transaction.hash.toHexString());
  activity.activity_type = "buy";
  activity.token = token.id;
  activity.value = event.params.price;
  activity.transaction_hash = event.transaction.hash.toHexString();
  activity.timestamp = event.block.timestamp;
  activity.save();
}

export function handleNFTSend(event: SentNFT): void {
  let tokenID = event.params.nft
  .toHexString()
  .concat(":".concat(event.params.tokenID.toHexString()));

  let actor1 = Actor.load(event.params.recipient.toHexString());
  let contract = NFTContract.load(event.params.nft.toHexString());
  let token = NFT.load(tokenID);


  if (actor1 === null) {
    actor1 = new Actor(event.params.recipient.toHexString());
    actor1.save();
  }

  if (contract === null) {
    contract = new NFTContract(event.params.nft.toHexString());
    contract.save();
  }

  if (token === null) {
    token = new NFT(tokenID);
    token.contract = contract.id;
    token.token_id = event.params.tokenID;
    token.save();
  }

  let activity = new NFTActivity(event.transaction.hash.toHexString());
  activity.activity_type = "send";
  activity.token = token.id;
  activity.recipient = actor1.id;
  activity.transaction_hash = event.transaction.hash.toHexString();
  activity.timestamp = event.block.timestamp;
  activity.save();
}

export function handleNFTSell(event: SoldNFT): void {
  let contract = NFTContract.load(event.params.nft.toHexString());

  let tokenID = event.params.nft
  .toHexString()
  .concat(":".concat(event.params.tokenID.toHexString()));

  let token = NFT.load(tokenID);

  if (contract === null) {
    contract = new NFTContract(event.params.nft.toHexString());
    contract.save();
  }

  if (token === null) {
    token = new NFT(tokenID);
    token.contract = contract.id;
    token.token_id = event.params.tokenID;
    token.save();
  }

  let activity = new NFTActivity(event.transaction.hash.toHexString());
  activity.activity_type = "sell";
  activity.token = token.id;
  activity.value = event.params.price;
  activity.transaction_hash = event.transaction.hash.toHexString();
  activity.timestamp = event.block.timestamp;
  activity.save();
}