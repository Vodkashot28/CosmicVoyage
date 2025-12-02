import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type Transfer = {
    $$type: 'Transfer';
    queryId: bigint;
    newOwner: Address;
    responseDestination: Address;
    customPayload: Cell | null;
    forwardAmount: bigint;
    forwardPayload: Cell;
}

export function storeTransfer(src: Transfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(609864198, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.newOwner);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
        const b_1 = new Builder();
        b_1.storeInt(src.forwardAmount, 257);
        b_1.storeRef(src.forwardPayload);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 609864198) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadIntBig(257);
    const _newOwner = sc_0.loadAddress();
    const _responseDestination = sc_0.loadAddress();
    const _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    const sc_1 = sc_0.loadRef().beginParse();
    const _forwardAmount = sc_1.loadIntBig(257);
    const _forwardPayload = sc_1.loadRef();
    return { $$type: 'Transfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

export function loadTupleTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    const _responseDestination = source.readAddress();
    const _customPayload = source.readCellOpt();
    const _forwardAmount = source.readBigNumber();
    const _forwardPayload = source.readCell();
    return { $$type: 'Transfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

export function loadGetterTupleTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    const _responseDestination = source.readAddress();
    const _customPayload = source.readCellOpt();
    const _forwardAmount = source.readBigNumber();
    const _forwardPayload = source.readCell();
    return { $$type: 'Transfer' as const, queryId: _queryId, newOwner: _newOwner, responseDestination: _responseDestination, customPayload: _customPayload, forwardAmount: _forwardAmount, forwardPayload: _forwardPayload };
}

export function storeTupleTransfer(source: Transfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    builder.writeNumber(source.forwardAmount);
    builder.writeCell(source.forwardPayload);
    return builder.build();
}

export function dictValueParserTransfer(): DictionaryValue<Transfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTransfer(src.loadRef().beginParse());
        }
    }
}

export type GetStaticData = {
    $$type: 'GetStaticData';
    queryId: bigint;
}

export function storeGetStaticData(src: GetStaticData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3057312375, 32);
        b_0.storeInt(src.queryId, 257);
    };
}

export function loadGetStaticData(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3057312375) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadIntBig(257);
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

export function loadTupleGetStaticData(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

export function loadGetterTupleGetStaticData(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, queryId: _queryId };
}

export function storeTupleGetStaticData(source: GetStaticData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadGetStaticData(src.loadRef().beginParse());
        }
    }
}

export type NFTData = {
    $$type: 'NFTData';
    planetName: string;
    rarity: string;
    itemIndex: bigint;
    glowColor: string;
    imageURI: string;
}

export function storeNFTData(src: NFTData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeStringRefTail(src.planetName);
        b_0.storeStringRefTail(src.rarity);
        b_0.storeInt(src.itemIndex, 257);
        const b_1 = new Builder();
        b_1.storeStringRefTail(src.glowColor);
        b_1.storeStringRefTail(src.imageURI);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadNFTData(slice: Slice) {
    const sc_0 = slice;
    const _planetName = sc_0.loadStringRefTail();
    const _rarity = sc_0.loadStringRefTail();
    const _itemIndex = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _glowColor = sc_1.loadStringRefTail();
    const _imageURI = sc_1.loadStringRefTail();
    return { $$type: 'NFTData' as const, planetName: _planetName, rarity: _rarity, itemIndex: _itemIndex, glowColor: _glowColor, imageURI: _imageURI };
}

export function loadTupleNFTData(source: TupleReader) {
    const _planetName = source.readString();
    const _rarity = source.readString();
    const _itemIndex = source.readBigNumber();
    const _glowColor = source.readString();
    const _imageURI = source.readString();
    return { $$type: 'NFTData' as const, planetName: _planetName, rarity: _rarity, itemIndex: _itemIndex, glowColor: _glowColor, imageURI: _imageURI };
}

export function loadGetterTupleNFTData(source: TupleReader) {
    const _planetName = source.readString();
    const _rarity = source.readString();
    const _itemIndex = source.readBigNumber();
    const _glowColor = source.readString();
    const _imageURI = source.readString();
    return { $$type: 'NFTData' as const, planetName: _planetName, rarity: _rarity, itemIndex: _itemIndex, glowColor: _glowColor, imageURI: _imageURI };
}

export function storeTupleNFTData(source: NFTData) {
    const builder = new TupleBuilder();
    builder.writeString(source.planetName);
    builder.writeString(source.rarity);
    builder.writeNumber(source.itemIndex);
    builder.writeString(source.glowColor);
    builder.writeString(source.imageURI);
    return builder.build();
}

export function dictValueParserNFTData(): DictionaryValue<NFTData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNFTData(src)).endCell());
        },
        parse: (src) => {
            return loadNFTData(src.loadRef().beginParse());
        }
    }
}

