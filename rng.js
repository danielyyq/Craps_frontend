var RNG =                   // Mersenne Twister
{                           // adapted from http://gist.github.com/banksean/300494
    N          : 624,
    M          : 397,
    MATRIX_A   : 0x9908b0df,
    UPPER_MASK : 0x80000000,
    LOWER_MASK : 0x7fffffff,

    Initialize : function()
    {
        this.mt         = new Array(this.N);
        this.mti        = this.N + 1;
        var seed        = new Date().getTime();
        this.mt[0]      = seed >>> 0;

        for (this.mti = 1; this.mti < this.N; this.mti++)
        {
            var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
            this.mt[this.mti] >>>= 0;
        }
    },

    Next : function(max)
    {
        // returns a random integer greater than or equal to zero and less than max

        var y;
        var mag01 = new Array(0x0, this.MATRIX_A);

        if (this.mti >= this.N)
        {
            var kk;

            for (kk = 0; kk < (this.N - this.M); kk++)
            {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }

            for ( ; kk < (this.N - 1); kk++)
            {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }

            y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
            this.mti = 0;
        }

        y = this.mt[this.mti++];

        y ^= (y >>> 11);
        y ^= (y <<   7) & 0x9d2c5680;
        y ^= (y <<  15) & 0xefc60000;
        y ^= (y >>> 18);
        y >>>= 0;

        return Math.floor(max * y / 4294967296.0);
    }
};

RNG.Initialize();
