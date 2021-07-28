        function Graph(canvasId, minX, minY, maxX, maxY, unitsPerTick) {
            // user defined properties
            this.canvas = document.getElementById(canvasId);
            this.minX = minX;
            this.minY = minY;
            this.maxX = maxX;
            this.maxY = maxY;
            this.unitsPerTick = unitsPerTick;


            // constants
            this.axisColor = "#aaa";
            this.font = "8pt Calibri";
            this.tickSize = 20;

            // relationships
            this.context = this.canvas.getContext("2d");
            this.rangeX = this.maxX - this.minX;
            this.rangeY = this.maxY - this.minY;
            this.unitX = this.canvas.width / this.rangeX;
            this.unitY = this.canvas.height / this.rangeY;
            this.centerY = Math.round(Math.abs(this.minY / this.rangeY) * this.canvas.height);
            this.centerX = Math.round(Math.abs(this.minX / this.rangeX) * this.canvas.width);
            this.iteration = (this.maxX - this.minX) / 1000;
            this.scaleX = this.canvas.width / this.rangeX;
            this.scaleY = this.canvas.height / this.rangeY;

            this.error = 0.5; //mouse error

            // draw x and y axis
            this.drawXAxis();
            this.drawYAxis();
        }

        Graph.prototype.drawXAxis = function () {
            var context = this.context;
            context.save();
            context.beginPath();
            context.moveTo(0, this.centerY);
            context.lineTo(this.canvas.width, this.centerY);
            context.strokeStyle = this.axisColor;
            context.lineWidth = 2;
            context.stroke();

            // draw tick marks
            var xPosIncrement = this.unitsPerTick * this.unitX;
            var xPos, unit;
            context.font = this.font;
            context.textAlign = "center";
            context.textBaseline = "top";

            // draw left tick marks
            xPos = this.centerX - xPosIncrement;
            unit = -1 * this.unitsPerTick;
            while (xPos > 0) {
                context.moveTo(xPos, this.centerY - this.canvas.height / 2);
                context.lineTo(xPos, this.centerY + this.canvas.height / 2);
                context.stroke();
                context.fillText(unit, xPos, this.centerY + this.tickSize / 5);
                unit -= this.unitsPerTick;
                xPos = Math.round(xPos - xPosIncrement);
            }

            // draw right tick marks
            xPos = this.centerX + xPosIncrement;
            unit = this.unitsPerTick;
            while (xPos < this.canvas.width) {
                context.moveTo(xPos, this.centerY - this.canvas.height / 2);
                context.lineTo(xPos, this.centerY + this.canvas.height / 2);
                context.stroke();
                context.fillText(unit, xPos, this.centerY + this.tickSize / 5);
                unit += this.unitsPerTick;
                xPos = Math.round(xPos + xPosIncrement);
            }
            context.restore();
        };

        Graph.prototype.drawYAxis = function () {
            var context = this.context;
            context.save();
            context.beginPath();
            context.moveTo(this.centerX, 0);
            context.lineTo(this.centerX, this.canvas.height);
            context.strokeStyle = this.axisColor;
            context.lineWidth = 2;
            context.stroke();

            // draw tick marks
            var yPosIncrement = this.unitsPerTick * this.unitY;
            var yPos, unit;
            context.font = this.font;
            context.textAlign = "right";
            context.textBaseline = "middle";

            // draw top tick marks
            yPos = this.centerY - yPosIncrement;
            unit = this.unitsPerTick;
            while (yPos > 0) {
                context.moveTo(this.centerX - this.canvas.width / 2, yPos);
                context.lineTo(this.centerX + this.canvas.width / 2, yPos);
                context.stroke();
                //context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
                context.fillText(unit, this.centerX - this.tickSize / 5, yPos-3);
                unit += this.unitsPerTick;
                yPos = Math.round(yPos - yPosIncrement);
            }

            // draw bottom tick marks
            yPos = this.centerY + yPosIncrement;
            unit = -1 * this.unitsPerTick;
            while (yPos < this.canvas.height) {
                context.moveTo(this.centerX - this.canvas.width / 2, yPos);
                context.lineTo(this.centerX + this.canvas.width / 2, yPos);
                context.stroke();
               // context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
                 context.fillText(unit, this.centerX - this.tickSize / 5, yPos-3);
                unit -= this.unitsPerTick;
                yPos = Math.round(yPos + yPosIncrement);
            }
            context.restore();
        }


        Graph.prototype.drawVerticalLine = function (xAxis, color, thickness, lineType) {
            var context = this.context;
            context.save();
            context.beginPath();
            context.moveTo(xAxis * this.scaleX + this.centerX, 0);
            context.lineTo(xAxis * this.scaleX + this.centerX, this.canvas.height);
            // context.moveTo(xAxis * this.scaleX + this.centerX, 0);
            //context.lineTo(xAxis * this.scaleX + this.centerX, this.centerY - this.canvas.height / 2);

            context.strokeStyle = color;
            context.lineWidth = thickness;

            if (lineType == "dash")
                context.setLineDash([5, 15]);

            context.stroke();
            context.restore();
        }

        Graph.prototype.drawEquation = function (equation, color, thickness, lineType) {
            var context = this.context;
            context.save();
            context.save();
            this.transformContext();

            context.beginPath();


            context.moveTo(this.minX, equation(this.minX));

            for (var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {

                //testing end
                context.lineTo(x, equation(x));
            }

            //context.strokeStyle = "red";
            //context.lineWidth = 0.5;
            //context.stroke();

            context.restore();
            //
            if (lineType == "dash")
                context.setLineDash([5, 15]);

            context.lineJoin = "round";
            context.lineWidth = thickness;
            context.strokeStyle = color;
            context.stroke();
            context.restore();
        };

        Graph.prototype.transformContext = function () {
            var context = this.context;

            // move context to center of canvas
            this.context.translate(this.centerX, this.centerY);

            context.scale(this.scaleX, -this.scaleY);
        };

        // if error  =0.5 considered the two points same
        Graph.prototype.arePiontSame = function (x1, y1, x2, y2) {
            if (Math.abs(x1 - x2) < this.error && Math.abs(y1 - y2) < this.error)
                return true;
            return false;

        };