/**
 * Created by toko on 13.05.17.
 */

/**
 *
 * Define a wire frame cube with methods for drawing it.
 *
 * @param gl
 * @param color the color of the cube
 * @returns object with draw method
 * @constructor
 */
function Iglushape(gl, edges, color) {
    var maxHeight = 2;
    var heightDifference = 0.1;
    var normalVectors = [];

    function defineVerticesOld(gl) {
        // define the vertices of the cube
        var vertices = [
            -0.5,-0.5,-0.5,      // v0
             0.5,-0.5,-0.5,      // v1
             0.5, 0.5,-0.5,      // v2
            -0.5, 0.5,-0.5,      // v3
            -0.5,-0.5, 0.5,      // v4
             0.5,-0.5, 0.5,      // v5
             0.5, 0.5, 0.5,      // v6
            -0.5, 0.5, 0.5       // v7
        ];
        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;

        var vertexIndices = [
            0,1, // face on z = 0
            1,2,
            2,3,
            3,0,
            4,5, // face on z = 1
            5,6,
            6,7,
            7,4,
            0,4, // edges between
            1,5,
            2,6,
            3,7
        ];
    }

    function calculateX(gl, radius, angle, step){
        var radient = angle * (Math.PI / 180);
        var value = Math.round(radius * Math.cos(radient) * 100) / 100;
        if((step < (edges / 4) || step > (edges * 3 / 4)) && value > 0)
        {
            return value * -1;
        }
        else {
            if(value > 0){
                return value;
            }
            else{
                return value * -1;
            }
        }
    }

    function calculateY(gl, radius, angle, step){
        var radient = angle * (Math.PI / 180);
        var value = Math.round(radius * Math.sin(radient) * 100) / 100;
        if((step < (edges / 2)) && value > 0)
        {
            return value * -1;
        }
        else {
            if(value > 0){
                return value;
            }
            else{
                return value * -1;
            }
        }
    }

    function defineVertices(gl){
        var vertices = [];
        var radStep = 360/edges;
        normalVectors = [];

        for (var x = 0; x < maxHeight; x = x + heightDifference) {
            var roundingHeight = calculateRounding(gl, x, 2);

            for (var i = 0; i < edges; i++) {
                var x_Value = calculateX(gl, roundingHeight, radStep * i, i);
                var z_Value = x;
                var y_Value = calculateY(gl, roundingHeight, radStep * i, i);

                vertices.push(x_Value);
                vertices.push(z_Value);
                vertices.push(y_Value);

                var vec = vec3.create();
                vec3.normalize(vec, [x_Value, z_Value, y_Value]);

                normalVectors.push(vec[0]);
                normalVectors.push(vec[1]);
                normalVectors.push(vec[2]);
            }
        }

        vertices.push(0);
        vertices.push(maxHeight);
        vertices.push(0);

        normalVectors.push(0.0, 1.0, 0.0);

        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    function calculateRounding(gl, height, fullHeight){
        var cosFactor = height / fullHeight;
        var topAngle = Math.acos(cosFactor) * 180 / Math.PI;
        var bottomAngle = 90 - topAngle;
        var radient = bottomAngle * (Math.PI / 360);
        if(radient == 0){
            var width = 0;
        }
        else{
            var width = height / Math.tan(radient);
        }

        width = Math.round(width * 100) / 100
        if(width == 0){
            return fullHeight;
        }
        else{
            return width - fullHeight;
        }
    }

    function defineEdges(gl) {
        // define the edges for the cube, there are 12 edges in a cube
        var vertexIndices = [];
        var counter = 0;
        for (var x = 0; x < maxHeight; x = x + heightDifference){
            var z = counter * edges;
            for (var y = 0; y < edges; y++){
                vertexIndices.push(y + z);
                if (((y + 1) % edges) == 0){
                    vertexIndices.push(z);
                }
                else{
                    vertexIndices.push(y + 1 + z);
                }
            }

            counter++;
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        return buffer;
    }

    function defineSides(gl){
        var vertexIndices = [];

        var counter = 0;
        for (var x = 0; x < maxHeight; x = x + heightDifference){
            for (var y = 0; y < edges; y++){
                var currentNodeOnCurrentRow = (counter*edges) + y;
                var currentNodeOnNextRow = ((counter+1)*edges) + y;

                var roundedx = Math.round(x * 10000) / 10000;

                if(roundedx + heightDifference == maxHeight){
                    // Dachdreieck
                    vertexIndices.push(currentNodeOnCurrentRow);
                    vertexIndices.push(currentNodeOnCurrentRow + 1);
                    vertexIndices.push(edges * (maxHeight / heightDifference));
                }
                else{
                    // Dreieck 1
                    vertexIndices.push(currentNodeOnCurrentRow);
                    vertexIndices.push(currentNodeOnCurrentRow + 1);
                    vertexIndices.push(currentNodeOnNextRow);

                    // Dreieck 2
                    vertexIndices.push(currentNodeOnCurrentRow + 1);
                    vertexIndices.push(currentNodeOnNextRow);
                    vertexIndices.push(currentNodeOnNextRow + 1);
                }
            }

            counter++;
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);

        return buffer;
    }

    return {
        color: color,

        draw: function(gl, aVertexPositionId, aVertexColorId, aVertexNormalId) {

                // bind the buffer, so that the cube vertices are used
                gl.bindBuffer(gl.ARRAY_BUFFER, defineVertices(gl));
                gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(aVertexPositionId);

                // set a constant color for all vertices
                gl.disableVertexAttribArray(aVertexColorId);
                gl.vertexAttrib3fv(aVertexColorId, this.color);

                var normalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalVectors), gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                gl.vertexAttribPointer(aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(aVertexNormalId);

                // bind the element array
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, defineEdges(gl));
                gl.drawElements(gl.LINES, edges * (maxHeight / heightDifference) * 2,gl.UNSIGNED_SHORT, 0);



            // bind the element array
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, defineSides(gl));
            gl.drawElements(gl.TRIANGLES, edges * ((maxHeight / heightDifference) - 1) * 6 + (edges * 3),gl.UNSIGNED_SHORT, 0);
        }
    }
}



