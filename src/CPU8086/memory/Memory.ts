import { ByteBuffer, byteBuffer } from "../arch/ByteBuffer";

export interface MemoryOptions {
    size: number
}

export class Memory {

    private readonly _data: ByteBuffer;

    private readonly _size: number;

    constructor(options: MemoryOptions) {
        const { size } = options;
        this._size = size;
        this._data = byteBuffer.from(0, size);
    }

    public set(address: number, data: number) {
        this._data[address] = data;
    }
    
    public get(address: number) {
        return this._data[address];
    }

    /**
     * Returns the number of bytes that can be stored in the memory.
     */
    public size() {
        return this._size;
    }
}