import { BitBufferable, BitBuffer } from "../arch/BitBuffer";
import { Register } from "./Register";
import { Register16 } from "./Register16";

class InnerRegister8 extends Register {
    
    constructor(buffer: BitBuffer, offset: number) {
        super({
            size: 8,
            offset,
            buffer
        });
    }

}

export class GeneralPurposeRegister extends Register16 {

    public readonly low = new InnerRegister8(this._data, 0);
    public readonly high = new InnerRegister8(this._data, 8);

    constructor(initialValue?: BitBufferable) {
        super(initialValue);
    }

}