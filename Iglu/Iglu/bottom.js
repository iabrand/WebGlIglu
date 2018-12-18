function Bottom(gl, x, y, z, width) {

    var cubeTexture = {}
    var cubeImage = {}
    var textures ={
        textureObj: {}
    };

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
        var x1 = x;
        var x2 = x + width;
        var z1 = 0;
        var z2 = z;

        var vertices = [
            0.0, 0.0,  0.0,
            1.0, 1.0,  0.0,
            0.0, 1.0,  1.0,
            0.0, 0.0,  1.0,
            1.0, 0.0,  0.0,
            1.0, 1.0,  1.0
        ];

        // Create a buffer for texcoords.
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    function loadTexture(gl)
    {
        // Create a texture.
        textures.textureObj = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textures.textureObj);

        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));

        // Asynchronously load an image
        var image = new Image();

        image.onload = function() {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, textures.textureObj);

            // set parameters for the texture
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            //gl.generateMipmap(gl.TEXTURE_2D);

            // turn texture off again
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        image.src = "lena512.png";
    }

    return {
        draw: function(gl, aVertexPositionId, aVertexColorId, aVertexNormalId, aVertexTextureCoordId) {
            //loadTexture(gl);
            gl.disableVertexAttribArray(aVertexColorId);
            gl.bindBuffer(gl.ARRAY_BUFFER , defineTexture(gl) );
            gl.vertexAttribPointer(aVertexTextureCoordId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexTextureCoordId);

            gl.bindBuffer(gl.ARRAY_BUFFER, defineVertices(gl));
            gl.vertexAttribPointer(aVertexPositionId,3, gl.FLOAT, false, 0, 0);// Nimm jeweils zwei argumente für diese VertexPosition
            gl.enableVertexAttribArray(aVertexPositionId);

            //gl.vertexAttrib3fv(aVertexColorId,[1.0,1.0,1.0]);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.disableVertexAttribArray(aVertexTextureCoordId);

        }
    }



}