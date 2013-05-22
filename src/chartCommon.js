//Written by Tadesse D. Feyissa. May 21, 2013.

function niceScale(min, max, maxTicks) {

    var m = this;
    maxTicks = maxTicks || 10;       
    var minPoint = min;
    var maxPoint = max;
    
    m.tickSpacing = 0;
    m.niceMin = 0;
    m.niceMax = 0;        
    
    (function() {
        var range = niceNum(maxPoint - minPoint, false);
        m.tickSpacing = niceNum(range / (maxTicks - 1), true);
        m.niceMin = Math.floor(minPoint / m.tickSpacing) * m.tickSpacing;
        m.niceMax = Math.ceil(maxPoint / m.tickSpacing) * m.tickSpacing;
    }());

    function niceNum(range, round) {
        var exponent; /* exponent of range */
        var fraction; /* fractional part of range */
        var niceFraction; /* nice, rounded fraction */

        exponent = Math.floor(Math.log(range) / Math.log(10));
        fraction = range / Math.pow(10, exponent);

        if (round) {
                if (fraction < 1.5)
                    niceFraction = 1;
                else if (fraction < 3)
                    niceFraction = 2;
                else if (fraction < 7)
                    niceFraction = 5;
                else
                    niceFraction = 10;
        } 
        else {
                if (fraction <= 1)
                    niceFraction = 1;
                else if (fraction <= 2)
                    niceFraction = 2;
                else if (fraction <= 5)
                    niceFraction = 5;
                else
                    niceFraction = 10;
        }

        return niceFraction * Math.pow(10, exponent);
    }
}