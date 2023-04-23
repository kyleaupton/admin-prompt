import { sudo } from './sudo'

console.log(await sudo('/bin/ls -la'))