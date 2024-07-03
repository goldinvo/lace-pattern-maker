/*
A fixed-sized stack (LIFO) where pushes that exceed capacity will remove the
oldest object. 

My heart says linked list but my brain says to go quick and dirty and it will
probably be faster anyway
*/

class FixedStack extends Array {
    constructor(sizeLimit) {
        super();  
        this.sizeLimit = sizeLimit;
    }
  
    push(item) {
        if (this.length >= this.sizeLimit) {
            this.shift(); 
        }
        return super.push(item);
    }
    
    clear() {
        this.length = 0; // apparently kosher
    }

    clone() {
        return this.slice();
    }
}

export default FixedStack;