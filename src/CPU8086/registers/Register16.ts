import { BitBufferable } from "../arch/BitBuffer";
import { Register } from "./Register";

export class Register16 extends Register {

    constructor(initialValue?: BitBufferable) {
        super({
            size: 16,
            initialValue
        });
    }

}