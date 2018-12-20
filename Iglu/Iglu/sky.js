function Sky(gl, x, y, width, height) {

    function defineVertices(gl)
    {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;

        var vertices = [
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ];
        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    return {
        draw: function(gl, aVertexPositionId, aVertexColorId, aVertexNormalId, aVertexTextureCoordId) {

            //gl.disableVertexAttribArray(aVertexColorId);
            //gl.bindBuffer(gl.ARRAY_BUFFER , defineTexture(gl) );
            //gl.vertexAttribPointer(aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
            //gl.enableVertexAttribArray(aVertexTextureCoordId);


            gl.bindBuffer(gl.ARRAY_BUFFER, defineVertices(gl));
            gl.vertexAttribPointer(aVertexPositionId,2, gl.FLOAT, false, 0, 0);// Nimm jeweils zwei argumente für diese VertexPosition
            gl.enableVertexAttribArray(aVertexPositionId);

            gl.disableVertexAttribArray(aVertexColorId);
            gl.vertexAttrib3fv(aVertexColorId,[0.0,0.0,0.0]);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            //gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

            gl.disableVertexAttribArray(aVertexTextureCoordId);
        }
    }



}