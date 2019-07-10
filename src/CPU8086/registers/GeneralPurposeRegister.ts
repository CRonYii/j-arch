import { Register16 } from "./Register16";
import { BitBufferable } from "../arch/BitBuffer";

// TODO: This type of register can be treated as two 8-bit registers
export class GeneralPurposeRegister extends Register16 {


    constructor(initialValue?: BitBufferable) {
        super(initialValue);
    }

}