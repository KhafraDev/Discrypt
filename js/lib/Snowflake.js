/*
        Copyright 2015 - 2020 Amish Shah

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

let INCREMENT = 0;

const Snowflake = () => {
    const timestamp = new Date().getTime();

    if (INCREMENT >= 4095) INCREMENT = 0;
    let num = `${(timestamp - 1420070400000).toString(2).padStart(42, '0')}0000100000${(INCREMENT++).toString(2).padStart(12, '0')}`;
    let dec = '';

    while (num.length > 50) {
        const high = parseInt(num.slice(0, -32), 2);
        const low = parseInt((high % 10).toString(2) + num.slice(-32), 2);

        dec = (low % 10).toString() + dec;
        num = Math.floor(high / 10).toString(2) + Math.floor(low / 10).toString(2).padStart(32, '0');
    }

    num = parseInt(num, 2);
    while (num > 0) {
        dec = (num % 10).toString() + dec;
        num = Math.floor(num / 10);
    }

    return dec;
}