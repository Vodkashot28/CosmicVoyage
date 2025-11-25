import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendResult } from '@ton/core';

export type PlanetNFTItemConfig = Record<string, never>;

export function planetNFTItemConfigToCell(config: PlanetNFTItemConfig): Cell {
  return beginCell().endCell();
}

export class PlanetNFTItem implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new PlanetNFTItem(address);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, opts: any) {
    await provider.internal(via, opts);
  }
}
