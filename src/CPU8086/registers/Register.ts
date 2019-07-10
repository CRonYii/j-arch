import { halfAdd } from "../../utils/Helper";
import { BinaryDigit, BitBuffer, BitBufferable, toBitBuffer } from "../arch/BitBuffer";

export class Register {

    /** the data container of the register,
     * each element in the array represents a one-digit binary.
     */
    protected readonly _data: BitBuffer;

    /** the number of binary digits the register can store. */
    protected readonly _size: number;

    protected constructor(size: number, initialValue?: BitBufferable) {
        this._size = size;
        this._data = this.toBitBuffer(initialValue || 0);
    }

    // TODO: move the operation to CPU, a register should only be able to set/get
    public move(other: BitBufferable) {
        let data: BitBuffer = this.toBitBuffer(other);

        for (let i = 0; i < this._size; i++) {
            this._data[i] = data[i];
        }
    }

    // TODO: move the operation to CPU, a register should only be able to set/get
    public add(other: BitBufferable) {
        let data: BitBuffer = this.toBitBuffer(other);

        const size = this._size;
        const d1 = this._data;
        const d2 = data;

        let currentDigit: BinaryDigit = 0;
        let carry: BinaryDigit = 0;

        for (let i = 0; i < size; i++) {
            const digit1 = d1[i];
            const digit2 = d2[i];

            const result = halfAdd(digit1, digit2, carry);
            currentDigit = result[0];
            carry = result[1];
            this._data[i] = currentDigit;
        }
    }

    /**
     * A helper function to convert BitBufferable to a BifBuffer
     * @param data anything that can be converted to BitBuffer
     */
    protected toBitBuffer(data: BitBufferable): BitBuffer {
        if (typeof data === 'string' || typeof data === 'number') {
            data = toBitBuffer(data, this._size);
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
        return [...this._data];
    }

    /**
     * Returns the number of bits that can be stored in the register.
     */
    public size() {
        return this._size;
    }

    /**
     * Returns a decimal representation of the data stored in the register.
     */
    public value(): number {
        let result = 0;
        for (let i = 0; i < this._size; i++) {
            if (this._data[i]) {
                result += 1 << i;
            }
        }
        return result;
    }

}