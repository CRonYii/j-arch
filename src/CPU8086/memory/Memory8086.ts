import { Memory } from "./Memory";
import { ByteBufferable, ByteBuffer, byteBuffer } from "../arch/ByteBuffer";

export class Memory8086 extends Memory {

    static readonly SIZE: number = 1 << 20;

    constructor() {
        super({
            size: Memory8086.SIZE
        });
    }

}

export class MemoryOffsetAddress {

    public readonly address: ByteBuffer;

    constructor(address: ByteBufferable) {
        this.address = byteBuffer.from(address, 2);
    }

}

export const mem = (address: ByteBufferable) => new MemoryOffsetAddress(address);