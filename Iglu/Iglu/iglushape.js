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


        // inners from left to right
        addEntryVerticesRoof(0.0, 9, radStep, vertices, true);
        addEntryVerticesRoof(0.2, 9, radStep, vertices, true);
        addEntryVerticesRoof(0.4, 9, radStep, vertices, true);
        addEntryVerticesRoof(0.6, 9, radStep, vertices, true);
        addEntryVerticesRoof(0.67, 8.9, radStep, vertices, true);
        addEntryVerticesRoof(0.74, 8.7, radStep, vertices, true);
        addEntryVerticesRoof(0.78, 8.4, radStep, vertices, true);
        addEntryVerticesRoof(0.8, 8, radStep, vertices, true);
        addEntryVerticesRoof(0.78, 7.6, radStep, vertices, true);
        addEntryVerticesRoof(0.74, 7.3, radStep, vertices, true);
        addEntryVerticesRoof(0.67, 7.1, radStep, vertices, true);
        addEntryVerticesRoof(0.6, 7, radStep, vertices, true);
        addEntryVerticesRoof(0.4, 7, radStep, vertices, true);
        addEntryVerticesRoof(0.2, 7, radStep, vertices, true);
        addEntryVerticesRoof(0.0, 7, radStep, vertices, true);

        // outers from left to right
        addEntryVerticesRoof(0.0, 10, radStep, vertices, false);
        addEntryVerticesRoof(0.2, 10, radStep, vertices, false);
        addEntryVerticesRoof(0.4, 10, radStep, vertices, false);
        addEntryVerticesRoof(0.6, 10, radStep, vertices, false);
        addEntryVerticesRoof(0.76, 9.9, radStep, vertices, false);
        addEntryVerticesRoof(0.91, 9.5, radStep, vertices, false);
        addEntryVerticesRoof(0.98, 8.8, radStep, vertices, false);
        addEntryVerticesRoof(1, 8, radStep, vertices, false);
        addEntryVerticesRoof(0.98, 7.2, radStep, vertices, false);
        addEntryVerticesRoof(0.91, 6.5, radStep, vertices, false);
        addEntryVerticesRoof(0.76, 6.1, radStep, vertices, false);
        addEntryVerticesRoof(0.6, 6, radStep, vertices, false);
        addEntryVerticesRoof(0.4, 6, radStep, vertices, false);
        addEntryVerticesRoof(0.2, 6, radStep, vertices, false);
        addEntryVerticesRoof(0.0, 6, radStep, vertices, false);

        addEntryVerticesFront(0.0, 9, radStep, vertices);
        addEntryVerticesFront(0.2, 9, radStep, vertices);
        addEntryVerticesFront(0.4, 9, radStep, vertices);
        addEntryVerticesFront(0.6, 9, radStep, vertices);
        addEntryVerticesFront(0.67, 8.9, radStep, vertices);
        addEntryVerticesFront(0.74, 8.7, radStep, vertices);
        addEntryVerticesFront(0.78, 8.4, radStep, vertices);
        addEntryVerticesFront(0.8, 8, radStep, vertices);
        addEntryVerticesFront(0.78, 7.6, radStep, vertices);
        addEntryVerticesFront(0.74, 7.3, radStep, vertices);
        addEntryVerticesFront(0.67, 7.1, radStep, vertices);
        addEntryVerticesFront(0.6, 7, radStep, vertices);
        addEntryVerticesFront(0.4, 7, radStep, vertices);
        addEntryVerticesFront(0.2, 7, radStep, vertices);
        addEntryVerticesFront(0.0, 7, radStep, vertices);

        // outers from left to right
        addEntryVerticesFront(0.0, 10, radStep, vertices);
        addEntryVerticesFront(0.2, 10, radStep, vertices);
        addEntryVerticesFront(0.4, 10, radStep, vertices);
        addEntryVerticesFront(0.6, 10, radStep, vertices);
        addEntryVerticesFront(0.76, 9.9, radStep, vertices);
        addEntryVerticesFront(0.91, 9.5, radStep, vertices);
        addEntryVerticesFront(0.98, 8.8, radStep, vertices);
        addEntryVerticesFront(1, 8, radStep, vertices);
        addEntryVerticesFront(0.98, 7.2, radStep, vertices);
        addEntryVerticesFront(0.91, 6.5, radStep, vertices);
        addEntryVerticesFront(0.76, 6.1, radStep, vertices);
        addEntryVerticesFront(0.6, 6, radStep, vertices);
        addEntryVerticesFront(0.4, 6, radStep, vertices);
        addEntryVerticesFront(0.2, 6, radStep, vertices);
        addEntryVerticesFront(0.0, 6, radStep, vertices);

        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    function addEntryVerticesRoof(height, edge, radStep, vertices, inner){
        var roundingHeight = calculateRounding(gl, height, 2);
        var x_Value = calculateX(gl, roundingHeight, radStep * edge, edge);
        var z_Value = height;
        var y_Value = calculateY(gl, roundingHeight, radStep * edge, edge);
        addVertice(vertices, x_Value, z_Value, y_Value);
        addVertice(vertices, x_Value, z_Value, y_Value - 0.5);
        addVertice(vertices, x_Value, z_Value, y_Value - 1);

        if(edge == 10 || edge == 7){
            normalVectors.push(1.0, 0.0, 0.0);
            normalVectors.push(1.0, 0.0, 0.0);
            normalVectors.push(1.0, 0.0, 0.0);
        }
        else{
            if(edge == 9 || edge == 6){
                normalVectors.push(-1.0, 0.0, 0.0);
                normalVectors.push(-1.0, 0.0, 0.0);
                normalVectors.push(-1.0, 0.0, 0.0);
            }
            else{
                var roundingHeight_middle = calculateRounding(gl, height, 2);
                var x_Value_middle = calculateX(gl, roundingHeight_middle, radStep * 8, 8);
                var z_Value_middle = 0.6;
                var y_Value_middle = calculateY(gl, roundingHeight_middle, radStep * 8, 8);

                addNormalVectorRoof(inner, x_Value, z_Value, y_Value, x_Value_middle, z_Value_middle, y_Value_middle);
                addNormalVectorRoof(inner, x_Value, z_Value, y_Value - 0.5, x_Value_middle, z_Value_middle, y_Value_middle - 0.5);
                addNormalVectorRoof(inner, x_Value, z_Value, y_Value - 1.0, x_Value_middle, z_Value_middle, y_Value_middle - 1.0);

                if(edge == 8){
                    console.log(x_Value);
                    console.log(z_Value);
                    console.log(y_Value);
                    console.log(x_Value_middle);
                    console.log(z_Value_middle);
                    console.log(y_Value_middle);
                }
            }
        }
    }

    function addNormalVectorRoof(inner, x1, z1, y1, x2, z2, y2){
        x1 = x1 - x2;
        z1 = z1 - z2;
        y1 = y1 - y2;

        if(inner){
            x1 = x1 * -1;
            z1 = z1 * -1;
            y1 = y1 * -1;
        }

        var vec = vec3.create();
        vec3.normalize(vec, [x1, z1, y1]);

        console.log(vec);

        normalVectors.push(vec[0]);
        normalVectors.push(vec[1]);
        normalVectors.push(vec[2]);
    }

    function addEntryVerticesFront(height, edge, radStep, vertices){
        var roundingHeight = calculateRounding(gl, height, 2);
        var x_Value = calculateX(gl, roundingHeight, radStep * edge, edge);
        var z_Value = height;
        var y_Value = calculateY(gl, roundingHeight, radStep * edge, edge);
        addVertice(vertices, x_Value, z_Value, y_Value - 1);

        var vec = vec3.create();
        vec3.normalize(vec, [x_Value, z_Value, y_Value - 1]);

        normalVectors.push(vec[0]);
        normalVectors.push(vec[1]);
        normalVectors.push(vec[2]);
    }

    function addVertice(vertices, x, z, y){
        vertices.push(x);
        vertices.push(z);
        vertices.push(y);
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
        for (var x = 0; counter < 20; x = x + (heightDifference * 2)){
            var z = counter * edges;
            for (var y = 0; y < edges; y++){
                vertexIndices.push(y + z);
                if (((y + 1) % edges) == 0){
                    vertexIndices.push(z);
                }
                else{
                    vertexIndices.push(y + 1 + z);
                }

                if(counter < 18){
                    if(counter % 4 == 0){
                        if(y % 2 == 0){
                            vertexIndices.push(y + z);
                            vertexIndices.push(y + z + edges);
                            vertexIndices.push(y + z + edges);
                            vertexIndices.push(y + z + edges * 2);
                        }
                    }
                    else{
                        if(y % 2 != 0){
                            vertexIndices.push(y + z);
                            vertexIndices.push(y + z + edges);
                            vertexIndices.push(y + z + edges);
                            vertexIndices.push(y + z + edges * 2);
                        }
                    }
                }
                else{
                    if(counter % 4 == 0){
                        if(y % 2 == 0){
                            vertexIndices.push(y + z);
                            vertexIndices.push(y + z + edges);
                            vertexIndices.push(y + z + edges);
                            vertexIndices.push(edges * (maxHeight / heightDifference));
                        }
                    }
                    else{
                        if(y % 2 != 0){
                            vertexIndices.push(y + z);
                            vertexIndices.push(y + z + edges);
                            vertexIndices.push(y + z + edges);
                            vertexIndices.push(edges * (maxHeight / heightDifference));
                        }
                    }
                }
            }

            edges * (maxHeight / heightDifference)

            counter = counter + 2;
        }


        var offset = edges * (maxHeight / heightDifference);

        // entry lines
        for (var x = 0; x < 30; x++){
            edgeEntryTop(offset + 1 + (x*3), vertexIndices);
        }

        for (var x = 0; x < 14; x++){
            entryFrontLine(offset + 3 + (x*3), vertexIndices);
        }

        for (var x = 0; x < 14; x++){
            entryFrontLine(offset + 45 + 3 + (x*3), vertexIndices);
        }

        for (var x = 0; x < 14; x++){
            if((x % 2) == 0){
                entryFrontLine(offset + 2 + (x*3), vertexIndices);
            }
        }

        for (var x = 0; x < 14; x++){
            if((x % 2) == 0){
                entryFrontLine(offset + 45 + 2 + (x*3), vertexIndices);
            }
        }

        offset = offset + 90;

        for (var x = 0; x < 15; x++){
            entryFrontFrontLine(offset + 1 + x, vertexIndices);
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        return buffer;
    }

    function entryFrontFrontLine(offset, vertexIndices){
        vertexIndices.push(offset);
        vertexIndices.push(offset + 15);
    }

    function entryFrontLine(offset, vertexIndices){
        vertexIndices.push(offset);
        vertexIndices.push(offset + 3);
    }

    function edgeEntryTop(offset, vertexIndices){
        vertexIndices.push(offset);
        vertexIndices.push(offset + 1);
        vertexIndices.push(offset + 1);
        vertexIndices.push(offset + 2);
    }

    function defineSides(gl){
        var vertexIndices = [];

        var counter = 0;
        for (var x = 0; x < maxHeight; x = x + heightDifference){
            for (var y = 0; y < edges; y++){
                var currentNodeOnCurrentRow = (counter*edges) + y;
                var currentNodeOnNextRow = ((counter+1)*edges) + y;
                var nextNodeOnCurrentRow;
                var nextNodeOnNextRow;
                if(y == 31){
                    nextNodeOnCurrentRow = (counter*edges);
                    nextNodeOnNextRow = ((counter + 1)*edges);
                }
                else{
                    nextNodeOnCurrentRow = currentNodeOnCurrentRow + 1;
                    nextNodeOnNextRow = currentNodeOnNextRow + 1;
                }


                var roundedx = Math.round(x * 10000) / 10000;

                if(roundedx + heightDifference == maxHeight){
                    // Dachdreieck
                    vertexIndices.push(currentNodeOnCurrentRow);
                    vertexIndices.push(nextNodeOnCurrentRow);
                    vertexIndices.push(edges * (maxHeight / heightDifference));
                }
                else{
                    // Dreieck 1
                    vertexIndices.push(currentNodeOnCurrentRow);
                    vertexIndices.push(nextNodeOnCurrentRow);
                    vertexIndices.push(currentNodeOnNextRow);

                    // Dreieck 2
                    vertexIndices.push(nextNodeOnCurrentRow);
                    vertexIndices.push(currentNodeOnNextRow);
                    vertexIndices.push(nextNodeOnNextRow);
                }
            }

            console.log(vertexIndices);

            counter++;
        }


        var offset = edges * (maxHeight / heightDifference);

        for (var x = 0; x < 14; x++){
            addEntryWall(offset + 1 + (x*3), vertexIndices);
        }

        for (var x = 0; x < 14; x++){
            addEntryWall(offset + 46 + (x*3), vertexIndices);
        }

        offset = offset + 90;

        for (var x = 0; x < 14; x++){
            addFrontWall(offset + 1 + x, vertexIndices);
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);

        return buffer;
    }

    function addFrontWall(offset, vertexIndices){
        vertexIndices.push(offset);
        vertexIndices.push(offset + 1);
        vertexIndices.push(offset + 15);

        vertexIndices.push(offset + 1);
        vertexIndices.push(offset + 15);
        vertexIndices.push(offset + 16);
    }

    function addEntryWall(offset, vertexIndices){
        vertexIndices.push(offset);
        vertexIndices.push(offset + 1);
        vertexIndices.push(offset + 3);

        vertexIndices.push(offset + 1);
        vertexIndices.push(offset + 3);
        vertexIndices.push(offset + 4);

        vertexIndices.push(offset + 1);
        vertexIndices.push(offset + 2);
        vertexIndices.push(offset + 4);

        vertexIndices.push(offset + 2);
        vertexIndices.push(offset + 4);
        vertexIndices.push(offset + 5);
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
                gl.vertexAttrib3fv(aVertexColorId, [0.0, 0.0, 0.0, 1.0]);

                var normalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalVectors), gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                gl.vertexAttribPointer(aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(aVertexNormalId);

                var circles = edges * (maxHeight / heightDifference);

                // bind the element array
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, defineEdges(gl));
                gl.drawElements(gl.LINES, 1280 + 120 + 28 + 28 + 30 + 28,gl.UNSIGNED_SHORT, 0);
                //gl.drawElements(gl.LINES, 1280 + 80 + 28 + 28 + 24,gl.UNSIGNED_SHORT, 0);

            // set a constant color for all vertices
            gl.disableVertexAttribArray(aVertexColorId);
            gl.vertexAttrib3fv(aVertexColorId, this.color);

            // bind the element array
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, defineSides(gl));
            //gl.drawElements(gl.TRIANGLES, 192,gl.UNSIGNED_SHORT, 0);
            gl.drawElements(gl.TRIANGLES, edges * ((maxHeight / heightDifference) - 1) * 6 + (edges * 3) + 336 + 84,gl.UNSIGNED_SHORT, 0);
            //gl.drawElements(gl.TRIANGLES, edges * ((maxHeight / heightDifference) - 1) * 6 + (edges * 3) + 144,gl.UNSIGNED_SHORT, 0);
        }
    }
}



