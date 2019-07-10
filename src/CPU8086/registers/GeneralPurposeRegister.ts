import { Register16 } from "./Register16";
import { BitBufferable } from "../arch/BitBuffer";

export class GeneralPurposeRegister extends Register16 {

    constructor(initialValue?: BitBufferable) {
        super(initialValue);
    }

}