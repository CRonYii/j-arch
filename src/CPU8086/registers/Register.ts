import { BinaryDigit, BitBuffer, bitBuffer, BitBufferable } from "../arch/BitBuffer";

export interface RegisterOptions {
    size: number;
    offset?: number;
    initialValue?: BitBufferable,
    buffer?: BitBuffer
}

export class Register {

    /** the data container of the register,
     * each element in the array represents a one-digit binary.
     */
    protected readonly _data: BitBuffer;

    /** the number of binary digits the register can store. */
    protected readonly _size: number;

    /** the offset indicates the starting index of the _data BitBuffer */
    protected readonly _offset: number;

    public readonly usingOutsideBuffer: boolean = false;

    protected constructor(options: RegisterOptions) {
        const { size, initialValue, offset = 0, buffer } = options;
        if (isNaN(offset) || offset < 0
            || isNaN(size) || size <= offset) {
            throw new Error(`Invalid size and/or offset. [size=${size}, offset=${offset}]`);
        }
        this._size = size;
        this._offset = offset;
        if (buffer) {
            this._data = buffer;
            this.usingOutsideBuffer = true;
        } else {
            this._data = this.toBitBuffer(initialValue || 0);
        }
    }

    private setBit(index: number, value: BinaryDigit) {
        index += this._offset;
        this._data[index] = value;
    }

    public set(value: BitBufferable) {
        let data: BitBuffer = this.toBitBuffer(value);

        for (let i = 0; i < this._size; i++) {
            this.setBit(i, data[i]);
        }
    }

    /**
     * A helper function to convert BitBufferable to a BifBuffer
     * @param data anything that can be converted to BitBuffer
     */
    public toBitBuffer(data: BitBufferable): BitBuffer {
        if (typeof data === 'string' || typeof data === 'number') {
            data = bitBuffer.from(data, this._size);
        } else if (data instanceof Register) {
            data = data.data();
        }
        if (!this.compatible(data)) {
            throw new Error('incompatible register size');
        }
        return data;
    }

    /**
     * Determine whether or not the register is compatible 
     * to perform arithmetic operation with the BifBuffer.
     * @param buffer The BitBuffer to be compare with
     */
    public compatible(buffer: BitBuffer): boolean {
        return this._size === buffer.length;
    }

    /**
     * Returns a copy of the BitBuffer stored in the register.
     */
    public data(): BitBuffer {
        return [...this._data].slice(this._offset, this._size);
    }

    /**
     * Returns the number of bits that can be stored in the register.
     */
    public size() {
        return this._size;
    }

}