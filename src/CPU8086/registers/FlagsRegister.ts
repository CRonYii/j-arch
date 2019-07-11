import { Register16 } from "./Register16";
import { ByteBufferable } from "../arch/ByteBuffer";

export class FlagsRegister extends Register16 {

    constructor(initialValue?: ByteBufferable) {
        super(initialValue);
    }

}