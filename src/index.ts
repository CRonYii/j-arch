import { Register16 } from "./CPU8086/registers/Register16";
import { CPU8086 } from "./CPU8086";

const ax = new Register16();
const bx = new Register16();

ax.move('0x4E20');
console.log(ax.value());

ax.add('0x1406');
console.log(ax.value());

bx.move('0x2000');
console.log(bx.value());

ax.add(bx);
console.log(ax.value());

bx.move(ax);
console.log(bx.value());

ax.add(bx);
console.log(ax.value());

console.log(new CPU8086());
