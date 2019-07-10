import { Register16 } from "./Register16";
import { BitBufferable } from "../arch/BitBuffer";

export class InstructionPointerRegister extends Register16 {

    constructor() {
        super('0x0000');
    }

}