export type PassiveIncomeData = {
    $$type: 'PassiveIncomeData';
    earnsPassiveIncome: boolean;
    passiveIncomeRate: bigint;
    discoveredAt: bigint;
}

export function storePassiveIncomeData(src: PassiveIncomeData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.earnsPassiveIncome);
        b_0.storeInt(src.passiveIncomeRate, 257);
        b_0.storeInt(src.discoveredAt, 257);
    };
}

export function loadPassiveIncomeData(slice: Slice) {
    const sc_0 = slice;
    const _earnsPassiveIncome = sc_0.loadBit();
    const _passiveIncomeRate = sc_0.loadIntBig(257);
    const _discoveredAt = sc_0.loadIntBig(257);
    return { $$type: 'PassiveIncomeData' as const, earnsPassiveIncome: _earnsPassiveIncome, passiveIncomeRate: _passiveIncomeRate, discoveredAt: _discoveredAt };
}

export function loadTuplePassiveIncomeData(source: TupleReader) {
    const _earnsPassiveIncome = source.readBoolean();
    const _passiveIncomeRate = source.readBigNumber();
    const _discoveredAt = source.readBigNumber();
    return { $$type: 'PassiveIncomeData' as const, earnsPassiveIncome: _earnsPassiveIncome, passiveIncomeRate: _passiveIncomeRate, discoveredAt: _discoveredAt };
}

export function loadGetterTuplePassiveIncomeData(source: TupleReader) {
    const _earnsPassiveIncome = source.readBoolean();
    const _passiveIncomeRate = source.readBigNumber();
    const _discoveredAt = source.readBigNumber();
    return { $$type: 'PassiveIncomeData' as const, earnsPassiveIncome: _earnsPassiveIncome, passiveIncomeRate: _passiveIncomeRate, discoveredAt: _discoveredAt };
}

export function storeTuplePassiveIncomeData(source: PassiveIncomeData) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.earnsPassiveIncome);
    builder.writeNumber(source.passiveIncomeRate);
    builder.writeNumber(source.discoveredAt);
    return builder.build();
}

export function dictValueParserPassiveIncomeData(): DictionaryValue<PassiveIncomeData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePassiveIncomeData(src)).endCell());
        },
        parse: (src) => {
            return loadPassiveIncomeData(src.loadRef().beginParse());
        }
    }
}

export type PlanetNFTItem$Data = {
    $$type: 'PlanetNFTItem$Data';
    itemIndex: bigint;
    collectionAddress: Address;
    owner: Address;
    planetName: string;
    discoveryOrder: bigint;
    discoveredAt: bigint;
    rarity: string;
    glowColor: string;
    earnsPassiveIncome: boolean;
    passiveIncomeRate: bigint;
    imageURI: string;
}

export function storePlanetNFTItem$Data(src: PlanetNFTItem$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.itemIndex, 257);
        b_0.storeAddress(src.collectionAddress);
        b_0.storeAddress(src.owner);
        b_0.storeStringRefTail(src.planetName);
        const b_1 = new Builder();
        b_1.storeInt(src.discoveryOrder, 257);
        b_1.storeInt(src.discoveredAt, 257);
        b_1.storeStringRefTail(src.rarity);
        b_1.storeStringRefTail(src.glowColor);
        b_1.storeBit(src.earnsPassiveIncome);
        b_1.storeInt(src.passiveIncomeRate, 257);
        b_1.storeStringRefTail(src.imageURI);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadPlanetNFTItem$Data(slice: Slice) {
    const sc_0 = slice;
    const _itemIndex = sc_0.loadIntBig(257);
    const _collectionAddress = sc_0.loadAddress();
    const _owner = sc_0.loadAddress();
    const _planetName = sc_0.loadStringRefTail();
    const sc_1 = sc_0.loadRef().beginParse();
    const _discoveryOrder = sc_1.loadIntBig(257);
    const _discoveredAt = sc_1.loadIntBig(257);
    const _rarity = sc_1.loadStringRefTail();
    const _glowColor = sc_1.loadStringRefTail();
    const _earnsPassiveIncome = sc_1.loadBit();
    const _passiveIncomeRate = sc_1.loadIntBig(257);
    const _imageURI = sc_1.loadStringRefTail();
    return { $$type: 'PlanetNFTItem$Data' as const, itemIndex: _itemIndex, collectionAddress: _collectionAddress, owner: _owner, planetName: _planetName, discoveryOrder: _discoveryOrder, discoveredAt: _discoveredAt, rarity: _rarity, glowColor: _glowColor, earnsPassiveIncome: _earnsPassiveIncome, passiveIncomeRate: _passiveIncomeRate, imageURI: _imageURI };
}

