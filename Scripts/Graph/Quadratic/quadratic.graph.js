/*
 *      QuadraticGraph inherits from Graph
 * 
 */

    function QuadraticGraph(canvasId, minX, minY, maxX, maxY, unitsPerTick, a, b, c) {
        Graph.call(this, canvasId, minX, minY, maxX, maxY, unitsPerTick);


            //temp quadratic, (1,0,0) is baseline
            this.a1 = 1;
            this.b1 = 0;
            this.c1 = 0;
            this.quad1 = x => this.a1 * x * x + this.b1 * x + this.c1*1;

            this.is_intercept_correct = false;
            this.is_axis_of_symetry_correct = false;
            this.is_vertex_correct = false;

            //target quadratic
            this.a = a;
            this.b = b;
            this.c = c; //intercept

        //*1 to change c from string to number
            this.quad = x => this.a * x * x + this.b * x + this.c*1;


    }



        QuadraticGraph.prototype = Object.create(Graph.prototype);
        QuadraticGraph.prototype.constructor = Graph;

Object.defineProperty(QuadraticGraph.prototype, "axisOfSymmetry", {
    get: function () {
        return -this.b / (2 * this.a);
    }
});

Object.defineProperty(QuadraticGraph.prototype, "vertex_x", {
    get: function () {
        return this.axisOfSymmetry;
    }
});
Object.defineProperty(QuadraticGraph.prototype, "vertex_y", {
    get: function () {
        return (4 * this.a * this.c - this.b * this.b) / (4 * this.a);
    }
});
        /*decide the current quadratic function
         * input: 1. is_axis_of_symetry_correct:
         *        2. is_vertex_correct
         *        3. is_intercept_correct
         *  the above flags stay true when are set by the user.
         *
         *  rules: get intercept right first, then axis of symmetry, vertex the last.
         *         once set correctly, not allowed to try again
        */
        QuadraticGraph.prototype.decideQuadratic = function (mouse_x, mouse_y) {

            //calculate temp quad coefficients
            if (this.is_intercept_correct == false && this.arePiontSame(mouse_x, mouse_y, 0, this.c)) {

                this.is_intercept_correct = true;
                this.c1 = this.c*1;
                return;
            }


            if (this.is_intercept_correct) {


                if (this.is_axis_of_symetry_correct == false && Math.abs(mouse_x - this.axisOfSymmetry) < this.error) {

                    this.is_axis_of_symetry_correct = true;
                    this.b1 = -2 * this.a1 * this.axisOfSymmetry;
                    return;
                }

                if (this.is_axis_of_symetry_correct) {

                    if (this.is_vertex_correct == false && Math.abs(mouse_y - this.vertex_y) < this.error) {
                        this.b1 = this.b;
                        this.a1 = this.a;
                        this.is_vertex_correct = true;

                        return;
                    }
                    else {
                        //mouse_y is used as y coordinate of vertex
                        //(4ac-b^2)/4a = mouse_y
                        this.a1 = (this.c1*1 - mouse_y) / (this.axisOfSymmetry * this.axisOfSymmetry);
                        this.b1 = -2 * this.a1 * this.axisOfSymmetry;

                    }
                }
                else {
                    //mouse_x is used as axis_of_symetry
                    this.b1 = -2 * this.a1 * mouse_x;

                }

            }
};
