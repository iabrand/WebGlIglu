function Sky(gl, x, y, width, height) {

    var cubeTexture = {}
    var cubeImage = {}

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

    function defineTexture(gl)
    {
        var vertices = [
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


    function createTexture()
    {
        // Create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));

        // Asynchronously load an image
        var image = new Image();
        image.src = "letItSnow.jpg";
        image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });
    }



    return {
        draw: function(gl, aVertexPositionId, aVertexColorId, aVertexNormalId, aVertexTextureCoordId) {

            gl.bindBuffer(gl.ARRAY_BUFFER , defineTexture(gl) );
            gl.vertexAttribPointer(aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexTextureCoordId);

            gl.bindBuffer(gl.ARRAY_BUFFER, defineVertices(gl));
            gl.vertexAttribPointer(aVertexPositionId,2, gl.FLOAT, false, 0, 0);// Nimm jeweils zwei argumente für diese VertexPosition
            gl.enableVertexAttribArray(aVertexPositionId);

            gl.disableVertexAttribArray(aVertexColorId);
            //gl.bindBuffer(gl.ARRAY_BUFFER, defineTexture(gl));
            //gl.vertexAttribPointer(aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
            //gl.enableVertexAttribArray(aVertexTextureCoordId);


            gl.drawArrays(gl.TRIANGLES, 0, 6);

            createTexture();

        }
    }



}