export function loadTuplePlanetNFTItem$Data(source: TupleReader) {
    const _itemIndex = source.readBigNumber();
    const _collectionAddress = source.readAddress();
    const _owner = source.readAddress();
    const _planetName = source.readString();
    const _discoveryOrder = source.readBigNumber();
    const _discoveredAt = source.readBigNumber();
    const _rarity = source.readString();
    const _glowColor = source.readString();
    const _earnsPassiveIncome = source.readBoolean();
    const _passiveIncomeRate = source.readBigNumber();
    const _imageURI = source.readString();
    return { $$type: 'PlanetNFTItem$Data' as const, itemIndex: _itemIndex, collectionAddress: _collectionAddress, owner: _owner, planetName: _planetName, discoveryOrder: _discoveryOrder, discoveredAt: _discoveredAt, rarity: _rarity, glowColor: _glowColor, earnsPassiveIncome: _earnsPassiveIncome, passiveIncomeRate: _passiveIncomeRate, imageURI: _imageURI };
}

export function loadGetterTuplePlanetNFTItem$Data(source: TupleReader) {
    const _itemIndex = source.readBigNumber();
    const _collectionAddress = source.readAddress();
    const _owner = source.readAddress();
    const _planetName = source.readString();
    const _discoveryOrder = source.readBigNumber();
    const _discoveredAt = source.readBigNumber();
    const _rarity = source.readString();
    const _glowColor = source.readString();
    const _earnsPassiveIncome = source.readBoolean();
    const _passiveIncomeRate = source.readBigNumber();
    const _imageURI = source.readString();
    return { $$type: 'PlanetNFTItem$Data' as const, itemIndex: _itemIndex, collectionAddress: _collectionAddress, owner: _owner, planetName: _planetName, discoveryOrder: _discoveryOrder, discoveredAt: _discoveredAt, rarity: _rarity, glowColor: _glowColor, earnsPassiveIncome: _earnsPassiveIncome, passiveIncomeRate: _passiveIncomeRate, imageURI: _imageURI };
}

export function storeTuplePlanetNFTItem$Data(source: PlanetNFTItem$Data) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.itemIndex);
    builder.writeAddress(source.collectionAddress);
    builder.writeAddress(source.owner);
    builder.writeString(source.planetName);
    builder.writeNumber(source.discoveryOrder);
    builder.writeNumber(source.discoveredAt);
    builder.writeString(source.rarity);
    builder.writeString(source.glowColor);
    builder.writeBoolean(source.earnsPassiveIncome);
    builder.writeNumber(source.passiveIncomeRate);
    builder.writeString(source.imageURI);
    return builder.build();
}

export function dictValueParserPlanetNFTItem$Data(): DictionaryValue<PlanetNFTItem$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePlanetNFTItem$Data(src)).endCell());
        },
        parse: (src) => {
            return loadPlanetNFTItem$Data(src.loadRef().beginParse());
        }
    }
}

 type PlanetNFTItem_init_args = {
    $$type: 'PlanetNFTItem_init_args';
    itemIndex: bigint;
    collectionAddress: Address;
    owner: Address;
    planetName: string;
    discoveryOrder: bigint;
    glowColor: string;
}

function initPlanetNFTItem_init_args(src: PlanetNFTItem_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.itemIndex, 257);
        b_0.storeAddress(src.collectionAddress);
        b_0.storeAddress(src.owner);
        b_0.storeStringRefTail(src.planetName);
        const b_1 = new Builder();
        b_1.storeInt(src.discoveryOrder, 257);
        b_1.storeStringRefTail(src.glowColor);
        b_0.storeRef(b_1.endCell());
    };
}

