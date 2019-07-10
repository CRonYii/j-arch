import { CPU8086, RegisterID8086 } from "./CPU8086";
import { bitBuffer } from "./CPU8086/arch/BitBuffer";

var cpu = new CPU8086();

function show(registerID: RegisterID8086) {
    const value = cpu.getData(registerID);
    const hex = bitBuffer.toHex(value);
    const paddedHex = bitBuffer.toPrecision(hex, 4);
    console.log(paddedHex);
}

cpu.mov('ax', '0x001A');
cpu.mov('bx', '0x0026');

cpu.add('al', cpu.getData('bl'));
cpu.add('ah', cpu.getData('bl'));
cpu.add('bh', cpu.getData('al'));

cpu.mov('ah', 0);

cpu.add('al', '0x85');
show('ax');
show('bx');
cpu.add('al', '0x93');
show('ax');
show('bx');