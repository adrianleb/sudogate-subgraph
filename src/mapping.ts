import {RegisterPoolCall} from '../generated/SudoGate/SudoGate';
import { Actor, NFTContract, SudoPool } from '../generated/schema'


export function handleRegisterPool(call: RegisterPoolCall): void {
  // let caller = call.transaction.from;
  // let actor = Actor.load(caller.toHexString());

  // if (!actor) {
  //   actor = new Actor(caller.toHexString());
  // }

  let pool = new SudoPool(call.inputs.sudoswapPool.toHexString())
  pool.save()
}