async function PlanetNFTItem_init(itemIndex: bigint, collectionAddress: Address, owner: Address, planetName: string, discoveryOrder: bigint, glowColor: string) {
    const __code = Cell.fromHex('b5ee9c72410209010002bb000142ff00208e983001d072d721d200d200fa4021103450666f04f86102f862e1f2c80b0102feed44d0d200018e36810101d700fa40fa40d401d001d401d0810101d700810101d700d401d001d401d001d200810101d700d430d0107b107a107910786c1b8ea4810101d700fa40fa40d401d001d401d0810101d700d430d0102610251024102306d15504e20c925f0ce0702bd74920c21f95310bd31f0cde2182102459ca06020300e47f803223f8238d0bda1d1d1c1cce8bcbdcdbdb185c9cde5cdd195b595e1c1b1bdc995c8b98dbdb4bdb999d0bdc1b185b995d0b9a9cdbdba026c00199368b6636f6d6d6f6e88e2526c10497368b47261726588e1706c107968b46570696389b8b96c6567656e646172798e2e2e2461450521304feba8e5b5b0a810101d70031fa403082009058f8425009c70518f2f4108a5517c87f01ca0055a050ab810101cf0018ce16ce04c8ce14cd02c8810101cf00810101cf0002c8ce12cd02c8ce12cd12ca0012810101cf0002c8ce12cdcdc9ed54e0218210b63ae277bae302218210946a98b6bae3023cc0000bc1211bb0e3025f0b04050708008a5b3a108a5517c87f01ca0055a050ab810101cf0018ce16ce04c8ce14cd02c8810101cf00810101cf0002c8ce12cd02c8ce12cd12ca0012810101cf0002c8ce12cdcdc9ed54018c5b0ad33f30c8018210aff90f5758cb1fcb3fc9109b108a107910681057104610354430f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb0006007ec87f01ca0055a050ab810101cf0018ce16ce04c8ce14cd02c8810101cf00810101cf0002c8ce12cd02c8ce12cd12ca0012810101cf0002c8ce12cdcdc9ed540086108a5517c87f01ca0055a050ab810101cf0018ce16ce04c8ce14cd02c8810101cf00810101cf0002c8ce12cd02c8ce12cd12ca0012810101cf0002c8ce12cdcdc9ed540006f2c0825ee7f7fd');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initPlanetNFTItem_init_args({ $$type: 'PlanetNFTItem_init_args', itemIndex, collectionAddress, owner, planetName, discoveryOrder, glowColor })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const PlanetNFTItem_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    36952: { message: "Only owner can transfer" },
    49729: { message: "Unauthorized" },
} as const

export const PlanetNFTItem_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Only owner can transfer": 36952,
    "Unauthorized": 49729,
} as const

const PlanetNFTItem_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Transfer","header":609864198,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forwardAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"forwardPayload","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"GetStaticData","header":3057312375,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"NFTData","header":null,"fields":[{"name":"planetName","type":{"kind":"simple","type":"string","optional":false}},{"name":"rarity","type":{"kind":"simple","type":"string","optional":false}},{"name":"itemIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"glowColor","type":{"kind":"simple","type":"string","optional":false}},{"name":"imageURI","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"PassiveIncomeData","header":null,"fields":[{"name":"earnsPassiveIncome","type":{"kind":"simple","type":"bool","optional":false}},{"name":"passiveIncomeRate","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"discoveredAt","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"PlanetNFTItem$Data","header":null,"fields":[{"name":"itemIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collectionAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"planetName","type":{"kind":"simple","type":"string","optional":false}},{"name":"discoveryOrder","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"discoveredAt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"rarity","type":{"kind":"simple","type":"string","optional":false}},{"name":"glowColor","type":{"kind":"simple","type":"string","optional":false}},{"name":"earnsPassiveIncome","type":{"kind":"simple","type":"bool","optional":false}},{"name":"passiveIncomeRate","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"imageURI","type":{"kind":"simple","type":"string","optional":false}}]},
]

const PlanetNFTItem_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "Transfer": 609864198,
    "GetStaticData": 3057312375,
}

const PlanetNFTItem_getters: ABIGetter[] = [
]

export const PlanetNFTItem_getterMapping: { [key: string]: string } = {
}

const PlanetNFTItem_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"Transfer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"GetStaticData"}},
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class PlanetNFTItem implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = PlanetNFTItem_errors_backward;
    public static readonly opcodes = PlanetNFTItem_opcodes;
    
    static async init(itemIndex: bigint, collectionAddress: Address, owner: Address, planetName: string, discoveryOrder: bigint, glowColor: string) {
        return await PlanetNFTItem_init(itemIndex, collectionAddress, owner, planetName, discoveryOrder, glowColor);
    }
    
    static async fromInit(itemIndex: bigint, collectionAddress: Address, owner: Address, planetName: string, discoveryOrder: bigint, glowColor: string) {
        const __gen_init = await PlanetNFTItem_init(itemIndex, collectionAddress, owner, planetName, discoveryOrder, glowColor);
        const address = contractAddress(0, __gen_init);
        return new PlanetNFTItem(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new PlanetNFTItem(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  PlanetNFTItem_types,
        getters: PlanetNFTItem_getters,
        receivers: PlanetNFTItem_receivers,
        errors: PlanetNFTItem_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Transfer | GetStaticData | null | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Transfer') {
            body = beginCell().store(storeTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'GetStaticData') {
            body = beginCell().store(storeGetStaticData(message)).endCell();
        }
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
}