//
// DI Computer Graphics
//
// WebGL Exercises
//

// Turn Texture Mapping on and off
// Add Transformation
// Add 3D functionality
// Add shading

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

var texture= null;

// all parameters associated with the shader program
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aVertexColorId: -1,
    aVertexNormalId: -1,
    uModelViewMatrixId: -1,
    uProjectionMatrixId: -1,
    uNormalMatrixId: -1,
    uSamplerId: -1,
    uLightPositionId: -1,
    uLightColorId: -1,
    uEnableLightingId: -1,
    uEnableTextureId: -1,
    aVertexTextureId: -1,
};

// parameters that define the scene
var scene = {
    eyePosition: [0.6, 1, -12],
    lookAtPosition: [0, 0, 0],
    upVector: [0, 1, 0],
    nearPlane: 0.1,
    farPlane: 30.0,
    fov: 40,
    lightPosition: [20, 20, 20],
    lightColor: [1, 1, 1],
    rotateObjects: true,
    angle: 0,
    angularSpeed: 0.1 * 2 * Math.PI / 360.0
};

// defined object
var drawingObjects = {
    iglu: null,
    sky: null,
    bottom: null,
};

var textures =
    {
        textureObj: {}
    };

var images=
    [
        "",
        "snow.jpg",
    ]

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    //window.requestAnimationFrame (drawAnimated);
    loadTexture();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShaderLighting.glsl');
    setUpAttributesAndUniforms();
    defineObjects();

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.8, 0.8, 0.8, 1);
}

function defineObjects() {
    drawingObjects.iglu = new Iglushape(gl, 32, [0.7, 0.7, 0.7]);
    drawingObjects.sky = new Sky(gl, -20, -5, 40, 40);
    drawingObjects.bottom = new Bottom(gl, -20,-5,-40,40)
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
    ctx.aVertexTextureId = gl.getAttribLocation(ctx.shaderProgram, "aTextureCoord");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");

    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");

    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
    ctx.uEnableTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
}

/**
 * Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 */
function initTexture ( image , textureObject ) {
    // create a new texture
    gl.bindTexture(gl.TEXTURE_2D , textureObject );

    // set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL , true );
    gl.texImage2D(gl.TEXTURE_2D , 0, gl.RGBA , gl.RGBA , gl.UNSIGNED_BYTE , image );
    gl.texParameteri(gl.TEXTURE_2D , gl.TEXTURE_MAG_FILTER , gl.LINEAR );
    gl.texParameteri(gl.TEXTURE_2D , gl.TEXTURE_MIN_FILTER , gl.LINEAR_MIPMAP_NEAREST );
    gl.generateMipmap(gl.TEXTURE_2D );

    // turn texture off again
    gl.bindTexture(gl.TEXTURE_2D , null );
}

/**
 * Load an image as a texture
 */
function loadTexture (counter) {
    var image = new Image();
    // create a texture object
    textures.textureObj = gl.createTexture();
    //gl.bindTexture(gl.TEXTURE_2D, textures.textureObj);
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
     //   new Uint8Array([0, 0, 255, 255]));
    image.onload = function() {
        initTexture( image , textures.textureObj);
        // make sure there is a redraw after the loading of the texture
        draw();
    };
    // setting the src will trigger onload
    //image.src = "letitsnow.png";
    //image.src = "fallingSnow.jpg";
    image.src = "snow.jpg"
}
/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    var modelViewMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    var normalMatrix = mat3.create();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the matrices from the scene
    mat4.lookAt(viewMatrix, scene.eyePosition, scene.lookAtPosition, scene.upVector);
    mat4.perspective(projectionMatrix, glMatrix.toRadian(40), gl.drawingBufferWidth / gl.drawingBufferHeight, scene.nearPlane, scene.farPlane);

    // set the light
    gl.uniform1i(ctx.uEnableLightingId, 0);
    gl.uniform3fv(ctx.uLightPositionId, scene.lightPosition);
    gl.uniform3fv(ctx.uLightColorId, scene.lightColor);

    // same projection matrix for all drawings, so it can be specified here
    gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);

    // translate and rotate objects
    mat4.translate(modelViewMatrix, viewMatrix, [0.0, 4.0, 17.0]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    drawingObjects.sky.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId, ctx.aVertexTextureId)

    gl.uniform1i(ctx.uEnableTextureId, 1);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.textureObj);
    gl.uniform1i(ctx.uSamplerId,0);
    // translate and rotate objects
    mat4.translate(modelViewMatrix, viewMatrix, [0.0, 4.0, 17.0]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    drawingObjects.bottom.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId, ctx.aVertexTextureId)

    gl.uniform1i(ctx.uEnableTextureId, 0);
    gl.uniform1i(ctx.uEnableLightingId, 1);
    // translate and rotate objects
    mat4.translate(modelViewMatrix, viewMatrix, [-1.5, -1.0, 0.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 0.4, [0, 1, 0]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    drawingObjects.iglu.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId);

    // translate and rotate objects
    mat4.translate(modelViewMatrix, viewMatrix, [3.0, -1.0, 3.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, -0.2, [0, 1, 0]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    drawingObjects.iglu.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId);
}

var first = true;
var lastTimeStamp = 0;
function drawAnimated ( timeStamp ) {
    var timeElapsed = 0;
    if (first) {
        lastTimeStamp = timeStamp;
        first = false;
    } else {
        timeElapsed = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
    }
    // calculate time since last call
    // move or change objects
    scene.angle += timeElapsed * scene.angularSpeed;
    if (scene.angle > 2.0*Math.PI) {
        scene.angle -= 2.0*Math.PI;
    }
    draw ();
    // request the next frame
    window.requestAnimationFrame (drawAnimated);
}