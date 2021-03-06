import { ByteBufferable } from "../arch/ByteBuffer";
import { Register } from "./Register";

export class Register16 extends Register {

    constructor(initialValue?: ByteBufferable) {
        super({
            size: 2,
            initialValue
        });
    }

}