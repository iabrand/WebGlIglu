function Bottom(gl, x, y, z, width) {

    var cubeTexture = {}
    var cubeImage = {}

    function defineVertices(gl)
    {
        var x1 = x;
        var x2 = x + width;
        var z1 = 0;
        var z2 = z;

        var vertices = [
            x1, y, z1,
            x2, y, z1,
            x1, y, z2,
            x1, y, z2,
            x2, y, z2,
            x2, y, z1,
        ];
        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }


    function defineTexture(gl)
    {
        // Set Texcoords.
        // Fill the buffer with texture coordinates for the F.

        var vertices = [
            // vorne
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
        ];

        // Create a buffer for texcoords.
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }



    return {
        draw: function(gl, aVertexPositionId, aVertexColorId, aVertexNormalId, aVertexTextureCoordId) {

            gl.bindBuffer(gl.ARRAY_BUFFER, defineVertices(gl));
            gl.vertexAttribPointer(aVertexPositionId,3, gl.FLOAT, false, 0, 0);// Nimm jeweils zwei argumente für diese VertexPosition
            gl.enableVertexAttribArray(aVertexPositionId);

            gl.disableVertexAttribArray(aVertexColorId);
            //gl.bindBuffer(gl.ARRAY_BUFFER, defineTexture(gl));
            //gl.vertexAttribPointer(aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
            //gl.enableVertexAttribArray(aVertexTextureCoordId);
            gl.vertexAttrib3fv(aVertexColorId,[1.0,1.0,1.0]);

            gl.drawArrays(gl.TRIANGLES, 0, 6);


        }
    }



}